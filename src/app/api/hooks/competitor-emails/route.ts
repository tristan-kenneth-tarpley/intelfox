import { NextRequest } from 'next/server';
import summarizeEmailMessaging from '@/lib/logic/aiCapabilities/messaging/summarizeEmailMessaging';
import db from '@/lib/services/db/db';
import hooksMiddleware from '../hooksMiddleware';

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
  console.log('requesting for toEmails', toEmails);
  const addressAfterPlusSign = toEmails.split('+')[1];

  const competitor = await db.competitors.findFirstOrThrow({
    where: {
      domain: addressAfterPlusSign,
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
