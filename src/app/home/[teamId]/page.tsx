import { PageProps } from '@/app/types';
import TeamLoader from '@/components/TeamLoader';
import Heading from '@/components/ui/Heading';
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
import { WORKSPACE_HEIGHT } from '@/constants/dimensions';
import { innerPadding } from './styles';
import Navbar from '../../../components/navbar/Navbar';

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
            <div style={{ maxHeight: WORKSPACE_HEIGHT }} className={classNames(innerPadding, 'overflow-hidden')}>
              <div className='grid grid-cols-2 gap-x-4 items-stretch'>
                <VStack align="start">
                  <Heading level={6}>Test</Heading>
                </VStack>
                <div className="overflow-x-scroll w-full pb-12" style={{ maxHeight: WORKSPACE_HEIGHT }}>
                  <VStack align="start" justify="start">
                    <div className="sticky top-0 bg-zinc-950 w-full py-2">
                      <Heading level={5}>Feed</Heading>
                    </div>
                    {feedItems?.map((item) => (
                      <div key={item.href} className="w-full">
                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle>{item.type}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Heading level={6}>{item.text}</Heading>
                            <Text className="whitespace-break-spaces">{item.bodyText}</Text>
                            {/* <Text></Text> */}
                          </CardContent>
                          <CardFooter>
                            {/* todo this should be dynamic */}
                            <Button iconLeft={<ArrowTopRightOnSquareIcon className="w-5 h-5" />} target="_blank" variant="secondary" href={`https://reddit.com${item.href}`}></Button>
                          </CardFooter>
                        </Card>
                      </div>
                    ))}
                  </VStack>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </TeamLoader>
  );
};

export default TeamHome;
