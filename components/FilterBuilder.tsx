
import React, { ChangeEvent, useMemo } from 'react';
import type { Filter, Operator, ColumnDef } from '../types';
import TrashIcon from './icons/TrashIcon';

interface FilterBuilderProps<T> {
  stagedFilters: Filter[];
  setStagedFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  filters: Filter[];
  hasChanges: boolean;
  allColumns: ColumnDef<T>[];
  applyFilters: (newFilters: Filter[]) => void;
}

const operatorOptions: { value: Operator; label: string }[] = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
];

export const FilterBuilder = <T,>({
    stagedFilters,
    setStagedFilters,
    filters,
    hasChanges,
    allColumns,
    applyFilters
}: FilterBuilderProps<T>) => {

    const filterableColumns = useMemo(() => allColumns.filter(c => c.accessorKey), [allColumns]);

    const handleAddStagedFilter = () => {
        if (filterableColumns.length === 0) return;
        setStagedFilters(prev => [
          ...prev,
          {
            id: new Date().toISOString(),
            column: filterableColumns[0].accessorKey as string,
            operator: 'contains',
            value: '',
          },
        ]);
    };

    const handleUpdateStagedFilter = (id: string, newFilter: Partial<Filter>) => {
        setStagedFilters(prev =>
          prev.map(f => (f.id === id ? { ...f, ...newFilter } : f))
        );
    };
    
    const handleRemoveStagedFilter = (id: string) => {
        setStagedFilters(prev => prev.filter(f => f.id !== id));
    };

  return (
    <div className="p-4 border border-gray-200 rounded-md mt-4 bg-gray-50 space-y-4">
      {stagedFilters.map((filter) => (
        <div key={filter.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 items-center">
          <select
            value={filter.column}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleUpdateStagedFilter(filter.id, { column: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {filterableColumns.map(col => <option key={col.id} value={col.accessorKey as string}>{col.header}</option>)}
          </select>
          <select
            value={filter.operator}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleUpdateStagedFilter(filter.id, { operator: e.target.value as Operator })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {operatorOptions.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
          <input
            type="text"
            value={filter.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateStagedFilter(filter.id, { value: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full md:col-span-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Value"
          />
          <button onClick={() => handleRemoveStagedFilter(filter.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md">
            <TrashIcon className="h-5 w-5 mx-auto" />
          </button>
        </div>
      ))}
      <button onClick={handleAddStagedFilter} className="px-4 py-2 border border-dashed border-gray-400 rounded-md text-sm text-gray-600 hover:bg-gray-100 w-full">
        + Add Filter
      </button>
      <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
        <button
          onClick={() => setStagedFilters([])}
          disabled={stagedFilters.length === 0}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
        <button
          onClick={() => setStagedFilters(filters)}
          disabled={!hasChanges}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Changes
        </button>
        <button
          onClick={() => applyFilters(stagedFilters)}
          disabled={!hasChanges}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
