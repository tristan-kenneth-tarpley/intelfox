'use client';

import { useOrganizationList } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './[teamId]/loading';
import { routes } from '../routes';

const HomePage = () => {
  const router = useRouter();
  const { userMemberships } = useOrganizationList({ userMemberships: true });

  useEffect(() => {
    if (userMemberships.data) {
      if (userMemberships.data.length > 0) {
        router.push(routes.teamHome({ teamId: userMemberships.data[0].organization.id }));
      } else {
        router.push(routes.afterSignupUrl());
      }
    }
  }, [router, userMemberships.data]);

  return <Loading />;
};

export default HomePage;
