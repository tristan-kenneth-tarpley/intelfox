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
import db from '@/lib/services/db/db';
import Text from '@/components/ui/Text';
import { innerPadding } from './styles';
import Navbar from './Navbar';

const TeamHome = async (props: PageProps) => {
  const { params } = props;
  const { teamId } = params;

  return (
    <TeamLoader teamId={teamId}>
      {async ({ team }) => {
        const keyphrase = await db.trackedKeyPhrases.findFirst({ where: { teamId } });
        const feedItems = await rocksetService.getKeywordSearchResults(JSON.stringify(keyphrase?.phraseEmbeddings ?? []));

        console.log('feedItems', feedItems);

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
                {feedItems?.slice(0, 10).map((item) => (
                  <div key={item.href} className="w-full md:w-2/3 lg:w-3/5">
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle>{item.type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Text>{item.text}</Text>
                      </CardContent>
                      <CardFooter>
                        <p>Card Footer</p>
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
