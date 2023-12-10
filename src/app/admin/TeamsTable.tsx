'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { useRouter } from 'next/navigation';
import { routes } from '../routes';

export const columns: ColumnDef<Teams>[] = [
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'clerkOrgId',
    header: 'clerkOrgId',
  },
  {
    accessorKey: 'primaryDomain',
    header: 'primaryDomain',
  },
  {
    accessorKey: 'name',
    header: 'name',
  },
  {
    accessorKey: 'description',
    header: 'description',
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
];

const TeamsTable = ({ teams }: { teams: Teams[] }) => {
  const router = useRouter();
  const table = useReactTable({
    data: teams,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
                onClick={() => router.push(routes.teamAdminPage({ teamId: row.getValue('id') }))}
                className="cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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