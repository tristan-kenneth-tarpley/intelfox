import db from '@/lib/services/db/db';

const findCompetitorRelationshipsByTeamId = async (teamId: string) => db.competitorRelationships.findMany({
  where: {
    teamId,
  },
});

export default findCompetitorRelationshipsByTeamId;
