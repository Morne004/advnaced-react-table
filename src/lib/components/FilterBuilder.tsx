import { ChangeEvent, useMemo, useState, useEffect } from 'react';
import type { Filter, Operator, FilterBuilderComponentProps } from '../types';

const operatorOptions: { value: Operator; label: string }[] = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
];

export const FilterBuilder = <T,>({
    table
}: FilterBuilderComponentProps<T>) => {
    const { filters, allColumns, applyFilters } = table;
    const [stagedFilters, setStagedFilters] = useState<Filter[]>(filters);

    useEffect(() => {
        setStagedFilters(filters);
    }, [filters]);

    const filterableColumns = useMemo(() => allColumns.filter(c => c.accessorKey), [allColumns]);
    const hasChanges = useMemo(() => JSON.stringify(stagedFilters) !== JSON.stringify(filters), [stagedFilters, filters]);

    const handleAddStagedFilter = () => {
        if (filterableColumns.length === 0) return;
        setStagedFilters(prev => [
          ...prev,
          { id: new Date().toISOString(), column: filterableColumns[0].accessorKey as string, operator: 'contains', value: '' },
        ]);
    };

    const handleUpdateStagedFilter = (id: string, newFilter: Partial<Filter>) => {
        setStagedFilters(prev => prev.map(f => (f.id === id ? { ...f, ...newFilter } : f)));
    };
    
    const handleRemoveStagedFilter = (id: string) => {
        setStagedFilters(prev => prev.filter(f => f.id !== id));
    };

  return (
    <div>
      {stagedFilters.map((filter) => (
        <div key={filter.id}>
          <select
            value={filter.column}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleUpdateStagedFilter(filter.id, { column: e.target.value })}
          >
            {filterableColumns.map(col => <option key={col.id} value={col.accessorKey as string}>{col.header}</option>)}
          </select>
          <select
            value={filter.operator}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleUpdateStagedFilter(filter.id, { operator: e.target.value as Operator })}
          >
            {operatorOptions.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
          <input
            type="text"
            value={filter.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateStagedFilter(filter.id, { value: e.target.value })}
            placeholder="Value"
          />
          <button onClick={() => handleRemoveStagedFilter(filter.id)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddStagedFilter}>+ Add Filter</button>
      <div>
        <button onClick={() => setStagedFilters([])} disabled={stagedFilters.length === 0}>Clear All</button>
        <button onClick={() => setStagedFilters(filters)} disabled={!hasChanges}>Reset</button>
        <button onClick={() => applyFilters(stagedFilters)} disabled={!hasChanges}>Apply Filters</button>
      </div>
    </div>
  )
}