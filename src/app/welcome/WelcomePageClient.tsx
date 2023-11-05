'use client';

import Button from '@/components/ui/Button';
import { useFormState } from 'react-dom';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import WarningAlert from '@/components/ui/WarningAlert';
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
    >
      {state.message && (
        <WarningAlert header="There were issues with the form" message={state.message} />
      )}
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
