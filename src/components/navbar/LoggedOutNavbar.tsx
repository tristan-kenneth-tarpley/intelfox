import { routes } from '@/app/routes';
import Button from '../ui/Button';
import HStack from '../ui/stack/HStack';
import NavbarSkeleton from './NavbarSkeleton';

const LoggedOutNavbar = () => {
  return (
    <NavbarSkeleton
      links={[
        // <Button key={1} href={routes.teamHome({ teamId: team.id })} variant='ghost'>Home</Button>,
        // <Button key={2} href={routes.teamKeyPhrases({ teamId: team.id })} variant='ghost'>Key phrases</Button>,
        // <Button key={3} variant="ghost">Competitors</Button>,
      ]}
      rightContent={(
        <HStack>
          <Button href={routes.login()} variant="outline">Login</Button>
          <Button href={routes.signup()}>Signup</Button>
        </HStack>
      )}
    />
  );
};

export default LoggedOutNavbar;
