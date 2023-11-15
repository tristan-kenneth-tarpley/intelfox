import getTrackedKeyPhrasesByTeam from '@/lib/logic/keyPhrases/getTrackedKeyPhrasesByTeam';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import scrapeAndPersistRedditItems from '../dataCollection/scrapeAndPersistRedditItems';
import runJob from '../runJob';

// todo rename to something that includes product report
const syncTeamKeyPhrases = async ({ teamId }: { teamId: string }) => {
  const keyPhrases = await getTrackedKeyPhrasesByTeam(teamId);
  // const competitors = await

  console.log('got it in syncTeamKeyPhrases', keyPhrases);
  await updateTeamById(teamId, { lastSyncedAt: new Date() });
  keyPhrases.forEach(({ phrase }) => {
    // todo here, run monthly report for each branded phrase
    return runJob(scrapeAndPersistRedditItems, { phrase });
  });
};

export default syncTeamKeyPhrases;
