import { SignUp } from '@clerk/nextjs';
import { routes } from '../routes';

export default function Page() {
  return (
    <div className="container mx-auto my-auto flex justify-center">
      <SignUp afterSignInUrl={routes.afterSigninUrl()} afterSignUpUrl={routes.afterSignupUrl()} />
    </div>
  );
}
