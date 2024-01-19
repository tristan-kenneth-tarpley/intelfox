import { routes } from "@/app/routes";
import { PageProps } from "@/app/types";
import TeamLoader from "@/components/TeamLoader";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import HStack from "@/components/ui/stack/HStack";
import VStack from "@/components/ui/stack/VStack";
import getCollatedReports from "@/jobs/reporting/reportNarrative/getCollatedReports";
import { redirect } from "next/navigation";
import { cache } from "react";

const leftNavWidth = 200;

const getCachedCollatedReports = cache(getCollatedReports);

const sections = [
  {
    title: "About company",
    id: "about-company",
  },
  {
    title: "What people are saying",
    id: "seen",
  },
  {
    title: "Competitors",
    id: "competitors",
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
        const reports = await getCachedCollatedReports({ team });
        // console.log("reports", reports);

        return (
          <HStack className="flex" align="start" space={8}>
            <div
              style={{
                minWidth: leftNavWidth,
                maxWidth: leftNavWidth,
              }}
              className="sticky top-0"
            >
              <VStack align="start" className="pr-4">
                {sections.map(({ title, id }) => (
                  <Button
                    variant="ghost"
                    key={id}
                    href={`${routes.welcomeConfirmation({ t: team.id })}#${id}`}
                    className="w-full"
                  >
                    {title}
                  </Button>
                ))}
              </VStack>
            </div>
            <VStack>
              <div>
                <Heading level={1}>{team.name}</Heading>
                <Text size="base">{team.description}</Text>
              </div>
              {reports.teamReport.scrapedItemsReport?.map((item) => {
                return (
                  <div key={item.id}>
                    <Heading level={2}>{item.text}</Heading>
                    <Text size="base">{item.bodyText}</Text>
                    <Text size="base">(parent) {item.parentText}</Text>
                  </div>
                );
              })}
            </VStack>
          </HStack>
        );
      }}
    </TeamLoader>
  );
};

export default AccountConfirmationPage;
