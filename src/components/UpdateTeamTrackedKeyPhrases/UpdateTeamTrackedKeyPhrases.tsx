import { Teams } from '@prisma/client/edge';
import getTrackedKeyPhrasesByTeam from '@/lib/logic/keyPhrases/getTrackedKeyPhrasesByTeam';
import TrackedKeyPhraseManager from './TrackedKeyPhraseManager';

const UpdateTeamTrackedKeyPhrases = async ({
  team,
}: {
  team: Teams
}) => {
  const trackedKeyPhrases = await getTrackedKeyPhrasesByTeam(team.id);

  return (
    <TrackedKeyPhraseManager
      keyPhrases={trackedKeyPhrases}
      team={team}
    />
  );
};

export default UpdateTeamTrackedKeyPhrases;
