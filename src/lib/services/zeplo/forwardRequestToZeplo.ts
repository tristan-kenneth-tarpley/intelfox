import { appConfig } from '@/config';

const zeploOptionKeys = [
  '_cron',
  '_retry',
  '_interval',
  '_delay',
] as const;

type ZeploOptionKey = typeof zeploOptionKeys[number];
type ZeploOptions = Record<ZeploOptionKey, string>;

const forwardRequestToZeplo = (url: string, requestOptions: RequestInit, zeploOptions?: ZeploOptions) => {
  console.log('final url to zeplo', `https://zeplo.to/${url}?${
    zeploOptions ? new URLSearchParams(zeploOptions).toString() : ''
  }`);
  return fetch(`https://zeplo.to/${url}?${
    zeploOptions ? new URLSearchParams(zeploOptions).toString() : ''
  }`, {
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      'X-Zeplo-Token': appConfig.zeploSecret,
    },
  });
};

export default forwardRequestToZeplo;