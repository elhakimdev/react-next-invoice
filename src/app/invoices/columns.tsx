'use client'

import * as React from 'react';

import{ Badge } from "src/components/others/badge-status";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "src/lib/database/connection";
import { formatDate } from 'src/utils/formatters/date-formatter';

export const InvoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "number",
    header: "Invoice Number",
    cell: ({row}) => {
      return (
        <div className='flex flex-col'>
          <span className='font-semibold text-gray-700'>{row.original.name}</span>
          <span className='font-normal text-gray-500 text-xs'>{row.original.number}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "date",
    header: "Due Date",
    cell: ({row}) => {
      return <span className='font-semibold text-gray-700'>{formatDate(row.original.date)}</span>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => {
      return <Badge status={row.original.status}/>
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({row}) => {
      return <span className='font-semibold text-gray-700'>{row.original.amount}</span>
    }
  },
  {
    id: "actions",
    header: "Actions",
  },
]