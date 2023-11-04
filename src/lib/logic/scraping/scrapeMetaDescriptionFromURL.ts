import runScrapingBeeRequest from '@/lib/services/scrapingBee/runScrapingBeeRequest';

const scrapeMetaDescriptionFromURL = async (url: string): Promise<string | null> => {
  try {
    const response = await runScrapingBeeRequest((client) => client.get({
      url,
      params: {
        extract_rules: {
          description: {
            selector: '/html/head/meta[@name="description"]/@content',
          },
        },
      },
    }));

    return response ? (JSON.parse(response).description as string) : null;
  } catch (e) {
    return null;
  }
};

export default scrapeMetaDescriptionFromURL;
