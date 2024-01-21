import db from "@/lib/services/db/db";

const findCompetitorByDomain = (domain: string) =>
  db.competitors.findFirst({ where: { domain } });

export default findCompetitorByDomain;
