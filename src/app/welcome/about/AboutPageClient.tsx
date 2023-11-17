'use client';

import { Teams } from '@prisma/client/edge';
import Button from '@/components/ui/Button';
import { useFormState } from 'react-dom';
import handleAboutPageSubmission from '@/app/actions/welcome/handleAboutPageSubmission';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import WarningAlert from '@/components/ui/WarningAlert';
import FormGroup from '@/components/ui/FormGroup';
import WelcomeContainer from '../WelcomeContainer';
import AboutInputField from './AboutInputField';
import CompanyNameInputField from './CompanyNameInputField';

const AboutPageClient = ({
  team,
}: {
  team: Teams,
}) => {
  const [state, formAction] = useFormState(handleAboutPageSubmission, {
    team,
  });

  return (
    <WelcomeContainer
      formAction={formAction}
      activeName="About company"
      heading="Tell us more about yourself"
      subheading="We took a stab at describing your company. Feel free to edit it or just leave as-is... It won't hurt our feelings!" // todo show fallback if we couldn't find anything from their URL
      actions={[
        <FormStatusWrapper key="continue">
          {({ pending }) => (
            <Button type="submit" loading={pending}>Continue</Button>
          )}
        </FormStatusWrapper>,
      ]}
    >
      {state.message && (
        <WarningAlert header="There were issues with the form" message={state.message} />
      )}
      <FormGroup className="w-full" label="Company name">
        <CompanyNameInputField initialValue={team.name} />
      </FormGroup>
      <FormGroup className="w-full" label="Company description">
        <AboutInputField initialValue={team.description} />
      </FormGroup>
    </WelcomeContainer>
  );
};

export default AboutPageClient;
