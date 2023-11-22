import { companyIdTable, fields } from '@/lib/services/airtable/companiesBase';
import { Competitors, Teams } from '@prisma/client/edge';
import generateForwardToEmail from './generateForwardToEmail';

const postCompetitorToAirtable = async (team: Teams, competitor: Competitors) => {
  return companyIdTable.create([{
    fields: {
      [fields.companyName]: competitor.name,
      [fields.companyId]: competitor.id,
      [fields.client]: false,
      [fields.competitorOf]: team.id,
      [fields.emailAddress]: generateForwardToEmail(competitor),
    },
  }]);
};

export default postCompetitorToAirtable;
