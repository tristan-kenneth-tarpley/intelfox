import db from '@/lib/services/db/db';
import { ScrapedItemCreateParams } from './types';

const createManyScrapedItems = async (scrapedItems: ScrapedItemCreateParams[]) => {
  // Ideally we would do createMany here, but I didn't figure out a clever enough way
  // to dedupe the nested array
  // if someone figures it out, you can use the chunkArrayByMaxBytes util to make sure payloads
  // are less than 5mb
  return Promise.allSettled(scrapedItems.map((item) => db.scrapedItems.create({ data: item })));
};

export default createManyScrapedItems;
