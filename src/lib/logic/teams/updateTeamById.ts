import db from '@/lib/services/db/db';
import { Teams } from '@prisma/client';

const updateTeamById = (
  id: string,
  updateData: Partial<Pick<Teams, 'description' | 'primaryDomain'>>,
) => {
  return db.teams.update({ where: { id }, data: updateData });
};

export default updateTeamById;
