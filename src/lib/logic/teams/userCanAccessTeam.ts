import { clerkClient } from '@clerk/nextjs';
import { Teams } from '@prisma/client/edge';

const userCanAccessTeam = async ({ team, userId }: { team: Teams; userId: string | null; }) => {
  if (!userId) {
    return false;
  }

  const membershipList = await clerkClient.organizations.getOrganizationMembershipList({ organizationId: team.clerkOrgId });
  const membership = membershipList.find(({ publicUserData }) => publicUserData?.userId === userId);

  return !!membership;
};

export default userCanAccessTeam;
