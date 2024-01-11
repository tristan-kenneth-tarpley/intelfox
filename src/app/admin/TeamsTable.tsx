'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Teams } from '@prisma/client/edge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronUpIcon } from '@radix-ui/react-icons';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import HStack from '@/components/ui/stack/HStack';
import { routes } from '../routes';

const columns: ColumnDef<Teams>[] = [
  {
    accessorKey: 'name',
    header: 'name',
  },
  {
    accessorKey: 'description',
    header: 'description',
    size: 400,
    enableResizing: true,
  },
  {
    accessorKey: 'primaryDomain',
    header: 'primaryDomain',
  },
  {
    accessorKey: 'createdAt',
    header: 'createdAt',
  },
  {
    accessorKey: 'lastSyncedAt',
    header: 'lastSyncedAt',
  },
  {
    accessorKey: 'lastPreppedAt',
    header: 'lastPreppedAt',
  },
  {
    accessorKey: 'lastReportedAt',
    header: 'lastReportedAt',
  },
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'clerkOrgId',
    header: 'clerkOrgId',
  },
];

const TeamsTable = ({ teams }: { teams: Teams[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: teams,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead onClick={header.column.getToggleSortingHandler()} style={{ minWidth: header.column.getSize() }} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (
                      <HStack>
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        {{
                          asc: <ChevronUpIcon className="w-4 h-4" />,
                          desc: <ChevronDownIcon className="w-4 h-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </HStack>
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="cursor-pointer"
              >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell style={{ minWidth: cell.column.getSize() }} key={cell.id}>
                      <Link className='h-full' prefetch={false} href={routes.teamAdminPage({ teamId: row.getValue('id') })}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Link>
                    </TableCell>
                  ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamsTable;
