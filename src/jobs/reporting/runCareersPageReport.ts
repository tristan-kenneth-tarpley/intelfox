import summarizeCareersPage from '@/lib/logic/aiCapabilities/summarizeCareersPage';
import extractRelevantTextFromURL from '@/lib/logic/scraping/extractRelevantTextFromURL';
import db from '@/lib/services/db/db';

const runCareersPageReport = async ({ url, teamId, competitorId }: { url: string; teamId?: string; competitorId?: string }) => {
  console.log('runCareersPageReport', url);
  const careersPageText = await extractRelevantTextFromURL(url);
  if (!careersPageText) {
    return null;
  }

  const careersSummary = await summarizeCareersPage(careersPageText);
  console.log('got a careerssummary?', careersSummary);

  if (!careersSummary) {
    return null;
  }

  return db.jobListingsReport.create({
    data: {
      [competitorId ? 'competitorId' : 'teamId']: competitorId ?? teamId,
      listings: careersSummary.listings,
    },
  });
};

export default runCareersPageReport;
