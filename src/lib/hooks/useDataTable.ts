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
  persistentStateTuple: [DataTableState[K], (value: React.SetStateAction<DataTableState[K]>) => void],
  getCurrentState: () => DataTableState
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

    // Pass complete state to prevent losing other properties in controlled mode
    const currentState = getCurrentState();
    onStateChange({ ...currentState, [key]: newValue });
  }, [isControlled, onStateChange, setInternalState, key, value, getCurrentState]);

  return [value, setValue];
};


export const useDataTable = <T,>({
  data,
  columns,
  initialState = {},
  state: controlledState,
  onStateChange = () => {},
  manualPagination = false,
  manualFiltering = false,
  manualSorting = false,
  totalRowCount,
  pageCount: controlledPageCount,
  disablePersistence = false,
  disableFilterPersistence = false,
  storageKey = '',
}: Omit<DataTableProps<T>, 'getRowId' | 'components' | 'isLoading' | 'noDataMessage'> & { data: T[]}) => {
  const onStateChangeCallback = useCallback((newState: ControlledDataTableState) => {
    onStateChange(newState);
  }, [onStateChange]);

  // Helper to create storage key with optional prefix
  const getStorageKey = (key: string) => storageKey ? `${storageKey}_${key}` : `datatable_${key}`;

  // Internal state holders for uncontrolled mode
  // Use regular useState when persistence is disabled
  const globalFilterState = usePersistentState(
    getStorageKey('globalFilter'),
    initialState.globalFilter ?? '',
    !disablePersistence
  );
  const filtersState = usePersistentState<Filter[]>(
    getStorageKey('filters'),
    initialState.filters ?? [],
    !disablePersistence && !disableFilterPersistence
  );
  const sortingState = usePersistentState<SortConfig<T> | null>(
    getStorageKey('sorting'),
    initialState.sorting ?? null,
    !disablePersistence
  );
  const pageSizeState = usePersistentState(
    getStorageKey('pageSize'),
    initialState.pageSize ?? 10,
    !disablePersistence
  );
  const pageIndexState = useState(initialState.pageIndex ?? 0);
  const columnOrderState = usePersistentState<string[]>(
    getStorageKey('columnOrder'),
    initialState.columnOrder ?? (() => columns.map(c => c.id)),
    !disablePersistence
  );
  const columnVisibilityState = usePersistentState<Record<string, boolean>>(
    getStorageKey('columnVisibility'),
    initialState.columnVisibility ?? (() => { const v: Record<string, boolean> = {}; columns.forEach(c => (v[c.id] = true)); return v; }),
    !disablePersistence
  );
  const columnWidthsState = usePersistentState<Record<string, number>>(
    getStorageKey('columnWidths'),
    initialState.columnWidths ?? {},
    !disablePersistence
  );
  const rowSelectionState = usePersistentState<Record<string, boolean>>(
    getStorageKey('rowSelection'),
    initialState.rowSelection ?? {},
    !disablePersistence
  );
  const isCondensedState = usePersistentState<boolean>(
    getStorageKey('isCondensed'),
    initialState.isCondensed ?? false,
    !disablePersistence
  );

  // Function to get complete current state for controlled mode
  const getCurrentState = useCallback((): DataTableState => ({
    globalFilter: controlledState?.globalFilter ?? globalFilterState[0],
    filters: controlledState?.filters ?? filtersState[0],
    sorting: controlledState?.sorting ?? sortingState[0],
    pageSize: controlledState?.pageSize ?? pageSizeState[0],
    pageIndex: controlledState?.pageIndex ?? pageIndexState[0],
    columnOrder: controlledState?.columnOrder ?? columnOrderState[0],
    columnVisibility: controlledState?.columnVisibility ?? columnVisibilityState[0],
    columnWidths: controlledState?.columnWidths ?? columnWidthsState[0],
    rowSelection: controlledState?.rowSelection ?? rowSelectionState[0],
    isCondensed: controlledState?.isCondensed ?? isCondensedState[0],
  }), [controlledState, globalFilterState, filtersState, sortingState, pageSizeState, pageIndexState, columnOrderState, columnVisibilityState, columnWidthsState, rowSelectionState, isCondensedState]);

  const [globalFilter, setGlobalFilter] = useControlledOrInternalState('globalFilter', controlledState, onStateChangeCallback, globalFilterState, getCurrentState);
  const [filters, setFilters] = useControlledOrInternalState('filters', controlledState, onStateChangeCallback, filtersState, getCurrentState);
  const [sorting, setSorting] = useControlledOrInternalState('sorting', controlledState, onStateChangeCallback, sortingState, getCurrentState);
  const [pageSize, setPageSizeState] = useControlledOrInternalState('pageSize', controlledState, onStateChangeCallback, pageSizeState, getCurrentState);
  const [pageIndex, setPageIndexState] = useControlledOrInternalState('pageIndex', controlledState, onStateChangeCallback, pageIndexState, getCurrentState);
  const [columnOrder, setColumnOrder] = useControlledOrInternalState('columnOrder', controlledState, onStateChangeCallback, columnOrderState, getCurrentState);
  const [columnVisibility, setColumnVisibilityInternal] = useControlledOrInternalState('columnVisibility', controlledState, onStateChangeCallback, columnVisibilityState, getCurrentState);
  const [columnWidths, setColumnWidths] = useControlledOrInternalState('columnWidths', controlledState, onStateChangeCallback, columnWidthsState, getCurrentState);
  const [rowSelection, setRowSelectionInternal] = useControlledOrInternalState('rowSelection', controlledState, onStateChangeCallback, rowSelectionState, getCurrentState);
  const [isCondensed, setIsCondensed] = useControlledOrInternalState('isCondensed', controlledState, onStateChangeCallback, isCondensedState, getCurrentState);

  // FIX: `sortedData` must be declared before it is used by `pageCount`.
  // The data derivation pipeline is moved up.
  const filteredData = useMemo(() => {
    // Skip client-side filtering when manualFiltering is enabled
    if (manualFiltering) return data;

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
  }, [data, globalFilter, filters, columns, manualFiltering]);

  const sortedData = useMemo(() => {
    // Skip client-side sorting when manualSorting is enabled
    if (manualSorting) return filteredData;

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
  }, [filteredData, sorting, manualSorting]);

  // Use controlled pageCount for manual pagination, otherwise compute from data
  const pageCount = manualPagination && controlledPageCount !== undefined
    ? controlledPageCount
    : Math.ceil(sortedData.length / pageSize);

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
    setColumnVisibilityInternal(currentVisibility => {
      const newVisibility = { ...currentVisibility };
      let changed = false;
      Object.keys(newVisibility).forEach(id => { if (!columnIds.has(id)) { delete newVisibility[id]; changed = true; } });
      columns.forEach(col => { if (!(col.id in newVisibility)) { newVisibility[col.id] = true; changed = true; } });
      return changed ? newVisibility : currentVisibility;
    });
  }, [columns, setColumnOrder, setColumnVisibilityInternal]);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumnVisibilityInternal(prev => ({ ...prev, [columnId]: !prev[columnId] }));
  }, [setColumnVisibilityInternal]);

  const toggleDensity = useCallback(() => {
    setIsCondensed(prev => !prev);
  }, [setIsCondensed]);

  // Expose setColumnVisibility as a direct setter (not just toggle)
  const setColumnVisibility = useCallback((visibility: Record<string, boolean>) => {
    setColumnVisibilityInternal(visibility);
  }, [setColumnVisibilityInternal]);

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
    // Skip client-side pagination when manualPagination is enabled - use data as-is from server
    if (manualPagination) return data;

    const start = pageIndex * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pageIndex, pageSize, manualPagination, data]);

  // Row selection handlers
  const setRowSelection = useCallback((selection: Record<string, boolean>) => {
    setRowSelectionInternal(selection);
  }, [setRowSelectionInternal]);

  const toggleRowSelection = useCallback((rowId: string) => {
    setRowSelectionInternal(prev => ({ ...prev, [rowId]: !prev[rowId] }));
  }, [setRowSelectionInternal]);

  const toggleAllRows = useCallback(() => {
    const allSelected = paginatedData.every(row => {
      const rowId = String((row as any).id);
      return rowSelection[rowId];
    });
    
    setRowSelectionInternal(prev => {
      const newSelection = { ...prev };
      paginatedData.forEach(row => {
        const rowId = String((row as any).id);
        newSelection[rowId] = !allSelected;
      });
      return newSelection;
    });
  }, [paginatedData, rowSelection, setRowSelectionInternal]);

  const getSelectedRows = useCallback(() => {
    return data.filter(row => {
      const rowId = String((row as any).id);
      return rowSelection[rowId];
    });
  }, [data, rowSelection]);

  const clearRowSelection = useCallback(() => {
    setRowSelectionInternal({});
  }, [setRowSelectionInternal]);

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

  // Use controlled totalRowCount for manual pagination, otherwise use data length
  const totalCount = manualPagination && totalRowCount !== undefined
    ? totalRowCount
    : data.length;

  return {
    // State
    globalFilter, filters, sorting, pagination, columnOrder, columnVisibility, columnWidths, rowSelection, isCondensed,
    // Derived Data
    paginatedData, sortedData, pageCount, totalCount, orderedAndVisibleColumns, allColumns: columns,
    // Handlers
    handleGlobalFilterChange, applyFilters, setSort, setSorting, setPageSize, setPageIndex, setColumnOrder, setColumnVisibility, setColumnWidths, toggleColumnVisibility, toggleDensity,
    // Row Selection
    setRowSelection, toggleRowSelection, toggleAllRows, getSelectedRows, clearRowSelection,
  };
};