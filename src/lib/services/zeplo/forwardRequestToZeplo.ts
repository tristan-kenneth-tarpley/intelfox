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
  const parsedUrl = new URL(url);
  const { hostname, pathname } = parsedUrl;
  const forwardToUrl = `${hostname}${pathname}`;

  return fetch(`https://zeplo.to/${forwardToUrl}?${
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
