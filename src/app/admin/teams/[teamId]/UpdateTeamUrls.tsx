'use client';

import _ from 'lodash';
import Button from '@/components/ui/Button';
import { Teams, URLType } from '@prisma/client/edge';
import { useMemo, useState } from 'react';
import FormGroup from '@/components/ui/FormGroup';
import VStack from '@/components/ui/stack/VStack';
import InputField from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import HStack from '@/components/ui/stack/HStack';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useFormState } from 'react-dom';
import handleTeamURLsUpdate from '@/app/actions/admin/handleTeamURLsUpdate';
import FormStatusWrapper from '@/components/FormStatusWrapper';
import CalloutSection from '@/components/ui/CalloutSection';
import { allUrlTypes } from '@/lib/logic/teams/teamConstants';

const UpdateTeamUrls = ({ team }: { team: Teams }) => {
  const [state, formAction] = useFormState(handleTeamURLsUpdate, { teamId: team.id });

  const [teamUrls, setTeamUrls] = useState(team.urls);
  const currentURLTypes = teamUrls.map((url) => url.type);
  const remainingTypes = _.difference(allUrlTypes, currentURLTypes);

  const handleURLRemoval = (type: URLType) => {
    setTeamUrls(teamUrls.filter((url) => url.type !== type));
  };

  const hasUnsavedChanges = useMemo(() => {
    return !_.isEqual(team.urls, teamUrls);
  }, [team.urls, teamUrls]);

  return (
    <form action={formAction}>
      {state.message && <CalloutSection header='URLs updated' message={state.message} />}
      <VStack align='start' space={4}>
        <VStack align="start" className="w-full">
          <Button
            type="button"
            onClick={() => setTeamUrls([...teamUrls, { type: remainingTypes[0], url: '' }])}
            disabled={remainingTypes.length === 0}
            variant="outline"
          >
            Add URL
          </Button>
          {teamUrls.map((url) => (
            <HStack key={url.type} align="start" justify="between" className="w-full">
              <VStack className="pl-4 border-l border-l-zinc-700" space={1}>
                <FormGroup label="URL" className='m-0'>
                  <InputField
                    name={url.type}
                    value={url.url}
                    onChange={(e) => {
                      setTeamUrls(teamUrls.map((x) => {
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
                  />
                </FormGroup>
              </VStack>
              <Button onClick={() => handleURLRemoval(url.type)} variant="danger">
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </HStack>
          ))}
        </VStack>

        <FormStatusWrapper>
          {({ pending }) => (
            <Button
              loading={pending}
              disabled={!hasUnsavedChanges || !teamUrls.every((url) => url.url)}
            >
              Save changes
            </Button>
          )}
        </FormStatusWrapper>
      </VStack>
    </form>
  );
};

export default UpdateTeamUrls;
