import { routes } from '@/app/routes';
import clerkAppearance from '@/app/styles/clerkAppearance';
import { UserButton as ClerkUserButton } from '@clerk/nextjs';

const UserButton = () => (
  <ClerkUserButton
    afterSignOutUrl={routes.root()}
    appearance={clerkAppearance}
    userProfileProps={{ appearance: clerkAppearance }}
  />
);

export default UserButton;
