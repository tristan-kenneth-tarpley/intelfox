'use server';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import splitStringOnCommas from '@/utils/splitStringOnCommas';
import { Teams } from '@prisma/client/edge';
import _ from 'lodash';
import { redirect } from 'next/navigation';

const handleCompetitorsPageSubmission: FormStateHandler<{ team: Teams; message?: string }> = async (
  { team },
  formData,
) => {
  if (!team) {
    return redirect(routes.welcome());
  }

  const customCompetitors = splitStringOnCommas(formData.get('custom_competitors')?.toString() ?? '');

  const competitors = Array.from(formData.keys())
    .filter((key) => key.startsWith('int_comp_'))
    .map((key) => key.slice('int_comp_'.length));

  await updateTeamById(team.id, {
    competitorDomains: _.uniq([...customCompetitors, ...competitors]),
  });

  return redirect(routes.teamHome({ teamId: team.id }));
};

export default handleCompetitorsPageSubmission;
