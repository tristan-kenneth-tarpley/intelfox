import db from '@/lib/services/db/db';

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

  const [
    emailSummaries,
    pricingPageReport,
    messagingProfile,
    jobListingsReport,
    marketIntelReport,
  ] = await Promise.all([
    db.emailSummaries.findMany({
      where: {
        ...where,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy,
    }),
    db.pricingPageReport.findMany(query),
    db.messagingProfile.findMany(query),
    db.jobListingsReport.findMany(query),
    db.marketIntelReport.findMany(query),
  ]);

  return {
    teamId,
    competitorId,
    emailSummaries,
    pricingPageReport,
    messagingProfile,
    jobListingsReport,
    marketIntelReport,
  };
};

export default findLastNReportsByEntityId;
