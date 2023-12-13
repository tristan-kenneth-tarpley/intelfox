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
  const name = competitor?.name ?? team.name;
  // todo include more global context here, then only focus on emails, job postings, and pricing page in report
  const systemMessages = [
    `You are a market intelligence analyst for a company called ${name} with the following description:`,
    competitor?.description ?? team.description,
    `The following content was found online about ${name}.`,
    'Answer the questions asked from a 3rd party, neutral perspective.',
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
  console.log({
    careers: reports.jobListingsReport[0]?.listings.length,
  });
  return [
    // todo, we should ask these questions upstream when we scrape then pass the raw text here, or ask for differences between the last two months
    // joinOnNewLine([
    //   'Given the following summary of the pricing page, answer the following questions in one paragraph or less:',
    //   '- how do they segment their pricing?',
    //   '- Which features are paywalled?',
    //   '- Is there a free plan?',
    //   ...reports.pricingPageReport.map(({ pricingSummary }, i) => `collected ${i === 0 ? 'this month' : 'last month'}: ${pricingSummary}`),
    // ]),
    // todo don't need to pass to OAI
    // we should pass this as context to the rest of the prompts
    // instead, compare how team positions vs. how competitor positions
    joinOnNewLine([
      'The following is an analysis of how the company positions itself on their website.',
      'Summarize the following characteristics in less than one paragraph:',
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
      'Start your response with MESSAGING PROFILE: {{response}}',
    ]),
    // todo, maybe can we ask "what does this say about their priorities/strategy?"
    // compare to last month
    reports.jobListingsReport[0]?.listings.length ? joinOnNewLine([
      'Compare the prior 2 months of job listings, including what is different:',
      ...reports.jobListingsReport.map(({ listings }, i) => joinOnNewLine([
        `collected ${i === 0 ? 'this month' : 'last month'}: ${listings.length} job listings`,
        ...listings.map(({ title, department, location }) => joinOnNewLine([
          `title: ${title}`,
          `department: ${department}`,
          `location: ${location}`,
        ])),
      ])),
      'Start your response with CAREERS REPORT: {{response}}',
    ]) : null,
    joinOnNewLine([
      'The following is an analysis of how the market views the company',
      'Summarize the following characteristics in less than one paragraph:',
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
      'Start your response with MARKET INTEL REPORT: {{response}}',
    ]),
    // todo don't need to pass to OAI
    // just print our summaries
    // maybeeee use OAI to stack rank or pick 3 that are most relevant
    // joinOnNewLine([
    //   'Summaries of marketing emails sent in the past 30 days:',
    //   ...reports.emailSummaries.map(({
    //     subject,
    //     messagingProfile: {
    //       title,
    //       summary,
    //       category,
    //       personality,
    //     },
    //   }) => joinOnNewLine([
    //     `subject: ${subject}`,
    //     `title: ${title}`,
    //     `summary: ${summary}`,
    //     `category: ${category}`,
    //     `personality: ${personality.map(({ trait, description }) => `${trait}: ${description}`).join(', ')}`,
    //   ])),
    // ]),
  ].filter(isTruthy);
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
  const completions = await Promise.all(completionArgs.map((reportText) => handleRequest({
    team,
    competitor,
    reportText,
  })));

  return [
    ...completions,
    reports.pricingPageReport[0]?.pricingSummary, // todo compare to last month and do better code
  ]
    .filter(isTruthy)
    .flat();
};

// todo combine logic in these two functions
const generateReportForTeam = async ({ team }: { team: Teams }) => {
  const teamReports = await findLastNReportsByEntityId({ teamId: team.id }, { n: 2 });
  const completions = await makeCompletions({ team, reports: teamReports });

  console.log('teamReports', teamReports);
  return [
    ...completions,
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

const generateReportForCompetitor = async ({ team, competitor }: { team: Teams; competitor: Competitors }) => {
  const competitorReports = await findLastNReportsByEntityId({ competitorId: competitor.id }, { n: 2 });
  const completions = await makeCompletions({ team, competitor, reports: competitorReports });
  return [
    ...completions,
    '\n\nCareers:',
    competitorReports.jobListingsReport[0]?.listings.map(
      ({ title, department, location }) => joinOnNewLine([
        `title: ${title}`, `department: ${department}`, `location: ${location}`,
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
  console.log('teamReport received');
  const competitorReports = await Promise.all(competitors.map((competitor) => generateReportForCompetitor({ team, competitor })));
  console.log('competitorReports received');

  // todo also look for scraped reddit items here
  return joinOnNewLine([
    'Report:',
    teamReport.join('\n\n'),
    ...competitorReports.map((report, i) => joinOnNewLine([
      `Competitor report ${i + 1}:`,
      report.join('\n\n'),
    ].filter(isTruthy))),
  ].filter(isTruthy));
};

export default generateIntelReportEmail;
