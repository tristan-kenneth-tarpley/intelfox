'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';

import { Teams } from '@prisma/client/edge';
import { CompetitorAPIResponse } from '@/lib/services/spyfu/spyfuService';
import Button from '@/components/ui/Button';
import { routes } from '@/app/routes';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import CheckboxContainer from '@/components/ui/CheckboxContainer';
import Checkbox from '@/components/ui/Checkbox';
import Label from '@/components/ui/Label';
import FormGroup from '@/components/ui/FormGroup';
import InputField from '@/components/ui/Input';
import WarningAlert from '@/components/ui/WarningAlert';
import handleCompetitorsPageSubmission from '@/app/actions/welcome/handleCompetitorsPageSubmission';
import getHostnameFromDomain from '@/utils/getHostnameFromDomain';
import WelcomeContainer from '../WelcomeContainer';

const CompetitorsPageClient = ({
  team,
  competitors,
  trackedCompetitorDomains,
}: {
  team: Teams,
  competitors: CompetitorAPIResponse['results'],
  trackedCompetitorDomains: string[];
}) => {
  const [customCompetitors, setCustomCompetitors] = useState('');
  const [state, formAction] = useFormState(handleCompetitorsPageSubmission, {
    team,
  });

  const trackedCompetitorsSet = new Set(trackedCompetitorDomains);

  return (
    <WelcomeContainer
      formAction={formAction}
      activeName="Pick competitors"
      heading="Who are your competitors?"
      subheading="We will monitor these competitors for you around the internet and include relevant conversations in your IntelFox feed."
      actions={[
        <FormStatusWrapper key="back">
          {({ pending }) => (
            <Button disabled={pending} href={routes.welcomeAbout({ t: team.id })} variant="secondary">
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
          )}
        </FormStatusWrapper>,
        <FormStatusWrapper key="continue">
          {({ pending }) => (
            <Button loading={pending}>Continue</Button>
          )}
        </FormStatusWrapper>,
      ]}
    >
      {state.message && (
        <WarningAlert header="There were issues with the form" message={state.message} />
      )}
      <div className="grid grid-cols-2 gap-y-2">
        {competitors
          .filter((competitor) => competitor.domain !== getHostnameFromDomain(team.primaryDomain))
          .slice(0, 20)
          .map((competitor) => {
            const id = `int_comp_${competitor.domain}`;
            return (
            <CheckboxContainer key={competitor.domain}>
              <Checkbox
                id={id}
                name={id}
                defaultChecked={trackedCompetitorsSet.has(competitor.domain)}
              />
              <Label htmlFor={id}>
                {competitor.domain}
              </Label>
            </CheckboxContainer>
            );
          })}
      </div>
      <div>
        <FormGroup label="Enter more competitor URLs, separated by a comma." subLabel="This will be included in addition to the key phrases selected above.">
          <InputField
            textArea
            className="w-full"
            value={customCompetitors}
            onChange={(e) => setCustomCompetitors(e.target.value)}
            name="custom_competitors"
          />
        </FormGroup>
      </div>
    </WelcomeContainer>
  );
};

export default CompetitorsPageClient;
