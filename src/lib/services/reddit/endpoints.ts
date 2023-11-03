import { redditConfig } from './config';

export const redditEndpoints = {
  searchPosts: (query: string) => `${redditConfig.baseUrl}/search?${new URLSearchParams({ q: query })}`,
  searchComments: (query: string) => `${redditConfig.baseUrl}/search?${new URLSearchParams({ q: query, type: 'comment' })}`,
};
