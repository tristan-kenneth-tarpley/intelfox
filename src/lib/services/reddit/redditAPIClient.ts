import axios from 'axios';
import nango from '../nango/nangoClient';
import { RedditAPISearchResult } from './types';

const redditAPIClient = async () => {
  const conn = await nango.getConnection(
    'reddit',
    'tristan',
  );

  const redditAxios = axios.create({
    baseURL: 'https://oauth.reddit.com/',
    headers: {
      // @ts-expect-error not sure why it doesn't have this
      Authorization: `Bearer ${conn?.credentials.access_token}`,
    },
  });

  return {
    search: async ({ query }: { query: string }) => {
      return redditAxios.get<{
        kind: 'Listing';
        data: {
          children: RedditAPISearchResult[];
          before: null; // todo figure out
          modhash: null; // todo figure out
          dist: number,
          facets: {},
          after: string;
          geo_filter: string;
        }
      }>(`/search?${new URLSearchParams({
        q: query,
        type: 'link',
      })}`);
    },
  };
};

export default redditAPIClient;
