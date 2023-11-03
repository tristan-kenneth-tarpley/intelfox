import db from '@/lib/services/db/db';
import openAIClient from '@/lib/services/openAI/client';
import { ScrapedRedditItem } from '@/lib/services/reddit/types';

const putScrapedRedditItem = async (item: ScrapedRedditItem) => {
  const existingItem = await db.redditItems.findFirst({
    where: {
      href: item.href,
    },
  });

  if (existingItem) {
    return existingItem;
  }

  const embeddingsResponse = await openAIClient.getEmbeddings({
    input: item.text,
    model: 'text-embedding-ada-002',
  });

  const newItem = await db.redditItems.create({
    data: {
      ...item,
      embeddings: embeddingsResponse.data[0]?.embedding,
    },
  });

  return newItem;
};

export default putScrapedRedditItem;
