import { appConfig } from '@/config';
import Airtable from 'airtable';

export const client = new Airtable({ apiKey: appConfig.airtableSecretKey });
