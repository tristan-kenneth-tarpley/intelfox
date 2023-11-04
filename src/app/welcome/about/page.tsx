import { routes } from '@/app/routes';
import TeamLoader from '@/components/TeamLoader';
import { PageProps } from '@/app/types';
import { redirect } from 'next/navigation';
import AboutPageClient from './AboutPageClient';

const AboutPage = ({
  searchParams,
}: PageProps) => {
  if (!searchParams?.t) {
    return redirect(routes.welcome());
  }

  const { t } = searchParams;

  return (
    <TeamLoader teamId={t as string}>
      {({ team }) => (
        <AboutPageClient team={team} />
      )}
    </TeamLoader>
  );
};

export default AboutPage;
