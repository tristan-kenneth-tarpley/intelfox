import db from "@/lib/services/db/db";
import safeParseURL from "@/utils/safeParseURL";
import maybeAddProtocolToURL from "@/utils/maybeAddProtocolToURL";
import extractCompanyNameFromURL from "../aiCapabilities/extractCompanyNameFromURL";
import summarizeWebsiteMessaging from "../aiCapabilities/summarizeWebsiteMessaging";

const findOrInitializeCompetitor = async (domainParam: string) => {
  const domain = maybeAddProtocolToURL(domainParam);
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

  const competitor = await db.competitors.upsert({
    where: {
      domain,
    },
    update: {
      domain,
    },
    create: {
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

  return competitor;
};

export default findOrInitializeCompetitor;
