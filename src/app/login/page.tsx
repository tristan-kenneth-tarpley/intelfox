import { SignIn } from '@clerk/nextjs';
import { routes } from '../routes';

export default function Page() {
  return <SignIn afterSignInUrl={routes.afterSigninUrl()} afterSignUpUrl={routes.afterSignupUrl()} />;
}
