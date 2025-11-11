import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Filter, SortConfig, ColumnDef, DataTableState, ControlledDataTableState, DataTableProps } from '../types';
import { usePersistentState } from './usePersistentState';

// FIX: Cast the value to the expected, non-partial type.
// The isControlled check ensures that if we use the controlledState, the value is not undefined.
// This resolves incorrect type inferences by TypeScript.
const useControlledOrInternalState = <K extends keyof DataTableState>(
  key: K,
  controlledState: ControlledDataTableState | undefined,
  onStateChange: (newState: ControlledDataTableState) => void,
  persistentStateTuple: [DataTableState[K], (value: React.SetStateAction<DataTableState[K]>) => void]
): [DataTableState[K], (value: React.SetStateAction<DataTableState[K]>) => void] => {
  
  const [internalState, setInternalState] = persistentStateTuple;
  
  const isControlled = controlledState && controlledState[key] !== undefined;
  const value = (isControlled ? controlledState[key] : internalState) as DataTableState[K];

  const setValue = useCallback((updater: React.SetStateAction<DataTableState[K]>) => {
    const newValue = typeof updater === 'function' 
        ? (updater as (prevState: DataTableState[K]) => DataTableState[K])(value)
        : updater;
    
    if (!isControlled) {
        setInternalState(newValue);
    }
    onStateChange({ [key]: newValue });
  }, [isControlled, onStateChange, setInternalState, key, value]);

  return [value, setValue];
};


