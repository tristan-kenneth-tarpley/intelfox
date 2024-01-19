import { differenceInDays } from "date-fns/differenceInDays";

import { Teams } from "@prisma/client/edge";

const teamNeedsSynced = (team: Teams): boolean => {
  if (!team.lastSyncedAt) {
    return true;
  }

  const daysSinceLastSync = differenceInDays(new Date(), team.lastSyncedAt);
  return daysSinceLastSync > 30;
};

export default teamNeedsSynced;
