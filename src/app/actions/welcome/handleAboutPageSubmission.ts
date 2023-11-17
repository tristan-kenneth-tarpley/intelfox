'use server';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import summarizeDescription from '@/lib/logic/aiCapabilities/summarizeDescription';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import { clerkClient } from '@clerk/nextjs';
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
  const companyName = formData.get('company_name')?.toString();

  if (aboutCompany && aboutCompany !== team.description) {
    const oneLinerChatCompletion = await summarizeDescription(aboutCompany).catch(() => undefined);
    const shortDescription = oneLinerChatCompletion?.choices[0]?.message.content;

    await Promise.all([
      clerkClient.organizations.updateOrganization(team.clerkOrgId, {
        name: companyName,
      }),
      updateTeamById(team.id, {
        description: aboutCompany,
        shortDescription,
        name: companyName,
      }),
    ]);
  }

  return redirect(routes.welcomeCompetitors({ t: team.id }));
};

export default handleAboutPageSubmission;
