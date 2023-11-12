import db from '@/lib/services/db/db';
import safeParseURL from '@/utils/safeParseURL';
import scrapeMetaDescriptionFromURL from '../scraping/scrapeMetaDescriptionFromURL';
import extractCompanyNameFromURL from '../aiCapabilities/extractCompanyNameFromURL';

const findOrInitializeCompetitor = async (domain: string) => {
  const [
    metaDescription,
    companyTeamNameFromURLChatCompletion,
  ] = await Promise.all([
    scrapeMetaDescriptionFromURL(domain),
    extractCompanyNameFromURL(domain).catch(() => null),
  ]);

  const parsedURL = safeParseURL(domain);
  const name = companyTeamNameFromURLChatCompletion?.choices[0]?.message.content ?? parsedURL?.hostname ?? domain;

  const competitor = await db.competitors.upsert({
    where: {
      domain,
    },
    update: {
      domain,
    },
    // todo need to gather data about the domain
    create: {
      domain,
      name,
      description: metaDescription ?? '',
    },
  });

  return competitor;
};

export default findOrInitializeCompetitor;
