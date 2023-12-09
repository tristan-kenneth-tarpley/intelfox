import db from '@/lib/services/db/db';
import { Teams } from '@prisma/client/edge';

const updateTeamById = (
  id: string,
  updateData: Partial<Pick<Teams, 'description' | 'primaryDomain' | 'shortDescription' | 'name' | 'lastSyncedAt' | 'lastPreppedAt' | 'urls'>>,
) => {
  return db.teams.update({ where: { id }, data: updateData });
};

export default updateTeamById;
