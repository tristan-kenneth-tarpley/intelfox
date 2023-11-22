import Button from '@/components/ui/Button';
import { Teams } from '@prisma/client/edge';
import { routes } from '@/app/routes';
import NavbarRight from './NavbarRight';
import NavbarSkeleton from './NavbarSkeleton';

const ApplicationHomeNavbar = ({
  team,
}: {
  team: Teams,
}) => {
  return (
    <NavbarSkeleton
      links={[
        <Button key={1} href={routes.teamHome({ teamId: team.id })} variant='ghost'>Home</Button>,
        <Button key={2} href={routes.teamKeyPhrases({ teamId: team.id })} variant='ghost'>Key phrases</Button>,
        <Button key={3} variant="ghost">Competitors</Button>,
      ]}
      rightContent={<NavbarRight team={team} />}
    />
  );
};

export default ApplicationHomeNavbar;
