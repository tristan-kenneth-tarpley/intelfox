import validateAdminUserAndMaybeRedirect from '@/app/navigationHelpers/validateAdminUserAndMaybeRedirect';
import { routes } from '@/app/routes';
import { PageProps } from '@/app/types';
import UpdateCompetitorUrls from '@/components/UpdateCompetitorUrls';
import AdminNavbar from '@/components/navbar/AdminNavBar';
import FormGroup from '@/components/ui/FormGroup';
import Text from '@/components/ui/Text';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import VStack from '@/components/ui/stack/VStack';
import findCompetitorById from '@/lib/logic/competitors/findCompetitorById';
import { redirect } from 'next/navigation';

const CompetitorAdminPage = async ({ params }: PageProps) => {
  await validateAdminUserAndMaybeRedirect();
  const { competitorId } = params;

  const competitor = await findCompetitorById(competitorId);

  if (!competitor) {
    return redirect(routes.admin());
  }

  return (
    <div>
      <AdminNavbar />
      <VStack space={12} className="container mx-auto p-8">
        <div className="w-full grid grid-cols-2 gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{competitor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <VStack>
                <Text>If you need to edit these... Ask Tristan... He ran out of time.</Text>
                <FormGroup label="name">
                  <Text>{competitor.name}</Text>
                </FormGroup>
                <FormGroup label="domain">
                  <Text>{competitor.domain}</Text>
                </FormGroup>
              </VStack>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Edit URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateCompetitorUrls competitor={competitor} />
            </CardContent>
          </Card>
        </div>
      </VStack>
    </div>
  );
};

export default CompetitorAdminPage;
