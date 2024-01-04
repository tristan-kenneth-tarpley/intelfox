'use server';

import findOrCreateKeyPhrase from '@/lib/logic/keyPhrases/findOrCreateKeyPhrase';
import { TrackedKeyPhrases } from '@prisma/client/edge';

const createKeyPhrase = ({
  teamId,
  phrase,
}: { teamId: string, phrase: string }): Promise<Omit<TrackedKeyPhrases, 'phraseEmbeddings'>> => {
  return findOrCreateKeyPhrase({
    teamId,
    phrase,
    traits: [],
  });
};

export default createKeyPhrase;
