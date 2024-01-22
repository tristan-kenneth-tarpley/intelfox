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
import SpinnerWithText from "@/components/ui/SpinnerWithText";
import CalloutSection from "@/components/ui/CalloutSection";
import { routes } from "@/app/routes";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import PricingDescriptionCard from "@/components/PricingDescriptionCard";
import { URL_INVALID } from "@/lib/logic/aiCapabilities/constants";
import WelcomeContainer from "../WelcomeContainer";
import AboutInputField from "./AboutInputField";
import CompanyNameInputField from "./CompanyNameInputField";

const AboutPageClient = ({ team }: { team: Teams }) => {
  const [step, setStep] = useState<"about" | "urls">("about");
  const [state, formAction] = useFormState(handleAboutPageSubmission, {
    team,
  });

  const [pricingPageUrl, setPricingPageUrl] = useState("");
  const [urlConfirmed, setUrlConfirmed] = useState(false);

  const {
    data: pricingDescription,
    mutateAsync,
    isPending: isScrapingPricingPage,
  } = usePricingPageScraper();

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
      activeName="About you"
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
            <Button
              type="submit"
              disabled={
                isScrapingPricingPage ||
                pending ||
                (step === "urls" && !urlConfirmed)
              }
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
          <PricingDescriptionCard
            heading={`${team.name ?? team.primaryDomain} pricing`}
            description={pricingDescription ?? undefined}
            pronoun="your"
            inputName={`pricing_url`}
            value={pricingPageUrl}
            onUrlConfirmed={() => {
              setUrlConfirmed(true);
            }}
            onUrlChange={(url) => {
              setPricingPageUrl(url);
            }}
          />
          <input
            hidden
            value={
              pricingDescription && pricingDescription !== URL_INVALID
                ? pricingDescription
                : ""
            }
            name="pricing_description"
          />
        </>
      ) : null}
    </WelcomeContainer>
  );
};

export default AboutPageClient;
