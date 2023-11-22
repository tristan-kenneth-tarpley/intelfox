import { routes } from '@/app/routes';
import { UserButton as ClerkUserButton } from '@clerk/nextjs';

const UserButton = () => (
  <ClerkUserButton
    afterSignOutUrl={routes.root()}
  />
);

export default UserButton;
