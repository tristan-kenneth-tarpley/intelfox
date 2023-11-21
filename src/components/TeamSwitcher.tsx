'use client';

import { useClerk, useOrganization, useOrganizationList } from '@clerk/nextjs';
import Image from 'next/image';
import { ChevronUpDownIcon, PlusIcon, Cog8ToothIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Teams } from '@prisma/client/edge';
import { routes } from '@/app/routes';

const TeamSwitcher = ({
  team,
}: {
  team: Teams;
}) => {
  const router = useRouter();
  const clerk = useClerk();
  const { userMemberships } = useOrganizationList();
  const org = useOrganization();
  console.log(userMemberships);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-64 p-2 flex items-center space-x-2 hover:bg-zinc-900 rounded-md">
        {org?.organization?.imageUrl ? (
          <div className="rounded-md overflow-hidden">
            <Image src={org?.organization.imageUrl} width="30" height="30" alt="Organization logo" />
          </div>
        ) : null}
        <div className="flex items-center justify-between w-full text-sm">
          <span style={{
            textOverflow: 'ellipsis',
            maxWidth: '170px',
            overflow: 'hidden',
          }}>{org.organization?.name ?? team.name}</span>
          <ChevronUpDownIcon className="h-5 w-5 text-zinc-600" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{team.name}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => clerk.openOrganizationProfile()} className="flex items-center space-x-2">
          <Cog8ToothIcon className="h-4 w-4" />
          <span>Manage team</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {userMemberships?.data?.map(({ organization }) => (
          <DropdownMenuItem
            key={organization.id}
            onClick={() => {
              router.push(routes.teamHome({ teamId: organization.id }));
            }}
            className='flex items-center space-x-2'
          >
            <div>
              {organization.name}
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="font-bold flex items-center space-x-2"
          onClick={() => {
            clerk.openCreateOrganization();
          }}
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create team</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamSwitcher;
