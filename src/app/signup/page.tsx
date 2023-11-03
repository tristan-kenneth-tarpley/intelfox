import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="container mx-auto my-auto flex justify-center">
      <SignUp afterSignUpUrl={'/home'} afterSignInUrl={'/home'} />
    </div>
  );
}
