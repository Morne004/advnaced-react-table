
import React, { ChangeEvent } from 'react';
import type { useDataTable } from '../hooks/useDataTable';
import { exportToCsv } from '../utils/csv';

import SearchIcon from './icons/SearchIcon';
import MaximizeIcon from './icons/MaximizeIcon';
import MinimizeIcon from './icons/MinimizeIcon';
import ViewColumnsIcon from './icons/ViewColumnsIcon';
import FilterIcon from './icons/FilterIcon';
import DownloadIcon from './icons/DownloadIcon';

type TableState<T extends { id: number | string }> = ReturnType<typeof useDataTable<T>>;

interface TableToolbarProps<T extends { id: number | string }> {
  tableState: TableState<T>;
  isCondensed: boolean;
  setIsCondensed: (value: React.SetStateAction<boolean>) => void;
  isColumnDropdownOpen: boolean;
  setIsColumnDropdownOpen: (value: React.SetStateAction<boolean>) => void;
  columnDropdownRef: React.RefObject<HTMLDivElement>;
  showFilters: boolean;
  setShowFilters: (value: React.SetStateAction<boolean>) => void;
}

export const TableToolbar = <T extends { id: number | string }>({
  tableState,
  isCondensed,
  setIsCondensed,
  isColumnDropdownOpen,
  setIsColumnDropdownOpen,
  columnDropdownRef,
  showFilters,
  setShowFilters,
}: TableToolbarProps<T>) => {
  const {
    globalFilter,
    filters,
    sortedData,
    totalCount,
    handleGlobalFilterChange,
    allColumns,
    columnVisibility,
    toggleColumnVisibility
  } = tableState;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative grow sm:grow-0">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleGlobalFilterChange(e.target.value)}
            placeholder="Search all columns..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
        </div>
        <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
          {filters.length > 0 || globalFilter ? (
            <span>
              Showing {sortedData.length} of {totalCount} rows
            </span>
          ) : (
            <span>
              {totalCount} total rows
            </span>
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
            onClick={() => setIsColumnDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-haspopup="true"
            aria-expanded={isColumnDropdownOpen}
            aria-controls="column-toggle-menu"
          >
            <ViewColumnsIcon className="h-4 w-4" />
            <span>Columns</span>
          </button>
          {isColumnDropdownOpen && (
            <div id="column-toggle-menu" className="absolute z-50 top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-2 text-sm font-semibold text-gray-800 border-b">Toggle Columns</div>
              <div className="py-1 max-h-60 overflow-y-auto">
                {allColumns.map(col => (
                  <label key={col.id} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={columnVisibility[col.id] ?? true}
                      onChange={() => toggleColumnVisibility(col.id)}
                    />
                    {col.header}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FilterIcon className="h-4 w-4" />
          <span>Filters</span>
          {filters.length > 0 && <span className="bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{filters.length}</span>}
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
