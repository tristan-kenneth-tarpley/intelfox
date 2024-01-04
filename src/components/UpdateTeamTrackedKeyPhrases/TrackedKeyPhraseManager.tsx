'use client';

import _ from 'lodash';

import { Teams, TrackedKeyPhrases } from '@prisma/client/edge';
import { useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { KeyPhraseTraits } from '@/lib/logic/keyPhrases/constants';
import { useFormState } from 'react-dom';
import handleKeyPhraseSubmission from '@/app/actions/handleKeyPhraseSubmission';
import VStack from '../ui/stack/VStack';
import HStack from '../ui/stack/HStack';
import Button from '../ui/Button';
import FormStatusWrapper from '../FormStatusWrapper';
import CheckboxContainer from '../ui/CheckboxContainer';
import Checkbox from '../ui/Checkbox';
import Label from '../ui/Label';
import InputField from '../ui/Input';
import ToastOnFormCompletion from '../ui/ToastOnFormCompletion';

const TrackedKeyPhraseManager = ({
  keyPhrases: originalKeyPhrases,
  team,
}: {
  keyPhrases: Omit<TrackedKeyPhrases, 'phraseEmbeddings' | 'createdAt' | 'updatedAt'>[];
  team: Teams;
}) => {
  const [formState, formAction] = useFormState(handleKeyPhraseSubmission, { teamId: team.id });
  const [keyPhrases, setKeyPhrases] = useState(originalKeyPhrases);

  const hasUnsavedChanges = useMemo(() => {
    return !_.isEqual(originalKeyPhrases, keyPhrases);
  }, [originalKeyPhrases, keyPhrases]);

  const handleAddKeyPhrase = () => {
    setKeyPhrases([
      ...keyPhrases,
      {
        id: `change-me-${Math.random()}`,
        phrase: '',
        traits: [],
        teamId: team.id,
      },
    ]);
  };

  return (
    <form action={formAction}>
      <div className="mb-4">
        <Button
          onClick={handleAddKeyPhrase}
          variant="outline"
          type="button"
        >
          Add key phrase
        </Button>
      </div>
      <ToastOnFormCompletion title="Key phrases submitted" message={formState.message} />
      <VStack>
        {keyPhrases.map(({ phrase, id, traits }) => (
          <HStack key={id} className="w-full" align="start" justify='between'>
            <VStack space={2} align="start">
              <InputField
                placeholder='key phrase'
                value={phrase}
              />
              <div>
                {Object.values(KeyPhraseTraits).map((trait) => (
                  <CheckboxContainer key={trait}>
                    <Checkbox
                      id={`${id}-${trait}`}
                      name={trait}
                      defaultChecked={traits?.includes(trait)}
                    />
                    <Label htmlFor={trait}>
                      {trait.toLowerCase()}
                    </Label>
                  </CheckboxContainer>
                ))}
              </div>
            </VStack>
            <Button type="button" size="sm" variant="danger">
              <XMarkIcon className="w-4 h-4" />
            </Button>
          </HStack>
        ))}
      </VStack>
      <div className="mt-4">
        <FormStatusWrapper>
          {({ pending }) => (
            <Button
              type="submit"
              loading={pending}
              disabled={!hasUnsavedChanges}
            >
              Save changes
            </Button>
          )}
        </FormStatusWrapper>
      </div>
    </form>
  );
};

export default TrackedKeyPhraseManager;
