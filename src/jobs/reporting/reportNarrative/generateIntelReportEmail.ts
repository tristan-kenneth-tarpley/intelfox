import _ from "lodash";
import findTeamById from "@/lib/logic/teams/findTeamById";
import sendgridService from "@/lib/services/sendgrid/sendgridService";
import isTruthy from "@/utils/isTruthy";
import { clerkClient } from "@clerk/nextjs/server";
import safeParseURL from "@/utils/safeParseURL";
import getCollatedReports from "./getCollatedReports";

const generateIntelReportEmail = async ({ teamId }: { teamId: string }) => {
  const team = await findTeamById(teamId);

  if (!team) {
    throw new Error(`Team not found for id: ${teamId}`);
  }

  const { teamReport, collatedCompetitorReports } = await getCollatedReports({
    team,
  });

  const teamMembers =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: team.clerkOrgId,
    });
  await sendgridService.sendMonthlyReportEmail({
    to: teamMembers
      .map(({ publicUserData }) => publicUserData?.identifier)
      .filter(isTruthy),
    preheader: "The preheader content", // todo write good preheader content
    sections: [
      {
        header: "Scraped items",
        description: "These are the items we scraped this month",
        contents:
          teamReport.scrapedItemsReport?.map((item) => ({
            preparedFor:
              safeParseURL(team.primaryDomain)?.hostname ?? team.name,
            header: item.text,
            content: item.bodyText ?? item.parentText ?? "",
            link: {
              href: `https://reddit.com${item.href}`, // todo move to util and create a route where we can track this click
              text: `View on ${_.startCase(item.source.toLowerCase())}`,
            },
          })) ?? [],
      },
      {
        header: "Careers",
        description: "What are your competitors hiring for right now?",
        contents:
          collatedCompetitorReports.jobListings?.map(
            ({ label, title, location, department }) => ({
              preparedFor: label,
              header: title,
              content: `${department}, ${location}`,
            }),
          ) ?? [],
      },
      {
        header: "Pricing",
        description: "What are your competitors charging?",
        contents:
          collatedCompetitorReports.pricingPageReport?.map(
            ({ label, pricingSummary }) => ({
              preparedFor: label,
              header: `Pricing summary`,
              content: pricingSummary,
            }),
          ) ?? [],
      },
      {
        header: "Emails",
        description: "What are your competitors emailing about?",
        contents:
          collatedCompetitorReports.emailSummaries?.map(
            ({
              label,
              subject,
              messagingProfile: { title, summary, category, personality },
            }) => ({
              preparedFor: label,
              header: title,
              content: `
            <div>
              <div>${subject}</div>
              <div>${summary}</div>
              <div>${category}</div>
              <div>
                <div>Personality:</div>
                ${personality
                  .map(
                    ({ trait, description }) =>
                      `<div>${trait}: ${description}</div>`,
                  )
                  .join("")}
              </div>
            </div>
          `.trim(),
            }),
          ) ?? [],
      },
    ].filter(isTruthy),
  });

  return "";
};

export default generateIntelReportEmail;
