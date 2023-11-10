import { ScrapedItemCreateParams } from '@/lib/logic/scraping/types';
import { RedditCommentContextData } from './types';
import scrapeRedditSearch from './scrapeRedditSearch';

const runScrape = scrapeRedditSearch<RedditCommentContextData>('COMMENT');
const makeCommentHref = (context: RedditCommentContextData) => {
  const {
    post: {
      url,
    },
    comment: {
      id,
    },
  } = context;

  return [
    url,
    id,
  ].join(url.endsWith('/') ? '' : '/');
};

const scrapeRedditComments = async (searchTerm: string) => {
  const comments: Omit<ScrapedItemCreateParams, 'embeddings'>[] = [];

  await runScrape(searchTerm, {
    onItem: (context, postCheerio) => {
      if (!context.post || !context.comment) {
        return;
      }
      const { post, comment } = context;
      const postName = post.title;

      // the actual comment text is not in the tracking context, so we have to search more of the markup
      const commentText = postCheerio
        .find('[id^="comment-content-"]')
        .text()
        .trim();

      comments.push({
        text: commentText,
        parentText: postName,
        href: makeCommentHref(context),
        type: 'COMMENT',
        source: 'REDDIT',
        itemCreatedAt: new Date(comment.created_timestamp),
      });
    },
  });

  return comments;
};

export default scrapeRedditComments;
