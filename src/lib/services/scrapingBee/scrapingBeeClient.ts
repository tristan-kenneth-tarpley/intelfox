import { appConfig } from '@/config';
import { ScrapingBeeClient } from 'scrapingbee';

const scrapingBee = new ScrapingBeeClient(appConfig.scrapingBeeAPIKey);

export default scrapingBee;
