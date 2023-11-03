import scrapeAndPersistRedditItems from '@/lib/logic/scraping/scrapeAndPersistRedditItems';

export async function POST() {
  console.log('starting');
  const t0 = performance.now();
  await scrapeAndPersistRedditItems('Digital signage');
  const t1 = performance.now();
  console.log(`Scraping and persisting took ${t1 - t0} milliseconds.`);

  return Response.json({ success: true });
}
