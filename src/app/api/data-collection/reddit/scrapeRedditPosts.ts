import * as cheerio from 'cheerio';

import { ScrapedRedditItem } from '@/lib/services/reddit/types';
import { redditEndpoints } from '@/lib/services/reddit/endpoints';
import runScrapingBeeRequest from '@/lib/services/scrapingBee/runScrapingBeeRequest';

import { redditScrapeConfig } from './redditScrapeConfig';

const scrapeRedditPosts = async (searchTerm: string) => {
  const res = await runScrapingBeeRequest((client) => client.get({
    url: redditEndpoints.searchPosts(searchTerm),
    params: redditScrapeConfig,
  }));

  if (res) {
    const $ = cheerio.load(res);
    const postsMarkup = $('[data-testid="post-title"]');

    const posts: ScrapedRedditItem[] = [];
    postsMarkup.each((index, post) => {
      const $post = $(post);
      const text = $post.text().trim();
      const { href } = ($post.attr() as { href: string });

      posts.push({ text, href, type: 'POST' });
    });

    return posts;
  }
};

export default scrapeRedditPosts;
