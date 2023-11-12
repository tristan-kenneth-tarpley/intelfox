import db from '@/lib/services/db/db';
import openAIClient from '@/lib/services/openAI/client';
import { TrackedKeyPhrases } from '@prisma/client/edge';

const findOrCreateKeyPhrase = async ({
  phrase,
  teamId,
}: Pick<TrackedKeyPhrases, 'teamId' | 'phrase'>) => {
  const existingKeyPhrase = await db.trackedKeyPhrases.findFirst({
    where: {
      phrase,
    },
  });

  if (existingKeyPhrase) {
    return existingKeyPhrase;
  }

  const embeddingsResponse = await openAIClient.getEmbeddings({ input: phrase });

  const newKeyPhrase = await db.trackedKeyPhrases.create({
    data: {
      phrase,
      phraseEmbeddings: embeddingsResponse.data[0].embedding,
      teamId,
    },
  });

  return newKeyPhrase;
};

export default findOrCreateKeyPhrase;
