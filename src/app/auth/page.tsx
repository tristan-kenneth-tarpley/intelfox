import OAuthPage from './OAuthPage';
import validateAdminUserAndMaybeRedirect from '../navigationHelpers/validateAdminUserAndMaybeRedirect';

const AuthPage = async () => {
  await validateAdminUserAndMaybeRedirect();

  return <OAuthPage />;
};

export default AuthPage;
