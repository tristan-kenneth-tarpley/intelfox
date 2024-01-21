import db from "@/lib/services/db/db";

const findCompetitorById = (competitorId: string) =>
  db.competitors.findUnique({ where: { id: competitorId } });

export default findCompetitorById;
