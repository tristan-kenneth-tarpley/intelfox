import { clerkClient } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import findTeamByClerkOrg from '@/lib/logic/teams/findTeamByClerkOrg';
import { routes } from '../routes';

const navigateToFirstTeamHome = async () => {
  const [clerkOrg] = await clerkClient.organizations.getOrganizationList();

  if (!clerkOrg || !clerkOrg.id) {
    return redirect(routes.afterSignupUrl());
  }

  const team = await findTeamByClerkOrg(clerkOrg.id);

  if (!team) {
    return redirect(routes.afterSignupUrl());
  }

  return redirect(routes.teamHome({ teamId: team.id }));
};

export default navigateToFirstTeamHome;
