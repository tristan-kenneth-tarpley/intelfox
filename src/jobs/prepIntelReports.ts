import db from '@/lib/services/db/db';
import runJob from './runJob';
import prepIntelReportForTeam from './prepIntelReportForTeam';

const findTeamsNotPreppedInLast28Days = async () => {
  return db.teams.findMany({
    where: {
      OR: [{
        lastPreppedAt: {
          lte: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        },
      }, {
        lastPreppedAt: {
          equals: null,
        },
      }],
    },
  });
};

const prepIntelReports = async () => {
  const teams = await findTeamsNotPreppedInLast28Days();
  console.log(`prepping reports for ${teams.length} teams`);
  if (teams.length) {
    await Promise.all(teams.map(({ id }) => runJob(prepIntelReportForTeam, { teamId: id })));
  }
};

export default prepIntelReports;
