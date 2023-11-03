import * as cheerio from 'cheerio';

import { ScrapedRedditItem } from '@/lib/services/reddit/types';
import { redditEndpoints } from '@/lib/services/reddit/endpoints';
import runScrapingBeeRequest from '@/lib/services/scrapingBee/runScrapingBeeRequest';

import { redditScrapeConfig } from './redditScrapeConfig';

const scrapeRedditComments = async (searchTerm: string) => {
  const res = await runScrapingBeeRequest((client) => client.get({
    url: redditEndpoints.searchComments(searchTerm),
    params: redditScrapeConfig,
  }));

  if (res) {
    const $ = cheerio.load(res);
    const commentsList = $('[data-faceplate-tracking-context]');

    const comments: ScrapedRedditItem[] = [];
    commentsList.each((index, comment) => {
      const contextData = $(comment).attr('data-faceplate-tracking-context');
      if (!contextData) return;

      try {
        const context = JSON.parse(contextData);

        if (context.post) {
          const postName = context.post.title;
          const postURL = context.post.url;

          comments.push({
            text: postName,
            href: postURL,
            type: 'COMMENT',
          });
        }
      } catch (error) {
        // todo handle gracefully
        console.error('Error parsing JSON data:', error);
      }
    });

    return comments;
  }
};

export default scrapeRedditComments;
