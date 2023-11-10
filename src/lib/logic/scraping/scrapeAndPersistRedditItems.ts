import scrapeRedditComments from '@/app/api/data-collection/reddit/scrapeRedditComments';
import scrapeRedditPosts from '@/app/api/data-collection/reddit/scrapeRedditPosts';
import openAIClient from '@/lib/services/openAI/client';
import db from '@/lib/services/db/db';
import chunkArrayByMaxBytes from '@/utils/chunkArrayByMaxBytes';
import { UnwrappedPromise } from '@/utils/types';
import { chunkEmbeddingsRequestsByTokenSize } from '../aiCapabilities/chunkRequestsByMaxTokenSize';
import { ScrapedItemCreateParams } from './types';

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

const persistItems = async (scrapedItems: ScrapedItemCreateParams[][]) => {
  return Promise.all(scrapedItems.flatMap((items) => {
    return db.scrapedItems.createMany({
      data: items,
    }).catch((err) => {
      console.log('error creating items', err.message, items.map(({ href }) => href));
    });
    // it seems like the createMany is working, and is probably more performant, but
    // to troubleshoot duplicate href key errors, you can uncomment this and figure it out
    // return items.flatMap((item) => {
    //   return db.scrapedItems.create({
    //     data: item,
    //   }).catch((err) => {
    //     console.log('error creating item', err, item);
    //   });
    // });
  }));
};

const scrapeAndPersistRedditItems = async (phrase: string) => {
  // todo add telemetry here, especially to detect when markup changes and scraper logic needs to be rewritten
  // todo we'll want to add some throttling so we're not scraping more than a certain interval
  // e.g. a given keyword shouldn't be scraped more than every X hours
  const t0 = performance.now();
  const [
    posts,
    comments,
  ] = await Promise.all([
    scrapeRedditPosts(phrase),
    scrapeRedditComments(phrase),
  ]);
  const t1 = performance.now();
  console.log(`scraping reddit took ${t1 - t0} milliseconds.`);

  const combined = [...posts ?? [], ...comments ?? []];
  const existingItems = await db.scrapedItems.findMany({
    where: {
      href: {
        in: combined.map(({ href }) => href),
      },
    },
    select: {
      href: true,
    },
  });

  const existingItemsHrefSet = new Set(existingItems.map(({ href }) => href));
  const filteredCombined = combined.filter(({ href }) => {
    return !existingItemsHrefSet.has(href);
  });

  if (filteredCombined.length === 0) {
    return [];
  }

  // todo notify user when there are new items
  // todo verify this joining logic... If query responses look weird, this could be why
  const embeddingsResponses = await makeChunkedEmbeddingsRequests(filteredCombined);
  const itemsWithEmbeddings = reconcileEmbeddingsWithScrapedItems(embeddingsResponses);
  const fiveMbInsertionlimit = 5 * 1024 * 1024;
  const chunkedInsertionData = chunkArrayByMaxBytes(itemsWithEmbeddings, fiveMbInsertionlimit);

  return Promise.all(chunkedInsertionData.flatMap(persistItems));
};

export default scrapeAndPersistRedditItems;
