import {
  ScrapedItems, TrackedKeyPhrases,
} from '@prisma/client/edge';
import withRocksetAPI from '../withRocksetAPI';

type KeyPhraseFeedResult =
  { similarity: number } &
  Pick<TrackedKeyPhrases, 'phrase'> &
  Pick<ScrapedItems, | 'text'
  | 'parentText'
  | 'bodyText'
  | 'href'
  | 'source'
  | 'type'
  | 'itemCreatedAt'>;

const getKeyphraseFeedResults = async (teamId: string): Promise<KeyPhraseFeedResult[] | null> => {
  const response = await withRocksetAPI((api) => api.queryLambdas
    .executeQueryLambda('commons', 'intelfox-keyword-fulltext-search', '73b158a1d05cc4c2', {
      parameters: [
        {
          name: 'teamId',
          type: 'string',
          value: teamId,
        },
      ],
    })
    .catch((err) => {
      console.error(err);
      return null;
    }));

  return (response?.results ?? null);
};

export default getKeyphraseFeedResults;
