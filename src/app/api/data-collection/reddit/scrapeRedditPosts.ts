import { ScrapedItemCreateParams } from '@/lib/logic/scraping/types';
import { RedditPostContextData } from './types';
import scrapeRedditSearch from './scrapeRedditSearch';

const runScrape = scrapeRedditSearch<RedditPostContextData>('POST');

const scrapeRedditPosts = async (searchTerm: string) => {
  const comments: Omit<ScrapedItemCreateParams, 'embeddings'>[] = [];
  await runScrape(searchTerm, {
    onItem: (context) => {
      if (!context.post) {
        return;
      }
      const postName = context.post.title;
      const postURL = context.post.url;

      comments.push({
        text: postName,
        parentText: null,
        href: postURL,
        type: 'POST',
        source: 'REDDIT',
        itemCreatedAt: new Date(context.post.created_timestamp),
      });
    },
  });

  return comments;
};

export default scrapeRedditPosts;
