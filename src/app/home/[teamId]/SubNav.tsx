'use client';

import FormGroup from '@/components/ui/FormGroup';
import Select from '@/components/ui/Select';
import HStack from '@/components/ui/stack/HStack';
import { Competitors, Teams } from '@prisma/client/edge';
import { useMemo } from 'react';

const SubNav = ({ competitors, team }: {
  competitors: Competitors[],
  team: Teams,
}) => {
  const teamOption = useMemo(() => ({
    id: team.id,
    name: team.name,
  }), [team.id, team.name]);

  return (
    <div className="flex">
      <HStack>
        <FormGroup label="Select report">
          <Select
            onChange={() => undefined}
            selected={teamOption}
            options={[teamOption, ...competitors.map(({ id, name }) => ({
              id,
              name,
            }))]}
          />
        </FormGroup>
        <FormGroup label="Select time period">
          <Select
            onChange={() => undefined}
            selected={undefined}
            options={[{
              id: '1',
              name: 'Last 7 days',
            }, {
              id: '2',
              name: 'Last 30 days',
            }, {
              id: '3',
              name: 'Last 90 days',
            }]}
          />
        </FormGroup>
      </HStack>
    </div>
  );
};

export default SubNav;
