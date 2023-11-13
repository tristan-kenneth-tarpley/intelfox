import makeRequestError from '@/app/actions/makeRequestError';
import { NextRequest } from 'next/server';
import runJob, { JobName } from '@/jobs/runJob';

export async function POST(request: NextRequest) {
  const { jobName, payload }: {
    jobName: JobName;
    payload: any;
  } = await request.json();

  if (!jobName) {
    return Response.json(makeRequestError({ code: 400, message: 'a valid jobName is required' }), { status: 400 });
  }

  await runJob(jobName, payload);
  // todo should prob add a jobId here from zeplo
  return Response.json({ status: 'success' });
}
