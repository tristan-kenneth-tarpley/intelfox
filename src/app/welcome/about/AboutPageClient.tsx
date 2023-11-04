'use client';

import { Teams } from '@prisma/client';
import Button from '@/components/ui/Button';
import { routes } from '@/app/routes';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { useFormState } from 'react-dom';
import handleAboutPageSubmission from '@/app/actions/welcome/handleAboutPageSubmission';
import FormStatusWrapper from '@/components/FormStatusWrapper';
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

  console.log(state);

  return (
    <WelcomeContainer
      formAction={formAction}
      activeName="About company"
      heading="Tell us more about yourself"
      subheading="We found this from your website. Feel free to edit it or just leave as-is." // todo show fallback if we couldn't find anything from their URL
      actions={[
        <FormStatusWrapper key="back">
          {({ pending }) => (
            <Button disabled={pending} href={routes.welcome()} variant="secondary">
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
          )}
        </FormStatusWrapper>,
        <FormStatusWrapper key="continue">
          {({ pending }) => (
            <Button type="submit" loading={pending}>Continue</Button>
          )}
        </FormStatusWrapper>,
      ]}
    >
      <AboutInputField initialValue={team.description} />
    </WelcomeContainer>
  );
};

export default AboutPageClient;
