import pickRelevantScrapedItems from '@/lib/logic/aiCapabilities/pickRelevantScrapedItems';
import findCompetitorsByTeamId from '@/lib/logic/competitors/findCompetitorsByTeamId';
import findLastNReportsByEntityId from '@/lib/logic/reporting/findLastNReportsByEntityId';
import findTeamById from '@/lib/logic/teams/findTeamById';
import isTruthy from '@/utils/isTruthy';
import joinOnNewLine from '@/utils/joinOnNewLine';
import { Competitors, Teams } from '@prisma/client/edge';

// todo combine logic in these two functions
const generateReportForTeam = async ({ team }: { team: Teams }) => {
  const teamReports = await findLastNReportsByEntityId({ teamId: team.id }, { n: 2 });
  const relevantScrapedItems = teamReports.scrapedItemsReport?.length
    ? await pickRelevantScrapedItems(teamReports.scrapedItemsReport, team)
    : null;

  return [
    'Scraped items:',
    ...relevantScrapedItems?.map(({ text, bodyText, parentText }) => joinOnNewLine([
      `title: ${text}`,
      `body text: ${bodyText}`,
      parentText ? `Text of post where this comment was posted: ${parentText}` : null,
    ].filter(isTruthy))) ?? [],
    '\n\nPricing report:',
    teamReports.pricingPageReport[0]?.pricingSummary,
    '\n\nEmails:',
    ...teamReports.emailSummaries.map(({
      subject,
      messagingProfile: {
        title,
        summary,
        category,
        personality,
      },
    }) => joinOnNewLine([
      `subject: ${subject}`,
      `title: ${title}`,
      `summary: ${summary}`,
      `category: ${category}`,
      `personality: ${personality.map(({ trait, description }) => `${trait}: ${description}`).join(', ')}`,
    ])),
  ];
};

const generateReportForCompetitor = async ({ competitor }: { team: Teams; competitor: Competitors }) => {
  const competitorReports = await findLastNReportsByEntityId({ competitorId: competitor.id }, { n: 2 });
  return [
    `\n\nCompetitor name: ${competitor.name}`,
    '\n\nCareers:',
    competitorReports.jobListingsReport[0]?.listings.map(
      ({ title, department, location }) => joinOnNewLine([
        `\n\ntitle: ${title}`,
        `department: ${department}`,
        `location: ${location}`,
      ]),
    ),

    '\n\nPricing report:',
    competitorReports.pricingPageReport[0]?.pricingSummary,
    '\n\nEmails:',
    ...competitorReports.emailSummaries.map(({
      subject,
      messagingProfile: {
        title,
        summary,
        category,
        personality,
      },
    }) => joinOnNewLine([
      '\n\n',
      `subject: ${subject}`,
      `title: ${title}`,
      `summary: ${summary}`,
      `category: ${category}`,
      `personality: ${personality.map(({ trait, description }) => `${trait}: ${description}`).join(', ')}`,
    ])),
  ];
};

const generateIntelReportEmail = async ({ teamId }: { teamId: string }) => {
  const team = await findTeamById(teamId);

  if (!team) {
    throw new Error(`Team not found for id: ${teamId}`);
  }

  const competitors = await findCompetitorsByTeamId(teamId);
  const teamReport = await generateReportForTeam({ team });
  const competitorReports = await Promise.all(competitors.map((competitor) => generateReportForCompetitor({ team, competitor })));

  return joinOnNewLine([
    '\n\nTeam report: ',
    teamReport.join('\n\n'),
    ...competitorReports.map((report, i) => joinOnNewLine([
      `Competitor report ${i + 1}:`,
      report.join('\n\n'),
    ].filter(isTruthy))),
  ].filter(isTruthy));
};

export default generateIntelReportEmail;
