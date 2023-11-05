'use client';

import { Teams } from '@prisma/client';
import Button from '@/components/ui/Button';
import { useFormState } from 'react-dom';
import handleAboutPageSubmission from '@/app/actions/welcome/handleAboutPageSubmission';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import WarningAlert from '@/components/ui/WarningAlert';
import WelcomeContainer from '../WelcomeContainer';
import AboutInputField from './AboutInputField';

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
      subheading="We found this from your website. Feel free to edit it or just leave as-is." // todo show fallback if we couldn't find anything from their URL
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
      <AboutInputField initialValue={team.description} />
    </WelcomeContainer>
  );
};

export default AboutPageClient;
