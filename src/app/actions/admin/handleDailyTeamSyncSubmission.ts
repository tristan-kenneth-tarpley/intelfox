"use server";

import { FormStateHandler } from "@/app/types";
import syncTeamKeyPhrases from "@/jobs/applicationSyncing/syncTeamKeyPhrases";
import runJob from "@/jobs/runJob";
import cacheHelpers from "@/lib/next-helpers/cacheHelpers";

const handleDailyTeamSyncSubmission: FormStateHandler<{
  teamId: string;
  message?: string;
}> = async ({ teamId }) => {
  cacheHelpers.noStore();
  console.log("syncing");
  await runJob(syncTeamKeyPhrases, { teamId });
  return { message: "Syncing started!", teamId };
};

export default handleDailyTeamSyncSubmission;
