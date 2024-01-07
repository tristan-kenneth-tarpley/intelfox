import {
  ScrapedItems, TrackedKeyPhrases,
} from '@prisma/client/edge';
import isTruthy from '@/utils/isTruthy';
import withRocksetAPI from '../withRocksetAPI';

export type KeyPhraseFeedResult =
  { similarity: number } &
  Pick<TrackedKeyPhrases, 'phrase' | 'id'> &
  Pick<ScrapedItems, | 'text'
  | 'parentText'
  | 'bodyText'
  | 'href'
  | 'source'
  | 'type'
  | 'itemCreatedAt'>;

const getKeyphraseFeedResults = async (
  teamId: string,
): Promise<KeyPhraseFeedResult[] | null> => {
  const response = await withRocksetAPI((api) => api.queryLambdas
    .executeQueryLambda('commons', 'intelfox-keyword-fulltext-search', '55cec53317563e6f', {
      parameters: [
        {
          name: 'teamId',
          type: 'string',
          value: teamId,
        },
      ].filter(isTruthy),
    })
    .catch((err) => {
      console.error(err);
      return null;
    }));

  return (response?.results ?? null);
};

export default getKeyphraseFeedResults;
