import { routes } from "@/app/routes";
import { PageProps } from "@/app/types";
import TeamLoader from "@/components/TeamLoader";
import findCompetitorsByTeamId from "@/lib/logic/competitors/findCompetitorsByTeamId";
import { redirect } from "next/navigation";
import CompetitorInfoPageClient from "./CompetitorInfoPageClient";

const CompetitorInfoPage = ({ searchParams }: PageProps) => {
  if (!searchParams?.t) {
    return redirect(routes.welcome());
  }

  const { t } = searchParams;

  return (
    <TeamLoader teamId={t as string}>
      {async ({ team }) => {
        const competitors = await findCompetitorsByTeamId(team.id);

        if (!competitors.length) {
          return redirect(routes.welcomeConfirmation({ t: team.id }));
        }

        return (
          <CompetitorInfoPageClient team={team} competitors={competitors} />
        );
      }}
    </TeamLoader>
  );
};

export default CompetitorInfoPage;
