import React from 'react';

export interface ColumnDef<T> {
  id: string;
  accessorKey?: keyof T;
  header: string;
  cell?: (info: { row: T }) => React.ReactNode;
  enableSorting?: boolean;
}

export type Operator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';

export interface Filter {
  id: string;
  column: string;
  operator: Operator;
  value: string;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}

export interface DataTableState {
  pageIndex: number;
  pageSize: number;
  sorting: SortConfig<any> | null;
  filters: Filter[];
  globalFilter: string;
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnWidths: Record<string, number>;
  rowSelection: Record<string, boolean>;
  isCondensed: boolean;

  // Server-side data management (opt-in)
  manualPagination?: boolean;
  manualFiltering?: boolean;
  manualSorting?: boolean;
  totalRowCount?: number;
  pageCount?: number;
}

export type ControlledDataTableState = Partial<DataTableState>;

export interface DataTableHandlers {
    onStateChange?: (newState: Partial<DataTableState>) => void;
}

// Props for the main DataTable component
export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];

    // Configuration
    getRowId?: (row: T) => string | number;
    initialState?: Partial<DataTableState>;
    disablePersistence?: boolean;
    disableFilterPersistence?: boolean;
    storageKey?: string;
    enableRowSelection?: boolean;
    enableStickyHeader?: boolean;

    // Data states
    isLoading?: boolean;
    noDataMessage?: React.ReactNode;

    // Components override
    components?: {
        Toolbar?: React.ComponentType<TableComponentProps<T>>;
        Pagination?: React.ComponentType<TableComponentProps<T>>;
        FilterBuilder?: React.ComponentType<FilterBuilderComponentProps<T>>;
        Skeleton?: React.ComponentType<{ rows?: number; cols: number; }>;
    };

    // Controlled state
    state?: ControlledDataTableState;
    onStateChange?: (state: ControlledDataTableState) => void;

    // Server-side data management (opt-in)
    manualPagination?: boolean;
    manualFiltering?: boolean;
    manualSorting?: boolean;
    totalRowCount?: number;
    pageCount?: number;
}

// Props passed to swappable component slots
export interface TableComponentProps<T> {
    table: ReturnType<typeof import('./hooks/useDataTable').useDataTable<T>>;
}

export interface FilterBuilderComponentProps<T> extends TableComponentProps<T> {
    showFilters: boolean;
}
