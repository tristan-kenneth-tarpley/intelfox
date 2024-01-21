"use client";

import { KeyPhraseFeedResult } from "@/lib/services/rockset/lambdas/getKeyphraseFeedResults";
import { startCase } from "lodash";
import { ExternalLinkIcon, LockClosedIcon } from "@radix-ui/react-icons";
import Text from "./ui/Text";
import Button from "./ui/Button";
import VStack from "./ui/stack/VStack";
import { Skeleton } from "./ui/skeleton";
import HStack from "./ui/stack/HStack";
import Tooltip from "./ui/Tooltip";

const DefaultSkeleton = () => {
  return (
    <Tooltip className="w-full" title="Upgrade to view content">
      <HStack className="w-full" align="start">
        <LockClosedIcon className="h-6 w-6" />
        <VStack className="w-full" align="start">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </VStack>
      </HStack>
    </Tooltip>
  );
};

const KeyPhraseFeedItem = ({
  item,
  locked,
}: {
  item: KeyPhraseFeedResult;
  locked?: boolean;
}) => {
  return (
    <VStack align="start" className="w-full">
      {item.parentText && (
        <div className="pl-4 border-l border-solid border-zinc-400">
          <Text
            size="base"
            className="text-zinc-400 whitespace-break-spaces font-semibold"
          >
            {locked ? <DefaultSkeleton /> : item.parentText}
          </Text>
        </div>
      )}
      <Text size="base">{item.text}</Text>
      {locked ? (
        <DefaultSkeleton />
      ) : (
        <Text size="sm" className="whitespace-break-spaces">
          {item.bodyText}
        </Text>
      )}
      <Tooltip title="Upgrade to view">
        <Button
          as="div"
          target="_blank"
          variant="outline"
          href={locked ? undefined : `https://reddit.com${item.href}`} // todo - make this a link builder
          iconRight={
            locked ? undefined : <ExternalLinkIcon className="w-4 h-4" />
          }
        >
          {locked ? (
            "View content"
          ) : (
            <>View on {startCase(item.source.toLowerCase())}</>
          )}
        </Button>
      </Tooltip>
    </VStack>
  );
};

export default KeyPhraseFeedItem;
