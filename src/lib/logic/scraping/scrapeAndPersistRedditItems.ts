import scrapeRedditComments from '@/app/api/data-collection/reddit/scrapeRedditComments';
import scrapeRedditPosts from '@/app/api/data-collection/reddit/scrapeRedditPosts';
import openAIClient from '@/lib/services/openAI/client';
import estimateEmbeddingsTokenSize from '@/lib/services/openAI/estimateEmbeddingsTokenSize';
import db from '@/lib/services/db/db';

const scrapeAndPersistRedditItems = async (phrase: string) => {
  // todo add telemetry here
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
  const existingItems = await db.redditItems.findMany({
    where: {
      href: {
        notIn: combined.map(({ href }) => href),
      },
    },
  });

  const existingItemsHrefSet = new Set(existingItems.map(({ href }) => href));
  const filteredCombined = combined.filter(({ href }) => !existingItemsHrefSet.has(href));

  const filteredCombinedText = filteredCombined.map(({ text }) => text);

  const tokenSize = estimateEmbeddingsTokenSize(filteredCombinedText.join('\n'));

  // todo do this better
  // also we need to incrementally break it up into multiple calls until we have a small enough payload
  if (tokenSize > 14000) {
    throw new Error('too many tokens');
  }

  if (filteredCombined.length === 0) {
    return [];
  }

  // todo add logic here so that we dedupe on prior requests
  const embeddingsResponse = await openAIClient.getEmbeddings({
    input: filteredCombinedText,
    model: 'text-embedding-ada-002',
  });

  // need to make sure payload doesn't get too big here
  return db.redditItems.createMany({
    data: filteredCombined.map((item, index) => ({
      ...item,
      embeddings: embeddingsResponse.data[index]?.embedding,
    })),
  });
};

export default scrapeAndPersistRedditItems;
