import { PageProps } from "@/app/types";
import TeamLoader from "@/components/TeamLoader";
import Heading from "@/components/ui/Heading";
import classNames from "classnames";
import VStack from "@/components/ui/stack/VStack";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import rocksetService from "@/lib/services/rockset/rocksetService";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { WORKSPACE_HEIGHT } from "@/constants/dimensions";
import findCompetitorsByTeamId from "@/lib/logic/competitors/findCompetitorsByTeamId";
import { innerPadding } from "../../styles";
import ApplicationHomeNavbar from "../../../components/navbar/ApplicationHomeNavbar";
import SubNav from "./SubNav";
import FeedResults from "./FeedResults";

const TeamHome = async (props: PageProps) => {
  const { params } = props;
  const { teamId } = params;

  // todo verify that user has permissions to view

  return (
    <TeamLoader teamId={teamId}>
      {async ({ team }) => {
        const feedItems = await rocksetService.getKeyphraseFeedResults(teamId);
        const competitors = await findCompetitorsByTeamId(teamId);

        return (
          <div className="flex flex-col w-screen">
            <div className="sticky top-0 bg-zinc-950">
              <ApplicationHomeNavbar team={team} />
            </div>
            <div
              style={{ maxHeight: WORKSPACE_HEIGHT }}
              className={classNames(innerPadding, "overflow-hidden")}
            >
              <div>
                <SubNav competitors={competitors} team={team} />
              </div>
              <div className="h-fullgrid grid-cols-8 gap-x-4 items-stretch">
                <div className="col-span-3">hi</div>
                {feedItems && <FeedResults feedItems={feedItems} />}
                <VStack className="col-span-2 h-full" align="start">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Chat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      textarea here <br />
                      question suggestions here
                      {/* <InputField textArea value="" /> */}
                      {/* <Heading level={6}>{item.text}</Heading> */}
                      {/* <Text className="whitespace-break-spaces">{item.bodyText}</Text> */}
                      {/* todo, visually distinguish comments from posts */}
                      {/* <Text className="whitespace-break-spaces">{item.parentText}</Text> */}
                      {/* <Text></Text> */}
                    </CardContent>
                    <CardFooter>
                      {/* todo this should be dynamic */}
                      {/* <Button iconLeft={<ArrowTopRightOnSquareIcon className="w-5 h-5" />} target="_blank" variant="secondary" href={`https://reddit.com${item.href}`}></Button> */}
                    </CardFooter>
                  </Card>
                </VStack>
              </div>
            </div>
          </div>
        );
      }}
    </TeamLoader>
  );
};

export default TeamHome;
