import _ from 'lodash';
import db from '@/lib/services/db/db';

const buildCases = (query: string) => {
  const fns: ((query: string) => string)[] = [
    _.identity,
    (q) => q.toLowerCase(),
    (q) => q.toUpperCase(),
    (q) => _.startCase(q),
  ];

  return fns.map((fn) => fn(query));
};

const searchableFields = ['name', 'primaryDomain', 'clerkOrgId'] as const;

const findTeamByMultipleFields = (query: string) => {
  const searchCases = searchableFields.map((field) => ({
    [field]: {
      in: buildCases(query),
    },
  }));
  console.log('query team', JSON.stringify(searchCases, null, 2));
  return db.teams.findFirstOrThrow({
    where: {
      OR: searchCases,
    },
  });
};

export default findTeamByMultipleFields;
