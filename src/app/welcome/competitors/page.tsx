import { routes } from '@/app/routes';
import { PageProps } from '@/app/types';
import { redirect } from 'next/navigation';
import TeamLoader from '@/components/TeamLoader';
import { spyfuService } from '@/lib/services/spyfu/spyfuService';
import CompetitorsPageClient from './CompetitorsPageClient';

const CompetitorsPage = ({
  searchParams,
}: PageProps) => {
  if (!searchParams?.t) {
    return redirect(routes.welcome());
  }

  const { t } = searchParams;

  return (
    <TeamLoader teamId={t as string}>
      {async ({ team }) => {
        const [
          ppcCompetitors,
          seoCompetitors,
        ] = await Promise.all([
          spyfuService.getPPCCompetitors(team.primaryDomain),
          spyfuService.getSEOCompetitors(team.primaryDomain),
        ]);

        return (
          <CompetitorsPageClient
            team={team}
            competitors={[...ppcCompetitors.data.results, ...seoCompetitors.data.results]}
          />
        );
      }}
    </TeamLoader>
  );
};

export default CompetitorsPage;
