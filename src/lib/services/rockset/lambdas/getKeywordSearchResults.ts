import { ItemType } from '@prisma/client/edge';
import withRocksetAPI from '../withRocksetAPI';

const getKeywordSearchResults = async (tempEmbeddings: string): Promise<{
  text: string,
  href: string,
  type: ItemType,
  similarity: number,
}[] | null> => {
  const response = await withRocksetAPI((api) => api.queryLambdas
    .executeQueryLambda('commons', 'intelfox-keyword-fulltext-search', '90635f28140a453c', {
      parameters: [
        {
          name: 'queryEmbeddings',
          type: 'string',
          value: tempEmbeddings, // source this directly in rockset
        },
      ],
    })
    .catch((err) => {
      console.error(err);
      return null;
    }));

  return (response?.results ?? null);
};

export default getKeywordSearchResults;
