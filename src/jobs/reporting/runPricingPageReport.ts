import summarizePricing from '@/lib/logic/aiCapabilities/summarizePricing';
import extractRelevantTextFromURL from '@/lib/logic/scraping/extractRelevantTextFromURL';
import db from '@/lib/services/db/db';

const runPricingPageReport = async ({
  url,
  teamId,
  competitorId,
}: {
  url: string;
  teamId?: string;
  competitorId?: string;
}) => {
  const pricingPageText = await extractRelevantTextFromURL(url);

  if (!pricingPageText) {
    return null;
  }

  const pricingSummary = await summarizePricing(pricingPageText);

  if (!pricingSummary) {
    return null;
  }

  return db.pricingPageReport.create({
    data: {
      [competitorId ? 'competitorId' : 'teamId']: competitorId ?? teamId,
      pricingSummary,
    },
  });
};

export default runPricingPageReport;
