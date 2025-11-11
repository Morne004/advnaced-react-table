# Usage Guide

Complete API reference and integration guide for the Headless React Data Table library.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Core Concepts](#core-concepts)
  - [Basic Setup](#basic-setup)
  - [Customization Levels](#customization-levels)
- [API Reference](#api-reference)
  - [DataTable Component](#datatable-component)
  - [useDataTable Hook](#usedatatable-hook)
  - [Column Definitions](#column-definitions)
  - [Component Slots](#component-slots)
  - [Utilities](#utilities)
- [TypeScript](#typescript)
- [State Management](#state-management-guide)
- [Styling](#styling-guide)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Migration Guides](#migration-guides)
- [Browser Support](#browser-support)

---

## Installation

### npm

```bash
npm install @morne004/headless-react-data-table
```

### yarn

```bash
yarn add @morne004/headless-react-data-table
```

### pnpm

```bash
pnpm add @morne004/headless-react-data-table
```

### Peer Dependencies

This library requires the following peer dependencies:

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

Most React projects already have these installed. If not:

```bash
npm install react react-dom
```

---

## Getting Started

### Core Concepts

This is a **headless** library, which means:

- ✅ **Logic included**: Sorting, filtering, pagination, state management
- ❌ **UI not included**: No pre-built components or styles
- 🎨 **You control**: All rendering, styling, and layout decisions

**Why headless?**
- Complete design freedom
- Works with any UI framework
- Smaller bundle size
- Easier to customize

**How it works:**

1. Library provides data and state via hooks
2. You render the UI using that data
3. You call library functions for interactions
4. Library updates state and gives you new data

### Basic Setup

Minimum code to get started:

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
}

const data: User[] = [
  { id: 1, name: 'John', email: 'john@example.com' },
];

const columns: ColumnDef<User>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
];

function App() {
  return <DataTable data={data} columns={columns} />;
}
```

### Customization Levels

Choose your level of control:

#### Level 1: Use Default Components + Custom Styles

Use the library's unstyled components and add your CSS:

```tsx
<DataTable data={data} columns={columns} />

<style>
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 12px; border: 1px solid #ddd; }
</style>
```

**Best for:** Quick prototypes, simple tables

#### Level 2: Replace Specific Components

Replace toolbar, pagination, or filters with your own:

```tsx
<DataTable
  data={data}
  columns={columns}
  components={{
    Toolbar: MyCustomToolbar,
    Pagination: MyCustomPagination,
  }}
/>
```

**Best for:** Custom UI while leveraging library features

#### Level 3: Build Completely Custom UI

Use the `useDataTable` hook directly and build everything:

```tsx
import { useDataTable } from '@morne004/headless-react-data-table';

function MyTable() {
  const table = useDataTable({ data, columns });

  return (
    <div>
      <input
        value={table.globalFilter}
        onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
      />
      <table>
        {/* Custom table rendering */}
      </table>
    </div>
  );
}
```

**Best for:** Maximum control, unique designs

---

## API Reference

### DataTable Component

The main component that renders a complete data table.

#### Props

```typescript
interface DataTableProps<T> {
  // Required
  data: T[];
  columns: ColumnDef<T>[];

  // Configuration
  getRowId?: (row: T) => string | number;
  initialState?: Partial<DataTableState>;

  // State
  isLoading?: boolean;
  noDataMessage?: React.ReactNode;

  // Components
  components?: {
    Toolbar?: React.ComponentType<TableComponentProps<T>>;
    Pagination?: React.ComponentType<TableComponentProps<T>>;
    FilterBuilder?: React.ComponentType<FilterBuilderComponentProps<T>>;
    Skeleton?: React.ComponentType<{ rows?: number; cols: number }>;
  };

  // Controlled mode
  state?: Partial<DataTableState>;
  onStateChange?: (state: Partial<DataTableState>) => void;
}
```

#### data (required)

**Type:** `T[]`

Array of objects to display in the table.

```tsx
const data = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
];

<DataTable data={data} columns={columns} />
```

**Notes:**
- Each object should have a unique identifier (default: `id` field)
- Objects can be of any shape
- Type safety via TypeScript generics

#### columns (required)

**Type:** `ColumnDef<T>[]`

Column definitions specifying what data to show and how.

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'name',           // Unique column ID
    accessorKey: 'name',  // Which field to display
    header: 'Name',       // Column header text
    enableSorting: true,  // Enable sorting (default: true)
    cell: ({ row }) => {  // Custom cell renderer (optional)
      return <strong>{row.name}</strong>;
    },
  },
];
```

See [Column Definitions](#column-definitions) for complete documentation.

#### getRowId

**Type:** `(row: T) => string | number`
**Default:** `(row) => row.id`

Function to extract unique identifier from each row.

```tsx
// Default behavior (uses 'id' field)
<DataTable data={data} columns={columns} />

// Custom ID field
<DataTable
  data={data}
  columns={columns}
  getRowId={(row) => row.userId}
/>

// Composite ID
<DataTable
  data={data}
  columns={columns}
  getRowId={(row) => `${row.type}-${row.id}`}
/>
```

#### initialState

**Type:** `Partial<DataTableState>`

Initial state for uncontrolled mode.

```tsx
<DataTable
  data={data}
  columns={columns}
  initialState={{
    pageSize: 50,
    pageIndex: 0,
    sorting: { key: 'name', direction: 'ascending' },
    globalFilter: '',
    filters: [],
    columnOrder: ['name', 'email', 'age'],
    columnVisibility: {
      email: false,  // Hide email column initially
    },
    isCondensed: false,
  }}
/>
```

**Available properties:**
- `pageIndex` (number) - Starting page (0-indexed)
- `pageSize` (number) - Rows per page
- `sorting` (SortConfig | null) - Initial sort
- `globalFilter` (string) - Initial search term
- `filters` (Filter[]) - Initial advanced filters
- `columnOrder` (string[]) - Initial column order
- `columnVisibility` (Record<string, boolean>) - Initial visibility
- `isCondensed` (boolean) - Initial density mode

#### isLoading

**Type:** `boolean`
**Default:** `false`

Show loading skeleton instead of data.

```tsx
const { data, isLoading } = useQuery(['users'], fetchUsers);

<DataTable
  data={data || []}
  columns={columns}
  isLoading={isLoading}
/>
```

#### noDataMessage

**Type:** `React.ReactNode`
**Default:** `"No data available."`

Message to show when data array is empty.

```tsx
<DataTable
  data={data}
  columns={columns}
  noDataMessage={
    <div className="text-center py-10">
      <h3>No users found</h3>
      <p>Try adjusting your search or filters</p>
    </div>
  }
/>
```

#### components

**Type:** `object`

Replace default components with your own.

```tsx
<DataTable
  data={data}
  columns={columns}
  components={{
    Toolbar: CustomToolbar,
    Pagination: CustomPagination,
    FilterBuilder: CustomFilterBuilder,
    Skeleton: CustomSkeleton,
  }}
/>
```

See [Component Slots](#component-slots) for details.

#### state

**Type:** `Partial<DataTableState>`

For controlled mode - externally managed state.

```tsx
const [tableState, setTableState] = useState({
  pageIndex: 0,
  pageSize: 25,
});

<DataTable
  data={data}
  columns={columns}
  state={tableState}
  onStateChange={setTableState}
/>
```

See [State Management](#state-management-guide) for details.

#### onStateChange

**Type:** `(state: Partial<DataTableState>) => void`

Callback when state changes in controlled mode.

```tsx
<DataTable
  data={data}
  columns={columns}
  state={tableState}
  onStateChange={(newState) => {
    setTableState(newState);
    // Optionally sync with URL, Redux, etc.
  }}
/>
```

**Note:** As of v1.0.2, receives complete state object (not partial).

---

### useDataTable Hook

Hook that provides table logic and state. Used internally by `DataTable` component, but you can use it directly for custom UIs.

#### Parameters

```typescript
interface UseDataTableParams<T> {
  data: T[];
  columns: ColumnDef<T>[];
  initialState?: Partial<DataTableState>;
  state?: Partial<DataTableState>;
  onStateChange?: (state: Partial<DataTableState>) => void;
}
```

#### Returns

```typescript
interface TableInstance<T> {
  // State
  globalFilter: string;
  filters: Filter[];
  sorting: SortConfig<T> | null;
  pagination: { pageIndex: number; pageSize: number };
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  isCondensed: boolean;

  // Derived Data
  paginatedData: T[];
  sortedData: T[];
  pageCount: number;
  totalCount: number;
  orderedAndVisibleColumns: ColumnDef<T>[];
  allColumns: ColumnDef<T>[];

  // Handlers
  handleGlobalFilterChange: (value: string) => void;
  applyFilters: (filters: Filter[]) => void;
  setSort: (key: keyof T) => void;
  setPageSize: (size: number) => void;
  setPageIndex: (index: number) => void;
  setColumnOrder: (order: string[]) => void;
  toggleColumnVisibility: (columnId: string) => void;
  toggleDensity: () => void;
}
```

#### Example

```tsx
import { useDataTable } from '@morne004/headless-react-data-table';

function CustomTable() {
  const table = useDataTable({
    data,
    columns,
    initialState: { pageSize: 10 },
  });

  return (
    <div>
      <input
        value={table.globalFilter}
        onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            {table.orderedAndVisibleColumns.map((col) => (
              <th key={col.id} onClick={() => table.setSort(col.accessorKey!)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.paginatedData.map((row, i) => (
            <tr key={i}>
              {table.orderedAndVisibleColumns.map((col) => (
                <td key={col.id}>
                  {col.cell
                    ? col.cell({ row })
                    : row[col.accessorKey!]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        Page {table.pagination.pageIndex + 1} of {table.pageCount}
        <button onClick={() => table.setPageIndex(table.pagination.pageIndex - 1)}>
          Previous
        </button>
        <button onClick={() => table.setPageIndex(table.pagination.pageIndex + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
```

---

### Column Definitions

Columns are defined using the `ColumnDef<T>` interface.

#### ColumnDef Interface

```typescript
interface ColumnDef<T> {
  id: string;
  accessorKey?: keyof T;
  header: string | (() => React.ReactNode);
  cell?: (info: { row: T }) => React.ReactNode;
  enableSorting?: boolean;
}
```

#### id (required)

**Type:** `string`

Unique identifier for the column.

```tsx
{ id: 'firstName', accessorKey: 'firstName', header: 'First Name' }
{ id: 'fullName', header: 'Full Name' } // No accessorKey = custom column
```

#### accessorKey

**Type:** `keyof T`

Which property of the data object to display.

```tsx
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { id: 'first', accessorKey: 'firstName', header: 'First' },
  { id: 'last', accessorKey: 'lastName', header: 'Last' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
];
```

**Notes:**
- Type-safe when using TypeScript
- Required for sorting and global search
- Omit for calculated/custom columns

#### header (required)

**Type:** `string | (() => React.ReactNode)`

Column header content.

```tsx
// String
{ id: 'name', header: 'Name' }

// Component (for custom header rendering)
{ id: 'name', header: () => <span className="font-bold">Name</span> }

// With icon
{
  id: 'email',
  header: () => (
    <div className="flex items-center gap-2">
      <MailIcon />
      <span>Email</span>
    </div>
  )
}
```

#### cell

**Type:** `(info: { row: T }) => React.ReactNode`

Custom cell renderer function.

```tsx
// Format as currency
{
  id: 'price',
  accessorKey: 'price',
  header: 'Price',
  cell: ({ row }) => `$${row.price.toFixed(2)}`
}

// Render component
{
  id: 'status',
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => <StatusBadge status={row.status} />
}

// Access nested properties
{
  id: 'author',
  accessorKey: 'author',
  header: 'Author',
  cell: ({ row }) => `${row.author.firstName} ${row.author.lastName}`
}

// Action buttons
{
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) => (
    <div>
      <button onClick={() => edit(row.id)}>Edit</button>
      <button onClick={() => delete(row.id)}>Delete</button>
    </div>
  )
}
```

#### enableSorting

**Type:** `boolean`
**Default:** `true`

Whether this column can be sorted.

```tsx
// Sortable (default)
{ id: 'name', accessorKey: 'name', header: 'Name' }

// Not sortable
{ id: 'actions', header: 'Actions', enableSorting: false }
```

---

### Component Slots

You can replace default components with your own implementations.

#### Toolbar Slot

**Type:** `React.ComponentType<TableComponentProps<T>>`

Replaces the search/filter/action toolbar.

**Props received:**

```typescript
interface TableComponentProps<T> {
  table: {
    // All properties from useDataTable hook
    globalFilter: string;
    handleGlobalFilterChange: (value: string) => void;
    filters: Filter[];
    sortedData: T[];
    totalCount: number;
    allColumns: ColumnDef<T>[];
    columnVisibility: Record<string, boolean>;
    toggleColumnVisibility: (columnId: string) => void;
    isCondensed: boolean;
    toggleDensity: () => void;
    // ... etc
  };
}
```

**Example:**

```tsx
const MyToolbar = ({ table }) => {
  const { globalFilter, handleGlobalFilterChange, sortedData } = table;

  return (
    <div>
      <input
        value={globalFilter}
        onChange={(e) => handleGlobalFilterChange(e.target.value)}
      />
      <span>Showing {sortedData.length} rows</span>
    </div>
  );
};

<DataTable
  data={data}
  columns={columns}
  components={{ Toolbar: MyToolbar }}
/>
```

#### Pagination Slot

**Type:** `React.ComponentType<TableComponentProps<T>>`

Replaces pagination controls.

**Props received:** Same as Toolbar slot

**Example:**

```tsx
const MyPagination = ({ table }) => {
  const { pagination, pageCount, setPageIndex, setPageSize } = table;

  return (
    <div>
      <button onClick={() => setPageIndex(pagination.pageIndex - 1)}>
        Previous
      </button>
      <span>Page {pagination.pageIndex + 1} of {pageCount}</span>
      <button onClick={() => setPageIndex(pagination.pageIndex + 1)}>
        Next
      </button>
      <select
        value={pagination.pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
};
```

#### FilterBuilder Slot

**Type:** `React.ComponentType<FilterBuilderComponentProps<T>>`

Replaces advanced filter UI.

**Props received:**

```typescript
interface FilterBuilderComponentProps<T> extends TableComponentProps<T> {
  showFilters: boolean;
}
```

**Example:**

```tsx
const MyFilterBuilder = ({ table, showFilters }) => {
  if (!showFilters) return null;

  const { filters, applyFilters, allColumns } = table;

  return (
    <div>
      {/* Your custom filter UI */}
    </div>
  );
};
```

#### Skeleton Slot

**Type:** `React.ComponentType<{ rows?: number; cols: number }>`

Replaces loading skeleton.

**Props received:**
- `rows` (number, optional) - Number of skeleton rows (default: 5)
- `cols` (number) - Number of columns

**Example:**

```tsx
const MySkeleton = ({ rows = 5, cols }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j}>
              <div className="animate-pulse bg-gray-200 h-4 rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
```

---

### Utilities

#### exportToCsv

Exports data to a CSV file.

**Type:**

```typescript
function exportToCsv<T extends object>(
  filename: string,
  rows: T[]
): void
```

**Parameters:**
- `filename` (string) - Name of the downloaded file (should end with .csv)
- `rows` (T[]) - Array of objects to export

**Example:**

```tsx
import { exportToCsv } from '@morne004/headless-react-data-table';

function MyTable() {
  const table = useDataTable({ data, columns });

  const handleExport = () => {
    exportToCsv('users.csv', table.sortedData);
  };

  return (
    <div>
      <button onClick={handleExport}>Export to CSV</button>
      {/* table */}
    </div>
  );
}
```

**Notes:**
- Exports current filtered/sorted view
- All object properties become CSV columns
- Handles special characters and escaping
- Triggers browser download

---

## TypeScript

The library is written in TypeScript and provides full type safety.

### Type-Safe Data

Use generics to ensure type safety:

```tsx
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  role: 'admin' | 'user' | 'guest';
}

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'firstName', // ✅ Type-checked: must be keyof User
    header: 'Name',
    cell: ({ row }) => {
      // ✅ row is typed as User
      return `${row.firstName} ${row.lastName}`;
    },
  },
];

<DataTable<User> data={users} columns={columns} />
```

### Exported Types

```typescript
import type {
  // Column Types
  ColumnDef,

  // Filter Types
  Filter,
  Operator,

  // Sort Types
  SortConfig,

  // State Types
  DataTableState,
  ControlledDataTableState,

  // Component Types
  DataTableProps,
  TableComponentProps,
  FilterBuilderComponentProps,
} from '@morne004/headless-react-data-table';
```

### Type-Safe Custom Components

```tsx
import type { TableComponentProps } from '@morne004/headless-react-data-table';

const MyToolbar = <T extends object>({
  table
}: TableComponentProps<T>) => {
  // table is fully typed
  const { globalFilter, handleGlobalFilterChange } = table;

  return <div>...</div>;
};
```

### Type Inference

TypeScript infers types from your data:

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => {
      // row.firstName is string (inferred from User type)
      // row.invalidProp // ❌ TypeScript error
      return `${row.firstName} ${row.lastName}`;
    },
  },
];
```

---

## State Management Guide

The library supports two state management modes.

### Uncontrolled Mode (Default)

Library manages state internally with automatic localStorage persistence.

**Usage:**

```tsx
<DataTable
  data={data}
  columns={columns}
  initialState={{
    pageSize: 50,
    sorting: { key: 'name', direction: 'ascending' },
  }}
/>
```

**What persists:**
- Global filter
- Advanced filters
- Sorting
- Page size
- Column order
- Column visibility
- Column widths
- View density

**When to use:**
- Simple implementations
- Don't need external state access
- Want automatic persistence

### Controlled Mode

You manage state externally for advanced use cases.

**Usage:**

```tsx
import { useState } from 'react';
import type { DataTableState } from '@morne004/headless-react-data-table';

function MyTable() {
  const [tableState, setTableState] = useState<Partial<DataTableState>>({
    pageIndex: 0,
    pageSize: 25,
    globalFilter: '',
  });

  return (
    <DataTable
      data={data}
      columns={columns}
      state={tableState}
      onStateChange={setTableState}
    />
  );
}
```

**Partial control:**

Control only specific properties:

```tsx
const [pageSize, setPageSize] = useState(25);

<DataTable
  data={data}
  columns={columns}
  state={{ pageSize }}
  onStateChange={(newState) => {
    if ('pageSize' in newState) {
      setPageSize(newState.pageSize!);
    }
  }}
/>
```

**When to use:**
- URL synchronization
- Global state management (Redux, Zustand)
- Server-side state
- Multi-table coordination
- Custom persistence logic

---

## Styling Guide

Since this is a headless library, styling is completely up to you.

### Approach

The library renders semantic HTML with no built-in styles. You apply styling via:

- CSS classes
- CSS-in-JS
- CSS Modules
- Tailwind CSS
- UI libraries (Material-UI, Ant Design, etc.)

### Tailwind CSS

```tsx
<table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      {columns.map(col => (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          {col.header}
        </th>
      ))}
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {data.map((row, i) => (
      <tr key={i} className="hover:bg-gray-50">
        {columns.map(col => (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {col.cell ? col.cell({ row }) : row[col.accessorKey!]}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

### CSS Modules

```tsx
import styles from './Table.module.css';

<table className={styles.table}>
  <thead className={styles.thead}>
    {/* ... */}
  </thead>
</table>
```

### styled-components

```tsx
import styled from 'styled-components';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTh = styled.th`
  padding: 12px;
  background: #f5f5f5;
  font-weight: 600;
`;

<StyledTable>
  <thead>
    <tr>
      {columns.map(col => (
        <StyledTh key={col.id}>{col.header}</StyledTh>
      ))}
    </tr>
  </thead>
</StyledTable>
```

---

## Performance

### Built-in Optimizations

The library includes several performance optimizations:

- `useMemo` for expensive computations
- `useCallback` for stable function references
- Efficient filtering and sorting algorithms
- Only renders current page (pagination)

### Best Practices

**1. Memoize columns:**

```tsx
const columns = useMemo(() => [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  // ...
], []);
```

**2. Memoize data:**

```tsx
const data = useMemo(() => fetchData(), [dependencies]);
```

**3. Simple cell renderers:**

```tsx
// ✅ Good
cell: ({ row }) => row.name.toUpperCase()

// ❌ Avoid complex calculations
cell: ({ row }) => {
  // Expensive operation on every render
  return complexCalculation(row);
}
```

**4. Use React.memo for custom components:**

```tsx
const MyToolbar = React.memo(({ table }) => {
  return <div>...</div>;
});
```

### Large Datasets

For 10,000+ rows:

1. **Server-side pagination** - Load only current page from API
2. **Debounced search** - Delay API calls during typing
3. **Virtual scrolling** - Use react-virtual or similar
4. **Lazy loading** - Load data as user scrolls

See [EXAMPLES.md](./EXAMPLES.md) for implementation examples.

---

## Troubleshooting

### Common Issues

**Issue:** Table not updating when data changes

**Solution:** Ensure data reference changes when updated:

```tsx
// ❌ Wrong - mutating array
data.push(newItem);

// ✅ Correct - new array reference
setData([...data, newItem]);
```

---

**Issue:** Column visibility not persisting

**Solution:** Ensure you're using uncontrolled mode or properly managing state in controlled mode:

```tsx
// Uncontrolled (auto-persists)
<DataTable data={data} columns={columns} />

// Controlled (you handle persistence)
<DataTable
  data={data}
  columns={columns}
  state={tableState}
  onStateChange={setTableState}
/>
```

---

**Issue:** Sorting not working

**Solution:** Ensure column has `accessorKey` defined:

```tsx
// ❌ Won't sort - no accessorKey
{ id: 'name', header: 'Name' }

// ✅ Will sort
{ id: 'name', accessorKey: 'name', header: 'Name' }
```

---

**Issue:** Performance issues with large datasets

**Solutions:**
1. Implement server-side pagination
2. Memoize columns and data
3. Simplify cell renderers
4. Use React DevTools Profiler to identify bottlenecks

---

## Migration Guides

### From TanStack Table

Key differences:

| TanStack Table | This Library |
|----------------|--------------|
| `@tanstack/react-table` | `@morne004/headless-react-data-table` |
| `useReactTable()` | `useDataTable()` |
| `columnHelper` | Direct `ColumnDef` objects |
| `getCoreRowModel()` | Handled internally |
| Client + Server modes | Primarily client-side |

**Migration steps:**

1. Change import:
```tsx
// Before
import { useReactTable } from '@tanstack/react-table';

// After
import { useDataTable } from '@morne004/headless-react-data-table';
```

2. Update column definitions:
```tsx
// Before
const columns = columnHelper.accessor('name', {
  header: 'Name',
});

// After
const columns: ColumnDef<User>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
];
```

3. Update hook usage:
```tsx
// Before
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});

// After
const table = useDataTable({
  data,
  columns,
});
```

---

## Browser Support

Supports all modern browsers:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

**Minimum versions:**
- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+

**Not supported:**
- Internet Explorer

---

## See Also

- **[README.md](./README.md)** - Library overview and quick start
- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[EXAMPLES.md](./EXAMPLES.md)** - Real-world usage examples
- **[GitHub Issues](https://github.com/Morne004/advnaced-react-table/issues)** - Report bugs or request features
- **[npm Package](https://www.npmjs.com/package/@morne004/headless-react-data-table)** - View on npm
