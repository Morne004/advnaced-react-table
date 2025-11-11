import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Filter, SortConfig, ColumnDef } from '../types';
import { usePersistentState } from './usePersistentState';

interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  initialPageSize?: number;
}

export const useDataTable = <T extends { id: number | string },>({
  data,
  columns,
  initialPageSize = 10,
}: UseDataTableProps<T>) => {
  const [globalFilter, setGlobalFilter] = usePersistentState('datatable_globalFilter', '');
  const [filters, setFilters] = usePersistentState<Filter[]>('datatable_filters', []);
  const [sorting, setSorting] = usePersistentState<SortConfig<T> | null>('datatable_sorting', null);
  
  const [pageSize, setPageSizeState] = usePersistentState('datatable_pageSize', initialPageSize);
  const [pageIndex, setPageIndex] = useState(0);

  const [columnOrder, setColumnOrder] = usePersistentState<string[]>(
    'datatable_columnOrder',
    () => columns.map(c => c.id)
  );
  const [columnVisibility, setColumnVisibility] = usePersistentState<Record<string, boolean>>(
    'datatable_columnVisibility',
    () => {
      const visibility: Record<string, boolean> = {};
      columns.forEach(c => (visibility[c.id] = true));
      return visibility;
    }
  );
  
  // Reconcile persisted column state when column definitions change
  useEffect(() => {
    const columnIds = new Set(columns.map(c => c.id));
    
    setColumnOrder(currentOrder => {
      const currentOrderSet = new Set(currentOrder);
      const newOrder = [...currentOrder.filter(id => columnIds.has(id))];
      columns.forEach(col => {
        if (!currentOrderSet.has(col.id)) {
          newOrder.push(col.id);
        }
      });
      if (JSON.stringify(newOrder) !== JSON.stringify(currentOrder)) {
        return newOrder;
      }
      return currentOrder;
    });
    
    setColumnVisibility(currentVisibility => {
      const newVisibility = { ...currentVisibility };
      let visibilityChanged = false;
      Object.keys(newVisibility).forEach(id => {
        if (!columnIds.has(id)) {
          delete newVisibility[id];
          visibilityChanged = true;
        }
      });
      columns.forEach(col => {
        if (!(col.id in newVisibility)) {
          newVisibility[col.id] = true;
          visibilityChanged = true;
        }
      });
      return visibilityChanged ? newVisibility : currentVisibility;
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
  }, [setFilters]);

  const handleGlobalFilterChange = useCallback((value: string) => {
    setGlobalFilter(value);
    setPageIndex(0);
  }, [setGlobalFilter]);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Global filter
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

    // Individual column filters
    if (filters.length > 0) {
      filtered = filtered.filter(row => {
        return filters.every(filter => {
          if (!filter.column || !filter.value) return true;
          const cellValue = row[filter.column as keyof T];
          const filterValue = filter.value;
          const lowercasedCell = String(cellValue).toLowerCase();
          const lowercasedFilter = filterValue.toLowerCase();

          switch (filter.operator) {
            case 'contains':
              return lowercasedCell.includes(lowercasedFilter);
            case 'equals':
              return lowercasedCell === lowercasedFilter;
            case 'startsWith':
              return lowercasedCell.startsWith(lowercasedFilter);
            case 'endsWith':
                return lowercasedCell.endsWith(lowercasedFilter);
            case 'greaterThan':
              return Number(cellValue) > Number(filterValue);
            case 'lessThan':
              return Number(cellValue) < Number(filterValue);
            default:
              return true;
          }
        });
      });
    }

    return filtered;
  }, [data, globalFilter, filters, columns]);

  const sortedData = useMemo(() => {
    if (!sorting) return filteredData;
    const { key, direction } = sorting;
    return [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return direction === 'ascending' ? comparison : -comparison;
    });
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pageIndex, pageSize]);

  const setSort = useCallback((key: keyof T) => {
    setSorting(prev => {
      if (prev?.key === key) {
        return prev.direction === 'ascending'
          ? { key, direction: 'descending' }
          : null;
      }
      return { key, direction: 'ascending' };
    });
  }, [setSorting]);

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPageIndex(0);
  };

  const nextPage = () => {
    if (pageIndex < pageCount - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const previousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };
  
  const pagination = { pageIndex, pageSize };

  return {
    // State
    globalFilter,
    filters,
    sorting,
    pagination,
    columnOrder,
    columnVisibility,
    // Data
    paginatedData,
    sortedData,
    pageCount,
    totalCount: data.length,
    orderedAndVisibleColumns,
    allColumns: columns,
    // Handlers
    handleGlobalFilterChange,
    applyFilters,
    setSort,
    setPageSize,
    setPageIndex,
    nextPage,
    previousPage,
    setColumnOrder,
    toggleColumnVisibility,
  };
};
