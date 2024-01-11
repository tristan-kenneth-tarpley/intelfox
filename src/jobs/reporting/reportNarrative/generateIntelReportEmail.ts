import _ from 'lodash';
import pickRelevantScrapedItems from '@/lib/logic/aiCapabilities/pickRelevantScrapedItems';
import findCompetitorsByTeamId from '@/lib/logic/competitors/findCompetitorsByTeamId';
import findLastReportsByEntityId, { ReportsByEntityIdReturnType } from '@/lib/logic/reporting/findLastReportsByEntityId';
import logManyScrapedItems from '@/lib/logic/scraping/logManyScrapedItems';
import findTeamById from '@/lib/logic/teams/findTeamById';
import sendgridService from '@/lib/services/sendgrid/sendgridService';
import isTruthy from '@/utils/isTruthy';
import { clerkClient } from '@clerk/nextjs/server';
import { Competitors, JobListing, Teams } from '@prisma/client/edge';
import safeParseURL from '@/utils/safeParseURL';

type CollatedEntityReportKeys = Extract<keyof ReportsByEntityIdReturnType,
| 'scrapedItemsReport'
| 'pricingPageReport'>;

type WithLabel<T> = { label: string } & T;

const withLabel = (label: string) => <T>(value: T): WithLabel<T> => ({ label, ...value });

const collateCompetitorReportsByType = (reports: ReportsByEntityIdReturnType[]) => {
  return reports.reduce((acc, report) => {
    const {
      scrapedItemsReport,
      jobListingsReport,
      pricingPageReport,
      emailSummaries,
      label,
    } = report;

    if (!label) {
      return acc;
    }

    const labeler = withLabel(label);

    return {
      scrapedItemsReport: [...(acc.scrapedItemsReport ?? []), labeler(scrapedItemsReport)],
      jobListings: [...(acc.jobListings ?? []), ...jobListingsReport?.listings.map(labeler) ?? []],
      pricingPageReport: [...(acc.pricingPageReport ?? []), labeler(pricingPageReport)],
      emailSummaries: [...(acc.emailSummaries ?? []), ...(emailSummaries?.map(labeler) ?? [])],
    };
  }, {
    scrapedItemsReport: [],
    jobListings: [],
    pricingPageReport: [],
    emailSummaries: [],
  } as {
    [key in CollatedEntityReportKeys]: WithLabel<ReportsByEntityIdReturnType[key]>[];
  } & {
    emailSummaries: WithLabel<ReportsByEntityIdReturnType['emailSummaries'][number]>[];
    jobListings: WithLabel<JobListing>[];
  });
};

const generateReportForTeam = async ({ team }: { team: Teams }) => {
  const teamReports = await findLastReportsByEntityId({ teamId: team.id });
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
  return findLastReportsByEntityId({ competitorId: competitor.id });
};

const generateIntelReportEmail = async ({ teamId }: { teamId: string }) => {
  const team = await findTeamById(teamId);

  if (!team) {
    throw new Error(`Team not found for id: ${teamId}`);
  }

  const teamReport = await generateReportForTeam({ team });
  const competitors = await findCompetitorsByTeamId(teamId);
  const competitorReports = await Promise.all(competitors.map((competitor) => generateReportForCompetitor({ team, competitor })));

  const collatedCompetitorReports = collateCompetitorReportsByType(competitorReports);

  const teamMembers = await clerkClient.organizations.getOrganizationMembershipList({ organizationId: team.clerkOrgId });
  await sendgridService.sendMonthlyReportEmail({
    to: teamMembers.map(({ publicUserData }) => publicUserData?.identifier).filter(isTruthy),
    preheader: 'The preheader content', // todo write good preheader content
    sections: [
      {
        header: 'Scraped items',
        description: 'These are the items we scraped this month',
        contents: teamReport.scrapedItemsReport?.map((item) => ({
          preparedFor: safeParseURL(team.primaryDomain)?.hostname ?? team.name,
          header: item.text,
          content: item.bodyText ?? item.parentText ?? '',
          link: {
            href: `https://reddit.com${item.href}`, // todo move to util and create a route where we can track this click
            text: `View on ${_.startCase(item.source.toLowerCase())}`,
          },
        })) ?? [],
      },
      {
        header: 'Careers',
        description: 'What are your competitors hiring for right now?',
        contents: collatedCompetitorReports.jobListings?.map(({
          label, title, location, department,
        }) => ({
          preparedFor: label,
          header: title,
          content: `${department}, ${location}`,
        })) ?? [],
      },
      {
        header: 'Pricing',
        description: 'What are your competitors charging?',
        contents: collatedCompetitorReports.pricingPageReport?.map(({
          label, pricingSummary,
        }) => ({
          preparedFor: label,
          header: `Pricing summary`,
          content: pricingSummary,
        })) ?? [],
      },
      {
        header: 'Emails',
        description: 'What are your competitors emailing about?',
        contents: collatedCompetitorReports.emailSummaries?.map(({
          label,
          subject,
          messagingProfile: {
            title,
            summary,
            category,
            personality,
          },
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
                ${personality.map(({ trait, description }) => (
            `<div>${trait}: ${description}</div>`
          )).join('')}
              </div>
            </div>
          `.trim(),
        })) ?? [],
      },
    ].filter(isTruthy),
  });

  return '';
};

export default generateIntelReportEmail;
