'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Competitors, Teams } from '@prisma/client/edge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import VStack from '@/components/ui/stack/VStack';
import { routes } from '../routes';
import NewCompetitorPopoverForm from './NewCompetitorPopoverForm';

export const columns: ColumnDef<Competitors>[] = [
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'domain',
    header: 'domain',
  },
  {
    accessorKey: 'name',
    header: 'name',
  },
  {
    accessorKey: 'description',
    header: 'description',
  },
];

const CompetitorsTable = ({ competitors, team }: { competitors: Competitors[]; team: Teams }) => {
  const router = useRouter();
  const table = useReactTable({
    data: competitors,
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
                onClick={() => router.push(routes.teamCompetitorPage({ competitorId: row.getValue('id') }))}
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
                <VStack className="mx-auto"><span>No competitors.</span> <NewCompetitorPopoverForm team={team} /></VStack>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompetitorsTable;
