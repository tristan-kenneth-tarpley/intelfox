import { RedditItems } from '@prisma/client';

export type ScrapedRedditItem = Pick<RedditItems, 'text' | 'href' | 'type'>;
