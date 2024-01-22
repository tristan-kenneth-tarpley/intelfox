"use client";

import { useEffect, useRef } from "react";
import TeamSwitcher from "@/components/TeamSwitcher";
import HStack from "@/components/ui/stack/HStack";
import { useOrganizationList } from "@clerk/nextjs";
import { Teams } from "@prisma/client/edge";
import UserButton from "../UserButton";

const NavbarRight = ({ team }: { team: Teams }) => {
  const isMountedRef = useRef(false);
  const { setActive: setActiveOrganization } = useOrganizationList();

  useEffect(() => {
    if (!isMountedRef.current && setActiveOrganization) {
      setActiveOrganization?.({ organization: team.clerkOrgId });
      isMountedRef.current = true;
    }
  }, [setActiveOrganization, team.clerkOrgId]);

  return (
    <HStack align="center">
      {isMountedRef.current && <TeamSwitcher team={team} />}
      <UserButton />
    </HStack>
  );
};

export default NavbarRight;
