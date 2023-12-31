'use client';

import Button from '@/components/ui/Button';
import FormGroup from '@/components/ui/FormGroup';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Teams } from '@prisma/client/edge';
import { useFormState } from 'react-dom';
import Text from '@/components/ui/Text';
import InputField from '@/components/ui/Input';
import VStack from '@/components/ui/stack/VStack';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import createCompetitorAction from '../actions/admin/createCompetitorAction';

const NewCompetitorPopoverForm = ({ team }: { team: Teams }) => {
  const [state, formAction] = useFormState(createCompetitorAction, { teamId: team.id, admin: true });

  return (
    <Popover>
      <PopoverTrigger>
        <Button as="div">Create competitor</Button>
      </PopoverTrigger>
      <PopoverContent>
        {state.message && <Text>{state.message}</Text>}
        <form action={formAction}>
          <VStack align="start" className="w-full">
            <FormGroup className='w-full' label="Competitor name">
              <InputField name="name" />
            </FormGroup>
            <FormGroup className='w-full' label="Competitor domain">
              <InputField type="url" name="domain" />
            </FormGroup>
            <FormStatusWrapper>
              {({ pending }) => (
                <Button loading={pending}>Save</Button>
              )}
            </FormStatusWrapper>
          </VStack>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default NewCompetitorPopoverForm;
