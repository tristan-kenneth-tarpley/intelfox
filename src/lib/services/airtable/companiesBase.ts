import { client } from './airtableClient';

const companyBase = client.base('appcHNCivvVav2k6O');
const companyIdTable = companyBase('tblshMW2HXiJ1Td9f');

const fields = {
  companyName: 'fldiUVD1JGCbs2J3A',
  companyId: 'fldAHTcnkmx81kgvJ',
  client: 'fldhBXutLkapbua9Q',
  competitorOf: 'fldUyurX5pwDEf6Fg',
  emailAddress: 'fldpqQjrTnjSlCDXq',
} as const;

export { companyBase, companyIdTable, fields };
