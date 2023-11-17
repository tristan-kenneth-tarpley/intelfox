'use server';

import _ from 'lodash';

import { routes } from '@/app/routes';
import { FormStateHandler } from '@/app/types';
import openAIClient from '@/lib/services/openAI/client';
import { Teams, TrackedKeyPhrases } from '@prisma/client/edge';
import { redirect } from 'next/navigation';
import db from '@/lib/services/db/db';
import splitStringOnCommas from '@/utils/splitStringOnCommas';
import isTruthy from '@/utils/isTruthy';
import runJob from '@/jobs/runJob';
import syncTeamKeyPhrases from '@/jobs/applicationSyncing/syncTeamKeyPhrases';
import makeRequestError from '../makeRequestError';

export interface KeyphraseSubmission {
  traits: TrackedKeyPhrases['traits'];
  phrase: string;
}

const handleKeywordPageSubmission: FormStateHandler<{ team: Teams; message?: string }> = async (
  { team },
  formData,
) => {
  if (!team) {
    return redirect(routes.welcome());
  }

  const customKeywords = splitStringOnCommas(formData.get('custom_keywords')?.toString() ?? '')
    .map((keyword) => {
      const trimmed = keyword.trim();
      return trimmed.startsWith('https://') || trimmed.startsWith('http://') ? trimmed : `https://${trimmed}`;
    });
  const submittedKeyPhrases = Array.from(formData.keys())
    .map((key) => {
      try {
        return JSON.parse(decodeURIComponent(key)) as KeyphraseSubmission;
      } catch (e) {
        return null;
      }
    })
    .filter(isTruthy);

  const allPhrases = submittedKeyPhrases.map(({ phrase }) => phrase);
  const allKeywords = _.uniq([...customKeywords, ...allPhrases]);

  if (allKeywords.length === 0) {
    return makeRequestError({
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

  const newKeyPhrases = submittedKeyPhrases.filter((keyword) => !allExistingKeyPhrasesSet.has(keyword.phrase));

  if (newKeyPhrases.length > 0) {
    const keywordEmbeddings = await openAIClient.getEmbeddings({
      input: newKeyPhrases.map(({ phrase }) => phrase),
    });

    const keyPhrases = newKeyPhrases
      .map(({ phrase, traits }, index) => ({
        phrase,
        phraseEmbeddings: keywordEmbeddings.data[index]?.embedding,
        teamId: team.id,
        traits,
      }));

    await db.trackedKeyPhrases.createMany({
      data: keyPhrases,
    });
  }

  await runJob(syncTeamKeyPhrases, { teamId: team.id });
  return redirect(routes.teamHome({ teamId: team.id }));
};

export default handleKeywordPageSubmission;
