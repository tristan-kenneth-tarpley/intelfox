'use client';

import handleTeamUpdate from '@/app/actions/admin/handleTeamUpdate';
import Button from '@/components/ui/Button';
import CalloutSection from '@/components/ui/CalloutSection';
import FormGroup from '@/components/ui/FormGroup';
import InputField from '@/components/ui/Input';
import VStack from '@/components/ui/stack/VStack';
import { Teams } from '@prisma/client/edge';
import { useFormState } from 'react-dom';

const fields: {
  label: string;
  value: keyof Teams;
  type?: 'text' | 'url';
  textArea?: boolean;
}[] = [
  {
    label: 'Team name',
    value: 'name',
  },
  {
    label: 'Team description',
    value: 'description',
    textArea: true,
  },
  {
    label: 'Team primary domain',
    value: 'primaryDomain',
    type: 'url',
  },
];

const UpdateTeamForm = ({ team }: { team: Teams }) => {
  const [state, formAction] = useFormState(handleTeamUpdate, { teamId: team.id });
  return (
    <form className="w-full" action={formAction}>
      {state.message && <CalloutSection header="Form submitted" message={state.message} theme={state.message === 'team updated!' ? 'success' : 'warning'} />}
      <VStack space={2}>
        {fields.map((field) => (
          <FormGroup className="w-full" label={field.label} key={field.value}>
            <InputField
              textArea={field.textArea}
              defaultValue={team[field.value]?.toString() ?? undefined}
              className="w-full"
              type={field.type ?? 'text'}
              name={field.value}
            />
          </FormGroup>
        ))}
      </VStack>
      <Button className="ml-auto mt-4">Save changes</Button>
    </form>
  );
};

export default UpdateTeamForm;
