/* eslint-disable @typescript-eslint/no-unused-vars */
import { OnChangeFn, PaginationState, Table } from '@tanstack/react-table';
import React, {
  SetStateAction,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

export interface DatatablePaginationProps<T> {
  table: Table<T>;
  pagination: PaginationState;
  maxVisiblePages: number;
  setPagination: OnChangeFn<PaginationState> | undefined;
}

export interface DatatablePaginationRef {
  pages: (number | '...')[];
}

function DatatablePaginationComponent<T>(
  {
    table,
    pagination,
    maxVisiblePages,
    setPagination,
  }: DatatablePaginationProps<T>,
  ref: React.Ref<DatatablePaginationRef>
) {
  const generatePagination = (totalPages: number, currentPage: number) => {
    const pages: (number | '...')[] = [];

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i); // Zero-based index
    }

    const showLeftEllipsis = currentPage > 2;
    const showRightEllipsis = currentPage < totalPages - 3;

    pages.push(0); // Tambahkan halaman pertama (0-based)

    if (showLeftEllipsis) {
      pages.push('...');
    }

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (showRightEllipsis) {
      pages.push('...');
    }

    pages.push(totalPages - 1); // Tambahkan halaman terakhir (0-based)

    return pages;
  };

  const pages = generatePagination(table.getPageCount(), pagination.pageIndex);

  useImperativeHandle(ref, () => ({
    pages,
  }));

  return (
    table.getRowCount() > 5 && (
      <nav
        className="flex flex-col items-start justify-between py-4 space-y-3 md:flex-row md:items-center md:space-y-0"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-700">
          Showing
          <span className="font-semibold text-gray-900 px-2">
            {pagination.pageIndex * pagination.pageSize + 1}
          </span>
          -
          <span className="font-semibold text-gray-900 px-2">
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              table.getRowCount()
            )}
          </span>
          of
          <span className="font-semibold text-gray-900 px-2">
            {table.getRowCount()}
          </span>
          entries
        </span>

        {/* Navigation for page */}
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.firstPage()}
              className="flex items-center justify-center h-full py-1.5 px-3 w-auto ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L6.31 10l3.72-3.72a.75.75 0 1 0-1.06-1.06L4.72 9.47Zm9.25-4.25L9.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L11.31 10l3.72-3.72a.75.75 0 0 0-1.06-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </li>
          <li>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="flex items-center justify-center h-full py-1.5 px-[6px] ml-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only translate-x-0">Previous</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          {pages.map((page, index) => {
            if (page === '...') {
              const isLeftEllipsis = index === 1; // Appears after 1
              const isRightEllipsis = index === pages.length - 2; // Appears before last page
              const isMiddleEllipsis = !isLeftEllipsis && !isRightEllipsis;

              const totalPages = table.getPageCount();

              return (
                <button
                  key={`ellipsis-${index}`}
                  onClick={() => {
                    setPagination?.((prev) => {
                      let newPage = prev.pageIndex;
                      const step = 3; // Number of pages to skip

                      if (
                        isLeftEllipsis ||
                        (isMiddleEllipsis && prev.pageIndex >= totalPages / 2)
                      ) {
                        newPage = Math.max(0, prev.pageIndex - step);
                      } else if (
                        isRightEllipsis ||
                        (isMiddleEllipsis && prev.pageIndex < totalPages / 2)
                      ) {
                        newPage = Math.min(
                          totalPages - 1,
                          prev.pageIndex + step
                        );
                      }

                      return { ...prev, pageIndex: newPage };
                    });
                  }}
                  className="px-3 py-1 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  ...
                </button>
              );
            }

            return (
              <li key={`page-${page}`}>
                <button
                  onClick={() =>
                    setPagination?.((prev) => ({
                      ...prev,
                      pageIndex: page,
                    }))
                  }
                  className={`flex items-center justify-center px-3 py-2 text-sm font-medium leading-tight 
                      border shadow-sm transition-all duration-300
                      ${
                        page === pagination.pageIndex
                          ? 'bg-gray-300 text-gray-700 border-gray-300 shadow-md hover:bg-gray-500 hover:text-white'
                          : 'bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                >
                  {page + 1}
                </button>
              </li>
            );
          })}
          <li>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className="flex items-center justify-center h-full py-1.5 px-[6px] leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          <li>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.lastPage()}
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    )
  );
}

export const DatatablePagination = forwardRef(DatatablePaginationComponent) as <
  T
>(
  props: DatatablePaginationProps<T> & {
    ref?: React.Ref<DatatablePaginationRef>;
  }
) => React.ReactElement;
