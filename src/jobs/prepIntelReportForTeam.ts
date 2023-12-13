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
      console.log('requesting HOMEPAGE');
      return runJob(runWebpageMessagingReport, payload);
    case 'PRICING_PAGE':
      console.log('requesting PRICING_PAGE');
      return runJob(runPricingPageReport, payload);
    case 'CAREERS_PAGE':
      console.log('requesting CAREERS');
      return runJob(runCareersPageReport, payload);
    case 'CAPTERRA':
      console.log('requesting CAPTERRA');
      return runJob(runMarketIntelReport, payload);
    default:
      return null;
  }
};

const prepIntelReportForTeam = async ({ teamId }: { teamId: string }) => {
  const team = await findTeamById(teamId);
  const competitors = await findCompetitorsByTeamId(teamId);

  // todo, here we probably want to score/analyze some reddit posts (scrapedItems)
  if (!team) {
    throw new Error(`Team not found for id ${teamId}`);
  }

  console.log('competitors', competitors[0].id, competitors[0]?.urls);

  // todo fallback to primaryDomain if we don't have HOMEPAGE
  await Promise.all(team.urls.map((teamUrl) => handleUrl(teamUrl, { teamId })));
  await competitors.flatMap(async ({ urls, id }) => {
    return Promise.all(urls.map(({ type, url }) => handleUrl({ type, url }, { teamId, competitorId: id })));
  });

  await updateTeamById(teamId, { lastPreppedAt: new Date() });
};

export default prepIntelReportForTeam;
