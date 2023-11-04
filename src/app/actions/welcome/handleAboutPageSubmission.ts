'use server';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import { Teams } from '@prisma/client';
import { redirect } from 'next/navigation';

const handleAboutPageSubmission: FormStateHandler<{ team: Teams; message?: string }> = async (
  { team },
  formData,
) => {
  if (!team) {
    return redirect(routes.welcome());
  }

  const aboutCompany = formData.get('about_company')?.toString();

  if (aboutCompany && aboutCompany !== team.description) {
    await updateTeamById(team.id, { description: aboutCompany });
  }

  return redirect(routes.welcomeKeywords({ t: team.id }));
};

export default handleAboutPageSubmission;
