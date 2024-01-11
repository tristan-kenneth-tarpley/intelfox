'use server';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import findTeamByMultipleFields from '@/lib/logic/teams/findTeamByMultipleFields';
import { redirect } from 'next/navigation';
import makeRequestError from '../makeRequestError';

const handleTeamSearchSubmission: FormStateHandler<{ message?: string }> = async (
  _,
  formData,
) => {
  const query = formData.get('query')?.toString() ?? '';

  console.log('query', query);
  const team = await findTeamByMultipleFields(query).catch((err) => {
    console.log(err);
    return null;
  });

  if (team) {
    return redirect(routes.teamAdminPage({ teamId: team.id }));
  }

  return makeRequestError({ code: 410, message: 'Team not found' });
};

export default handleTeamSearchSubmission;
