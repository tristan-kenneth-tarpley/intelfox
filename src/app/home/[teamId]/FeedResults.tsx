import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import VStack from "@/components/ui/stack/VStack";
import { WORKSPACE_HEIGHT } from "@/constants/dimensions";
import { KeyPhraseFeedResult } from "@/lib/services/rockset/lambdas/getKeyphraseFeedResults";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

const FeedResults = ({ feedItems }: { feedItems: KeyPhraseFeedResult[] }) => {
  return (
    <div
      className="overflow-x-scroll w-full pb-12"
      style={{ maxHeight: WORKSPACE_HEIGHT }}
    >
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
                {/* todo, visually distinguish comments from posts */}
                <Text className="whitespace-break-spaces">
                  {item.parentText}
                </Text>
                {/* <Text></Text> */}
              </CardContent>
              <CardFooter>
                {/* todo this should be dynamic */}
                <Button
                  iconLeft={<ArrowTopRightIcon className="w-5 h-5" />}
                  target="_blank"
                  variant="secondary"
                  href={`https://reddit.com${item.href}`}
                ></Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </VStack>
    </div>
  );
};

export default FeedResults;
