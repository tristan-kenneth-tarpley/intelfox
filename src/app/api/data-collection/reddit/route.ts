import scrapeAndPersistRedditItems from '@/lib/logic/scraping/scrapeAndPersistRedditItems';
import redditAPIClient from '@/lib/services/reddit/redditAPIClient';
import { NextApiRequest } from 'next';

export async function POST(request: Request) {
  // const { body } = Request.;
  const { query } = await request.json();
  console.log('starting');
  const t0 = performance.now();
  await scrapeAndPersistRedditItems(query);
  const t1 = performance.now();
  console.log(`Scraping and persisting took ${t1 - t0} milliseconds.`);

  return Response.json({ success: true });
}

export async function GET(request: NextApiRequest) {
  console.log('gotcha');
  const { searchParams } = new URL(request.url ?? '');
  const redditClient = await redditAPIClient();
  const results = await redditClient.search({ query: searchParams.get('query') ?? '' });
  console.log('results', results.data.data.children[0]);

  return Response.json({ results: results.data.data.children });
}
