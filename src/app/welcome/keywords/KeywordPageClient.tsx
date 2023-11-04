'use client';

import { Teams } from '@prisma/client';
import { useFormState } from 'react-dom';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { routes } from '@/app/routes';
import { PPCKeywordAPIResponse, SEOKeywordsForDomainResponse } from '@/lib/services/spyfu/spyfuService';
import handleKeywordPageSubmission from '@/app/actions/welcome/handleKeywordPageSubmission';
import InputField from '@/components/ui/Input';
import FormGroup from '@/components/ui/FormGroup';
import WelcomeContainer from '../WelcomeContainer';

const KeywordPageClient = ({
  team,
  ppcKeywords,
  seoKeywords,
}: {
  team: Teams,
  ppcKeywords: PPCKeywordAPIResponse,
  seoKeywords: SEOKeywordsForDomainResponse,
}) => {
  const [foo, setFoo] = useState(false);
  const [state, formAction] = useFormState(handleKeywordPageSubmission, {
    team,
  });

  const prioritizedKeywords = ppcKeywords.results.map(({ keyword }) => keyword); // todo update logic

  console.log(ppcKeywords, seoKeywords);

  return (
    <WelcomeContainer
      formAction={formAction}
      activeName='Keywords'
      heading="Pick some keywords"
      subheading="We will monitor these keywords for you around the internet and include relevant conversations in your IntelFox feed."
      actions={[
        <Button key="back" href={routes.welcomeAbout({ t: 'hi' })} variant='secondary'><ChevronLeftIcon className="h-5 w-5" /></Button>,
        <Button key="continue">Continue</Button>,
      ]}
    >
      {prioritizedKeywords.map((keyword) => {
        const id = `int_kw_${keyword}`;
        return (
          <div key={keyword} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              name={id}
            />
            <label className="text-sm text-zinc-200" htmlFor={id}>
              {keyword}
            </label>
          </div>
        );
      })}
      <div>
        <FormGroup label="Or add your own keywords, separated by a comma." subLabel="This will be included in addition to the keywords selected above.">
          <InputField
            textArea
            className="w-full"
            value=""
            placeholder="E.g. shoes, sneakers"
            onChange={() => undefined} name="custom_keywords"
          />
        </FormGroup>
      </div>
    </WelcomeContainer>

  );
};

export default KeywordPageClient;
