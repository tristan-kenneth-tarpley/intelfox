import findCompetitorsByTeamId from '@/lib/logic/competitors/findCompetitorsByTeamId';
import findLastNReportsByEntityId from '@/lib/logic/reporting/findLastNReportsByEntityId';
import findTeamById from '@/lib/logic/teams/findTeamById';
import openAIClient from '@/lib/services/openAI/client';
import pluckFirstChoice from '@/lib/services/openAI/pluckFirstChoice';
import isTruthy from '@/utils/isTruthy';
import joinOnNewLine from '@/utils/joinOnNewLine';
import { UnwrappedPromise } from '@/utils/types';
import { Competitors, Teams } from '@prisma/client/edge';

const handleRequest = ({
  team,
  competitor,
  reportText,
}: {
  team: Teams;
  competitor?: Competitors;
  reportText: string;
}) => {
  const systemMessages = [
    `You are a market intelligence analyst for a company called ${team.name} with the following description:`,
    team.description,
    `The following content was found online about ${competitor ? `a competitor called ${competitor.name}` : 'your company'}.`,
    'Compile a concise intelligence report for your team to review in the following format:',
    'just use your best judgment for now with format, just keep it concise', // todo define format
    'Call out changes in strategy, dissonance between how they present themselves and how the market views them, as well as opportunities to gain an advantage on competitors in the market.',
  ].join('\n');

  return openAIClient.createModeratedChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemMessages },
      { role: 'system', content: reportText },
    ],
  }).then(pluckFirstChoice);
};

const prepareCompletionArgs = (reports: UnwrappedPromise<ReturnType<typeof findLastNReportsByEntityId>>) => {
  return [
    joinOnNewLine([
      'Pricing page report:',
      ...reports.pricingPageReport.map(({ pricingSummary }, i) => `collected ${i === 0 ? 'this month' : 'last month'}: ${pricingSummary}`),
    ]),
    joinOnNewLine([
      'Pricing page report:',
      ...reports.messagingProfile.map(({
        messagingProfile: {
          summary,
          keyValueProps,
          personality,
        },
      }, i) => joinOnNewLine([
        `collected ${i === 0 ? 'this month' : 'last month'}`,
        `summary: ${summary}`,
        `key value props: ${keyValueProps.join(', ')}`,
        `personality: ${personality.map(({ trait, description }) => `${trait}: ${description}`).join(', ')}`,
      ])),
    ]),
    joinOnNewLine([
      'Open job postings:',
      ...reports.jobListingsReport.map(({ listings }, i) => joinOnNewLine([
        `collected ${i === 0 ? 'this month' : 'last month'}: ${listings.length} job listings`,
        ...listings.map(({ title, department, location }) => joinOnNewLine([
          `title: ${title}`,
          `department: ${department}`,
          `location: ${location}`,
        ])),
      ])),
    ]),
    joinOnNewLine([
      'Summarization from a product review site:',
      ...reports.marketIntelReport.map(({
        pros,
        cons,
        peopleGoodFor,
        peopleNotGoodFor,
      }, i) => joinOnNewLine([
        `collected ${i === 0 ? 'this month' : 'last month'}:`,
        `pros: ${pros.join(', ')}`,
        `cons: ${cons.join(', ')}`,
        `people good for: ${peopleGoodFor.join(', ')}`,
        `people not good for: ${peopleNotGoodFor.join(', ')}`,
      ])),
    ]),
    joinOnNewLine([
      'Summaries of marketing emails sent in the past 30 days:',
      ...reports.emailSummaries.map(({
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
    ]),
  ];
};

const makeCompletions = async ({
  team,
  competitor,
  reports,
}: {
  team: Teams,
  competitor?: Competitors,
  reports: UnwrappedPromise<ReturnType<typeof findLastNReportsByEntityId>>,
}) => {
  const completionArgs = prepareCompletionArgs(reports);
  const [
    pricingCompletion,
    messagingCompletion,
    jobListingsCompletion,
    marketIntelCompletion,
    emailSummariesCompletion,
  ] = await Promise.all(completionArgs.map((reportText) => handleRequest({
    team,
    competitor,
    reportText,
  })));

  console.log(`combining them all at the end for ${competitor ? `competitor: ${competitor.name}` : 'team'}`);
  return handleRequest({
    team,
    reportText: joinOnNewLine([
      'compile the following reports into one cohesive report:',
      pricingCompletion,
      messagingCompletion,
      jobListingsCompletion,
      marketIntelCompletion,
      emailSummariesCompletion,
    ].filter(isTruthy)),
  });
};

const generateReportForTeam = async ({ team }: { team: Teams }) => {
  const teamReports = await findLastNReportsByEntityId({ teamId: team.id }, { n: 2 });
  return makeCompletions({ team, reports: teamReports });
};

const generateReportForCompetitor = async ({ team, competitor }: { team: Teams; competitor: Competitors }) => {
  const competitorReports = await findLastNReportsByEntityId({ competitorId: competitor.id }, { n: 2 });
  return makeCompletions({ team, competitor, reports: competitorReports });
};

const generateIntelReportEmail = async ({ teamId }: { teamId: string }) => {
  const team = await findTeamById(teamId);

  if (!team) {
    throw new Error(`Team not found for id: ${teamId}`);
  }

  const competitors = await findCompetitorsByTeamId(teamId);
  const teamReport = await generateReportForTeam({ team });
  const competitorReports = await Promise.all(competitors.map((competitor) => generateReportForCompetitor({ team, competitor })));

  // todo also look for scraped reddit items here
  return joinOnNewLine([
    'Team report:',
    teamReport,
    ...competitorReports.map((report, i) => joinOnNewLine([
      `Competitor report ${i + 1}:`,
      report,
    ].filter(isTruthy))),
  ].filter(isTruthy));
};

export default generateIntelReportEmail;
