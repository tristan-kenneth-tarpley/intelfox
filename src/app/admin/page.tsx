import AdminNavbar from '@/components/navbar/AdminNavBar';
import db from '@/lib/services/db/db';
import validateAdminUserAndMaybeRedirect from '../navigationHelpers/validateAdminUserAndMaybeRedirect';
import TeamsTable from './TeamsTable';

const getAllTeams = async () => {
  return db.teams.findMany();
};

const AdminPage = async () => {
  await validateAdminUserAndMaybeRedirect();

  const teams = await getAllTeams();

  return (
    <div>
      <AdminNavbar />
      <div className="container p-8 mx-auto">
        <div className='grid'>
          <TeamsTable teams={teams} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
