import { NextRequest } from 'next/server';
import summarizeEmailMessaging from '@/lib/logic/aiCapabilities/messaging/summarizeEmailMessaging';
import db from '@/lib/services/db/db';
import hooksMiddleware from '../hooksMiddleware';

const extractDomainFromUrl = (url: string) => {
  const splitOnPlus = url.split('+')[1];

  return splitOnPlus.split('@')[0];
};

export async function POST(request: NextRequest) {
  const middleware = hooksMiddleware(request);
  if (middleware) {
    return middleware;
  }

  const body = await request.json();
  const {
    bodyPlain, date, subject, toEmails,
  } = body as {
    bodyPlain: string;
    date: string;
    subject: string;
    toEmails: string;
  };

  const bodySummarization = await summarizeEmailMessaging(bodyPlain);
  const competitorDomain = extractDomainFromUrl(toEmails);
  console.log('requesting for toEmails', toEmails, competitorDomain);

  const competitor = await db.competitors.findFirstOrThrow({
    where: {
      domain: competitorDomain,
    },
  });

  if (!competitor) {
    return Response.json({ status: `failed, could not find a competitor for ${toEmails}` });
  }

  if (!bodySummarization) {
    return Response.json({ status: `failed, could not summarize email for ${toEmails}` });
  }

  await db.emailSummaries.create({
    data: {
      competitorId: competitor.id,
      date: new Date(date),
      subject,
      messagingProfile: bodySummarization,
    },
  });

  return Response.json({ status: 'success' });
}
