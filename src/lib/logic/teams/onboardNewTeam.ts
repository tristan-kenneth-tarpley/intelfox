import { Teams } from '@prisma/client/edge';
import { clerkClient } from '@clerk/nextjs';
import db from '@/lib/services/db/db';
import stripeService from '@/lib/services/stripe/stripeService';

const onboardNewTeam = async ({
  primaryDomain,
  description,
  createdByUserId,
  createdByEmail,
  createdByName,
  name,
  clerkOrgName,
}: Pick<Teams, 'primaryDomain' | 'description' | 'createdByUserId' | 'name'> & { clerkOrgName: string; createdByEmail: string; createdByName: string }) => {
  const organization = await clerkClient.organizations.createOrganization({
    name: clerkOrgName,
    createdBy: createdByUserId,
  });

  const team = await db.teams.create({
    data: {
      name,
      primaryDomain,
      clerkOrgId: organization.id,
      description,
      createdByUserId,
    },
  });

  const stripeCustomer = await stripeService.customers.create({
    name: organization.name,
    email: createdByEmail,
    metadata: {
      clerkOrgId: organization.id,
      teamId: team.id,
      createdByUserId,
    },
  });

  const billingTarget = await db.billingTargets.create({
    data: {
      teamId: team.id,
      billingEmail: createdByEmail,
      billingName: createdByName,
      stripeCustomerId: stripeCustomer.id,
    },
  });

  return { team, organization, billingTarget };
};

export default onboardNewTeam;
