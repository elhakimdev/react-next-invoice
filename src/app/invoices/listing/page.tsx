/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';

import { ColumnFiltersState, Datatable, DatatableRef } from 'src/components/datatable/datatable';
import { useEffect, useRef, useState } from 'react';

import { AppPageTitle } from 'src/components/app-page-title';
import DatatableShowEntries from 'src/components/datatable/datatable-show-entries';
import DatatableStatusFilter from 'src/components/datatable/datatable-status-filter';
import { Invoice } from 'src/lib/database/connection';
import { InvoiceColumns } from '../columns';
import { SortingState } from '@tanstack/react-table';
import { pageSizeOptions } from 'src/constants/page-size-options';

export type ColumnFilterOptions = {
  id: string,
  text: string,
  value: string,
}
export default function ListInvoices() {
  const [data, setData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);
  const [columnFiltersOptions, setColumnFiltersOptions] = useState<ColumnFilterOptions[]>([
    {
      id: 'pending',
      value: 'pending',
      text: 'Pending'
    },
    {
      id: 'paid',
      value: 'paid',
      text: 'Paid'
    },
    {
      id: 'unpaid',
      value: 'unpaid',
      text: 'Unpaid'
    },
    {
      id: 'all',
      value: '',
      text: 'All Status'
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: 'status',
      value: ''
    }
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
            <h1 className="flex-none items-start text-[#1C2434] text-[26px] font-bold">Invoices</h1>
            <div className='flex flex-row gap-x-4'>
              <div>
                
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
                        value: value
                      }
                    ])
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
                      pageIndex: 0, // Aktifkan reset ke halaman pertama jika menginginkan page di reset ke halaman pertama setiap kali ganti show entries.
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
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
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
