'use client';

import _ from 'lodash';
import { TeamURLs, URLType } from '@prisma/client/edge';
import { useMemo, useState } from 'react';
import { allUrlTypes } from '@/lib/logic/teams/teamConstants';
import { XMarkIcon } from '@heroicons/react/20/solid';
import CalloutSection from './ui/CalloutSection';
import VStack from './ui/stack/VStack';
import Button from './ui/Button';
import HStack from './ui/stack/HStack';
import FormGroup from './ui/FormGroup';
import InputField from './ui/Input';
import Select from './ui/Select';
import FormStatusWrapper from './FormStatusWrapper';

const UpdateURLs = ({
  message,
  urls: initialUrls,
  action,
}: {
  urls: TeamURLs[];
  message?: string;
  action: (payload: FormData) => void,
}) => {
  const [urls, setURLs] = useState(initialUrls);
  const currentURLTypes = urls.map((url) => url.type);
  const remainingTypes = _.difference(allUrlTypes, currentURLTypes);

  const handleURLRemoval = (type: URLType) => {
    setURLs(urls.filter((url) => url.type !== type));
  };

  const hasUnsavedChanges = useMemo(() => {
    return !_.isEqual(initialUrls, urls);
  }, [initialUrls, urls]);

  return (
    <form action={action}>
      {message && <CalloutSection header='URLs updated' message={message} />}
      <VStack align='start' space={4}>
        <VStack align="start" className="w-full">
          <Button
            type="button"
            onClick={() => setURLs([...urls, { type: remainingTypes[0], url: '' }])}
            disabled={remainingTypes.length === 0}
            variant="outline"
          >
            Add URL
          </Button>
          {urls.map((url) => (
            <HStack key={url.type} align="start" justify="between" className="w-full">
              <VStack className="pl-4 border-l border-l-zinc-700" space={1}>
                <FormGroup label="URL" className='m-0'>
                  <InputField
                    name={url.type}
                    value={url.url}
                    onChange={(e) => {
                      setURLs(urls.map((x) => {
                        if (x.type === e.target.name) {
                          return {
                            ...x,
                            url: e.target.value,
                          };
                        }
                        return x;
                      }));
                    }}
                  />
                </FormGroup>
                <FormGroup className="my-0" label="URL type">
                  <Select
                    selected={{ name: url.type, id: url.type }}
                    options={allUrlTypes.map((type) => ({ name: type, id: type }))}
                    onChange={(e) => {
                      setURLs(urls.map((x) => {
                        if (x.type === url.type) {
                          return {
                            ...x,
                            type: e as URLType,
                          };
                        }
                        return x;
                      }));
                    }}
                  />
                </FormGroup>
              </VStack>
              <Button type="button" onClick={() => handleURLRemoval(url.type)} variant="danger">
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </HStack>
          ))}
        </VStack>

        <FormStatusWrapper>
          {({ pending }) => (
            <Button
              loading={pending}
              disabled={!hasUnsavedChanges || !urls.every((url) => url.url)}
            >
              Save changes
            </Button>
          )}
        </FormStatusWrapper>
      </VStack>
    </form>
  );
};

export default UpdateURLs;
