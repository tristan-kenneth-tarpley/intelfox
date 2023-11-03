import withRocksetAPI from '../withRocksetAPI';

const getKeywordSearchResults = async () => {
  const response = await withRocksetAPI((api) => api.queryLambdas
    .executeQueryLambda('commons', 'intelfox-keyword-fulltext-search', '90635f28140a453c', {
      parameters: [
        {
          name: 'queryEmbeddings',
          type: 'string',
          value: 'test', // todo this should prob be done directly from rockset
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
