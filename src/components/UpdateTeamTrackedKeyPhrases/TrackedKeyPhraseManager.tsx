'use client';

import _ from 'lodash';

import { Teams, TrackedKeyPhrases } from '@prisma/client/edge';
import { useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { KeyPhraseTraits } from '@/lib/logic/keyPhrases/constants';
import handleKeyPhraseSubmission from '@/app/actions/handleKeyPhraseSubmission';
import createKeyPhrase from '@/app/actions/createKeyPhrase';
import VStack from '../ui/stack/VStack';
import HStack from '../ui/stack/HStack';
import Button from '../ui/Button';
import FormStatusWrapper from '../FormStatusWrapper';
import CheckboxContainer from '../ui/CheckboxContainer';
import Checkbox from '../ui/Checkbox';
import Label from '../ui/Label';
import InputField from '../ui/Input';
import { useToast } from '../ui/use-toast';
import FormGroup from '../ui/FormGroup';

const TrackedKeyPhraseManager = ({
  keyPhrases: originalKeyPhrases,
  team,
}: {
  keyPhrases: Omit<TrackedKeyPhrases, 'phraseEmbeddings' | 'createdAt' | 'updatedAt'>[];
  team: Teams;
}) => {
  const [isAddingNewKeyPhrase, setIsAddingNewKeyPhrase] = useState(false);
  const [newKeyPhraseLoading, setNewKeyPhraseLoading] = useState(false);
  const [newKeyPhrase, setNewKeyPhrase] = useState('');

  const [keyPhrases, setKeyPhrases] = useState(originalKeyPhrases);

  const hasUnsavedChanges = useMemo(() => {
    return !_.isEqual(originalKeyPhrases, keyPhrases);
  }, [originalKeyPhrases, keyPhrases]);

  const handleAddKeyPhrase = async (phrase: string) => {
    setNewKeyPhraseLoading(true);
    const newKeyPhraseResponse = await createKeyPhrase({ phrase, teamId: team.id });
    console.log('newKeyPhraseResponse', newKeyPhraseResponse);
    setKeyPhrases([
      ...keyPhrases,
      newKeyPhraseResponse,
    ]);
    setNewKeyPhraseLoading(false);
    setIsAddingNewKeyPhrase(false);
    setNewKeyPhrase('');
  };

  const resetNewKeyPhrase = () => {
    setNewKeyPhrase('');
    setIsAddingNewKeyPhrase(false);
  };

  const { toast } = useToast();

  return (
    <form action={async () => {
      const { message } = await handleKeyPhraseSubmission({ teamId: team.id, keyPhrases });
      toast({ description: message, title: 'Key phrases updated' });
    }}>
      {!isAddingNewKeyPhrase && (
        <div className="mb-4">
          <Button
            onClick={() => setIsAddingNewKeyPhrase(true)}
            variant="outline"
            type="button"
            loading={newKeyPhraseLoading}
          >
            Add key phrase
          </Button>
        </div>
      )}
      <VStack>
        {isAddingNewKeyPhrase && (
          <HStack justify='between' className="w-full">
            <FormGroup className='border-b border-zinc-700 pb-4' label="new key phrase">
              <InputField
                value={newKeyPhrase}
                onChange={(e) => setNewKeyPhrase(e.target.value)}
              />
            </FormGroup>
            <HStack>
              <Button
                onClick={resetNewKeyPhrase}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                loading={newKeyPhraseLoading}
                disabled={!newKeyPhrase}
                onClick={() => handleAddKeyPhrase(newKeyPhrase)}
              >
                Save
              </Button>
            </HStack>
          </HStack>
        )}
        {keyPhrases.map(({ phrase, id, traits }) => (
          <HStack key={id} className="w-full" align="start" justify='between'>
            <VStack space={2} align="start">
              <InputField
                placeholder='key phrase'
                value={phrase}
                name={id}
                onChange={(e) => {
                  setKeyPhrases(keyPhrases.map((keyPhrase) => {
                    if (keyPhrase.id === id) {
                      return {
                        ...keyPhrase,
                        phrase: e.target.value,
                      };
                    }

                    return keyPhrase;
                  }));
                }}
              />
              <div>
                {Object.values(KeyPhraseTraits).map((trait) => (
                  <CheckboxContainer key={trait}>
                    <Checkbox
                      id={`${id}-${trait}`}
                      name={`${id}-${trait}`}
                      checked={traits?.includes(trait)}
                      onChange={(e) => {
                        setKeyPhrases(keyPhrases.map((keyPhrase) => {
                          if (keyPhrase.id === id) {
                            return {
                              ...keyPhrase,
                              traits: e.target.checked
                                ? _.uniq([...(keyPhrase.traits ?? []), trait])
                                : keyPhrase.traits?.filter((t) => t !== trait),
                            };
                          }

                          return keyPhrase;
                        }));
                      }}
                    />
                    <Label htmlFor={`${id}-${trait}`}>
                      {trait.toLowerCase()}
                    </Label>
                  </CheckboxContainer>
                ))}
              </div>
            </VStack>
            <Button onClick={() => {
              setKeyPhrases(keyPhrases.filter((keyPhrase) => keyPhrase.id !== id));
            }} type="button" size="sm" variant="danger">
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
