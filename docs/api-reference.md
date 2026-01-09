# API Reference

Complete reference documentation for all components, hooks, types, and utilities in **@morne004/headless-react-data-table**.

---

## Table of Contents

- [DataTable Component](#datatable-component)
- [useDataTable Hook](#usedatatable-hook)
- [TypeScript Types](#typescript-types)
- [Utility Functions](#utility-functions)

---

## DataTable Component

The main component that renders a complete, feature-rich data table with default UI components.

### Import

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
```

### Type Signature

```tsx
function DataTable<T extends { id: number | string }>(
  props: DataTableProps<T>
): JSX.Element
```

### Props

#### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data objects to display in the table |
| `columns` | `ColumnDef<T>[]` | Column definitions specifying how to render each column |

#### Configuration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `getRowId` | `(row: T) => string \| number` | `row => row.id` | Function to extract unique ID from each row |
| `initialState` | `Partial<DataTableState>` | `{}` | Initial state for the table (sorting, filters, page size, etc.) |
| `disablePersistence` | `boolean` | `false` | Disable automatic localStorage persistence |
| `enableRowSelection` | `boolean` | `false` | Enable row selection checkboxes |

#### Data State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLoading` | `boolean` | `false` | Show skeleton loading state |
| `noDataMessage` | `React.ReactNode` | Default message | Custom content shown when data array is empty |

#### Component Slots Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `components.Toolbar` | `React.ComponentType<TableComponentProps<T>>` | `TableToolbar` | Custom toolbar component |
| `components.Pagination` | `React.ComponentType<TableComponentProps<T>>` | `TablePagination` | Custom pagination component |
| `components.FilterBuilder` | `React.ComponentType<FilterBuilderComponentProps<T>>` | `FilterBuilder` | Custom filter builder component |
| `components.Skeleton` | `React.ComponentType<{ rows?: number; cols: number }>` | `TableSkeleton` | Custom loading skeleton component |

#### Controlled State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `ControlledDataTableState` | `undefined` | Controlled state object (partial) |
| `onStateChange` | `(state: ControlledDataTableState) => void` | `undefined` | Callback when state changes (for controlled mode) |

#### Server-Side Data Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `manualPagination` | `boolean` | `false` | Disable client-side pagination (server handles it) |
| `manualFiltering` | `boolean` | `false` | Disable client-side filtering (server handles it) |
| `manualSorting` | `boolean` | `false` | Disable client-side sorting (server handles it) |
| `totalRowCount` | `number` | `undefined` | Total number of rows (for server-side pagination) |
| `pageCount` | `number` | `undefined` | Total number of pages (for server-side pagination) |

### Usage Examples

#### Basic Usage

```tsx
<DataTable<User>
  data={users}
  columns={columns}
/>
```

#### With Initial State

```tsx
<DataTable<User>
  data={users}
  columns={columns}
  initialState={{
    pageSize: 25,
    sorting: { key: 'createdAt', direction: 'descending' },
    columnVisibility: { email: false },
  }}
/>
```

#### With Loading State

```tsx
<DataTable<User>
  data={users}
  columns={columns}
  isLoading={isLoading}
  noDataMessage={
    <div>No users found. Try adjusting your filters.</div>
  }
/>
```

#### With Custom Components

```tsx
<DataTable<User>
  data={users}
  columns={columns}
  components={{
    Toolbar: CustomToolbar,
    Pagination: CustomPagination,
  }}
/>
```

#### Server-Side Data Management

```tsx
<DataTable<User>
  data={users}
  columns={columns}
  manualPagination
  manualFiltering
  manualSorting
  totalRowCount={totalRowsFromServer}
  pageCount={totalPagesFromServer}
  state={tableState}
  onStateChange={(newState) => {
    setTableState(newState);
    fetchDataFromServer(newState);
  }}
/>
```

---

## useDataTable Hook

The headless hook that provides all table logic and state management without any UI. Use this when you want complete control over rendering.

### Import

```tsx
import { useDataTable } from '@morne004/headless-react-data-table';
```

### Type Signature

```tsx
function useDataTable<T>(
  props: Omit<DataTableProps<T>, 'getRowId' | 'components' | 'isLoading' | 'noDataMessage'>
): UseDataTableReturn<T>
```

### Parameters

Same as `DataTable` component props, except:
- No `getRowId` (not needed for headless hook)
- No `components` (you're rendering your own UI)
- No `isLoading` or `noDataMessage` (you handle UI states)

### Return Value

The hook returns an object with the following properties:

#### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `globalFilter` | `string` | Current global search text |
| `filters` | `Filter[]` | Active advanced filters |
| `sorting` | `SortConfig<T> \| null` | Current sort configuration |
| `pagination` | `{ pageIndex: number; pageSize: number }` | Current pagination state |
| `columnOrder` | `string[]` | Array of column IDs in display order |
| `columnVisibility` | `Record<string, boolean>` | Column visibility map (columnId → visible) |
| `columnWidths` | `Record<string, number>` | Column width map in pixels (columnId → width) |
| `rowSelection` | `Record<string, boolean>` | Selected rows map (rowId → selected) |
| `isCondensed` | `boolean` | Whether condensed row height is enabled |

#### Derived Data Properties

| Property | Type | Description |
|----------|------|-------------|
| `paginatedData` | `T[]` | Data for the current page (after filtering, sorting, pagination) |
| `sortedData` | `T[]` | All data after filtering and sorting (before pagination) |
| `pageCount` | `number` | Total number of pages |
| `totalCount` | `number` | Total number of rows (before pagination) |
| `orderedAndVisibleColumns` | `ColumnDef<T>[]` | Columns in display order with hidden columns removed |
| `allColumns` | `ColumnDef<T>[]` | All columns as originally provided |

#### Handler Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `handleGlobalFilterChange` | `(value: string) => void` | Update global search text (resets to page 0) |
| `applyFilters` | `(filters: Filter[]) => void` | Apply advanced filters (resets to page 0) |
| `setSort` | `(key: keyof T) => void` | Toggle sort on column (asc → desc → none) |
| `setSorting` | `(config: SortConfig<T> \| null) => void` | Set sort configuration directly |
| `setPageSize` | `(size: number) => void` | Set page size (resets to page 0) |
| `setPageIndex` | `(index: number) => void` | Set current page index (0-based) |
| `setColumnOrder` | `(order: string[]) => void` | Set column display order |
| `setColumnVisibility` | `(visibility: Record<string, boolean>) => void` | Set column visibility map |
| `setColumnWidths` | `(widths: Record<string, number>) => void` | Set column widths |
| `toggleColumnVisibility` | `(columnId: string) => void` | Toggle single column visibility |
| `toggleDensity` | `() => void` | Toggle between normal and condensed row heights |

#### Row Selection Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `setRowSelection` | `(selection: Record<string, boolean>) => void` | Set row selection map directly |
| `toggleRowSelection` | `(rowId: string) => void` | Toggle selection for single row |
| `toggleAllRows` | `() => void` | Toggle selection for all rows on current page |
| `getSelectedRows` | `() => T[]` | Get array of all selected row objects |
| `clearRowSelection` | `() => void` | Clear all row selections |

### Usage Example

```tsx
import { useDataTable } from '@morne004/headless-react-data-table';

function CustomTable() {
  const table = useDataTable({
    data: users,
    columns: columns,
  });

  return (
    <div>
      {/* Custom search bar */}
      <input
        value={table.globalFilter}
        onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
        placeholder="Search..."
      />

      {/* Custom table */}
      <table>
        <thead>
          <tr>
            {table.orderedAndVisibleColumns.map(col => (
              <th key={col.id} onClick={() => col.accessorKey && table.setSort(col.accessorKey)}>
                {col.header}
                {table.sorting?.key === col.accessorKey && (
                  <span>{table.sorting.direction === 'ascending' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.paginatedData.map(row => (
            <tr key={String((row as any).id)}>
              {table.orderedAndVisibleColumns.map(col => (
                <td key={col.id}>
                  {col.cell
                    ? col.cell({ row })
                    : col.accessorKey
                    ? String(row[col.accessorKey])
                    : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Custom pagination */}
      <div>
        <button
          onClick={() => table.setPageIndex(table.pagination.pageIndex - 1)}
          disabled={table.pagination.pageIndex === 0}
        >
          Previous
        </button>
        <span>
          Page {table.pagination.pageIndex + 1} of {table.pageCount}
        </span>
        <button
          onClick={() => table.setPageIndex(table.pagination.pageIndex + 1)}
          disabled={table.pagination.pageIndex >= table.pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## TypeScript Types

### ColumnDef<T>

Defines a column in the table.

```tsx
interface ColumnDef<T> {
  id: string;                                      // Required: unique column identifier
  header: string;                                  // Required: display text for column header
  accessorKey?: keyof T;                           // Optional: property key to access data
  cell?: (info: { row: T }) => React.ReactNode;   // Optional: custom cell renderer
  enableSorting?: boolean;                         // Optional: enable sorting (default: true if accessorKey exists)
}
```

#### Example

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name'
  },
  {
    id: 'salary',
    header: 'Salary',
    accessorKey: 'salary',
    cell: ({ row }) => `$${row.salary.toLocaleString()}`
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    enableSorting: false
  },
];
```

---

### Filter

Defines an advanced filter.

```tsx
interface Filter {
  id: string;         // Unique filter identifier
  column: string;     // Column ID to filter on
  operator: Operator; // Comparison operator
  value: string;      // Filter value
}
```

---

### Operator

Filter comparison operators.

```tsx
type Operator =
  | 'contains'      // Column value contains the filter value
  | 'equals'        // Column value exactly equals the filter value
  | 'startsWith'    // Column value starts with the filter value
  | 'endsWith'      // Column value ends with the filter value
  | 'greaterThan'   // Column value > filter value (numeric comparison)
  | 'lessThan';     // Column value < filter value (numeric comparison)
```

#### Example

```tsx
const filters: Filter[] = [
  { id: '1', column: 'status', operator: 'equals', value: 'active' },
  { id: '2', column: 'age', operator: 'greaterThan', value: '30' },
  { id: '3', column: 'name', operator: 'contains', value: 'john' },
];
```

---

### SortConfig<T>

Defines sorting configuration.

```tsx
interface SortConfig<T> {
  key: keyof T;                             // Property to sort by
  direction: 'ascending' | 'descending';    // Sort direction
}
```

#### Example

```tsx
const sorting: SortConfig<User> = {
  key: 'age',
  direction: 'descending'
};
```

---

### DataTableState

Complete internal state shape.

```tsx
interface DataTableState {
  // Pagination
  pageIndex: number;
  pageSize: number;

  // Sorting
  sorting: SortConfig<any> | null;

  // Filtering
  filters: Filter[];
  globalFilter: string;

  // Column management
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnWidths: Record<string, number>;

  // Row selection
  rowSelection: Record<string, boolean>;

  // UI state
  isCondensed: boolean;

  // Server-side flags (opt-in)
  manualPagination?: boolean;
  manualFiltering?: boolean;
  manualSorting?: boolean;
  totalRowCount?: number;
  pageCount?: number;
}
```

---

### ControlledDataTableState

Partial state for controlled mode. Any subset of `DataTableState`.

```tsx
type ControlledDataTableState = Partial<DataTableState>;
```

#### Example

```tsx
// Control only pagination and sorting
const [state, setState] = useState<ControlledDataTableState>({
  pageIndex: 0,
  pageSize: 25,
  sorting: { key: 'createdAt', direction: 'descending' },
});

<DataTable
  data={data}
  columns={columns}
  state={state}
  onStateChange={setState}
/>
```

---

### TableComponentProps<T>

Props passed to custom component slots (Toolbar, Pagination).

```tsx
interface TableComponentProps<T> {
  table: ReturnType<typeof useDataTable<T>>;  // Full table instance
}
```

#### Example

```tsx
const CustomToolbar = <T,>({ table }: TableComponentProps<T>) => {
  return (
    <div>
      <input
        value={table.globalFilter}
        onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
      />
      <span>{table.totalCount} total rows</span>
    </div>
  );
};
```

---

### FilterBuilderComponentProps<T>

Props passed to custom FilterBuilder component.

```tsx
interface FilterBuilderComponentProps<T> extends TableComponentProps<T> {
  showFilters: boolean;  // Whether filter UI should be shown
}
```

---

## Utility Functions

### exportToCsv

Export table data to CSV file.

#### Type Signature

```tsx
function exportToCsv<T extends object>(
  filename: string,
  rows: T[]
): void
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `filename` | `string` | Name of the CSV file (e.g., "users.csv") |
| `rows` | `T[]` | Array of objects to export |

#### Description

- Generates CSV from array of objects
- Uses object keys as column headers
- Handles quote escaping and special characters
- Handles multi-line values
- Triggers browser download automatically

#### Usage Examples

##### Export All Data

```tsx
import { exportToCsv } from '@morne004/headless-react-data-table';

<button onClick={() => exportToCsv('all-users.csv', users)}>
  Export All
</button>
```

##### Export Filtered/Sorted Data

```tsx
const table = useDataTable({ data: users, columns });

<button onClick={() => exportToCsv('filtered-users.csv', table.sortedData)}>
  Export Current View
</button>
```

##### Export with Timestamp

```tsx
const filename = `users_${new Date().toISOString()}.csv`;
exportToCsv(filename, table.sortedData);
// Creates: users_2024-01-15T10:30:00.000Z.csv
```

---

## Notes

### Type Safety

All components and hooks are fully generic. Always provide the type parameter:

```tsx
// ✅ Good - Type safe
<DataTable<User> data={users} columns={columns} />
const table = useDataTable<User>({ data: users, columns });

// ❌ Bad - No type checking
<DataTable data={users} columns={columns} />
```

### State Persistence

By default, the following state is persisted to localStorage:
- `globalFilter`
- `filters`
- `sorting`
- `pageSize`
- `columnOrder`
- `columnVisibility`
- `columnWidths`
- `rowSelection`
- `isCondensed`

**NOT persisted** (resets on page refresh):
- `pageIndex` - Always starts at 0

To disable persistence:

```tsx
<DataTable data={data} columns={columns} disablePersistence />
```

### Controlled vs Uncontrolled

You can use the table in three modes:

1. **Fully Uncontrolled** (default) - Table manages its own state
2. **Fully Controlled** - You manage all state externally
3. **Partially Controlled** - Mix of both (recommended for most use cases)

```tsx
// Partially controlled - control only sorting and pagination
const [state, setState] = useState<ControlledDataTableState>({
  sorting: { key: 'name', direction: 'ascending' },
  pageIndex: 0,
  pageSize: 25,
});

<DataTable
  state={state}
  onStateChange={setState}
  // ... other uncontrolled state managed internally
/>
```

### Server-Side Data Management

Enable manual flags for server-side data handling:

```tsx
const [tableState, setTableState] = useState<ControlledDataTableState>({});

<DataTable
  data={dataFromServer}           // Already filtered/sorted by server
  columns={columns}
  manualPagination                // Don't paginate client-side
  manualFiltering                 // Don't filter client-side
  manualSorting                   // Don't sort client-side
  totalRowCount={serverTotalRows}
  pageCount={serverTotalPages}
  state={tableState}
  onStateChange={(newState) => {
    setTableState(newState);
    // Fetch from server with new state
    fetchData(newState);
  }}
/>
```

---

## See Also

- [Quick Start Guide](./quick-start.md) - Get started quickly
- [Features Overview](./features-overview.md) - Learn about all features
- [Examples](./examples/README.md) - See practical examples
- [TypeScript Guide](./typescript-guide.md) - Type safety patterns
- [Customization Guide](./customization-guide.md) - Styling and customization
