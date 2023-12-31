import db from '@/lib/services/db/db';
import { TrackedKeyPhrases } from '@prisma/client/edge';

const getTrackedKeyPhrasesByTeam = async (teamId: string): Promise<Omit<TrackedKeyPhrases, 'phraseEmbeddings'>[]> => {
  return db.trackedKeyPhrases.findMany({
    where: {
      teamId,
    },
    select: {
      id: true,
      phrase: true,
      teamId: true,
      createdAt: true,
      updatedAt: true,
      traits: true,
    },
  }) as any;
};

export default getTrackedKeyPhrasesByTeam;
