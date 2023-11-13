import { appConfig } from '@/config';
import forwardRequestToZeplo from '@/lib/services/zeplo/forwardRequestToZeplo';

import syncTeamKeyPhrases from './applicationSyncing/syncTeamKeyPhrases';
import scrapeAndPersistRedditItems from './dataCollection/scrapeAndPersistRedditItems';

const jobs = {
  syncTeamKeyPhrases,
  scrapeAndPersistRedditItems,
} as const;

export type JobName = keyof typeof jobs;

const runJob = (
  jobName: JobName,
  payload: Record<string, any>,
) => {
  const job = jobs[jobName];
  if (appConfig.nodeEnv === 'development') {
    // run locally
    return job(payload as any);
  }

  if (appConfig.nodeEnv === 'production') {
    return forwardRequestToZeplo(
      `${appConfig.selfUrl}/api/jobs/exec`,
      {
        method: 'POST',
        body: JSON.stringify({ ...payload, jobName }),
        headers: {
          authorization: `Bearer ${appConfig.cronSecret}`,
        },
      },
    );
  }
};

export default runJob;
