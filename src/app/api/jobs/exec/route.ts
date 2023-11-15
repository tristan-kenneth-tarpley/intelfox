import makeRequestError from '@/app/actions/makeRequestError';
import { NextRequest } from 'next/server';

import syncTeamKeyPhrases from '@/jobs/applicationSyncing/syncTeamKeyPhrases';
import scrapeAndPersistRedditItems from '@/jobs/dataCollection/scrapeAndPersistRedditItems';
import runIntelReport from '@/jobs/reporting/runIntelReport';

const jobs = {
  syncTeamKeyPhrases,
  scrapeAndPersistRedditItems,
  runIntelReport,
} as const;

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const { jobName, payload }: {
    jobName: keyof typeof jobs;
    payload: any;
  } = await request.json();

  console.log('received a job request', jobName, payload);
  const job = jobs[jobName];
  if (!jobName || !job) {
    return Response.json(makeRequestError({ code: 400, message: 'a valid jobName is required' }), { status: 400 });
  }

  await job(payload);
  // todo should prob add a jobId here from zeplo
  return Response.json({ status: 'success' });
}
