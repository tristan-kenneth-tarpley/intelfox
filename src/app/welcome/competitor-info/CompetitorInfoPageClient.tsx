"use client";

import PricingDescriptionCard from "@/components/PricingDescriptionCard";
import usePricingPageScraper from "@/mutations/usePricingPageScraper";
import { Competitors, Teams } from "@prisma/client/edge";
import { useEffect, useState } from "react";
import { URL_INVALID } from "@/lib/logic/aiCapabilities/constants";
import FormStatusWrapper from "@/components/FormStatusWrapper";
import Button from "@/components/ui/Button";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { routes } from "@/app/routes";
import { useFormState } from "react-dom";
import handleCompetitorInfoPageSubmission from "@/app/actions/welcome/handleCompetitorInfoPageSubmission";
import CalloutSection from "@/components/ui/CalloutSection";
import WelcomeContainer from "../WelcomeContainer";

const CompetitorPricingCard = ({
  competitor,
  onUrlConfirmed,
}: {
  competitor: Competitors;
  onUrlConfirmed: () => void;
}) => {
  const { data: pricingDescription, mutateAsync } = usePricingPageScraper();

  const [pricingUrl, setPricingUrl] = useState<string | undefined>(
    competitor.urls.find((url) => url.type === "PRICING_PAGE")?.url,
  );

  useEffect(() => {
    if (pricingUrl) {
      return;
    }

    const pricingPageUrl = `${competitor.domain}/pricing`;

    mutateAsync(pricingPageUrl).then((description) => {
      if (description === URL_INVALID) {
        return;
      }

      setPricingUrl(pricingPageUrl);
    });
  }, [mutateAsync, pricingUrl, competitor.domain]);

  return (
    <div>
      <PricingDescriptionCard
        heading={`${competitor.name ?? competitor.domain} pricing`}
        description={pricingDescription ?? undefined}
        pronoun="their"
        inputName={`pricing_url_${competitor.id}`}
        onUrlChange={(url) => {
          setPricingUrl(url);
        }}
        value={pricingUrl}
        onUrlConfirmed={onUrlConfirmed}
      />
      <input
        hidden
        value={pricingDescription ?? undefined}
        name={`pricing_description_${competitor.id}`}
      />
    </div>
  );
};

const CompetitorInfoPageClient = ({
  competitors,
  team,
}: {
  competitors: Competitors[];
  team: Teams;
}) => {
  const [state, formAction] = useFormState(handleCompetitorInfoPageSubmission, {
    team,
  });
  const [urlConfirmations, setUrlConfirmations] = useState<
    Record<string, boolean>
  >(
    competitors.reduce(
      (acc, { id }) => ({ ...acc, [id]: false }),
      {} as Record<string, boolean>,
    ),
  );

  // const
  // tristan todo need to start syncing team key phrases and preparing resources for report upon submission here
  // also upon submission, save the pricing summaries as a report so that we can show it on confirmation page
  return (
    <WelcomeContainer
      formAction={formAction}
      activeName="Competitor info"
      heading="Tell us a little bit more about these competitors"
      subheading="This will help us better understand their business and your market."
      actions={[
        <FormStatusWrapper key="back">
          {({ pending }) => (
            <Button
              disabled={pending}
              href={routes.welcomeCompetitorInfo({ t: team.id })}
              variant="secondary"
              type="button"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
          )}
        </FormStatusWrapper>,
        <FormStatusWrapper key="continue">
          {({ pending }) => (
            <Button
              loading={pending}
              disabled={Object.values(urlConfirmations).some(
                (confirmed) => !confirmed,
              )}
            >
              Continue
            </Button>
          )}
        </FormStatusWrapper>,
      ]}
      dialog={
        state.message ? (
          <CalloutSection
            header="There were issues with the form"
            message={state.message}
          />
        ) : null
      }
    >
      <div className="grid lg:grid-cols-2 gap-4">
        {competitors.map((competitor) => (
          <CompetitorPricingCard
            key={competitor.domain}
            competitor={competitor}
            onUrlConfirmed={() =>
              setUrlConfirmations({
                ...urlConfirmations,
                [competitor.id]: true,
              })
            }
          />
        ))}
      </div>
    </WelcomeContainer>
  );
};

export default CompetitorInfoPageClient;
