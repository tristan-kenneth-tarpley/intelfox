'use server';

import { FormStateHandler } from '@/app/types';
import findTeamById from '@/lib/logic/teams/findTeamById';
import { URLType } from '@prisma/client/edge';
import { allUrlTypes } from '@/lib/logic/teams/teamConstants';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { routes } from '@/app/routes';
import makeRequestError from '../makeRequestError';

const handleTeamURLsUpdate: FormStateHandler<{
  teamId: string;
  message?: string;
}> = async ({
  teamId,
}, formData) => {
  noStore();
  const team = await findTeamById(teamId);

  if (!team) {
    return makeRequestError({ code: 410, message: 'Team not found', extra: { teamId } });
  }

  const urls = Array.from(formData.keys())
    .filter((key) => allUrlTypes.includes(key as URLType))
    .map(
      (key) => ({
        type: key as URLType,
        url: formData.get(key)?.toString() ?? '',
      }),
    );

  await updateTeamById(teamId, { urls });
  revalidatePath(routes.teamAdminPage({ teamId }));

  return { message: 'URLs updated!', teamId };
};

export default handleTeamURLsUpdate;
