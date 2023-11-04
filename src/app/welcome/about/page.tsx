import Button from '@/components/ui/Button';
import { routes } from '@/app/routes';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import WelcomeContainer from '../WelcomeContainer';
import AboutInputField from './AboutInputField';

const AboutPage = () => {
  return (
    <WelcomeContainer
      activeName="About company"
      heading="Tell us more about yourself"
      subheading="We found this from your website. Feel free to edit it or just leave as-is." // todo show fallback if we couldn't find anything from their URL
      actions={[
        <Button key="back" href={routes.welcome()} variant="secondary">
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>,
        <Button key="continue">Continue</Button>,
      ]}
    >
      <AboutInputField />
    </WelcomeContainer>
  );
};

export default AboutPage;
