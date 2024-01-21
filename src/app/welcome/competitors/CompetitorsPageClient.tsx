"use client";

import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import _ from "lodash";
import { Teams } from "@prisma/client/edge";
import { CompetitorAPIResponse } from "@/lib/services/spyfu/spyfuService";
import Button from "@/components/ui/Button";
import { routes } from "@/app/routes";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import FormStatusWrapper from "@/components/FormStatusWrapper";
import CheckboxContainer from "@/components/ui/CheckboxContainer";
import Checkbox from "@/components/ui/Checkbox";
import Label from "@/components/ui/Label";
import FormGroup from "@/components/ui/FormGroup";
import InputField from "@/components/ui/Input";
import CalloutSection from "@/components/ui/CalloutSection";
import handleCompetitorsPageSubmission from "@/app/actions/welcome/handleCompetitorsPageSubmission";
import getHostnameFromDomain from "@/utils/getHostnameFromDomain";
import classNames from "classnames";
import splitStringOnCommas from "@/utils/splitStringOnCommas";
import SpinnerWithText from "@/components/ui/SpinnerWithText";
import WelcomeContainer from "../WelcomeContainer";

const CompetitorsPageClient = ({
  team,
  competitors,
  trackedCompetitorDomains,
}: {
  team: Teams;
  competitors: CompetitorAPIResponse["results"];
  trackedCompetitorDomains: string[];
}) => {
  const [customCompetitors, setCustomCompetitors] = useState("");
  const [state, formAction] = useFormState(handleCompetitorsPageSubmission, {
    team,
  });

  const [newCompetitors, setNewCompetitors] = useState(
    trackedCompetitorDomains,
  );

  const trackedCompetitorsSet = new Set(newCompetitors);
  const newCompetitorsArray = splitStringOnCommas(customCompetitors);
  const atMaxCompetitors =
    newCompetitorsArray.length + trackedCompetitorsSet.size >= 2;

  const domainsToDisplay = useMemo(() => {
    return _.uniq([
      ...competitors
        .filter(
          (competitor) =>
            competitor.domain !== getHostnameFromDomain(team.primaryDomain),
        )
        .slice(0, 20)
        .map(({ domain }) => domain),
      ...trackedCompetitorDomains,
    ]);
  }, [competitors, team.primaryDomain, trackedCompetitorDomains]);

  return (
    <WelcomeContainer
      formAction={formAction}
      activeName="Pick competitors"
      heading="Who are your competitors?"
      subheading="We will monitor these competitors for you around the internet and include relevant conversations in your IntelFox feed. Pick up to two."
      actions={[
        <FormStatusWrapper key="back">
          {({ pending }) => (
            <Button
              disabled={pending}
              href={routes.welcomeAbout({ t: team.id })}
              variant="secondary"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
          )}
        </FormStatusWrapper>,
        <FormStatusWrapper key="continue">
          {({ pending }) => <Button disabled={pending}>Continue</Button>}
        </FormStatusWrapper>,
      ]}
      dialog={
        <FormStatusWrapper key="back">
          {({ pending }) =>
            state.message ? (
              <CalloutSection
                header="There were issues with the form"
                message={state.message}
              />
            ) : pending ? (
              <SpinnerWithText text="Looking up some info about your competitors..." />
            ) : null
          }
        </FormStatusWrapper>
      }
    >
      <div className="grid grid-cols-2 gap-y-2">
        {domainsToDisplay.map((competitorDomain) => {
          const id = `int_comp_${competitorDomain}`;
          return (
            <CheckboxContainer key={competitorDomain}>
              <Checkbox
                id={id}
                name={id}
                defaultChecked={trackedCompetitorsSet.has(competitorDomain)}
                disabled={
                  atMaxCompetitors &&
                  !trackedCompetitorsSet.has(competitorDomain)
                }
                onChange={(e) => {
                  setNewCompetitors((prev) => {
                    const newSet = new Set(prev);
                    if (e.target.checked) {
                      newSet.add(competitorDomain);
                    } else {
                      newSet.delete(competitorDomain);
                    }
                    return Array.from(newSet);
                  });
                }}
              />
              <Label
                className={classNames({
                  "text-gray-400": atMaxCompetitors,
                })}
                htmlFor={id}
              >
                {competitorDomain}
              </Label>
            </CheckboxContainer>
          );
        })}
      </div>
      <div>
        <FormGroup
          label="Enter more competitor URLs, separated by a comma."
          subLabel="This will be included in addition to the key phrases selected above."
        >
          <InputField
            textArea
            className="w-full"
            value={customCompetitors}
            onChange={(e) => setCustomCompetitors(e.target.value)}
            name="custom_competitors"
            disabled={atMaxCompetitors}
          />
        </FormGroup>
      </div>
    </WelcomeContainer>
  );
};

export default CompetitorsPageClient;
