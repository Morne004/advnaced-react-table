
import React from 'react';
import type { useDataTable } from '../hooks/useDataTable';

type TableState<T extends { id: number | string }> = ReturnType<typeof useDataTable<T>>;

interface TablePaginationProps<T extends { id: number | string }> {
  tableState: TableState<T>;
}

export const TablePagination = <T extends { id: number | string },>({
  tableState
}: TablePaginationProps<T>) => {

  const {
    pagination,
    pageCount,
    setPageSize,
    setPageIndex,
  } = tableState;

  const canPreviousPage = pagination.pageIndex > 0;
  const canNextPage = pagination.pageIndex < pageCount - 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-end pt-4">
      <div className="flex items-center space-x-2 sm:space-x-6">
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {[10, 25, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
        </div>
        <div className="text-sm text-gray-700">
          Page {pagination.pageIndex + 1} of {pageCount}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setPageIndex(0)}
            disabled={!canPreviousPage}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            aria-label="Go to first page"
          >
            <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
          </button>
          <button
            onClick={() => setPageIndex(pagination.pageIndex - 1)}
            disabled={!canPreviousPage}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            aria-label="Go to previous page"
          >
            <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => setPageIndex(pagination.pageIndex + 1)}
            disabled={!canNextPage}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            aria-label="Go to next page"
          >
            <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <button
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={!canNextPage}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            aria-label="Go to last page"
          >
            <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
