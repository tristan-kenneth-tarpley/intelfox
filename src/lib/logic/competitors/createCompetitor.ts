import db from '@/lib/services/db/db';
import { Competitors } from '@prisma/client/edge';

const createCompetitor = (createParams: Pick<Competitors, 'name' | 'domain'>) => {
  return db.competitors.create({
    data: {
      ...createParams,
      urls: [{
        type: 'HOMEPAGE',
        url: createParams.domain,
      }],
    },
  });
};

export default createCompetitor;
