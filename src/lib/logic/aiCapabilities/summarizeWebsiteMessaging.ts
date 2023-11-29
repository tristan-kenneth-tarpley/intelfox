import extractRelevantTextFromURL from '../scraping/extractRelevantTextFromURL';
import summarizeMessaging from './messaging/summarizeMessaging';

const summarizeWebsiteMessaging = async (url: string) => {
  const relevantText = await extractRelevantTextFromURL(url);
  console.log('got the scraped text. Is it null?', relevantText ? 'no' : 'yes');
  const combined = relevantText
    ? await summarizeMessaging(relevantText)
    : null;

  return combined;
};

export default summarizeWebsiteMessaging;
