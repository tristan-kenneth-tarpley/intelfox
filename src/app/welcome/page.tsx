import Button from '@/components/ui/Button';
import DomainInput from './DomainInput';
import WelcomeContainer from './WelcomeContainer';

const WelcomePage = () => {
  // on submit:
  // - validate URL
  // - create team in clerk
  // - create Teams document
  // - scrape site, validate URL, and get meta description
  // - hit Spyfu API to get keywords and competitor domains

  return (
    <WelcomeContainer
      activeName='Domain'
      heading="What is your company's URL?"
      subheading="This will be used to find relevant keywords about your business, data about your competitors, and info about your products."
      actions={[
        <Button key="container">Continue</Button>,
      ]}
    >
      <div className="w-full flex items-stretch">
        <DomainInput />
      </div>
    </WelcomeContainer>
  );
};

export default WelcomePage;
