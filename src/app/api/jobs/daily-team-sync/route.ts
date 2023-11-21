import syncTeamKeyPhrases from '@/jobs/applicationSyncing/syncTeamKeyPhrases';
import runJob from '@/jobs/runJob';
import db from '@/lib/services/db/db';
import { NextRequest } from 'next/server';
import jobsMiddleware from '../jobsMiddleware';

const findTeamsNotSyncedInLast24Hours = async () => {
  return db.teams.findMany({
    where: {
      OR: [
        {
          lastSyncedAt: {
            lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        {
          lastSyncedAt: {
            equals: null,
          },
        },
      ],
    },
  });
};

const runDailyTeamSync = async () => {
  const teams = await findTeamsNotSyncedInLast24Hours();
  if (teams.length) {
    await Promise.all(teams.map(({ id }) => runJob(syncTeamKeyPhrases, { teamId: id })));
  }
};

export async function POST(request: NextRequest) {
  const middleware = jobsMiddleware(request);
  if (middleware) {
    return middleware;
  }

  await runDailyTeamSync();
  return Response.json({ status: 'success' });
}
