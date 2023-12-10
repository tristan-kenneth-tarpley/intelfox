import db from '@/lib/services/db/db';
import { CompetitorRelationships } from '@prisma/client/edge';

const createCompetitorRelationship = (createParams: Pick<CompetitorRelationships, 'teamId' | 'competitorId'>) => {
  return db.competitorRelationships.create({
    data: createParams,
  });
};

export default createCompetitorRelationship;
