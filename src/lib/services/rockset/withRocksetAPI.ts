import rockset, { MainApi } from '@rockset/client';

const rocksetClient = rockset(
  process.env.ROCKSET_API_KEY ?? '',
  process.env.ROCKSET_API_ENDPOINT,
);

const withRocksetAPI = <TData>(callback: (api: MainApi) => Promise<TData>) => callback(rocksetClient);

export default withRocksetAPI;
