import getTrackedKeyPhrasesByTeam from '@/lib/logic/keyPhrases/getTrackedKeyPhrasesByTeam';
import updateTeamById from '@/lib/logic/teams/updateTeamById';
import scrapeAndPersistRedditItems from '../dataCollection/scrapeAndPersistRedditItems';
import runJob from '../runJob';

const syncTeamKeyPhrases = async ({
  teamId,
}: {
  teamId: string,
}) => {
  const keyPhrases = await getTrackedKeyPhrasesByTeam(teamId);

  await updateTeamById(teamId, { lastSyncedAt: new Date() });
  keyPhrases.forEach(({ phrase }) => {
    // todo here, run monthly report for each branded phrase
    return runJob(scrapeAndPersistRedditItems, { phrase });
  });
};

export default syncTeamKeyPhrases;
