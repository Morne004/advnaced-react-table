import React, { ChangeEvent } from 'react';
import type { TableComponentProps } from '../types';
import { exportToCsv } from '../utils/csv';

interface TableToolbarComponentProps<T> extends TableComponentProps<T> {
  isColumnDropdownOpen: boolean;
  setIsColumnDropdownOpen: (value: React.SetStateAction<boolean>) => void;
  columnDropdownRef: React.RefObject<HTMLDivElement>;
  showFilters: boolean;
  setShowFilters: (value: React.SetStateAction<boolean>) => void;
}

// FIX: Add `extends object` constraint to generic type `T` to satisfy `exportToCsv` requirements.
export const TableToolbar = <T extends object>({
  table,
  isColumnDropdownOpen,
  setIsColumnDropdownOpen,
  columnDropdownRef,
  showFilters,
  setShowFilters,
}: TableToolbarComponentProps<T>) => {
  const {
    globalFilter,
    filters,
    sortedData,
    totalCount,
    handleGlobalFilterChange,
    allColumns,
    columnVisibility,
    toggleColumnVisibility,
    isCondensed,
    toggleDensity
  } = table;

  return (
    <div>
      <div>
        <div>
          <input
            type="text"
            value={globalFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleGlobalFilterChange(e.target.value)}
            placeholder="Search all columns..."
          />
        </div>
        <div>
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
      <div>
        <button
          onClick={toggleDensity}
          title={isCondensed ? 'Switch to Normal View' : 'Switch to Condensed View'}
        >
          <span>{isCondensed ? 'Normal' : 'Condensed'}</span>
        </button>
        <div ref={columnDropdownRef}>
          <button
            onClick={() => setIsColumnDropdownOpen(prev => !prev)}
            aria-haspopup="true"
            aria-expanded={isColumnDropdownOpen}
            aria-controls="column-toggle-menu"
          >
            <span>Columns</span>
          </button>
          {isColumnDropdownOpen && (
            <div id="column-toggle-menu">
              <div>Toggle Columns</div>
              <div>
                {allColumns.map(col => (
                  <label key={col.id}>
                    <input
                      type="checkbox"
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
        >
          <span>Filters</span>
          {filters.length > 0 && <span>{filters.length}</span>}
        </button>
        <button
            onClick={() => exportToCsv(`all_data_${new Date().toISOString()}.csv`, sortedData)}
        >
            <span>Export All</span>
        </button>
      </div>
    </div>
  );
};