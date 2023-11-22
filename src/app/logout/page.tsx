'use client';

import { useClerk, useSession } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '../routes';
import Loading from '../home/[teamId]/loading';

const LogoutPage = () => {
  const router = useRouter();
  const { session } = useSession();
  const clerk = useClerk();

  useEffect(() => {
    const returnHome = () => {
      router.push(routes.root());
    };

    if (session?.id) {
      clerk.signOut(() => {
        returnHome();
      });
    } else {
      returnHome();
    }
  });

  return <Loading />;
};

export default LogoutPage;
