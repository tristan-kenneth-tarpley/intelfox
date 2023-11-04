import { appConfig } from '@/config';
import rockset, { MainApi } from '@rockset/client';

const rocksetClient = rockset(
  appConfig.rocksetAPIKey,
  appConfig.rocksetAPIEndpoint,
);

const withRocksetAPI = <TData>(callback: (api: MainApi) => Promise<TData>) => callback(rocksetClient);

export default withRocksetAPI;
