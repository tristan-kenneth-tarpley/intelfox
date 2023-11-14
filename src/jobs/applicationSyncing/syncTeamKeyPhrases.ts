import getTrackedKeyPhrasesByTeam from '@/lib/logic/keyPhrases/getTrackedKeyPhrasesByTeam';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import scrapeAndPersistRedditItems from '../dataCollection/scrapeAndPersistRedditItems';
import runJob from '../runJob';

const syncTeamKeyPhrases = async ({ teamId }: { teamId: string }) => {
  const keyPhrases = await getTrackedKeyPhrasesByTeam(teamId);

  console.log('got it in syncTeamKeyPhrases', keyPhrases);
  await updateTeamById(teamId, { lastSyncedAt: new Date() });
  keyPhrases.forEach(({ phrase }) => {
    return runJob(scrapeAndPersistRedditItems, { phrase });
  });
};

export default syncTeamKeyPhrases;
