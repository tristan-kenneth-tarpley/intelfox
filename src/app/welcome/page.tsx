import Button from '@/components/ui/Button';
import DomainInput from './DomainInput';
import WelcomeContainer from './WelcomeContainer';
import handleCompanyDomainSubmission from '../actions/welcome/handleCompanyDomainSubmission';

const WelcomePage = () => {
  return (
    <WelcomeContainer
      formAction={handleCompanyDomainSubmission}
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
