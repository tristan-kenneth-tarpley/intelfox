'use server';

import { FormStateHandler } from '@/app/types';
import findTeamById from '@/lib/logic/teams/findTeamById';
import { URLType } from '@prisma/client/edge';
import { allUrlTypes } from '@/lib/logic/teams/teamConstants';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import { revalidatePath } from 'next/cache';
import makeRequestError from '../makeRequestError';

const handleTeamURLsUpdate: FormStateHandler<{ teamId: string; message?: string }> = async ({
  teamId,
}, formData) => {
  const team = await findTeamById(teamId);

  if (!team) {
    return makeRequestError({ code: 410, message: 'Team not found' });
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
  revalidatePath(`/admin/teams/${teamId}`);

  return { message: 'URLs updated!' };
};

export default handleTeamURLsUpdate;
