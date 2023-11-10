'use server';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import summarizeDescription from '@/lib/logic/aiCapabilities/summarizeDescription';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import { Teams } from '@prisma/client/edge';
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
    const oneLinerChatCompletion = await summarizeDescription(aboutCompany).catch(() => undefined);
    const shortDescription = oneLinerChatCompletion?.choices[0]?.message.content;

    await updateTeamById(team.id, {
      description: aboutCompany,
      shortDescription,
    });
  }

  return redirect(routes.welcomeKeywords({ t: team.id }));
};

export default handleAboutPageSubmission;