export const useDataTable = <T,>({
  data,
  columns,
  initialState = {},
  state: controlledState,
  onStateChange = () => {},
}: Omit<DataTableProps<T>, 'getRowId' | 'components' | 'isLoading' | 'noDataMessage'> & { data: T[]}) => {
  const onStateChangeCallback = useCallback((newState: ControlledDataTableState) => {
    onStateChange(newState);
  }, [onStateChange]);
  
  const [globalFilter, setGlobalFilter] = useControlledOrInternalState('globalFilter', controlledState, onStateChangeCallback, usePersistentState('datatable_globalFilter', initialState.globalFilter ?? ''));
  const [filters, setFilters] = useControlledOrInternalState('filters', controlledState, onStateChangeCallback, usePersistentState<Filter[]>('datatable_filters', initialState.filters ?? []));
  const [sorting, setSorting] = useControlledOrInternalState('sorting', controlledState, onStateChangeCallback, usePersistentState<SortConfig<T> | null>('datatable_sorting', initialState.sorting ?? null));
  const [pageSize, setPageSizeState] = useControlledOrInternalState('pageSize', controlledState, onStateChangeCallback, usePersistentState('datatable_pageSize', initialState.pageSize ?? 10));
  const [pageIndex, setPageIndexState] = useControlledOrInternalState('pageIndex', controlledState, onStateChangeCallback, useState(initialState.pageIndex ?? 0));
  const [columnOrder, setColumnOrder] = useControlledOrInternalState('columnOrder', controlledState, onStateChangeCallback, usePersistentState<string[]>('datatable_columnOrder', initialState.columnOrder ?? (() => columns.map(c => c.id))));
  const [columnVisibility, setColumnVisibility] = useControlledOrInternalState('columnVisibility', controlledState, onStateChangeCallback, usePersistentState<Record<string, boolean>>('datatable_columnVisibility', initialState.columnVisibility ?? (() => { const v: Record<string, boolean> = {}; columns.forEach(c => (v[c.id] = true)); return v; })));

  // FIX: `sortedData` must be declared before it is used by `pageCount`.
  // The data derivation pipeline is moved up.
  const filteredData = useMemo(() => {
    let filtered = [...data];
    if (globalFilter) {
      const lowercasedFilter = globalFilter.toLowerCase();
      filtered = filtered.filter(row =>
        columns.some(col => {
            if (!col.accessorKey) return false;
            const value = row[col.accessorKey];
            return String(value).toLowerCase().includes(lowercasedFilter);
        })
      );
    }
    if (filters.length > 0) {
      filtered = filtered.filter(row =>
        filters.every(filter => {
          if (!filter.column || !filter.value) return true;
          const cellValue = row[filter.column as keyof T];
          const filterValue = filter.value;
          const lowercasedCell = String(cellValue).toLowerCase();
          const lowercasedFilter = filterValue.toLowerCase();
          switch (filter.operator) {
            case 'contains': return lowercasedCell.includes(lowercasedFilter);
            case 'equals': return lowercasedCell === lowercasedFilter;
            case 'startsWith': return lowercasedCell.startsWith(lowercasedFilter);
            case 'endsWith': return lowercasedCell.endsWith(lowercasedFilter);
            case 'greaterThan': return Number(cellValue) > Number(filterValue);
            case 'lessThan': return Number(cellValue) < Number(filterValue);
            default: return true;
          }
        })
      );
    }
    return filtered;
  }, [data, globalFilter, filters, columns]);

  const sortedData = useMemo(() => {
    if (!sorting) return filteredData;
    const { key, direction } = sorting;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as any)[key];
      const bVal = (b as any)[key];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return direction === 'ascending' ? comparison : -comparison;
    });
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pageSize);

  const setPageIndex = (updater: React.SetStateAction<number>) => {
    const newPageIndex = typeof updater === 'function' ? updater(pageIndex) : updater;
    if (newPageIndex >= 0 && newPageIndex < pageCount) {
        setPageIndexState(newPageIndex);
    }
  };

  useEffect(() => {
      if(pageIndex >= pageCount && pageCount > 0) {
          setPageIndex(pageCount - 1);
      }
  }, [pageIndex, pageCount, setPageIndex]);


  useEffect(() => {
    const columnIds = new Set(columns.map(c => c.id));
    setColumnOrder(currentOrder => {
      const currentOrderSet = new Set(currentOrder);
      const newOrder = [...currentOrder.filter(id => columnIds.has(id))];
      columns.forEach(col => { if (!currentOrderSet.has(col.id)) newOrder.push(col.id); });
      return JSON.stringify(newOrder) !== JSON.stringify(currentOrder) ? newOrder : currentOrder;
    });
    setColumnVisibility(currentVisibility => {
      const newVisibility = { ...currentVisibility };
      let changed = false;
      Object.keys(newVisibility).forEach(id => { if (!columnIds.has(id)) { delete newVisibility[id]; changed = true; } });
      columns.forEach(col => { if (!(col.id in newVisibility)) { newVisibility[col.id] = true; changed = true; } });
      return changed ? newVisibility : currentVisibility;
    });
  }, [columns, setColumnOrder, setColumnVisibility]);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumnVisibility(prev => ({ ...prev, [columnId]: !prev[columnId] }));
  }, [setColumnVisibility]);

  const orderedAndVisibleColumns = useMemo(() => {
    return columnOrder
      .map(id => columns.find(c => c.id === id))
      .filter((c): c is ColumnDef<T> => !!(c && columnVisibility[c.id]));
  }, [columns, columnOrder, columnVisibility]);

  const applyFilters = useCallback((newFilters: Filter[]) => {
    setFilters(newFilters);
    setPageIndex(0);
  }, [setFilters, setPageIndex]);

  const handleGlobalFilterChange = useCallback((value: string) => {
    setGlobalFilter(value);
    setPageIndex(0);
  }, [setGlobalFilter, setPageIndex]);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pageIndex, pageSize]);

  const setSort = useCallback((key: keyof T) => {
    setSorting(prev => {
      if (prev?.key === key) {
        return prev.direction === 'ascending' ? { key, direction: 'descending' } : null;
      }
      return { key, direction: 'ascending' };
    });
  }, [setSorting]);

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPageIndex(0);
  };
  
  const pagination = { pageIndex, pageSize };

  return {
    // State
    globalFilter, filters, sorting, pagination, columnOrder, columnVisibility,
    // Derived Data
    paginatedData, sortedData, pageCount, totalCount: data.length, orderedAndVisibleColumns, allColumns: columns,
    // Handlers
    handleGlobalFilterChange, applyFilters, setSort, setPageSize, setPageIndex, setColumnOrder, toggleColumnVisibility,
  };
};