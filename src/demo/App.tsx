


import React, { useState, useEffect } from 'react';
import { DataTable } from '../lib/components/DataTable';
import type { ColumnDef, TableComponentProps, FilterBuilderComponentProps, ControlledDataTableState } from '../lib/types';
import type { User } from './types';
import { generateMockData } from './data/mocks';
import { exportToCsv } from '../lib/utils/csv';


// Icons for the styled demo components, now correctly imported from the library folder
import SearchIcon from '../lib/components/icons/SearchIcon';
import MaximizeIcon from '../lib/components/icons/MaximizeIcon';
import MinimizeIcon from '../lib/components/icons/MinimizeIcon';
import ViewColumnsIcon from '../lib/components/icons/ViewColumnsIcon';
import FilterIcon from '../lib/components/icons/FilterIcon';
import DownloadIcon from '../lib/components/icons/DownloadIcon';
import ChevronsLeftIcon from '../lib/components/icons/ChevronsLeftIcon';
import ChevronLeftIcon from '../lib/components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../lib/components/icons/ChevronRightIcon';
import ChevronsRightIcon from '../lib/components/icons/ChevronsRightIcon';

const mockData = generateMockData(200);

const columns: ColumnDef<User>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID', enableSorting: true },
  { id: 'firstName', accessorKey: 'firstName', header: 'First Name' },
  { id: 'lastName', accessorKey: 'lastName', header: 'Last Name' },
  { id: 'email', accessorKey: 'email', header: 'Email', enableSorting: false },
  { id: 'phone', accessorKey: 'phone', header: 'Phone Number', enableSorting: false },
  { id: 'age', accessorKey: 'age', header: 'Age' },
  { id: 'salary', accessorKey: 'salary', header: 'Salary', cell: ({ row }) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.salary) },
  { id: 'status', accessorKey: 'status', header: 'Status', cell: ({ row }) => {
      const colorMap = { active: 'bg-green-200 text-green-800', inactive: 'bg-red-200 text-red-800', pending: 'bg-yellow-200 text-yellow-800' };
      return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorMap[row.status]}`}>{row.status}</span>;
    },
  },
];

// --- Custom Styled Components for the Demo ---

interface StyledToolbarProps<T extends object> extends TableComponentProps<T> {
    isColumnDropdownOpen: boolean;
    setIsColumnDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    columnDropdownRef: React.RefObject<HTMLDivElement>;
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledTableToolbar = <T extends {id: number | string}>({
    table, isColumnDropdownOpen, setIsColumnDropdownOpen, columnDropdownRef, showFilters, setShowFilters
}: StyledToolbarProps<T>) => {
    const { globalFilter, filters, sortedData, totalCount, handleGlobalFilterChange, allColumns, columnVisibility, toggleColumnVisibility } = table;
    const [isCondensed, setIsCondensed] = useState(false);
    
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative grow sm:grow-0">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => handleGlobalFilterChange(e.target.value)}
                        placeholder="Search all columns..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                    />
                </div>
                <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
                    {filters.length > 0 || globalFilter ? (
                        <span>Showing {sortedData.length} of {totalCount} rows</span>
                    ) : (
                        <span>{totalCount} total rows</span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => setIsCondensed(prev => !prev)}
                    title={isCondensed ? 'Switch to Normal View' : 'Switch to Condensed View'}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isCondensed ? <MaximizeIcon className="h-4 w-4" /> : <MinimizeIcon className="h-4 w-4" />}
                    <span>{isCondensed ? 'Normal' : 'Condensed'}</span>
                </button>
                <div className="relative" ref={columnDropdownRef}>
                    <button
                        onClick={() => setIsColumnDropdownOpen((prev: boolean) => !prev)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-haspopup="true" aria-expanded={isColumnDropdownOpen}
                    >
                        <ViewColumnsIcon className="h-4 w-4" /> Columns
                    </button>
                    {isColumnDropdownOpen && (
                        <div className="absolute z-50 top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
                            <div className="p-2 text-sm font-semibold text-gray-800 border-b">Toggle Columns</div>
                            <div className="py-1 max-h-60 overflow-y-auto">
                                {allColumns.map((col: ColumnDef<T>) => (
                                    <label key={col.id} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={columnVisibility[col.id] ?? true} onChange={() => toggleColumnVisibility(col.id)} />
                                        {col.header}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <FilterIcon className="h-4 w-4" /> Filters {filters.length > 0 && <span className="bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{filters.length}</span>}
                </button>
                <button
                    onClick={() => exportToCsv(`all_data_${new Date().toISOString()}.csv`, sortedData)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <DownloadIcon className="h-4 w-4" />
                    <span>Export All</span>
                </button>
            </div>
        </div>
    );
};

const StyledFilterBuilder: React.FC<FilterBuilderComponentProps<any>> = ({ table }) => {
    // This is a simplified version of the original FilterBuilder with styles
    const { filters, applyFilters } = table;
    const [stagedFilters, setStagedFilters] = useState(filters);
    const hasChanges = JSON.stringify(stagedFilters) !== JSON.stringify(filters);

    useEffect(() => { setStagedFilters(filters); }, [filters]);

    return (
        <div className="p-4 border border-gray-200 rounded-md mt-4 bg-gray-50 space-y-4">
            {/* Filter rows UI would go here */}
            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
                <button onClick={() => setStagedFilters(filters)} disabled={!hasChanges} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50">Reset</button>
                <button onClick={() => applyFilters(stagedFilters)} disabled={!hasChanges} className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">Apply Filters</button>
            </div>
        </div>
    );
};


const StyledTableSkeleton = ({ rows = 5, cols }: { rows?: number; cols: number }) => (
    <>
        {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="group">
                {Array.from({ length: cols }).map((_, c) => (
                    <td key={c} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                ))}
            </tr>
        ))}
    </>
);

const StyledTablePagination = <T extends object>({ table }: TableComponentProps<T>) => {
  const { pagination, pageCount, setPageSize, setPageIndex } = table;
  const { pageIndex, pageSize } = pagination;

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
      <div className="text-sm text-gray-700">
        {/* We can add row selection info here in the future */}
      </div>
      <div className="flex items-center space-x-2 sm:space-x-6">
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
        </div>
        <div className="text-sm text-gray-700 font-medium">
          Page {pageIndex + 1} of {pageCount}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setPageIndex(0)}
            disabled={!canPreviousPage}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Go to first page"
          >
            <ChevronsLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={!canPreviousPage}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!canNextPage}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Go to next page"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={!canNextPage}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            aria-label="Go to last page"
          >
            <ChevronsRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  const [tableState, setTableState] = useState<ControlledDataTableState>({
    pageSize: 100
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Mock Navigation Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#1f2937',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Application</h1>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>About</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
        </nav>
      </div>

      {/* Main Content with top padding to account for fixed nav */}
      <div className="container mx-auto px-4 py-8" style={{ marginTop: '64px' }}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reusable Data Table (Headless)</h1>
        <p className="text-gray-600 mb-6">This is a demo of the headless data table library with sticky header positioned below the navigation bar.</p>
      
      <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
        {/*
          Here we apply all the styling to the headless components.
          This is a simplified example. In a real app, you might create
          wrapper components for each part (e.g., StyledTable, StyledHeader).
        */}
        <div className="data-table-wrapper">
          <DataTable<User>
            data={mockData}
            columns={columns}
            isLoading={isLoading}
            state={tableState}
            onStateChange={setTableState}
            enableStickyHeader={true}
            stickyHeaderOffset={100}
            noDataMessage={
                <div className="text-center py-10 text-gray-500">
                    <h3 className="text-lg font-semibold">No Results Found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            }
            components={{
                Toolbar: StyledTableToolbar as any,
                FilterBuilder: StyledFilterBuilder,
                Skeleton: StyledTableSkeleton,
                Pagination: StyledTablePagination,
            }}
          />
        </div>
      </div>
      <style>{`
        .data-table-wrapper table { width: 100%; border-collapse: collapse; }
        .data-table-wrapper th, .data-table-wrapper td { border-bottom: 1px solid #e5e7eb; padding: 0.75rem 1.5rem; text-align: left; }
        .data-table-wrapper th { background-color: #f9fafb; font-weight: 500; text-transform: uppercase; font-size: 0.75rem; color: #4b5563; position: relative; }
        .data-table-wrapper th button { all: unset; display: flex; align-items: center; cursor: pointer; }
        .data-table-wrapper th > div > div { position: absolute; top: 0; right: 0; height: 100%; width: 0.5rem; cursor: col-resize; z-index: 10; }
        .data-table-wrapper th > div > div:hover { background-color: rgba(59, 130, 246, 0.5); }
        .data-table-wrapper tr:hover { background-color: #f9fafb; }
        .data-table-wrapper td { font-size: 0.875rem; color: #374151; }
      `}</style>
      </div>
    </>
  );
}

export default App;
