'use server';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import createCompetitor from '@/lib/logic/competitors/createCompetitor';
import createCompetitorRelationship from '@/lib/logic/competitors/createCompetitorRelationship';
import { redirect } from 'next/navigation';
import makeRequestError from '../makeRequestError';

// todo secure all of these admin actions!!!
const createCompetitorAction: FormStateHandler<{ message?: string; teamId: string; admin?: boolean; }> = async (
  { teamId, admin = false },
  formData,
) => {
  const [name, domain] = [
    formData.get('name') as string,
    formData.get('domain') as string,
  ];
  try {
    const competitor = await createCompetitor({
      name,
      domain,
    });
    await createCompetitorRelationship({
      competitorId: competitor.id,
      teamId,
    });

    if (admin) {
      redirect(routes.adminCompetitorPage({ competitorId: competitor.id }));
    }
    // todo add competitor page
  } catch (err) {
    return makeRequestError({
      code: 400,
      message: 'Failed to create competitor',
    });
  }
};

export default createCompetitorAction;
