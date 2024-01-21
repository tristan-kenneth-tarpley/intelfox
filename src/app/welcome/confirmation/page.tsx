import { routes } from "@/app/routes";
import { PageProps } from "@/app/types";
import KeyPhraseFeedItem from "@/components/KeyPhraseFeedItem";
import Metric from "@/components/Metric";
import TeamLoader from "@/components/TeamLoader";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import HStack from "@/components/ui/stack/HStack";
import VStack from "@/components/ui/stack/VStack";
import getCollatedReports from "@/jobs/reporting/reportNarrative/getCollatedReports";
import findCompetitorsByTeamId from "@/lib/logic/competitors/findCompetitorsByTeamId";
import addCommas from "@/utils/addCommas";
import { redirect } from "next/navigation";
import { cache } from "react";

const getCachedCollatedReports = cache(getCollatedReports);

const sections = [
  {
    title: "Overview",
    id: "about-company",
  },
  {
    title: "What people are saying about you",
    id: "seen",
  },
];

const AccountConfirmationPage = ({ searchParams }: PageProps) => {
  if (!searchParams?.t) {
    return redirect(routes.welcome());
  }

  const { t } = searchParams;

  return (
    <TeamLoader teamId={t as string}>
      {async ({ team }) => {
        const reports = await getCachedCollatedReports(
          { team },
          { logSeen: false },
        );

        const competitors = await findCompetitorsByTeamId(team.id);
        // console.log("reports", reports);

        return (
          <VStack align="start" space={8}>
            <HStack className="w-full sticky top-0" justify="start" space={8}>
              {[
                ...sections,
                ...competitors.slice(0, 2).map(({ name, domain }) => ({
                  title: name ?? domain,
                  id: domain,
                })),
              ].map(({ title, id }) => (
                <Button
                  variant="secondary"
                  key={id}
                  href={`${routes.welcomeConfirmation({ t: team.id })}#${id}`}
                  className="whitespace-nowrap"
                  size="lg"
                >
                  {title}
                </Button>
              ))}
            </HStack>
            <VStack space={8} align="start">
              <div>
                <Heading level={1}>{team.name}</Heading>
                <Text size="base">{team.description}</Text>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <Card className="col-span-2">
                  <CardHeader>
                    <Heading level={4}>What people are saying</Heading>
                  </CardHeader>
                  <CardContent>
                    <VStack align="start" space={8}>
                      {reports.teamReport.scrapedItemsReport?.map((item, i) => {
                        return (
                          <KeyPhraseFeedItem
                            key={item.id}
                            item={item}
                            locked={i > 1}
                          />
                        );
                      })}
                    </VStack>
                  </CardContent>
                </Card>
                <VStack align="start" className="sticky top-0">
                  <VStack align="start">
                    <Metric
                      label="Scraped items found"
                      value={addCommas(
                        reports.teamReport.scrapedItemsFound.toString(),
                      )}
                      subLabel="Only those with >90% relevancy"
                    />
                    <Button>See what else they&apos;re saying</Button>
                  </VStack>
                </VStack>
              </div>
              {competitors.slice(0, 2).map(({ name, domain, description }) => {
                return (
                  <div key={domain}>
                    <Heading level={1}>{name ?? domain}</Heading>
                    <Text size="base">{description}</Text>
                  </div>
                );
              })}
            </VStack>
          </VStack>
        );
      }}
    </TeamLoader>
  );
};

export default AccountConfirmationPage;
