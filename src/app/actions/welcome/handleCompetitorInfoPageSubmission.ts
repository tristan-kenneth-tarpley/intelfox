"use server";

import { routes } from "@/app/routes";
import { FormStateHandler } from "@/app/types";
import db from "@/lib/services/db/db";
import { Teams } from "@prisma/client/edge";
import { redirect } from "next/navigation";

const handleCompetitorInfoPageSubmission: FormStateHandler<{
  team: Teams;
  message?: string;
}> = async ({ team }, formData) => {
  const formDataByCompetitorId = Array.from(formData.entries()).reduce(
    (acc, [key, value]) => {
      const isPricingUrl = key.startsWith("pricing_url");
      const isPricingDescription = key.startsWith("pricing_description");

      const competitorId = key.split("_")[2];

      return {
        ...acc,
        [competitorId]: {
          ...acc[competitorId],
          ...(isPricingUrl
            ? {
                pricingUrl: value.toString(),
              }
            : undefined),
          ...(isPricingDescription
            ? {
                pricingSummary: value.toString(),
              }
            : undefined),
          competitorId,
        },
      };
    },
    {} as Record<
      string,
      {
        competitorId: string;
        pricingUrl?: string;
        pricingSummary?: string;
      }
    >,
  );

  await Promise.all(
    Object.values(formDataByCompetitorId).map(
      ({ competitorId, pricingUrl, pricingSummary }) => {
        return Promise.all([
          pricingUrl
            ? db.competitors.update({
                where: {
                  id: competitorId,
                },
                data: {
                  urls: {
                    push: [
                      {
                        type: "PRICING_PAGE",
                        url: pricingUrl,
                      },
                    ],
                  },
                },
              })
            : Promise.resolve(undefined),
          pricingSummary
            ? db.pricingPageReport.create({
                data: {
                  competitorId,
                  pricingSummary,
                },
              })
            : Promise.resolve(undefined),
        ]);
      },
    ),
  );

  return redirect(routes.welcomeConfirmation({ t: team.id }));
};

export default handleCompetitorInfoPageSubmission;
