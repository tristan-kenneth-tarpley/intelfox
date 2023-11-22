import { companyIdTable, fields } from '@/lib/services/airtable/companiesBase';
import { Teams } from '@prisma/client/edge';
import generateForwardToEmail from './generateForwardToEmail';

const postNewTeamToAirtable = async (team: Teams) => {
  return companyIdTable.create([{
    fields: {
      [fields.companyName]: team.name,
      [fields.companyId]: team.id,
      [fields.client]: true,
      [fields.emailAddress]: generateForwardToEmail(team),
    },
  }]);
};

export default postNewTeamToAirtable;
