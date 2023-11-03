import { AxiosResponse } from 'axios';
import { ScrapingBeeClient } from 'scrapingbee';
import scrapingBee from './scrapingBeeClient';

const runScrapingBeeRequest = async (
  getterFn: (client: ScrapingBeeClient) => Promise<AxiosResponse<any, any>>,
) => {
  const res = await getterFn(scrapingBee).catch((err) => {
    // todo handle error
    console.log('error', err.message);
  });

  const decoder = new TextDecoder();
  const text = res ? decoder.decode(res.data) : null;

  return text;
};

export default runScrapingBeeRequest;
