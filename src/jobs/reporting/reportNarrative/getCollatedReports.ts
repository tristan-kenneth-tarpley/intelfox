import pickRelevantScrapedItems from "@/lib/logic/aiCapabilities/pickRelevantScrapedItems";
import findCompetitorsByTeamId from "@/lib/logic/competitors/findCompetitorsByTeamId";
import findLastReportsByEntityId, {
  ReportsByEntityIdReturnType,
} from "@/lib/logic/reporting/findLastReportsByEntityId";
import logManyScrapedItems from "@/lib/logic/scraping/logManyScrapedItems";
import { Competitors, JobListing, Teams } from "@prisma/client/edge";

type CollatedEntityReportKeys = Extract<
  keyof ReportsByEntityIdReturnType,
  "scrapedItemsReport" | "pricingPageReport"
>;

type WithLabel<T> = { label: string } & T;

const withLabel =
  (label: string) =>
  <T>(value: T): WithLabel<T> => ({ label, ...value });

const collateCompetitorReportsByType = (
  reports: ReportsByEntityIdReturnType[],
) => {
  return reports.reduce(
    (acc, report) => {
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
        scrapedItemsReport: [
          ...(acc.scrapedItemsReport ?? []),
          labeler(scrapedItemsReport),
        ],
        jobListings: [
          ...(acc.jobListings ?? []),
          ...(jobListingsReport?.listings.map(labeler) ?? []),
        ],
        pricingPageReport: [
          ...(acc.pricingPageReport ?? []),
          labeler(pricingPageReport),
        ],
        emailSummaries: [
          ...(acc.emailSummaries ?? []),
          ...(emailSummaries?.map(labeler) ?? []),
        ],
      };
    },
    {
      scrapedItemsReport: [],
      jobListings: [],
      pricingPageReport: [],
      emailSummaries: [],
    } as {
      [key in CollatedEntityReportKeys]: WithLabel<
        ReportsByEntityIdReturnType[key]
      >[];
    } & {
      emailSummaries: WithLabel<
        ReportsByEntityIdReturnType["emailSummaries"][number]
      >[];
      jobListings: WithLabel<JobListing>[];
    },
  );
};

const generateReportForTeam = async (
  { team }: { team: Teams },
  { logSeen }: { logSeen: boolean },
) => {
  const teamReports = await findLastReportsByEntityId({ teamId: team.id });
  const relevantScrapedItems = teamReports.scrapedItemsReport?.length
    ? await pickRelevantScrapedItems(teamReports.scrapedItemsReport, team)
    : null;

  const scrapedItemsToShow = relevantScrapedItems?.slice(0, 5);
  if (scrapedItemsToShow?.length && logSeen) {
    await logManyScrapedItems(
      scrapedItemsToShow.map((item) => item.id),
      team.id,
    );
  }
  return {
    ...teamReports,
    scrapedItemsReport: scrapedItemsToShow,
    scrapedItemsFound: teamReports.scrapedItemsReport?.length ?? 0,
  };
};

const generateReportForCompetitor = async ({
  competitor,
}: {
  team: Teams;
  competitor: Competitors;
}) => {
  return findLastReportsByEntityId({ competitorId: competitor.id });
};

const getCollatedReports = async (
  { team }: { team: Teams },
  { logSeen = true }: { logSeen?: boolean } = {},
) => {
  const teamId = team.id;
  const teamReport = await generateReportForTeam({ team }, { logSeen });
  const competitors = await findCompetitorsByTeamId(teamId);
  const competitorReports = await Promise.all(
    competitors.map((competitor) =>
      generateReportForCompetitor({ team, competitor }),
    ),
  );

  const collatedCompetitorReports =
    collateCompetitorReportsByType(competitorReports);

  return {
    teamReport,
    collatedCompetitorReports,
  };
};

export default getCollatedReports;
