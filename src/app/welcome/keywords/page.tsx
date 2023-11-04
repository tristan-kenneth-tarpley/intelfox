'use client';

import Button from '@/components/ui/Button';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import Checkbox from '@/components/ui/Checkbox';
import { useState } from 'react';
import { routes } from '@/app/routes';
import WelcomeContainer from '../WelcomeContainer';

const KeywordSelectionPage = () => {
  const [foo, setFoo] = useState(false);

  return (
    <WelcomeContainer
      activeName='Keywords'
      heading="Pick some keywords"
      subheading="We will monitor these keywords for you around the internet and include relevant conversations in your IntelFox feed."
      actions={[
        <Button key="back" href={routes.welcomeAbout()} variant='secondary'><ChevronLeftIcon className="h-5 w-5" /></Button>,
        <Button key="continue">Continue</Button>,
      ]}
    >
      <div className="flex items-center space-x-2">
        <Checkbox describedBy='bar' onChange={() => setFoo(!foo)} checked={foo} name="foo" />
        <label className="text-sm text-zinc-200" htmlFor="foo" id="bar">Digital signage</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox describedBy='bar' onChange={() => setFoo(!foo)} checked={foo} name="foo" />
        <label className="text-sm text-zinc-200" htmlFor="foo" id="bar">Digital signage</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox describedBy='bar' onChange={() => setFoo(!foo)} checked={foo} name="foo" />
        <label className="text-sm text-zinc-200" htmlFor="foo" id="bar">Digital signage</label>
      </div>
    </WelcomeContainer>

  );
};

export default KeywordSelectionPage;
