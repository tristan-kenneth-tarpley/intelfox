import runScrapingBeeRequest from '@/lib/services/scrapingBee/runScrapingBeeRequest';

const extractRelevantTextFromURL = async (url: string, selector = 'body') => {
  const extractRules = {
    relevant_text: {
      selector,
      output: 'text_relevant',
    },
  };

  // todo, retry with incrementally stronger proxy options
  return runScrapingBeeRequest((client) => client.get({
    url,
    params: {
      extract_rules: extractRules,
      block_ads: true,
      block_resources: false,
      premium_proxy: true,
      stealth_proxy: true,
      country_code: 'us',
    },
  })).then((res) => {
    try {
      return JSON.parse(res ?? '{}').relevant_text as string;
    } catch (err) {
      return null;
    }
  }).catch(() => null);
};

export default extractRelevantTextFromURL;
