"use client";

import PricingDescriptionCard from "@/components/PricingDescriptionCard";
import usePricingPageScraper from "@/mutations/usePricingPageScraper";
import { Competitors, Teams } from "@prisma/client/edge";
import { useEffect, useState } from "react";
import { URL_INVALID } from "@/lib/logic/aiCapabilities/constants";
import FormGroup from "@/components/ui/FormGroup";
import InputField from "@/components/ui/Input";
import handleUrlInputOnChange from "@/utils/handleUrlInputOnChange";
import FormStatusWrapper from "@/components/FormStatusWrapper";
import Button from "@/components/ui/Button";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { routes } from "@/app/routes";
import WelcomeContainer from "../WelcomeContainer";

const CompetitorPricingCard = ({ competitor }: { competitor: Competitors }) => {
  const {
    data: pricingDescription,
    mutateAsync,
    isPending: isScrapingPricingPage,
  } = usePricingPageScraper();

  const [pricingUrl, setPricingUrl] = useState<string | undefined>(
    competitor.urls.find((url) => url.type === "PRICING_PAGE")?.url,
  );

  const pricingFound =
    !!pricingDescription && pricingDescription !== URL_INVALID;

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
    <PricingDescriptionCard
      heading={`${competitor.name ?? competitor.domain} pricing`}
      description={
        pricingFound
          ? pricingDescription ?? "undefined"
          : isScrapingPricingPage
            ? undefined
            : ""
      }
    >
      {isScrapingPricingPage || !pricingDescription ? null : (
        <FormGroup
          label={
            pricingFound
              ? "We found this from their pricing page"
              : "We couldn't find a pricing page... Can you help us out? Leave it blank if this doesn't apply."
          }
        >
          <InputField
            className="w-full"
            name={competitor.domain}
            disabled={pricingFound}
            value={pricingUrl}
            onChange={handleUrlInputOnChange(setPricingUrl)}
            type="url"
            placeholder="https://example.com/pricing"
          />
        </FormGroup>
      )}
    </PricingDescriptionCard>
  );
};

const CompetitorInfoPageClient = ({
  competitors,
  team,
}: {
  competitors: Competitors[];
  team: Teams;
}) => {
  // tristan todo need to start syncing team key phrases and preparing resources for report upon submission here
  return (
    <WelcomeContainer
      formAction={() => console.log("hi")}
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
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
          )}
        </FormStatusWrapper>,
        <FormStatusWrapper key="continue">
          {({ pending }) => (
            <Button
              type="button"
              href={routes.welcomeKeywords({ t: team.id })}
              loading={pending}
            >
              Continue
            </Button>
          )}
        </FormStatusWrapper>,
      ]}
    >
      <div className="grid md:grid-cols-2 gap-4">
        {competitors.map((competitor) => (
          <CompetitorPricingCard
            key={competitor.domain}
            competitor={competitor}
          />
        ))}
      </div>
    </WelcomeContainer>
  );
};

export default CompetitorInfoPageClient;
