import { PageProps } from '@/app/types';
import TeamLoader from '@/components/TeamLoader';
import Heading from '@/components/ui/Heading';
import getHostnameFromDomain from '@/utils/getHostnameFromDomain';
import classNames from 'classnames';
import VStack from '@/components/ui/stack/VStack';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import rocksetService from '@/lib/services/rockset/rocksetService';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { innerPadding } from './styles';
import Navbar from './Navbar';

const TeamHome = async (props: PageProps) => {
  const { params } = props;
  const { teamId } = params;

  return (
    <TeamLoader teamId={teamId}>
      {async ({ team }) => {
        const feedItems = await rocksetService.getKeyphraseFeedResults(teamId);
        return (
          <div className="flex flex-col w-screen">
            <div className="sticky top-0 bg-zinc-950">
              <Navbar team={team} />
            </div>
            <div className={classNames(innerPadding, 'border-b border-solid border-zinc-800')}>
              <Heading level={1} displayAs={3}>{getHostnameFromDomain(team.primaryDomain)}</Heading>
            </div>
            <div className={classNames(innerPadding)}>
              <VStack align="center">
                {feedItems?.map((item) => (
                  <div key={item.href} className="w-full md:w-2/3 lg:w-3/5">
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle>{item.type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Heading level={6}>{item.text}</Heading>
                        <Text>{item.bodyText}</Text>
                        {/* <Text></Text> */}
                      </CardContent>
                      <CardFooter>
                        {/* todo this should be dynamic */}
                        <Button iconLeft={<ArrowTopRightOnSquareIcon className="w-5 h-5" />} target="_blank" variant="secondary" href={`https://reddit.com/${item.href}`}></Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </VStack>
            </div>
          </div>
        );
      }}
    </TeamLoader>
  );
};

export default TeamHome;
