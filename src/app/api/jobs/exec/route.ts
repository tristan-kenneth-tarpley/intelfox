import makeRequestError from '@/app/actions/makeRequestError';
import { NextRequest } from 'next/server';
import runJob from '@/jobs/runJob';

import syncTeamKeyPhrases from '@/jobs/applicationSyncing/syncTeamKeyPhrases';
import scrapeAndPersistRedditItems from '@/jobs/dataCollection/scrapeAndPersistRedditItems';

const jobs = {
  syncTeamKeyPhrases,
  scrapeAndPersistRedditItems,
} as const;

export async function POST(request: NextRequest) {
  const { jobName, payload }: {
    jobName: keyof typeof jobs;
    payload: any;
  } = await request.json();

  if (!jobName) {
    return Response.json(makeRequestError({ code: 400, message: 'a valid jobName is required' }), { status: 400 });
  }

  const job = jobs[jobName];
  await runJob(job, payload);
  // todo should prob add a jobId here from zeplo
  return Response.json({ status: 'success' });
}
