'use server';

import { FormStateHandler } from '@/app/types';
import syncTeamKeyPhrases from '@/jobs/applicationSyncing/syncTeamKeyPhrases';
import runJob from '@/jobs/runJob';

const handleDailyTeamSyncSubmission: FormStateHandler<{
  teamId: string;
  message?: string;
}> = async ({
  teamId,
}) => {
  await runJob(syncTeamKeyPhrases, { teamId });
  return { message: 'Syncing started!' };
};

export default handleDailyTeamSyncSubmission;
