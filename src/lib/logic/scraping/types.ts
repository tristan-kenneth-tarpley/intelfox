import { ScrapedItems } from '@prisma/client/edge';

export type ScrapedItemCreateParams = Pick<
ScrapedItems,
| 'text'
| 'parentText'
| 'href'
| 'type'
| 'itemCreatedAt'
| 'source'
| 'embeddings'>;
