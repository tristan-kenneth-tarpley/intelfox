import summarizeCareersPage from '@/lib/logic/aiCapabilities/summarizeCareersPage';
import db from '@/lib/services/db/db';

const runCareersPageReport = async ({ url, teamId, competitorId }: { url: string; teamId: string; competitorId?: string }) => {
  const careersSummary = await summarizeCareersPage(url);

  if (!careersSummary) {
    return null;
  }

  return db.jobListingsReport.create({
    data: {
      competitorId,
      teamId,
      listings: careersSummary.listings,
    },
  });
};

export default runCareersPageReport;
