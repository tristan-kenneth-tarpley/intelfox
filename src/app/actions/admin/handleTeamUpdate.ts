'use server';

import { FormStateHandler } from '@/app/types';
import findTeamById from '@/lib/logic/teams/findTeamById';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { routes } from '@/app/routes';
import makeRequestError from '../makeRequestError';

const handleTeamUpdate: FormStateHandler<{ teamId: string; message?: string }> = async (
  { teamId },
  formData,
) => {
  noStore();
  const name = formData.get('name')?.toString();
  const description = formData.get('description')?.toString();
  const primaryDomain = formData.get('primaryDomain')?.toString();

  const team = await findTeamById(teamId);

  if (!team) {
    return makeRequestError({ code: 410, message: 'Team not found' });
  }

  await updateTeamById(teamId, {
    name,
    description,
    primaryDomain,
  });

  revalidatePath(routes.teamAdminPage({ teamId }));

  return { message: 'team updated!' };
};

export default handleTeamUpdate;
