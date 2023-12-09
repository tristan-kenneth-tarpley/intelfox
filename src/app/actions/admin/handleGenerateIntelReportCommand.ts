import { FormStateHandler } from '@/app/types';
import prepIntelReportForTeam from '@/jobs/prepIntelReportForTeam';
import runJob from '@/jobs/runJob';

const handleGenerateIntelReportCommand: FormStateHandler<{ message?: string; teamId: string }> = async (
  { teamId },
) => {
  // await runJob(prepIntelReportForTeam, { teamId });
  return { teamId };
};

export default handleGenerateIntelReportCommand;
