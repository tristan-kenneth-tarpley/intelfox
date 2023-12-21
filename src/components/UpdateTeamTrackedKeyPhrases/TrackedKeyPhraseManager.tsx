'use client';

import _ from 'lodash';

import { TrackedKeyPhrases } from '@prisma/client/edge';
import { useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { KeyPhraseTraits } from '@/lib/logic/keyPhrases/constants';
import VStack from '../ui/stack/VStack';
import HStack from '../ui/stack/HStack';
import Text from '../ui/Text';
import Button from '../ui/Button';
import FormStatusWrapper from '../FormStatusWrapper';
import CheckboxContainer from '../ui/CheckboxContainer';
import Checkbox from '../ui/Checkbox';
import Label from '../ui/Label';

const TrackedKeyPhraseManager = ({
  keyPhrases: originalKeyPhrases,
}: {
  keyPhrases: Omit<TrackedKeyPhrases, 'phraseEmbeddings'>[];
}) => {
  const [keyPhrases, setKeyPhrases] = useState(originalKeyPhrases);

  const hasUnsavedChanges = useMemo(() => {
    return !_.isEqual(originalKeyPhrases, keyPhrases);
  }, [originalKeyPhrases, keyPhrases]);

  // const handleAddKeyPhrase = () => {
  //   setKeyPhrases([
  //     ...keyPhrases,
  //     {
  //       id: `change-me${Math.random()}`,
  //       phrase: '',
  //     },
  //   ]);
  // };

  return (
    <form action={undefined}>
      <div className="mb-4">
        <Button variant="outline">Add key phrase</Button>
      </div>
      <VStack>
        {keyPhrases.map(({ phrase, id, traits }) => (
          <HStack key={id} className="w-full" align="start" justify='between'>
            <VStack space={2} align="start">
              <Text>{phrase}</Text>
              <div>
                {Object.values(KeyPhraseTraits).map((trait) => (
                  <CheckboxContainer key={trait}>
                    <Checkbox
                      id={trait}
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
            <Button size="sm" variant="danger">
              <XMarkIcon className="w-4 h-4" />
            </Button>
          </HStack>
        ))}
      </VStack>
      <div className="mt-4">
        <FormStatusWrapper>
          {({ pending }) => (
            <Button
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
