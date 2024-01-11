import db from '@/lib/services/db/db';
import rocksetService from '@/lib/services/rockset/rocksetService';
import { UnwrappedPromise } from '@/utils/types';
import safeParseURL from '@/utils/safeParseURL';
import findTeamById from '../teams/findTeamById';
import findCompetitorById from '../competitors/findCompetitorById';

const findLastReportsByEntityId = async ({
  teamId,
  competitorId,
}: {
  teamId?: string;
  competitorId?: string;
}) => {
  if (!teamId && !competitorId) throw new Error('must provide teamId or competitorId');

  const where = competitorId ? { competitorId } : { teamId };
  const orderBy = { createdAt: 'desc' } as const;
  const query = {
    where,
    orderBy,
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
    db.pricingPageReport.findFirst(query),
    db.messagingProfile.findFirst(query),
    db.jobListingsReport.findFirst(query),
    db.marketIntelReport.findFirst(query),
    teamId
      ? rocksetService.getKeyphraseFeedResults(teamId)
      : Promise.resolve(null),
  ]);

  const label = teamId
    ? await findTeamById(teamId).then((team) => team?.primaryDomain)
    : competitorId
      ? await findCompetitorById(competitorId).then((competitor) => competitor?.domain)
      : undefined;

  return {
    teamId,
    competitorId,
    label: label ? (safeParseURL(label)?.hostname ?? label) : undefined,
    emailSummaries,
    pricingPageReport,
    messagingProfile,
    jobListingsReport,
    marketIntelReport,
    scrapedItemsReport,
  };
};

export type ReportsByEntityIdReturnType = UnwrappedPromise<ReturnType<typeof findLastReportsByEntityId>>;

export default findLastReportsByEntityId;
