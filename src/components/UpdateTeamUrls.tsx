'use client';

import { Teams } from '@prisma/client/edge';
import { useFormState } from 'react-dom';
import handleTeamURLsUpdate from '@/app/actions/admin/handleTeamURLsUpdate';
import UpdateURLs from '@/components/UpdateURLs';

const UpdateTeamUrls = ({
  team,
}: {
  team: Teams
}) => {
  const [state, formAction] = useFormState(handleTeamURLsUpdate, { teamId: team.id });

  return <UpdateURLs urls={team.urls} action={formAction} message={state.message} />;
};

export default UpdateTeamUrls;
