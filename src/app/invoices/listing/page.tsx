/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';

import {
  ColumnFiltersState,
  Datatable,
  DatatableRef,
  GlobalFilterTableState,
} from 'src/components/datatable/datatable';
import { FilterFnOption, Row, SortingState } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';

import { AppPageTitle } from 'src/components/app-page-title';
import DatatableShowEntries from 'src/components/datatable/datatable-show-entries';
import DatatableStatusFilter from 'src/components/datatable/datatable-status-filter';
import { Invoice } from 'src/lib/database/connection';
import { InvoiceColumns } from '../columns';
import { filter } from 'framer-motion/client';
import { formatDate } from 'src/utils/formatters/date-formatter';
import { pageSizeOptions } from 'src/constants/page-size-options';

export type ColumnFilterOptions = {
  id: string;
  text: string;
  value: string;
};
export default function ListInvoices() {
  const [data, setData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFiltersOptions, setColumnFiltersOptions] = useState<
    ColumnFilterOptions[]
  >([
    {
      id: 'pending',
      value: 'pending',
      text: 'Pending',
    },
    {
      id: 'paid',
      value: 'paid',
      text: 'Paid',
    },
    {
      id: 'unpaid',
      value: 'unpaid',
      text: 'Unpaid',
    },
    {
      id: 'all',
      value: '',
      text: 'All Status',
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'status',
      value: '',
    },
  ]);

  const datatableRef = useRef<DatatableRef<Invoice>>(null);
  const totalPages = datatableRef.current?.table?.getPageCount();

  useEffect(() => {
    if (!totalPages) return;

    // Jika halaman saat ini lebih besar dari jumlah halaman yang tersedia
    if (pagination.pageIndex >= totalPages) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: Math.max(totalPages - 1, 0), // Pastikan halaman minimal adalah 0
      }));
    }
  }, [pagination.pageSize, totalPages, pagination.pageIndex]);

  const globalFilterFn: FilterFnOption<Invoice> = (
    row,
    columnId,
    filterValue
  ) => {
    switch (columnId) {
      case 'amount':
        return normalizeAmountFilter(row, filterValue);
      case 'date':
        return normalizeDateFilter(row, filterValue);
      case 'number':
        return normalizeInvoiceNumberFilter(row, filterValue);

      default:
        return false;
    }
  };

  const normalizeAmountFilter = (row: Row<Invoice>, filterValue: string) => {
    // Normalize the filter value by removing non-numeric characters (including currency symbols and formatting)
    const normalizedFilterValue = filterValue.replace(/[^0-9]/g, '');

    // Normalize the amount value by removing non-numeric characters
    const normalizedAmountValue = row.original.amount
      .toString()
      .replace(/[^0-9]/g, '');

    // Check if the normalized amount value includes the normalized filter value
    return normalizedAmountValue.includes(normalizedFilterValue);
  };

  const normalizeDateFilter = (row: Row<Invoice>, filterValue: string) => {
    const normalizedFilterValue = filterValue.toLowerCase();

    // Format the row date to get components (day, month, year)
    const rowDateFormatted = formatDate(row.original.date); // Assume this gives 'February 18, 2025'

    // Extract the month, day, and year from the formatted date
    const dateParts = {
      day: rowDateFormatted.split(' ')[1], // '18' from 'February 18, 2025'
      month: rowDateFormatted.split(' ')[0].toLowerCase(), // 'february' from 'February 18, 2025'
      year: rowDateFormatted.split(' ')[2], // '2025' from 'February 18, 2025'
    };

    // Normalize the date parts (to lowercase) for easier comparison
    const { day, month, year } = dateParts;

    // Check if the filter value matches any of the date components
    if (
      day.includes(normalizedFilterValue) ||
      month.includes(normalizedFilterValue) ||
      year.includes(normalizedFilterValue)
    ) {
      return true;
    }

    // If no match, return false
    return false;
  };

  const normalizeInvoiceNumberFilter = (
    row: Row<Invoice>,
    filterValue: string
  ) => {
    const { name, number } = row.original;

    // Normalize the filterValue and the row data to lowercase for case-insensitive matching
    const normalizedFilterValue = filterValue.trim().toLowerCase();
    const normalizedName = name.toLowerCase();
    const normalizedNumber = number.toLowerCase();
  
    // Check if either the name or number contains the filter value
    const match = normalizedName.includes(normalizedFilterValue) || normalizedNumber.includes(normalizedFilterValue);
  
    return match;
  };

  useEffect(() => {
    fetch('/api/invoices')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch(() => {
        // todo
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex flex-row justify-between items-center">
            <h1 className="flex-none items-start text-[#1C2434] text-[26px] font-bold">
              Invoices
            </h1>
            <div className="flex flex-row gap-x-4 items-center">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    value={globalFilter}
                    onChange={(e) => {
                      setGlobalFilter(e.target.value);
                    }}
                    id="default-search"
                    className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search Date, Status, Invoice...."
                    required
                  />
                </div>
              </div>

              {/* Select perpage */}
              <div className="">
                <DatatableStatusFilter
                  entries={[...columnFiltersOptions]}
                  value={''}
                  defaultValue={''}
                  onValueChange={(value) => {
                    setColumnFilters([
                      {
                        id: 'status',
                        value: value,
                      },
                    ]);
                  }}
                />
              </div>

              {/* Select perpage */}
              <div className="">
                <DatatableShowEntries
                  entries={[...pageSizeOptions]}
                  value={5}
                  defaultValue={5}
                  onValueChange={(value) => {
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: Number(value),
                      pageIndex: 0, // Reset to the first page when changing page size
                    }));
                  }}
                />
              </div>
            </div>
          </div>

          {/* Datatable */}
          <Datatable
            ref={datatableRef}
            data={data}
            columns={InvoiceColumns}
            sorting={sorting}
            pagination={pagination}
            columnFilters={columnFilters}
            globalFilter={globalFilter}
            globalFilterFn={globalFilterFn}
            setSorting={setSorting}
            setPagination={setPagination}
            setColumnFilters={setColumnFilters}
            setGlobalFilter={setGlobalFilter}
            onRowSelectionChange={(invoices) => {
              setSelectedInvoices([...invoices]);
            }}
          />
        </div>
      )}
    </div>
  );
}

const Loading = () => {
  return (
    <div className="bg-white w-[1000px] min-h-[500px] max-h-[500px] relative overflow-x-auto overflow-y-scroll sm:rounded-lg rounded-md shadow-md border-gray-200 border flex flex-col items-center justify-center">
      <div role="status">
        <svg
          aria-hidden="true"
          className="inline w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
