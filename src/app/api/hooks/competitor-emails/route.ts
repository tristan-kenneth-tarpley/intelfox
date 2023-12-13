import { NextRequest } from 'next/server';
import summarizeEmailMessaging from '@/lib/logic/aiCapabilities/messaging/summarizeEmailMessaging';
import db from '@/lib/services/db/db';
import hooksMiddleware from '../hooksMiddleware';

const extractSlugFromUrl = (url: string) => {
  const splitOnPlus = url.split('+')[1];

  return splitOnPlus.split('@')[0];
};

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const middleware = hooksMiddleware(request);
  if (middleware) {
    return middleware;
  }

  const body = await request.json();
  // todo, get the raw html and upload to s3 for future querying
  const {
    bodyPlain, date, subject, toEmails,
  } = body as {
    bodyPlain: string;
    date: string;
    subject: string;
    toEmails: string;
  };

  const bodySummarization = await summarizeEmailMessaging(bodyPlain);
  const slug = extractSlugFromUrl(toEmails);
  const prefix = slug.slice(0, 2); // t_ for a team, c_ for a competitor
  const domain = slug.slice(prefix.length);

  const entity = prefix === 't_'
    ? await db.teams.findFirstOrThrow({
      where: {
        OR: [
          {
            primaryDomain: domain,
          },
          {
            primaryDomain: `https://${domain}`,
          },
        ],
      },
    }).catch(() => null)
    : prefix === 'c_'
      ? await db.competitors.findFirstOrThrow({
        where: {
          OR: [
            {
              domain,
            },
            {
              domain: `https://${domain}`,
            },
          ],
        },
      }).catch(() => null)
      : null;

  if (!entity) {
    return Response.json({ status: `failed, could not find a competitor or team for ${toEmails}` });
  }

  if (!bodySummarization) {
    return Response.json({ status: `failed, could not summarize email for ${toEmails}` });
  }

  const entityKey = prefix === 't_' ? 'teamId' : 'competitorId' as const;
  await db.emailSummaries.create({
    data: {
      // todo store raw email text
      [entityKey]: entity.id,
      date: new Date(date),
      subject: subject.startsWith('Fwd:') ? subject.slice('Fwd: '.length) : subject,
      messagingProfile: bodySummarization,
    },
  });

  return Response.json({ status: 'success' });
}
