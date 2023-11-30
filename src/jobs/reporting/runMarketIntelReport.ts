import summarizeProductTraits from '@/lib/logic/aiCapabilities/summarizeProductTraits';
import findCompetitorById from '@/lib/logic/competitors/findCompetitorById';
import extractRelevantTextFromURL from '@/lib/logic/scraping/extractRelevantTextFromURL';
import findTeamById from '@/lib/logic/teams/findTeamById';
import db from '@/lib/services/db/db';

const runMarketIntelReport = async ({
  teamId,
  competitorId = null,
}: {
  teamId: string,
  competitorId?: string | null,
}) => {
  const team = await findTeamById(teamId);
  const competitor = competitorId ? await findCompetitorById(competitorId) : null;

  if (!team || (competitorId && !competitor)) {
    // todo add telemetry and handle gracefully
    return null;
  }

  const entity = competitor ?? team;
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
