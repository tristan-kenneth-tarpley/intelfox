import Button from '@/components/ui/Button';
import { routes } from '@/app/routes';
import NavbarSkeleton from './NavbarSkeleton';
import HStack from '../ui/stack/HStack';
import UserButton from '../UserButton';

const AdminNavbar = () => {
  return (
    <NavbarSkeleton
      links={[
        <Button key={1} href={routes.home()} variant='ghost'>App home</Button>,
        <Button key={1} href={routes.admin()} variant='ghost'>Admin home</Button>,
      ]}
      rightContent={(
        <HStack align="center">
          <UserButton />
        </HStack>
      )}
    />
  );
};

export default AdminNavbar;
