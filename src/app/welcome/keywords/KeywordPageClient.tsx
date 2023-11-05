'use client';

import { Teams, TrackedKeyPhrases } from '@prisma/client';
import { useFormState } from 'react-dom';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { routes } from '@/app/routes';
import { PPCKeywordAPIResponse, SEOKeywordsForDomainResponse } from '@/lib/services/spyfu/spyfuService';
import handleKeywordPageSubmission from '@/app/actions/welcome/handleKeywordPageSubmission';
import InputField from '@/components/ui/Input';
import FormGroup from '@/components/ui/FormGroup';
import { useMemo, useState } from 'react';
import WarningAlert from '@/components/ui/WarningAlert';
import truncateDomain from '@/utils/truncateDomain';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import Label from '@/components/ui/Label';
import CheckboxContainer from '@/components/ui/CheckboxContainer';
import WelcomeContainer from '../WelcomeContainer';

// TODO - Use team 1-liner as a key phrase
const KeywordPageClient = ({
  team,
  ppcKeywords,
  seoKeywords,
  trackedKeyPhrases,
}: {
  team: Teams,
  ppcKeywords: PPCKeywordAPIResponse,
  seoKeywords: SEOKeywordsForDomainResponse,
  trackedKeyPhrases: Omit<TrackedKeyPhrases, 'phraseEmbeddings'>[]
}) => {
  const [customKeywords, setCustomKeywords] = useState('');
  const [state, formAction] = useFormState(handleKeywordPageSubmission, {
    team,
    message: undefined,
  });

  const trackedKeyPhrasesSet = useMemo(
    () => {
      return new Set(trackedKeyPhrases.map(({ phrase }) => phrase));
    },
    [trackedKeyPhrases],
  );

  const truncatedDomain = truncateDomain(team.primaryDomain);
  // arbitrary logic... Basically, if a user spends money on PPC, their keywords _should_ be more relevant
  // but we can use seo keywords as a backfill
  const prioritizedKeywords = useMemo(() => {
    return (ppcKeywords.resultCount > 2
      ? ppcKeywords.results.map(({ keyword }) => keyword)
      : seoKeywords.results.map(({ keyword }) => keyword)).filter((keyword) => keyword !== truncatedDomain);
  }, [
    ppcKeywords.resultCount,
    ppcKeywords.results,
    seoKeywords.results,
    truncatedDomain,
  ]);

  return (
    <WelcomeContainer
      formAction={formAction}
      activeName='Key phrases'
      heading="Pick some keywords"
      subheading="We will monitor these key phrases for you around the internet and include relevant conversations in your IntelFox feed."
      actions={[
        <FormStatusWrapper key="back">
          {({ pending }) => (
            <Button
              disabled={pending}
              href={routes.welcomeAbout({ t: team.id })}
              variant='secondary'
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
          )}
        </FormStatusWrapper>,
        <FormStatusWrapper key="continue">
          {({ pending }) => (
            <Button loading={pending} type="submit">Continue</Button>
          )}
        </FormStatusWrapper>,
      ]}
    >
      {state.message && (
        <WarningAlert header="There were issues with the form" message={state.message} />
      )}
      <CheckboxContainer>
        <Checkbox
          id={`int_kw_${truncatedDomain}`}
          name={`int_kw_${truncatedDomain}`}
          defaultChecked={trackedKeyPhrasesSet.size === 0}
        />
        <Label htmlFor={`int_kw_${truncatedDomain}`}>
          {truncatedDomain}
        </Label>
      </CheckboxContainer>
      {prioritizedKeywords.map((keyword) => {
        const id = `int_kw_${keyword}`;
        return (
          <CheckboxContainer key={keyword}>
            <Checkbox
              id={id}
              name={id}
              defaultChecked={trackedKeyPhrasesSet.has(keyword)}
            />
            <Label htmlFor={id}>
              {keyword}
            </Label>
          </CheckboxContainer>
        );
      })}
      <div>
        <FormGroup label="Or add your own key phrases, separated by a comma." subLabel="This will be included in addition to the key phrases selected above.">
          <InputField
            textArea
            className="w-full"
            value={customKeywords}
            onChange={(e) => setCustomKeywords(e.target.value)}
            placeholder="E.g. shoes, sneakers"
            name="custom_keywords"
          />
        </FormGroup>
      </div>
    </WelcomeContainer>

  );
};

export default KeywordPageClient;
