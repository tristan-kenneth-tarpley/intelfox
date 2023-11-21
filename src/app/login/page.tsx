import { SignIn } from '@clerk/nextjs';
import CenterfoldContainer from '@/components/CenterfoldContainer';
import { routes } from '../routes';
import clerkAppearance from '../styles/clerkAppearance';

export default function Page() {
  return (
    <CenterfoldContainer>
      <SignIn
        appearance={clerkAppearance}
        afterSignInUrl={routes.afterSigninUrl()}
        afterSignUpUrl={routes.afterSignupUrl()}
      />
    </CenterfoldContainer>
  );
}
