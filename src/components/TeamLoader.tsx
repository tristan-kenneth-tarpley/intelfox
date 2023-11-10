import findTeamById from '@/lib/logic/teams/findTeamById';
import { Teams } from '@prisma/client/edge';
import Text from './ui/Text';

interface Props {
  teamId: string;
  children: (props: { team: Teams }) => React.ReactNode;
}

const TeamLoader = async ({
  teamId,
  children,
}: Props) => {
  const team = await findTeamById(teamId);

  if (!team) {
    return <Text>Team not found</Text>;
  }

  return <>{children({ team })}</>;
};

export default TeamLoader;
