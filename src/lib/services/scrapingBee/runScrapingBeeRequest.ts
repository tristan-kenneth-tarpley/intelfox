import { backOff } from 'exponential-backoff';
import { AxiosResponse } from 'axios';
import { ScrapingBeeClient } from 'scrapingbee';
import scrapingBee from './scrapingBeeClient';

const runScrapingBeeRequest = async (
  getterFn: (client: ScrapingBeeClient) => Promise<AxiosResponse<any, any> | null>,
) => {
  try {
    const res = await backOff(() => getterFn(scrapingBee), {
      numOfAttempts: 2,
    });

    const decoder = new TextDecoder();
    const text = res ? decoder.decode(res.data) : null;

    return text;
  } catch (err: any) {
    console.log('error running scraping bee request', err.message);
    return null;
  }
};

export default runScrapingBeeRequest;
