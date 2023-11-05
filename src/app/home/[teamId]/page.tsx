import { PageProps } from '@/app/types';
import TeamLoader from '@/components/TeamLoader';

const TeamHome = (props: PageProps) => {
  const { params } = props;
  const { teamId } = params;

  return (
    <TeamLoader teamId={teamId}>
      {({ team }) => {
        return (
          <div>This is the team home for {team.primaryDomain}</div>
        );
      }}
    </TeamLoader>
  );
};

export default TeamHome;
