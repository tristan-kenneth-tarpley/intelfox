"use client";

import { Teams } from "@prisma/client/edge";
import Button from "@/components/ui/Button";
import { useFormState } from "react-dom";
import handleAboutPageSubmission from "@/app/actions/welcome/handleAboutPageSubmission";
import FormStatusWrapper from "@/components/FormStatusWrapper";
import FormGroup from "@/components/ui/FormGroup";
import usePricingPageScraper from "@/mutations/usePricingPageScraper";
import { useState } from "react";
import safeParseURL from "@/utils/safeParseURL";
import { URL_INVALID } from "@/lib/logic/aiCapabilities/constants";
import VStack from "@/components/ui/stack/VStack";
import Text from "@/components/ui/Text";
import InputField from "@/components/ui/Input";
import SpinnerWithText from "@/components/ui/SpinnerWithText";
import CalloutSection from "@/components/ui/CalloutSection";
import { routes } from "@/app/routes";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import PricingDescriptionCard from "@/components/PricingDescriptionCard";
import handleUrlInputOnChange from "@/utils/handleUrlInputOnChange";
import WelcomeContainer from "../WelcomeContainer";
import AboutInputField from "./AboutInputField";
import CompanyNameInputField from "./CompanyNameInputField";

const PricingPageUrlInput = ({ defaultValue }: { defaultValue?: string }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <InputField
      className="w-full"
      type="url"
      name="pricing_page_url"
      placeholder="https://yourwebsite.com/pricing"
      value={value}
      onChange={handleUrlInputOnChange(setValue)}
    />
  );
};

const AboutPageClient = ({ team }: { team: Teams }) => {
  const [step, setStep] = useState<"about" | "urls">("about");
  const [state, formAction] = useFormState(handleAboutPageSubmission, {
    team,
  });

  const [pricingPageUrl, setPricingPageUrl] = useState("");

  const {
    data: pricingDescription,
    mutateAsync,
    isPending: isScrapingPricingPage,
  } = usePricingPageScraper();

  const pricingNotFound = pricingDescription === URL_INVALID;

  const tryToFindPricingPage = async () => {
    const moveOn = () => setStep("urls");

    if (step !== "about") {
      moveOn();
      return;
    }

    const url = team.primaryDomain;

    if (!url) {
      moveOn();
      return;
    }

    const parsedURL = safeParseURL(url?.toString() ?? "");
    const finalUrl = parsedURL?.origin;

    if (!finalUrl) {
      moveOn();
      return;
    }

    const pricingUrlGuess = `${finalUrl}/pricing`;
    setPricingPageUrl(pricingUrlGuess);
    await mutateAsync(pricingUrlGuess);
    moveOn();
  };

  return (
    <WelcomeContainer
      formAction={formAction}
      onSubmit={step === "about" ? tryToFindPricingPage : undefined}
      activeName="About company"
      heading="Tell us more about yourself"
      subheading="We took a stab at describing your company. Feel free to edit it or just leave as-is."
      actions={[
        <Button
          key="back"
          href={step === "about" ? routes.welcome() : undefined}
          onClick={step === "urls" ? () => setStep("about") : undefined}
          variant="secondary"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>,
        <FormStatusWrapper key="continue">
          {({ pending }) => (
            <Button type="submit" disabled={isScrapingPricingPage || pending}>
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
        ) : isScrapingPricingPage ? (
          <SpinnerWithText text="Reading about your pricing, open jobs postings, and product info..." />
        ) : null
      }
    >
      {step === "about" ? (
        <>
          <FormGroup className="w-full" label="Company name">
            <CompanyNameInputField initialValue={team.name} />
          </FormGroup>
          <FormGroup className="w-full" label="Company description">
            <AboutInputField initialValue={team.description} />
          </FormGroup>
        </>
      ) : step === "urls" ? (
        <>
          {pricingDescription && pricingDescription !== URL_INVALID ? (
            <PricingDescriptionCard description={pricingDescription}>
              <FormGroup label="URL for your pricing page (or leave blank)">
                <PricingPageUrlInput defaultValue={pricingPageUrl} />
              </FormGroup>
            </PricingDescriptionCard>
          ) : pricingNotFound ? (
            <VStack align="start">
              <Text>
                We couldn&apos;t able to find any pricing information on your
                site. Either add your pricing page URL here, or leave it blank
                if you don&apos;t have one.
              </Text>
              <PricingPageUrlInput />
            </VStack>
          ) : null}
        </>
      ) : null}
    </WelcomeContainer>
  );
};

export default AboutPageClient;
