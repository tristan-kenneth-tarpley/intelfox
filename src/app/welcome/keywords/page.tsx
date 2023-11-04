'use client';

import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import Checkbox from '@/components/ui/Checkbox';
import { useState } from 'react';
import { routes } from '@/app/routes';
import WelcomeBreadcrumb from '../WelcomeBreadcrumb';

const KeywordSelectionPage = () => {
  const [foo, setFoo] = useState(false);
  return (
    <div>
      <WelcomeBreadcrumb activeName="Keywords" />
      <div className="flex flex-col space-y-4">
        <div>
          <Heading level={1} displayAs={3}>Pick some keywords</Heading>
          <Text>We will monitor these keywords for you around the internet and include relevant conversations in your IntelFox feed.</Text>
        </div>
        <div className="w-full flex items-stretch flex-col space-y-2">
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
        </div>
        <div className="justify-end flex space-x-2">
          <Button href={routes.welcome()} variant='secondary'><ChevronLeftIcon className="h-5 w-5" /></Button>
          <Button>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default KeywordSelectionPage;
