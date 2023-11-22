import runScrapingBeeRequest from '@/lib/services/scrapingBee/runScrapingBeeRequest';
import sleep from '@/utils/sleep';

const extractRelevantTextFromURL = async (url: string, selector = 'body') => {
  const extractRules = {
    relevant_text: {
      selector,
      output: 'text_relevant',
    },
  };

  // todo, retry with incrementally stronger proxy options
  return runScrapingBeeRequest(async (client) => {
    const retries = Array.from({ length: 3 }, (_, i) => i);

    let res;
    // eslint-disable-next-line no-restricted-syntax
    for (const retry of retries) {
      console.log('retry', retry);
      if (retry > 0) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(
          ((retry || 1) ** 2) * 1000, // exponentially increasing backoff, multiplied by 1000 since it's in ms
        );
      }

      console.log('requesting with ', {
        extract_rules: extractRules,
        block_ads: true,
        block_resources: false,
        premium_proxy: retry > 0,
        stealth_proxy: retry === 2,
        country_code: 'us',
      });
      // try the scraper with increasingly premium features.
      // premium_proxy and stealth_proxy are not only more expensive but also take much longer.
      // eslint-disable-next-line no-await-in-loop
      res = await client.get({
        url,
        params: {
          extract_rules: extractRules,
          block_ads: true,
          block_resources: false,
          premium_proxy: retry > 0,
          stealth_proxy: retry === 2,
          country_code: 'us',
        },
      });

      if (res.status === 200) {
        break;
      }
    }

    return res ?? null;
  }).then((res) => {
    try {
      return JSON.parse(res ?? '{}').relevant_text as string;
    } catch (err) {
      return null;
    }
  }).catch(() => null);
};

export default extractRelevantTextFromURL;
