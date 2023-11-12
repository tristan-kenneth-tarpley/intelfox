import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { routes } from '../routes';
import OAuthPage from './OAuthPage';

const knownUserIds = {
  tristan: 'user_2X8MlHaiR1yBvyP1X6w5aDmMX2Y',
};

const knownUserIdsSet = new Set(Object.values(knownUserIds));

const AuthPage = async () => {
  const user = await currentUser();

  if (!user?.id || !knownUserIdsSet.has(user.id)) {
    return redirect(routes.root());
  }

  return <OAuthPage />;
};

export default AuthPage;
