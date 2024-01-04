'use server';

import { unstable_noStore as noStore } from 'next/cache';
import _ from 'lodash';
import { TrackedKeyPhrases } from '@prisma/client/edge';
import getTrackedKeyPhrasesByTeam from '@/lib/logic/keyPhrases/getTrackedKeyPhrasesByTeam';
import db from '@/lib/services/db/db';

const handleKeyPhraseSubmission = async ({
  keyPhrases,
  teamId,
}: {
  keyPhrases: Omit<TrackedKeyPhrases, 'phraseEmbeddings' | 'createdAt' | 'updatedAt'>[];
  teamId: string,
}) => {
  noStore();
  const currentKeyPhrases = await getTrackedKeyPhrasesByTeam(teamId);
  const deletedKeyPhraseIds = _.difference(
    currentKeyPhrases.map(({ id }) => id),
    keyPhrases.map(({ id }) => id),
  );

  if (deletedKeyPhraseIds.length > 0) {
    await db.trackedKeyPhrases.deleteMany({
      where: {
        id: {
          in: deletedKeyPhraseIds,
        },
      },
    });
  }

  await Promise.all(keyPhrases.map((keyPhrase) => {
    return db.trackedKeyPhrases.update({
      where: {
        id: keyPhrase.id,
      },
      data: {
        phrase: keyPhrase.phrase,
        traits: keyPhrase.traits,
      },
    });
  }));

  return { teamId, message: 'Success!' };
};

export default handleKeyPhraseSubmission;
