import getTrackedKeyPhrasesByTeam from '@/lib/logic/keyPhrases/getTrackedKeyPhrasesByTeam';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import scrapeAndPersistRedditItems from '../dataCollection/scrapeAndPersistRedditItems';

const syncTeamKeyPhrases = async ({ teamId }: { teamId: string }) => {
  const keyPhrases = await getTrackedKeyPhrasesByTeam(teamId);

  return Promise.all(keyPhrases.map(({ phrase }) => {
    return scrapeAndPersistRedditItems(phrase);
  })).then(() => updateTeamById(teamId, { lastSyncedAt: new Date() }));
};

export default syncTeamKeyPhrases;
