'use server';

import { FormStateHandler } from '@/app/types';
import { URLType } from '@prisma/client/edge';
import { allUrlTypes } from '@/lib/logic/teams/teamConstants';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import findCompetitorById from '@/lib/logic/competitors/findCompetitorById';
import updateCompetitorById from '@/lib/logic/competitors/updateCompetitorById';
import { routes } from '@/app/routes';
import makeRequestError from '../makeRequestError';

const handleCompetitorsURLsUpdate: FormStateHandler<{
  competitorId: string;
  message?: string;
}> = async ({
  competitorId,
}, formData) => {
  noStore();
  const competitor = await findCompetitorById(competitorId);

  if (!competitor) {
    return makeRequestError({ code: 410, message: 'Competitor not found' });
  }

  const urls = Array.from(formData.keys())
    .filter((key) => allUrlTypes.includes(key as URLType))
    .map(
      (key) => ({
        type: key as URLType,
        url: formData.get(key)?.toString() ?? '',
      }),
    );

  await updateCompetitorById(competitorId, { urls });
  revalidatePath(routes.adminCompetitorPage({ competitorId }));

  return { message: 'URLs updated!' };
};

export default handleCompetitorsURLsUpdate;
