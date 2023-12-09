import findCompetitorsByTeamId from '@/lib/logic/competitors/findCompetitorsByTeamId';
import findTeamById from '@/lib/logic/teams/findTeamById';
import { TeamURLs } from '@prisma/client/edge';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import runJob from './runJob';
import runMarketIntelReport from './reporting/runMarketIntelReport';
import runPricingPageReport from './reporting/runPricingPageReport';
import runWebpageMessagingReport from './reporting/runWebpageMessagingReport';
import runCareersPageReport from './reporting/runCareersPageReport';

const handleUrl = (teamUrl: TeamURLs, basePayload: {
  teamId: string;
  competitorId?: string;
}) => {
  const payload = {
    ...basePayload,
    url: teamUrl.url,
  };

  switch (teamUrl.type) {
    case 'HOMEPAGE':
      return runJob(runWebpageMessagingReport, payload);
    case 'PRICING_PAGE':
      return runJob(runPricingPageReport, payload);
    case 'CAREERS_PAGE':
      return runJob(runCareersPageReport, payload);
    case 'CAPTERRA':
      return runJob(runMarketIntelReport, payload);
    default:
      return null;
  }
};

const prepIntelReportForTeam = async ({ teamId }: { teamId: string }) => {
  const team = await findTeamById(teamId);
  const competitors = await findCompetitorsByTeamId(teamId);

  if (!team) {
    throw new Error(`Team not found for id ${teamId}`);
  }

  // todo fallback to primaryDomain if we don't have HOMEPAGE
  await Promise.all(team.urls.map((teamUrl) => handleUrl(teamUrl, { teamId })));
  await competitors.flatMap(async ({ urls, id }) => {
    return Promise.all(urls.map(({ type, url }) => handleUrl({ type, url }, { teamId, competitorId: id })));
  });

  await updateTeamById(teamId, { lastPreppedAt: new Date() });
};

export default prepIntelReportForTeam;
