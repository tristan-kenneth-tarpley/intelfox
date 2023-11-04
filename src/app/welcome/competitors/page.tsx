'use client';

import Button from '@/components/ui/Button';
import { routes } from '@/app/routes';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import Checkbox from '@/components/ui/Checkbox';
import InputField from '@/components/ui/Input';
import FormGroup from '@/components/ui/FormGroup';
import WelcomeContainer from '../WelcomeContainer';

// - hit Spyfu API to get keywords and competitor domains
const CompetitorsPage = () => {
  return (
    <WelcomeContainer
      formAction={() => undefined}
      activeName="Pick competitors"
      heading="Who are your competitors?"
      subheading="We will monitor these competitors for you around the internet and include relevant conversations in your IntelFox feed."
      actions={[
        <Button key="back" href={routes.welcomeKeywords()} variant="secondary">
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>,
        <Button key="continue">Continue</Button>,
      ]}
    >
      <div className="flex items-center space-x-2">
        <Checkbox describedBy='bar' onChange={() => undefined} checked={false} name="foo" />
        <label className="text-sm text-zinc-200" htmlFor="foo" id="bar">Select all</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox describedBy='bar' onChange={() => undefined} checked={false} name="foo" />
        <label className="text-sm text-zinc-200" htmlFor="foo" id="bar">screencloud.com</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox describedBy='bar' onChange={() => undefined} checked={false} name="foo" />
        <label className="text-sm text-zinc-200" htmlFor="foo" id="bar">yodeck.com</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox describedBy='bar' onChange={() => undefined} checked={false} name="foo" />
        <label className="text-sm text-zinc-200" htmlFor="foo" id="bar">fugo.ai</label>
      </div>
      <div className="pt-2">
        <FormGroup label="Choose some competitors not listed">
          <InputField textArea className="w-full" value="hi" onChange={() => undefined} />
        </FormGroup>
      </div>
    </WelcomeContainer>
  );
};

export default CompetitorsPage;
