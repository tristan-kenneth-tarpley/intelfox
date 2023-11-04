'use server';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import { Teams } from '@prisma/client';
import { redirect } from 'next/navigation';

const handleKeywordPageSubmission: FormStateHandler<{ team: Teams; message?: string }> = async (
  { team },
  formData,
) => {
  if (!team) {
    return redirect(routes.welcome());
  }
  console.log(formData);
  // const aboutCompany = formData.get('about_company')?.toString();

  // if (aboutCompany && aboutCompany !== team.description) {
  //   await updateTeamById(team.id, { description: aboutCompany });
  // }

  // return redirect(routes.welcomeKeywords({ t: team.id }));
};

export default handleKeywordPageSubmission;
