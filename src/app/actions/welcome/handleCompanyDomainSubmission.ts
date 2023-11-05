'use server';

import { routes } from '@/app/routes';
import { auth, clerkClient } from '@clerk/nextjs';
import { FormStateHandler } from '@/app/types';
import scrapeMetaDescriptionFromURL from '@/lib/logic/scraping/scrapeMetaDescriptionFromURL';
import { redirect } from 'next/navigation';
import onboardNewTeam from '@/lib/logic/teams/onboardNewTeam';
import db from '@/lib/services/db/db';
import makeActionError from '../makeActionError';

const unauthError = makeActionError({
  code: 401,
  message: 'You must be logged in to create a team.',
});

// todo add error handling - probably add a form action wrapper for generic fallbacks
const handleCompanyDomainSubmission: FormStateHandler = async (_, formData) => {
  const url = formData.get('company_url') as string;
  const parsedURL = url.startsWith('http://') || url.startsWith('https://') ? new URL(url) : new URL(`https://${url}`);
  const finalUrl = parsedURL.origin;

  const reqAuth = auth();

  if (!reqAuth.userId) {
    return unauthError;
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

  if (existingTeam) {
    return redirect(routes.welcomeAbout({ t: existingTeam.id }));
  }

  const metaDescription = await scrapeMetaDescriptionFromURL(finalUrl);

  const { team } = await onboardNewTeam({
    primaryDomain: finalUrl,
    description: metaDescription ?? '',
    createdByUserId: reqAuth.userId,
    createdByEmail: user.emailAddresses[0].emailAddress,
    createdByName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.emailAddresses[0].emailAddress,
    teamName: parsedURL.hostname,
  });

  redirect(routes.welcomeAbout({ t: team.id }));
};

export default handleCompanyDomainSubmission;
