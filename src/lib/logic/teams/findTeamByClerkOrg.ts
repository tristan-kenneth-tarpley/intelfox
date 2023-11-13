import db from '@/lib/services/db/db';

const findTeamByClerkOrg = (id: string) => {
  return db.teams.findFirst({ where: { clerkOrgId: id } });
};

export default findTeamByClerkOrg;
