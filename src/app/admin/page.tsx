import AdminNavbar from '@/components/navbar/AdminNavBar';
import db from '@/lib/services/db/db';
import VStack from '@/components/ui/stack/VStack';
import validateAdminUserAndMaybeRedirect from '../navigationHelpers/validateAdminUserAndMaybeRedirect';
import TeamsTable from './TeamsTable';
import TeamSearchForm from './TeamSearchForm';

const getAllTeams = async () => {
  return db.teams.findMany();
};

const AdminPage = async () => {
  await validateAdminUserAndMaybeRedirect();

  const teams = await getAllTeams();

  return (
    <div>
      <AdminNavbar />
      <VStack className="container p-8 mx-auto">
        <div className="w-1/2">
          <TeamSearchForm />
        </div>
        <div className='grid  max-w-[80vw] overflow-scroll'>
          <TeamsTable teams={teams} />
        </div>
      </VStack>
    </div>
  );
};

export default AdminPage;
