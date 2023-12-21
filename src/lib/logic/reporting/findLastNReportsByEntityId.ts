import db from '@/lib/services/db/db';
import rocksetService from '@/lib/services/rockset/rocksetService';

const findLastNReportsByEntityId = async ({
  teamId,
  competitorId,
}: {
  teamId?: string;
  competitorId?: string;
}, { n }: { n: number }) => {
  if (!teamId && !competitorId) throw new Error('must provide teamId or competitorId');

  const where = competitorId ? { competitorId } : { teamId };
  const orderBy = { createdAt: 'desc' } as const;
  const query = {
    where,
    orderBy,
    take: n,
  } as const;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [
    emailSummaries,
    pricingPageReport,
    messagingProfile,
    jobListingsReport,
    marketIntelReport,
    scrapedItemsReport,
  ] = await Promise.all([
    db.emailSummaries.findMany({
      where: {
        ...where,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy,
    }),
    db.pricingPageReport.findMany(query),
    db.messagingProfile.findMany(query),
    db.jobListingsReport.findMany(query),
    db.marketIntelReport.findMany(query),
    teamId
      ? rocksetService.getKeyphraseFeedResults(teamId)
      : Promise.resolve(null),
  ]);

  return {
    teamId,
    competitorId,
    emailSummaries,
    pricingPageReport,
    messagingProfile,
    jobListingsReport,
    marketIntelReport,
    scrapedItemsReport,
  };
};

export default findLastNReportsByEntityId;
