'use server';

import _ from 'lodash';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import openAIClient from '@/lib/services/openAI/client';
import { Teams } from '@prisma/client';
import { redirect } from 'next/navigation';
import db from '@/lib/services/db/db';
import splitStringOnCommas from '@/utils/splitStringOnCommas';
import makeActionError from '../makeActionError';

const handleKeywordPageSubmission: FormStateHandler<{ team: Teams; message?: string }> = async (
  { team },
  formData,
) => {
  if (!team) {
    return redirect(routes.welcome());
  }

  const customKeywords = splitStringOnCommas(formData.get('custom_keywords')?.toString() ?? '');

  const keywords = Array.from(formData.keys())
    .filter((key) => key.startsWith('int_kw_'))
    .map((key) => key.slice('int_kw_'.length));

  const allKeywords = _.uniq([...customKeywords, ...keywords]);

  if (allKeywords.length === 0) {
    return makeActionError({
      code: 400,
      message: 'You must provide at least one keyword',
      extra: { team },
    });
  }

  const existingKeyPhrases = await db.trackedKeyPhrases.findMany({
    where: {
      phrase: {
        in: allKeywords,
      },
    },
  });

  const allExistingKeyPhrasesSet = new Set(existingKeyPhrases.map(({ phrase }) => phrase));

  const newKeyPhrases = allKeywords.filter((keyword) => !allExistingKeyPhrasesSet.has(keyword));

  if (newKeyPhrases.length > 0) {
    const keywordEmbeddings = await openAIClient.getEmbeddings({
      model: 'text-embedding-ada-002',
      input: newKeyPhrases,
    });

    const keyPhrases = newKeyPhrases
      .map((phrase, index) => ({
        phrase,
        phraseEmbeddings: keywordEmbeddings.data[index]?.embedding,
        teamId: team.id,
      }));

    await db.trackedKeyPhrases.createMany({
      data: keyPhrases,
    });
  }

  return redirect(routes.welcomeCompetitors({ t: team.id }));
};

export default handleKeywordPageSubmission;
