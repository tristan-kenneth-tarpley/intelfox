'use server';

import { routes } from '@/app/routes';
import { auth, clerkClient } from '@clerk/nextjs';
import { FormStateHandler } from '@/app/types';
import { redirect } from 'next/navigation';
import onboardNewTeam from '@/lib/logic/teams/onboardNewTeam';
import db from '@/lib/services/db/db';
import safeParseURL from '@/utils/safeParseURL';
import summarizeWebsiteMessaging from '@/lib/logic/aiCapabilities/summarizeWebsiteMessaging';
import makeRequestError from '../makeRequestError';

const unauthError = makeRequestError({
  code: 401,
  message: 'You must be logged in to create a team.',
});

// todo add error handling - probably add a form action wrapper for generic fallbacks
const handleCompanyDomainSubmission: FormStateHandler = async (_, formData) => {
  const reqAuth = auth();

  if (!reqAuth.userId) {
    return unauthError;
  }

  const domainResponse = formData.get('company_url');
  const parsedURL = safeParseURL(domainResponse?.toString() ?? '');
  const finalUrl = parsedURL?.origin;

  if (!finalUrl) {
    return makeRequestError({ code: 400, message: 'Invalid URL' });
  }

  const user = await clerkClient.users.getUser(reqAuth.userId);

  if (!user) {
    return unauthError;
  }

  const existingTeam = await db.teams.findFirst({
    where: {
      primaryDomain: finalUrl,
      createdByUserId: reqAuth.userId,
    },
  });

  console.log('found an existing team');

  if (existingTeam) {
    return redirect(routes.welcomeAbout({ t: existingTeam.id }));
  }

  const messagingProfile = await summarizeWebsiteMessaging(finalUrl);

  const { team } = await onboardNewTeam({
    primaryDomain: finalUrl,
    description: messagingProfile?.summary ?? '',
    createdByUserId: reqAuth.userId,
    createdByEmail: user.emailAddresses[0].emailAddress,
    createdByName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.emailAddresses[0].emailAddress,
    clerkOrgName: parsedURL.hostname,
    name: messagingProfile?.companyName ?? parsedURL.hostname,
  });

  redirect(routes.welcomeAbout({ t: team.id }));
};

export default handleCompanyDomainSubmission;
