'use client';

import { useFormState } from 'react-dom';
import InputField from '@/components/ui/Input';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import CalloutSection from '@/components/ui/CalloutSection';
import VStack from '@/components/ui/stack/VStack';
import HStack from '@/components/ui/stack/HStack';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import handleTeamSearchSubmission from '../actions/admin/handleTeamSearchSubmission';

const TeamSearchForm = () => {
  const [query, setQuery] = useState('');
  const [state, formAction] = useFormState(handleTeamSearchSubmission, {});

  return (
    <form className="w-full" action={formAction}>
      <VStack space={1} align="center">
        <HStack space={1} className="w-full">
          <InputField
            placeholder='Search for a team'
            className="w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)} name="query"
          />
          <FormStatusWrapper>
            {({ pending }) => (
              <Button loading={pending} type="submit">Search</Button>
            )}
          </FormStatusWrapper>
        </HStack>
        {state.message && <CalloutSection header="There were issues with the form" message={state.message} />}
      </VStack>
    </form>
  );
};

export default TeamSearchForm;
