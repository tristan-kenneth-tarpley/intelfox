'use client';

import Button from '@/components/ui/Button';
import { useFormState } from 'react-dom';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import CalloutSection from '@/components/ui/CalloutSection';
import VStack from '@/components/ui/stack/VStack';
import Spinner from '@/components/ui/Spinner';
import HStack from '@/components/ui/stack/HStack';
import Text from '@/components/ui/Text';
import { useRef, useState } from 'react';
import safeParseURL from '@/utils/safeParseURL';
import usePricingPageScraper from '@/mutations/usePricingPageScraper';
import InputField from '@/components/ui/Input';
import { URL_INVALID } from '@/lib/logic/aiCapabilities/constants';
import Line from '@/components/ui/Line';
import DomainInput from './DomainInput';
import WelcomeContainer from './WelcomeContainer';
import handleCompanyDomainSubmission from '../actions/welcome/handleCompanyDomainSubmission';

const WelcomePageClient = ({
  guessedDomain,
}: {
  guessedDomain: string;
}) => {
  const [state, formAction] = useFormState(handleCompanyDomainSubmission, {
    message: null,
  });

  const {
    data: pricingDescription,
    mutateAsync,
    isPending: isScrapingPricingPage,
  } = usePricingPageScraper();

  const [hasTriedScrapingPricingPage, setHasTriedScrapingPricingPage] = useState(false);
  const [attemptedPricingUrl, setAttemptedPricingUrl] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const tryToFindPricingPage = async () => {
    if (hasTriedScrapingPricingPage) {
      return;
    }

    const url = inputRef.current?.value;

    if (!url) {
      return;
    }

    const parsedURL = safeParseURL(url?.toString() ?? '');
    const finalUrl = parsedURL?.origin;

    if (!finalUrl) {
      return;
    }

    const pricingUrlGuess = `${finalUrl}/pricing`;
    setAttemptedPricingUrl(pricingUrlGuess);
    await mutateAsync(pricingUrlGuess);
    setHasTriedScrapingPricingPage(true);
  };

  const pricingNotFound = pricingDescription === URL_INVALID;

  return (
    // todo - adding a better loading state that explains everything we're doing, since this can take a while to scrape their site and feed it to GPT
    <WelcomeContainer
      formAction={formAction}
      onSubmit={!hasTriedScrapingPricingPage ? tryToFindPricingPage : undefined}
      activeName='Domain'
      heading="What is your company's URL?"
      subheading="This will be used to find relevant keywords about your business, data about your competitors, and info about your products."
      actions={[
        (
          <FormStatusWrapper key="container">
            {({ pending }) => (
              <Button loading={pending || isScrapingPricingPage}>
                {hasTriedScrapingPricingPage ? "Let's keep going!" : 'Continue'}
              </Button>
            )}
          </FormStatusWrapper>
        ),
      ]}
      dialog={(
        state.message ? (
          <CalloutSection header="There were issues with the form" message={state.message} />
        ) : (
          <FormStatusWrapper>
            {({ pending }) => (
              !pending ? null : (
                <VStack align="start">
                  {[
                    'Reading about your product...',
                    'Looking for open job postings...',
                  ].map((text, i) => (
                    <HStack key={i}>
                      <Spinner variant="orange" />
                      <Text>{text}</Text>
                    </HStack>
                  ))}
                </VStack>
              )
            )}
          </FormStatusWrapper>
        )
      )}
    >
      <div className="w-full flex items-stretch">
        <DomainInput
          key={guessedDomain}
          initialValue={guessedDomain}
          inputRef={inputRef}
        />
        {pricingDescription && !pricingNotFound && (
          <input
            hidden
            name="pricing_page_url"
            value={attemptedPricingUrl}
          />
        )}
      </div>
      {isScrapingPricingPage && (
        <HStack>
          <Spinner variant="orange" />
          <Text>Looking for a pricing page on your URL...</Text>
        </HStack>
      )}
      {hasTriedScrapingPricingPage && (
        <Line />
      )}
      {pricingDescription && pricingDescription !== URL_INVALID ? (
        <VStack align="start">
          <Text>We got this information from your pricing page:</Text>
          <Text>{pricingDescription}</Text>
        </VStack>
      ) : hasTriedScrapingPricingPage && pricingNotFound ? (
        <VStack align="start">
          <Text>We couldn&apos;t able to find any pricing information on your site. Either add your pricing page URL here, or leave it blank if you don&apos;t have one.</Text>
          <InputField
            className="w-full"
            type="url"
            name="pricing_page_url"
            placeholder='https://yourwebsite.com/pricing'
          />
        </VStack>
      ) : null}
    </WelcomeContainer>
  );
};

export default WelcomePageClient;
