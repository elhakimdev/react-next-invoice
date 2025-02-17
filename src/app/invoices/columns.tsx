'use client';

import * as React from 'react';

import TriStateCheckbox, {
  CheckboxState,
} from 'src/components/others/tri-state-checkbox';

import { Badge } from 'src/components/others/badge-status';
import { ColumnDef } from '@tanstack/react-table';
import { Invoice } from 'src/lib/database/connection';
import { formatDate } from 'src/utils/formatters/date-formatter';

export const InvoiceColumns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const totalRows = table.getFilteredRowModel().rows.length;
      const selectedCount = selectedRows.length;

      // Determine the checkbox state
      const state: CheckboxState =
        selectedCount === totalRows
          ? 'checked'
          : selectedCount > 0
          ? 'indeterminate'
          : 'unchecked';

      const handleSelectAll = (newState: CheckboxState) => {
        if (newState === 'checked') {
          table.toggleAllRowsSelected(true);
        } else {
          table.toggleAllRowsSelected(false);
        }
      };

      return (
        <TriStateCheckbox
          indeterminated={true}
          state={state}
          onChange={(state) => {
            handleSelectAll(state);
          }}
        />
      );
    },
    
    cell: ({ row }) => {
      return (
        <TriStateCheckbox
          indeterminated={false}
          state={row.getIsSelected() ? 'checked' : 'unchecked'}
          onChange={() => row.toggleSelected()}
        />
      );
    },
  },
  {
    id: 'index',
    header: '#',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const index = pageIndex * pageSize + row.index + 1;
      return <span className="font-semibold text-gray-700">{index}</span>;
    },
    enableSorting: false, // Disable sorting for the index
    enableGlobalFilter: false, // Exclude from global search
  },
  {
    accessorKey: 'number',
    header: 'Invoice Number',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">
            {row.original.name}
          </span>
          <span className="font-normal text-gray-500 text-xs">
            {row.original.number}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Due Date',
    cell: ({ row }) => {
      return (
        <span className="font-semibold text-gray-700">
          {formatDate(row.original.date)}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <Badge status={row.original.status} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const filterVal = filterValue.toLowerCase();
      const statusVal = String(row.getValue(columnId)).toLowerCase();
      if(filterVal === '') return ['pending', 'paid', 'unpaid'].includes(statusVal);
      return statusVal === filterVal;
    }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      return (
        <span className="font-semibold text-gray-700">
          {row.original.amount}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
  },
];
