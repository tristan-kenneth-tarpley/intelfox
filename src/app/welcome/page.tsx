import { currentUser } from '@clerk/nextjs';
import parseEmailAddress from '@/utils/parseEmailAddress';
import WelcomePageClient from './WelcomePageClient';

const WelcomePage = async () => {
  const user = await currentUser();

  const email = user?.emailAddresses[0]?.emailAddress;

  let guessedDomain = '';

  if (email) {
    const { domain, isPersonalAddress } = parseEmailAddress(email);

    if (!isPersonalAddress) {
      guessedDomain = domain;
    }
  }

  return (
    <WelcomePageClient guessedDomain={`https://${guessedDomain}`} />
  );
};

export default WelcomePage;
