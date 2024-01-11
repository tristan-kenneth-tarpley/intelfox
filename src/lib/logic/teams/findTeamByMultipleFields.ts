import db from '@/lib/services/db/db';

const searchableFields = ['name', 'primaryDomain', 'clerkOrgId'] as const;

const findTeamByMultipleFields = (query: string) => {
  const searchCases = searchableFields.map((field) => ({
    [field]: {
      contains: query,
    },
  }));

  return db.teams.findFirst({
    where: {
      OR: searchCases,
    },
  });
};

export default findTeamByMultipleFields;
