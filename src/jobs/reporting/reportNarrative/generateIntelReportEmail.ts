import _ from 'lodash';
import pickRelevantScrapedItems from '@/lib/logic/aiCapabilities/pickRelevantScrapedItems';
import findCompetitorsByTeamId from '@/lib/logic/competitors/findCompetitorsByTeamId';
import findLastNReportsByEntityId from '@/lib/logic/reporting/findLastNReportsByEntityId';
import logManyScrapedItems from '@/lib/logic/scraping/logManyScrapedItems';
import findTeamById from '@/lib/logic/teams/findTeamById';
import sendgridService from '@/lib/services/sendgrid/sendgridService';
import isTruthy from '@/utils/isTruthy';
import { clerkClient } from '@clerk/nextjs/server';
import { Competitors, Teams } from '@prisma/client/edge';

const generateReportForTeam = async ({ team }: { team: Teams }) => {
  const teamReports = await findLastNReportsByEntityId({ teamId: team.id }, { n: 2 });
  const relevantScrapedItems = teamReports.scrapedItemsReport?.length
    ? await pickRelevantScrapedItems(teamReports.scrapedItemsReport, team)
    : null;

  const scrapedItemsToShow = relevantScrapedItems?.slice(0, 3);
  if (scrapedItemsToShow?.length) {
    await logManyScrapedItems(scrapedItemsToShow.map((item) => item.id), team.id);
  }
  return {
    ...teamReports,
    scrapedItemsReport: scrapedItemsToShow,
  };
};

const generateReportForCompetitor = async ({ competitor }: { team: Teams; competitor: Competitors }) => {
  return findLastNReportsByEntityId({ competitorId: competitor.id }, { n: 1 });
};

const generateIntelReportEmail = async ({ teamId }: { teamId: string }) => {
  const team = await findTeamById(teamId);

  if (!team) {
    throw new Error(`Team not found for id: ${teamId}`);
  }

  const competitors = await findCompetitorsByTeamId(teamId);
  const teamReport = await generateReportForTeam({ team });
  // const competitorReports = await Promise.all(competitors.map((competitor) => generateReportForCompetitor({ team, competitor })));

  const teamMembers = await clerkClient.organizations.getOrganizationMembershipList({ organizationId: team.clerkOrgId });
  await sendgridService.sendMonthlyReportEmail({
    to: teamMembers.map(({ publicUserData }) => publicUserData?.identifier).filter(isTruthy),
    preheader: 'The preheader content', // todo write good preheader content
    sections: [
      {
        header: 'Scraped items',
        description: 'These are the items we scraped this month',
        contents: teamReport.scrapedItemsReport?.map((item) => ({
          preparedFor: team.primaryDomain,
          header: item.text,
          content: item.bodyText ?? item.parentText ?? '',
          link: {
            href: `https://reddit.com${item.href}`, // todo move to util and create a route where we can track this click
            text: `View on ${_.startCase(item.source.toLowerCase())}`,
          },
        })) ?? [],
      },
    ],
  });

  return '';

  // return joinOnNewLine([
  //   '\n\nTeam report: ',
  //   teamReport.join('\n\n'),
  //   ...competitorReports.map((report, i) => joinOnNewLine([
  //     `Competitor report ${i + 1}:`,
  //     report.join('\n\n'),
  //   ].filter(isTruthy))),
  // ].filter(isTruthy));
};

export default generateIntelReportEmail;
