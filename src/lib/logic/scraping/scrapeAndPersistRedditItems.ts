import scrapeRedditComments from '@/app/api/data-collection/reddit/scrapeRedditComments';
import scrapeRedditPosts from '@/app/api/data-collection/reddit/scrapeRedditPosts';
import putScrapedRedditItem from '../reddit/putScrapedRedditItem';

const scrapeAndPersistRedditItems = async (phrase: string) => {
  // todo add telemetry here
  const [
    posts,
    comments,
  ] = await Promise.all([
    scrapeRedditPosts(phrase),
    scrapeRedditComments(phrase),
  ]);

  const combined = [...posts ?? [], ...comments ?? []];

  return Promise.all(combined.map(putScrapedRedditItem));
};

export default scrapeAndPersistRedditItems;
