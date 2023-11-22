'use client';

import Button from '@/components/ui/Button';
import { useFormState } from 'react-dom';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import CalloutSection from '@/components/ui/CalloutSection';
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

  return (
    // todo - adding a better loading state that explains everything we're doing, since this can take a while to scrape their site and feed it to GPT
    <WelcomeContainer
      formAction={formAction}
      activeName='Domain'
      heading="What is your company's URL?"
      subheading="This will be used to find relevant keywords about your business, data about your competitors, and info about your products."
      actions={[
        (
          <FormStatusWrapper key="container">
            {({ pending }) => (
              <Button loading={pending}>Continue</Button>
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
                <CalloutSection theme="success" header="This may take up to a minute" message={'We are analyzing your site\'s messaging, finding competitors, and looking for opportunities.'} />
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
        />
      </div>
    </WelcomeContainer>
  );
};

export default WelcomePageClient;
