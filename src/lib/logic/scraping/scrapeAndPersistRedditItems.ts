import _ from 'lodash';

import scrapeRedditComments from '@/app/api/data-collection/reddit/scrapeRedditComments';
import openAIClient from '@/lib/services/openAI/client';
import db from '@/lib/services/db/db';
import { UnwrappedPromise } from '@/utils/types';
import chunkArrayByMaxBytes from '@/utils/chunkArrayByMaxBytes';
import searchRedditPosts from '@/app/api/data-collection/reddit/searchRedditPosts';
import { chunkEmbeddingsRequestsByTokenSize } from '../aiCapabilities/chunkRequestsByMaxTokenSize';
import { ScrapedItemCreateParams } from './types';
import createManyScrapedItems from './createManyScrapedItems';

const fiveMbInsertionlimit = 5 * 1024 * 1024;

const makeChunkedEmbeddingsRequests = (items: Omit<ScrapedItemCreateParams, 'embeddings'>[]) => {
  const embeddingsRequests = chunkEmbeddingsRequestsByTokenSize(items, ({ text }) => text);

  return Promise.all(embeddingsRequests.map(async (request) => ({
    items: request,
    embeddingsResponse: await openAIClient.getEmbeddings({
      input: request.map(({ text }) => text),
    }),
  })));
};

const reconcileEmbeddingsWithScrapedItems = (embeddingsResponses: UnwrappedPromise<ReturnType<typeof makeChunkedEmbeddingsRequests>>) => {
  return embeddingsResponses.map(({ embeddingsResponse, items }) => items.map((item, index) => {
    const typedItem: ScrapedItemCreateParams = {
      ...item,
      embeddings: embeddingsResponse.data[index]?.embedding,
    };

    return typedItem;
  }));
};

const findExistingItemHrefs = (hrefs: string[]) => db.scrapedItems.findMany({
  where: {
    href: {
      in: hrefs,
    },
  },
  select: {
    href: true,
  },
});

const scrapeAndPersistRedditItems = async (phrase: string) => {
  // todo add telemetry here, especially to detect when markup changes and scraper logic needs to be rewritten
  // todo we'll want to add some throttling so we're not scraping more than a certain interval
  // e.g. a given keyword shouldn't be scraped more than every X hours
  const t0 = performance.now();
  const [
    posts,
    comments,
  ] = await Promise.all([
    searchRedditPosts(phrase),
    scrapeRedditComments(phrase),
    // Promise.resolve([]),
  ]);
  const t1 = performance.now();
  console.log(`scraping reddit took ${t1 - t0} milliseconds.`);
  const combined = _.uniqBy([...posts ?? [], ...comments ?? []], (item) => item.href);
  const existingItems = await findExistingItemHrefs(combined.map(({ href }) => href));

  const existingItemsHrefSet = new Set(existingItems.map(({ href }) => href));
  const filteredCombined = combined.filter(({ href }) => {
    return !existingItemsHrefSet.has(href);
  });

  if (filteredCombined.length === 0) {
    return [];
  }

  // todo notify user when there are new items
  // todo verify this joining logic... If query responses look weird, this could be why
  const t2 = performance.now();
  const embeddingsResponses = await makeChunkedEmbeddingsRequests(filteredCombined);
  const t3 = performance.now();
  console.log(`getting embeddings took ${t3 - t2} milliseconds.`);

  const chunkedInsertionData = chunkArrayByMaxBytes(
    reconcileEmbeddingsWithScrapedItems(embeddingsResponses).flat(),
    fiveMbInsertionlimit,
  );

  return Promise.all(
    chunkedInsertionData.map(createManyScrapedItems),
  );
};

export default scrapeAndPersistRedditItems;
