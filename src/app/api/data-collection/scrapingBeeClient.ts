import { ScrapingBeeClient } from 'scrapingbee';

const scrapingBee = new ScrapingBeeClient(process.env.SCRAPING_BEE_API_KEY ?? '');

export default scrapingBee;
