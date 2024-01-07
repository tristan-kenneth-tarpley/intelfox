import db from '@/lib/services/db/db';

const logManyScrapedItems = (ids: string[], teamId: string) => {
  return db.seenScrapedItems.createMany({
    data: ids.map((scrapedItemId) => ({
      scrapedItemId,
      teamId,
    })),
  });
};

export default logManyScrapedItems;
