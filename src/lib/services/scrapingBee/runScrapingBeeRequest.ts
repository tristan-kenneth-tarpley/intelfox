import { backOff } from 'exponential-backoff';
import { AxiosResponse } from 'axios';
import { ScrapingBeeClient } from 'scrapingbee';
import scrapingBee from './scrapingBeeClient';

const runScrapingBeeRequest = async (
  getterFn: (client: ScrapingBeeClient) => Promise<AxiosResponse<any, any>>,
) => {
  try {
    const res = await backOff(() => getterFn(scrapingBee), {
      numOfAttempts: 3,
    });

    const decoder = new TextDecoder();
    const text = res ? decoder.decode(res.data) : null;

    return text;
  } catch (err) {
    console.log('error running scraping bee request', err);
    return null;
  }
};

export default runScrapingBeeRequest;
