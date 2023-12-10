import db from '@/lib/services/db/db';
import { Competitors } from '@prisma/client/edge';

const updateCompetitorById = (id: string, createParams: Partial<Pick<Competitors, 'name' | 'domain' | 'urls'>>) => {
  return db.competitors.update({
    where: { id },
    data: createParams,
  });
};

export default updateCompetitorById;
