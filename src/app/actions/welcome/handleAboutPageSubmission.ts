"use server";

import { routes } from "@/app/routes";
import { FormStateHandler } from "@/app/types";
import { URL_INVALID } from "@/lib/logic/aiCapabilities/constants";
import summarizePricing from "@/lib/logic/aiCapabilities/summarizePricing";
import db from "@/lib/services/db/db";
import { clerkClient } from "@clerk/nextjs";
import { Teams } from "@prisma/client/edge";
import { redirect } from "next/navigation";

const handleAboutPageSubmission: FormStateHandler<{
  team: Teams;
  message?: string;
}> = async ({ team }, formData) => {
  if (!team) {
    return redirect(routes.welcome());
  }

  const aboutCompany = formData.get("about_company")?.toString();
  const companyName = formData.get("company_name")?.toString();
  const pricingPageUrlField = formData.get("pricing_page_url")?.toString();

  const pricingPageSummary = pricingPageUrlField
    ? await summarizePricing(pricingPageUrlField)
    : undefined;

  const pricingPageUrl =
    pricingPageSummary && pricingPageSummary !== URL_INVALID
      ? pricingPageUrlField
      : undefined;

  await Promise.all([
    clerkClient.organizations.updateOrganization(team.clerkOrgId, {
      name: companyName,
    }),
    db.teams.update({
      where: {
        id: team.id,
      },
      data: {
        description: aboutCompany,
        name: companyName,
        ...(pricingPageUrl
          ? {
              urls: {
                push: [
                  {
                    type: "PRICING_PAGE",
                    url: pricingPageUrl,
                  },
                ],
              },
            }
          : undefined),
      },
    }),
  ]);

  return redirect(routes.welcomeCompetitors({ t: team.id }));
};

export default handleAboutPageSubmission;
