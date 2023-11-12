import db from '@/lib/services/db/db';
import { CompetitorRelationships } from '@prisma/client/edge';

const findOrCreateCompetitorRelationship = async ({
  competitorId,
  teamId,
}: Pick<CompetitorRelationships, 'competitorId' | 'teamId'>) => {
  const existing = await db.competitorRelationships.findFirst({
    where: { teamId, competitorId },
  });

  return existing ?? db.competitorRelationships.create({
    data: {
      competitorId,
      teamId,
    },
  });
};

export default findOrCreateCompetitorRelationship;
