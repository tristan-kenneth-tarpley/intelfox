import db from '@/lib/services/db/db';

const findTeamByClerkOrg = (id: string) => {
  return db.teams.findUnique({ where: { clerkOrgId: id } });
};

export default findTeamByClerkOrg;
