import { RedditItem } from '@prisma/client';

export type ScrapedRedditItem = Pick<RedditItem, 'text' | 'href' | 'type'>;
