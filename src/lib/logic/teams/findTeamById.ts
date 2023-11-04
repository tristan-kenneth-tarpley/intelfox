import db from '@/lib/services/db/db';

const findTeamById = (id: string) => {
  return db.teams.findUnique({ where: { id } });
};

export default findTeamById;
