import findTeamById from '@/lib/logic/teams/findTeamById';
import { Teams } from '@prisma/client/edge';
import findTeamByClerkOrg from '@/lib/logic/teams/findTeamByClerkOrg';
import { redirect } from 'next/navigation';
import { routes } from '@/app/routes';
import Text from './ui/Text';

interface Props {
  teamId: string;
  children: (props: { team: Teams }) => React.ReactNode;
}

const TeamLoader = async ({
  teamId,
  children,
}: Props) => {
  const isClerkOrg = teamId.startsWith('org_');
  const team = isClerkOrg
    ? await findTeamByClerkOrg(teamId)
    : await findTeamById(teamId);

  if (!team) {
    return <Text>Team not found</Text>;
  }

  if (isClerkOrg) {
    return redirect(routes.teamHome({ teamId: team.id }));
  }

  return <>{children({ team })}</>;
};

export default TeamLoader;
