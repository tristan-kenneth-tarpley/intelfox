'use client';

import HStack from '@/components/ui/stack/HStack';
import { OrganizationSwitcher, UserButton, useOrganizationList } from '@clerk/nextjs';
import { Teams } from '@prisma/client';
import { useEffect, useRef } from 'react';

const NavbarRight = ({
  team,
}: {
  team: Teams,
}) => {
  const isMountedRef = useRef(false);
  const { setActive: setActiveOrganization } = useOrganizationList();

  useEffect(() => {
    if (!isMountedRef.current && setActiveOrganization) {
      setActiveOrganization?.({ organization: team.clerkOrgId });
      isMountedRef.current = true;
    }
  }, [setActiveOrganization, team.clerkOrgId]);

  return (
    <HStack align='start'>
      {isMountedRef.current && (
        <OrganizationSwitcher hidePersonal />
      )}
      <UserButton />
    </HStack>
  );
};

export default NavbarRight;
