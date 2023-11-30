import summarizeWebsiteMessaging from '@/lib/logic/aiCapabilities/summarizeWebsiteMessaging';
import db from '@/lib/services/db/db';

const runWebpageMessagingReport = async ({ url, teamId, competitorId }: { url: string; teamId: string; competitorId?: string }) => {
  const pageSummary = await summarizeWebsiteMessaging(url);

  if (!pageSummary) {
    return null;
  }

  return db.messagingProfile.create({
    data: {
      competitorId,
      teamId,
      messagingProfile: pageSummary,
    },
  });
};

export default runWebpageMessagingReport;
