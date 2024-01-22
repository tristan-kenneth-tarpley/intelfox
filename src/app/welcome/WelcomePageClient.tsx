"use client";

import Button from "@/components/ui/Button";
import { useFormState } from "react-dom";
import FormStatusWrapper from "@/components/FormStatusWrapper";
import CalloutSection from "@/components/ui/CalloutSection";
import VStack from "@/components/ui/stack/VStack";
import Spinner from "@/components/ui/Spinner";
import HStack from "@/components/ui/stack/HStack";
import Text from "@/components/ui/Text";
import DomainInput from "./DomainInput";
import WelcomeContainer from "./WelcomeContainer";
import handleCompanyDomainSubmission from "../actions/welcome/handleCompanyDomainSubmission";

const WelcomePageClient = ({ guessedDomain }: { guessedDomain: string }) => {
  const [state, formAction] = useFormState(handleCompanyDomainSubmission, {
    message: null,
  });

  return (
    // todo - adding a better loading state that explains everything we're doing, since this can take a while to scrape their site and feed it to GPT
    <WelcomeContainer
      formAction={formAction}
      activeName="URL"
      heading="What is your company's URL?"
      subheading="Give the URL to the public website that has the most information about your products, pricing, and company."
      dialog={
        state.message ? (
          <CalloutSection
            header="There were issues with the form"
            message={state.message}
          />
        ) : (
          <FormStatusWrapper>
            {({ pending }) =>
              !pending ? null : (
                <VStack align="start">
                  {[
                    "Looking for a pricing page...",
                    "Reading about your product...",
                    "Looking for open job postings...",
                  ].map((text, i) => (
                    <HStack key={i}>
                      <Spinner variant="orange" />
                      <Text>{text}</Text>
                    </HStack>
                  ))}
                </VStack>
              )
            }
          </FormStatusWrapper>
        )
      }
    >
      <HStack justify="center">
        <VStack className="w-full" align="start">
          <DomainInput key={guessedDomain} initialValue={guessedDomain} />
          <FormStatusWrapper>
            {({ pending }) => <Button disabled={pending}>Continue</Button>}
          </FormStatusWrapper>
        </VStack>
      </HStack>
    </WelcomeContainer>
  );
};

export default WelcomePageClient;
