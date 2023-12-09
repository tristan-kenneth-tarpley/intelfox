'use server';

import { FormStateHandler } from '@/app/types';
import prepIntelReportForTeam from '@/jobs/prepIntelReportForTeam';
import runJob from '@/jobs/runJob';

const handlePrepIntelReportCommand: FormStateHandler<{ message?: string; title?: string; teamId: string }> = async (
  { teamId },
) => {
  await runJob(prepIntelReportForTeam, { teamId });
  return { teamId, title: 'Success!', message: 'Refresh the page to see the recent values' };
};

export default handlePrepIntelReportCommand;
