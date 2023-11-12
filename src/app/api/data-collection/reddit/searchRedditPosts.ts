import { ScrapedItemCreateParams } from '@/lib/logic/scraping/types';
import redditAPIClient from '@/lib/services/reddit/redditAPIClient';

const searchRedditPosts = async (searchTerm: string): Promise<Omit<ScrapedItemCreateParams, 'embeddings'>[]> => {
  const redditClient = await redditAPIClient();

  try {
    const results = await redditClient.search({ query: searchTerm });
    return results.data.data.children.map(({ data }) => ({
      href: data.permalink,
      text: data.title,
      bodyText: data.selftext,
      parentText: null,
      source: 'REDDIT',
      type: 'POST',
      itemCreatedAt: new Date(data.created_utc),
    }));
  } catch (err) {
    // todo handle
    return [];
  }
};

export default searchRedditPosts;
