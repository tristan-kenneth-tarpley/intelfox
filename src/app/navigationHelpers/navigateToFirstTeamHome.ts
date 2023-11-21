import { auth, clerkClient } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import findTeamByClerkOrg from '@/lib/logic/teams/findTeamByClerkOrg';
import { routes } from '../routes';

const maybeNavigateToFirstTeamHome = async () => {
  const {
    user, userId, session, sessionId,
  } = auth();

  console.log('user', user);
  console.log('session', session);
  console.log('userId', userId);
  console.log('sessionId', sessionId);

  if (!userId) {
    if (sessionId) {
      await clerkClient.sessions.revokeSession(sessionId);
    }
    return null;
  }

  const [clerkOrg] = await clerkClient.organizations.getOrganizationList();
  console.log('clerkOrg', clerkOrg);
  if (!clerkOrg || !clerkOrg.id) {
    return redirect(routes.afterSignupUrl());
  }

  const team = await findTeamByClerkOrg(clerkOrg.id);

  if (!team) {
    return redirect(routes.afterSignupUrl());
  }

  return redirect(routes.teamHome({ teamId: team.id }));
};

export default maybeNavigateToFirstTeamHome;
