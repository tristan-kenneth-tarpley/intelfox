import db from "@/lib/services/db/db";
import safeParseURL from "@/utils/safeParseURL";
import maybeAddProtocolToURL from "@/utils/maybeAddProtocolToURL";
import extractCompanyNameFromURL from "../aiCapabilities/extractCompanyNameFromURL";
import summarizeWebsiteMessaging from "../aiCapabilities/summarizeWebsiteMessaging";
import findCompetitorByDomain from "./findCompetitorByDomain";

const findOrInitializeCompetitor = async (domainParam: string) => {
  const domain = maybeAddProtocolToURL(domainParam);

  const existingCompetitor = await findCompetitorByDomain(domain);

  if (existingCompetitor) {
    return existingCompetitor;
  }

  const [websiteMessaging, companyTeamNameFromURLChatCompletion] =
    await Promise.all([
      summarizeWebsiteMessaging(domain),
      extractCompanyNameFromURL(domain).catch(() => null),
    ]);

  const parsedURL = safeParseURL(domain);
  const name =
    companyTeamNameFromURLChatCompletion?.choices[0]?.message.content ??
    parsedURL?.hostname ??
    domain;

  const competitor = await db.competitors.create({
    data: {
      domain,
      name,
      description: websiteMessaging?.summary ?? "",
      urls: [
        {
          type: "HOMEPAGE",
          url: domain,
        },
      ],
    },
  });

  if (websiteMessaging) {
    await db.messagingProfile.create({
      data: {
        competitorId: competitor.id,
        messagingProfile: websiteMessaging,
      },
    });
  }

  return competitor;
};

export default findOrInitializeCompetitor;
