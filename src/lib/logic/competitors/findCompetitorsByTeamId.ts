import db from '@/lib/services/db/db';
import findCompetitorRelationshipsByTeamId from './findCompetitorRelationshipsByTeamId';

const findCompetitorsByTeamId = async (teamId: string) => {
  const competitorRelationships = await findCompetitorRelationshipsByTeamId(teamId);
  const competitorIds = competitorRelationships.map((relationship) => relationship.competitorId);

  return db.competitors.findMany({
    where: {
      id: {
        in: competitorIds,
      },
    },
  });
};

export default findCompetitorsByTeamId;
