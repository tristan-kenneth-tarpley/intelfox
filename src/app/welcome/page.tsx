import Heading from '@/components/ui/Heading';
import Button from '@/components/ui/Button';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import Text from '@/components/ui/Text';
import DomainInput from './DomainInput';
import WelcomeBreadcrumb from './WelcomeBreadcrumb';

const WelcomePage = () => {
  return (
    <div>
      <WelcomeBreadcrumb activeName="Domain" />
      <div className="flex flex-col space-y-4">
        <div>
          <Heading level={1} displayAs={3}>What is your company&apos;s URL?</Heading>
          <Text>This will be used to find relevant keywords about your business, data about your competitors, and info about your products.</Text>
        </div>
        <div className="w-full flex items-stretch">
          <DomainInput />
        </div>
        <div className="justify-end flex space-x-2">
          <Button variant='secondary'><ChevronLeftIcon className="h-5 w-5" /></Button>
          <Button>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
