import type { TableComponentProps } from '../types';

export const TablePagination = <T,>({
  table
}: TableComponentProps<T>) => {

  const {
    pagination,
    pageCount,
    setPageSize,
    setPageIndex,
  } = table;

  const canPreviousPage = pagination.pageIndex > 0;
  const canNextPage = pagination.pageIndex < pageCount - 1;

  return (
    <div>
      <div>
        <div>
            <span>Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 25, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
        </div>
        <div>
          Page {pagination.pageIndex + 1} of {pageCount}
        </div>
        <div>
          <button onClick={() => setPageIndex(0)} disabled={!canPreviousPage} aria-label="Go to first page">
            {'<<'}
          </button>
          <button onClick={() => setPageIndex(pagination.pageIndex - 1)} disabled={!canPreviousPage} aria-label="Go to previous page">
            {'<'}
          </button>
          <button onClick={() => setPageIndex(pagination.pageIndex + 1)} disabled={!canNextPage} aria-label="Go to next page">
            {'>'}
          </button>
          <button onClick={() => setPageIndex(pageCount - 1)} disabled={!canNextPage} aria-label="Go to last page">
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  )
}