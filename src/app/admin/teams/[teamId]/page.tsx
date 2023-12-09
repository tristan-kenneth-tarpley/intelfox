import validateAdminUserAndMaybeRedirect from '@/app/navigationHelpers/validateAdminUserAndMaybeRedirect';
import { routes } from '@/app/routes';
import { PageProps } from '@/app/types';
import AdminNavbar from '@/components/navbar/AdminNavBar';
import findTeamById from '@/lib/logic/teams/findTeamById';
import { redirect } from 'next/navigation';
import VStack from '@/components/ui/stack/VStack';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import humanizeTimeAgo from '@/utils/humanizeTimeAgo';
import Heading from '@/components/ui/Heading';
import findCompetitorsByTeamId from '@/lib/logic/competitors/findCompetitorsByTeamId';
import TeamSearchForm from '../../TeamSearchForm';
import UpdateTeamForm from './UpdateTeamForm';
import UpdateTeamUrls from './UpdateTeamUrls';
import ReportActions from './ReportActions';
import CompetitorsTable from '../../CompetitorsTable';

const TeamAdminPage = async ({ params }: PageProps) => {
  await validateAdminUserAndMaybeRedirect();

  const { teamId } = params;
  const team = await findTeamById(teamId);

  if (!team) {
    return redirect(routes.admin());
  }

  const competitors = await findCompetitorsByTeamId(teamId);

  return (
    <div>
      <AdminNavbar />
      <VStack space={12} className="container mx-auto p-8">
        <div className="w-1/2 mx-auto">
          <TeamSearchForm />
        </div>
        <div className="grid grid-cols-2 gap-x-8">
          <VStack className="self-start" align="start">
            <div>
              <Heading level={6}>Last prepped: {team.lastPreppedAt ? humanizeTimeAgo(team.lastPreppedAt) : 'never'}</Heading>
            </div>
            <div>
              <Heading level={6}>Last synced: {team.lastSyncedAt ? humanizeTimeAgo(team.lastSyncedAt) : 'never'}</Heading>
            </div>
            <div>
              <Heading level={6}>Last reported: {team.lastReportedAt ? humanizeTimeAgo(team.lastReportedAt) : 'never'}</Heading>
            </div>
          </VStack>
          <ReportActions team={team} />
        </div>
        <div className="w-full grid grid-cols-2 gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateTeamForm team={team} />
            </CardContent>
          </Card>
          <div>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Edit URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateTeamUrls team={team} />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2 max-h-[300px]">
            <CompetitorsTable competitors={competitors} team={team} />
          </div>
          <div className="col-span-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <UpdateTeamUrls team={team} /> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </VStack>
    </div>
  );
};

export default TeamAdminPage;
