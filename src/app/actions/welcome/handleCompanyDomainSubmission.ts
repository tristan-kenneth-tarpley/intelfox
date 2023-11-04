'use server';

import { routes } from '@/app/routes';
import { clerkClient, auth } from '@clerk/nextjs';
import { FormAction } from '@/app/types';
import scrapeMetaDescriptionFromURL from '@/lib/logic/scraping/scrapeMetaDescriptionFromURL';
import { redirect } from 'next/navigation';
import db from '@/lib/services/db/db';

const handleCompanyDomainSubmission: FormAction = async (e) => {
  const url = e.get('url') as string;
  const parsedURL = url.startsWith('http://') || url.startsWith('https://') ? new URL(url) : new URL(`https://${url}`);
  const finalUrl = parsedURL.origin;

  const reqAuth = auth();

  if (!reqAuth.userId) {
    return; // handle
  }

  const metaDescription = await scrapeMetaDescriptionFromURL(url);

  console.log('reqAuth', reqAuth);
  const organization = await clerkClient.organizations.createOrganization({ name: parsedURL.hostname, createdBy: reqAuth.userId });
  const team = await db.teams.create({
    data: {
      primaryDomain: finalUrl,
      clerkOrgId: organization.id,
      description: metaDescription ?? '',
    },
  });

  // create billing target and stripe customer

  redirect(routes.welcomeAbout({ orgId: organization.id }));

  // - validate URL
  // - create team in clerk
  // - create Teams document
  // - scrape site, validate URL, and get meta description

  // do this at load time?
  // - hit Spyfu API to get keywords and competitor domains
};

export default handleCompanyDomainSubmission;
