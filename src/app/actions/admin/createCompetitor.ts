'use server';

import { FormStateHandler } from '@/app/types';

const createCompetitor: FormStateHandler<{ message?: string; teamId: string }> = async (
  { teamId },
) => {
  // create competitor
  // create competitor relationship
  return { teamId };
};

export default createCompetitor;
