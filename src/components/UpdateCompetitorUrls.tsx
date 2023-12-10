'use client';

import { Competitors } from '@prisma/client/edge';
import { useFormState } from 'react-dom';
import UpdateURLs from '@/components/UpdateURLs';
import handleCompetitorsURLsUpdate from '@/app/actions/admin/handleCompetitorURLsUpdate';

const UpdateCompetitorUrls = ({
  competitor,
}: {
  competitor: Competitors
}) => {
  const [state, formAction] = useFormState(handleCompetitorsURLsUpdate, { competitorId: competitor.id });

  return <UpdateURLs urls={competitor.urls} action={formAction} message={state.message} />;
};

export default UpdateCompetitorUrls;
