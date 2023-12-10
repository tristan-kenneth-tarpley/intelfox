'use server';

import { FormStateHandler } from '@/app/types';
import generateIntelReportEmail from '@/jobs/reporting/reportNarrative/generateIntelReportEmail';
// import prepIntelReportForTeam from '@/jobs/prepIntelReportForTeam';
// import runJob from '@/jobs/runJob';

const handleGenerateIntelReportCommand: FormStateHandler<{ reportText?: string; teamId: string }> = async (
  { teamId },
) => {
  // await runJob(prepIntelReportForTeam, { teamId });
  const reportText = await generateIntelReportEmail({ teamId });
  return { teamId, reportText };
};

export default handleGenerateIntelReportCommand;
