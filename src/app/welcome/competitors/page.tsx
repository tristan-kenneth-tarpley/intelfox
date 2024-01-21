import _ from "lodash";
import { routes } from "@/app/routes";
import { PageProps } from "@/app/types";
import { redirect } from "next/navigation";
import TeamLoader from "@/components/TeamLoader";
import { spyfuService } from "@/lib/services/spyfu/spyfuService";
import findCompetitorsByTeamId from "@/lib/logic/competitors/findCompetitorsByTeamId";
import safeParseURL from "@/utils/safeParseURL";
import isTruthy from "@/utils/isTruthy";
import CompetitorsPageClient from "./CompetitorsPageClient";

const CompetitorsPage = ({ searchParams }: PageProps) => {
  if (!searchParams?.t) {
    return redirect(routes.welcome());
  }

  const { t } = searchParams;

  return (
    <TeamLoader teamId={t as string}>
      {async ({ team }) => {
        const [ppcCompetitors, seoCompetitors, competitors] = await Promise.all(
          [
            spyfuService
              .getPPCCompetitors(team.primaryDomain)
              .catch(() => null),
            spyfuService
              .getSEOCompetitors(team.primaryDomain)
              .catch(() => null),
            findCompetitorsByTeamId(team.id),
          ],
        );

        const competitorHostnames = competitors
          .map(({ domain }) => safeParseURL(domain)?.hostname)
          .filter(isTruthy);

        return (
          <CompetitorsPageClient
            team={team}
            competitors={_.uniqBy(
              [
                ...(ppcCompetitors?.data.results ?? []),
                ...(seoCompetitors?.data.results ?? []),
              ],
              ({ domain }) => domain,
            )}
            trackedCompetitorDomains={competitorHostnames}
          />
        );
      }}
    </TeamLoader>
  );
};

export default CompetitorsPage;
