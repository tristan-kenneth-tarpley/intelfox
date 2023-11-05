import { routes } from '@/app/routes';
import TeamLoader from '@/components/TeamLoader';
import { PageProps } from '@/app/types';
import { redirect } from 'next/navigation';
import AboutPageClient from './AboutPageClient';

// Todo - Ask GPT to create a 1-liner from the longer description
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
