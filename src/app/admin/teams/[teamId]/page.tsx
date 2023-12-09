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
import TeamSearchForm from '../../TeamSearchForm';
import UpdateTeamForm from './UpdateTeamForm';
import UpdateTeamUrls from './UpdateTeamUrls';

const TeamAdminPage = async ({ params }: PageProps) => {
  await validateAdminUserAndMaybeRedirect();

  const { teamId } = params;
  const team = await findTeamById(teamId);

  if (!team) {
    return redirect(routes.admin());
  }

  return (
    <div>
      <AdminNavbar />
      <VStack className="container mx-auto p-8">
        <div className="w-1/2 mx-auto">
          <TeamSearchForm />
        </div>
        <div className="w-full grid grid-cols-2 gap-x-4">
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
        </div>
      </VStack>
    </div>
  );
};

export default TeamAdminPage;
