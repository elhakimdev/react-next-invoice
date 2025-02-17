/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  ColumnDef,
  ColumnFiltersColumn,
  OnChangeFn,
  PaginationState,
  SortingState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  DatatablePagination,
  DatatablePaginationRef,
} from './datatable-pagination';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import DatatableSorting from './datatable-sorting';

export interface ColumnFilter {
  id: string,
  value: unknown
}

export type ColumnFiltersState = ColumnFilter[];

export interface DatatableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  sorting: SortingState;
  pagination: PaginationState;
  setSorting: OnChangeFn<SortingState> | undefined;
  setPagination: OnChangeFn<PaginationState> | undefined;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState> | undefined;
  onRowSelectionChange?: (selectedRows: T[]) => void; // New prop
}

export interface DatatableRef<T> {
  table: Table<T>;
  paginationLinks: DatatablePaginationRef | null;
}

function DatatableComponent<T>(
  {
    data,
    columns,
    sorting,
    pagination,
    setSorting,
    setPagination,
    columnFilters,
    setColumnFilters,
    onRowSelectionChange
  }: DatatableProps<T>,
  ref: React.Ref<DatatableRef<T>>
) {
  const paginationLinksRef = useRef<DatatablePaginationRef>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // needed for client-side filtering
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  });

  useImperativeHandle(ref, () => ({
    table: table,
    pagination,
    sorting,
    paginationLinks: paginationLinksRef.current,
  }));


  useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(table.getSelectedRowModel().rows.map(row => row.original));
    }
  }, [table, table.getState().rowSelection]); // ✅ Track row selection changes
  

  return (
    <div>
      <div className=" font-sans bg-white w-[1000px] min-h-[100px] max-h-[370px] relative overflow-x-auto overflow-y-scroll sm:rounded-lg rounded-md border-gray-200 border flex flex-col">
        {/* Main Table */}
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 border-y border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-6 cursor-pointer transition-all ease-in-out duration-300"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex flex-row items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() ? (
                        <DatatableSorting
                          direction={header.column.getIsSorted()}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={row.getToggleSelectedHandler()}
                className="border-b border-gray-200 hover:bg-gray-50 hover:cursor-pointer transition-all ease-in-out duration-300"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DatatablePagination
        ref={paginationLinksRef}
        table={table}
        pagination={pagination}
        setPagination={setPagination}
        maxVisiblePages={5}
      />
    </div>
  );
}

export const Datatable = forwardRef(DatatableComponent) as <T>(
  props: DatatableProps<T> & { ref?: React.Ref<DatatableRef<T>> }
) => React.ReactElement;
