import summarizeProductTraits from '@/lib/logic/aiCapabilities/summarizeProductTraits';
import findCompetitorById from '@/lib/logic/competitors/findCompetitorById';
import extractRelevantTextFromURL from '@/lib/logic/scraping/extractRelevantTextFromURL';
import findTeamById from '@/lib/logic/teams/findTeamById';
import db from '@/lib/services/db/db';

const runMarketIntelReport = async ({
  teamId,
  competitorId = null,
}: {
  teamId?: string,
  competitorId?: string | null,
}) => {
  // todo we don't need to handle the team here
  const team = teamId ? await findTeamById(teamId) : null;
  const competitor = competitorId ? await findCompetitorById(competitorId) : null;

  const entity = competitor ?? team;

  if (!entity) {
    // todo add telemetry
    return null;
  }

  const targetUrl = entity.urls?.find((url) => url.type === 'CAPTERRA');
  if (!targetUrl) {
    return null;
  }

  // todo add support for other types of urls, like pricing page
  const relevantText = await extractRelevantTextFromURL(targetUrl.url);
  const productReport = relevantText
    ? await summarizeProductTraits(relevantText)
    : null;

  if (!productReport) {
    // todo add telemetry
    return null;
  }

  return db.marketIntelReport.create({
    data: {
      ...productReport,
      teamId,
      competitorId,
    },
  });
};

export default runMarketIntelReport;
