/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ColumnDef, SortDirection, SortingState, Table, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface DatatableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

export interface DatatableRef<T> {
  table: Table<T>;
  pageSize: number;
  pageIndex: number;
  sorting: SortingState;
}

function DatatableComponent<T>(
  { data, columns }: DatatableProps<T>,
  ref: React.Ref<DatatableRef<T>>
){
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  useImperativeHandle(ref, () => ({
    table: table,
    pageSize,
    pageIndex,
    sorting,
  }));

  return (
    <div className=" font-sans bg-white w-[1000px] relative overflow-x-auto overflow-y-scroll sm:rounded-lg rounded-md shadow-md border-gray-200 border flex flex-col">    
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 bg-opacity-90 sticky top-0 z-10 border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-6 cursor-pointer transition-all ease-in-out duration-300"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex flex-row items-center justify-between">                    
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() ? <SortIcon direction={(header.column.getIsSorted())} /> : ""}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 hover:cursor-pointer transition-all ease-in-out duration-300">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>

      <nav className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-700">
            Showing
            <span className="font-semibold text-gray-900 px-2">1-10</span>
            of
            <span className="font-semibold text-gray-900 px-2">1000</span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
              <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                  <span className="sr-only">Previous</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
              </a>
          </li>
          <li>
              <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
          </li>
          <li>
              <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
          </li>
          <li>
              <a href="#" aria-current="page" className="z-10 flex items-center justify-center px-3 py-2 text-sm leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700">3</a>
          </li>
          <li>
              <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">...</a>
          </li>
          <li>
              <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">100</a>
          </li>
          <li>
              <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                  <span className="sr-only">Next</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
              </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

const SortIcon = ({direction}: {direction: false | SortDirection}) => {
  return (
    <div className="flex flex-col">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke={direction === "asc" ? "currentColor" : "gray"} className="size-[10px] transition-none ease-in-out duration-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke={direction === "desc" ? "currentColor" : "gray"} className="size-[10px] transition-none ease-in-out duration-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div> 
  )
}

export const Datatable = forwardRef(DatatableComponent) as <T>(
  props: DatatableProps<T> & { ref?: React.Ref<DatatableRef<T>> }
) => React.ReactElement;