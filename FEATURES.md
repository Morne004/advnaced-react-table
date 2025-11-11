# Features

Complete feature catalog for the Headless React Data Table library.

## Table of Contents

- [Core Data Features](#core-data-features)
  - [Sorting](#sorting)
  - [Filtering](#filtering)
  - [Pagination](#pagination)
  - [Global Search](#global-search)
- [UI Features](#ui-features)
  - [Column Visibility](#column-visibility)
  - [Column Reordering](#column-reordering)
  - [Column Resizing](#column-resizing)
  - [Condensed View](#condensed-view)
- [Data Export](#data-export)
  - [CSV Export](#csv-export)
- [State Management](#state-management)
  - [Persistent State](#persistent-state)
  - [Controlled Mode](#controlled-mode)
  - [Uncontrolled Mode](#uncontrolled-mode)
- [Customization](#customization)
  - [Headless Architecture](#headless-architecture)
  - [Component Slots](#component-slots)
  - [Custom Cell Renderers](#custom-cell-renderers)
- [TypeScript Support](#typescript-support)
- [Performance](#performance)

---

## Core Data Features

### Sorting

**What it does:**
Allows users to sort table data by clicking column headers. Supports ascending, descending, and unsorted states.

**How it works:**
- Click once: Sort ascending
- Click twice: Sort descending
- Click third time: Remove sorting

**Configuration:**

```typescript
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true  // Enable sorting for this column
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    enableSorting: false  // Disable sorting for this column
  }
];
```

**Accessing sort state:**

```typescript
const { sorting, setSort } = table;

// Current sort state
console.log(sorting); // { key: 'name', direction: 'ascending' } | null

// Programmatically set sort
setSort('age');
```

**Default behavior:**
- Sorting is enabled by default for all columns
- Uses locale-aware string comparison
- Handles null/undefined values (sorts them to the end)
- Supports numeric sorting

---

### Filtering

The library provides two types of filtering: global search and advanced column-specific filters.

#### Global Search

**What it does:**
Searches across all columns with a single search input.

**How it works:**
Case-insensitive substring matching across all column values (only columns with `accessorKey` defined).

**Usage:**

```typescript
const { globalFilter, handleGlobalFilterChange } = table;

<input
  type="text"
  value={globalFilter}
  onChange={(e) => handleGlobalFilterChange(e.target.value)}
  placeholder="Search all columns..."
/>
```

#### Advanced Filters

**What it does:**
Applies multiple column-specific filters with different operators.

**Supported operators:**

| Operator | Description | Example Use Case |
|----------|-------------|------------------|
| `contains` | Case-insensitive substring match | Name contains "John" |
| `equals` | Exact match | Status equals "active" |
| `startsWith` | Prefix match | Email starts with "admin" |
| `endsWith` | Suffix match | Domain ends with ".com" |
| `greaterThan` | Numeric comparison | Age > 25 |
| `lessThan` | Numeric comparison | Salary < 50000 |

**Usage:**

```typescript
import type { Filter } from '@morne004/headless-react-data-table';

const { filters, applyFilters } = table;

const newFilters: Filter[] = [
  {
    id: '1',
    column: 'age',
    operator: 'greaterThan',
    value: '25'
  },
  {
    id: '2',
    column: 'status',
    operator: 'equals',
    value: 'active'
  }
];

applyFilters(newFilters);
```

**Filter combination:**
- Multiple filters use AND logic (all must match)
- Global filter and advanced filters work together
- Filtering happens before sorting

---

### Pagination

**What it does:**
Splits large datasets into pages for better performance and UX.

**How it works:**
Client-side pagination with customizable page sizes.

**Configuration:**

```typescript
<DataTable
  data={data}
  columns={columns}
  initialState={{
    pageSize: 25,  // Default page size
    pageIndex: 0   // Start on first page
  }}
/>
```

**Available page sizes:**
- 10 rows
- 25 rows (default)
- 50 rows
- 100 rows

**Accessing pagination state:**

```typescript
const { pagination, pageCount, setPageSize, setPageIndex } = table;

// Current state
console.log(pagination); // { pageIndex: 0, pageSize: 25 }
console.log(pageCount); // Total number of pages

// Navigate
setPageIndex(0); // Go to first page
setPageSize(50); // Change page size
```

**Features:**
- First/previous/next/last page navigation
- Page size selector
- Current page indicator
- Automatic page adjustment when filters change

---

### Global Search

**What it does:**
Provides instant search across all table columns.

**How it works:**
- Searches all column values (columns with `accessorKey`)
- Case-insensitive matching
- Real-time results as you type
- Automatically resets to page 1 on search

**Usage:**

```typescript
const { globalFilter, handleGlobalFilterChange, sortedData, totalCount } = table;

<div>
  <input
    value={globalFilter}
    onChange={(e) => handleGlobalFilterChange(e.target.value)}
    placeholder="Search..."
  />
  {globalFilter && (
    <span>Showing {sortedData.length} of {totalCount} results</span>
  )}
</div>
```

**Best practices:**
- Debounce input for large datasets
- Show filtered count
- Provide clear feedback when no results found

---

## UI Features

### Column Visibility

**What it does:**
Allows users to show/hide columns dynamically.

**How it works:**
Toggle individual columns on/off with persistence to localStorage.

**Usage:**

```typescript
const { allColumns, columnVisibility, toggleColumnVisibility } = table;

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
```

**Features:**
- All columns visible by default
- State persists across page reloads
- Works with column reordering
- Affects only rendering (not data processing)

**Initial configuration:**

```typescript
<DataTable
  data={data}
  columns={columns}
  initialState={{
    columnVisibility: {
      'email': false,  // Hide email column by default
      'phone': false   // Hide phone column by default
    }
  }}
/>
```

---

### Column Reordering

**What it does:**
Lets users drag and drop columns to reorder them.

**How it works:**
- Drag column headers to new positions
- Order persists to localStorage
- Visual feedback during drag

**Usage:**

```typescript
const { columnOrder, setColumnOrder } = table;

// Column order is managed automatically
// Custom order can be set programmatically:
setColumnOrder(['id', 'name', 'age', 'email']);
```

**Initial configuration:**

```typescript
<DataTable
  data={data}
  columns={columns}
  initialState={{
    columnOrder: ['name', 'email', 'age', 'id']  // Custom initial order
  }}
/>
```

**Features:**
- Smooth drag animations
- Drop indicators
- State persistence
- Works with column visibility

---

### Column Resizing

**What it does:**
Allows users to manually adjust column widths by dragging resize handles.

**How it works:**
- Hover over column border to see resize handle
- Drag to adjust width
- Minimum width enforced (80px default)
- Widths persist to localStorage

**Configuration:**

The `DataTable` component manages column widths internally. Consumers can customize the minimum width:

```typescript
// In useColumnResizing hook (if customizing)
const { isResizing, getResizeHandler } = useColumnResizing({
  setColumnWidths,
  minWidth: 100  // Custom minimum width
});
```

**Features:**
- Visual resize cursor
- Smooth resizing experience
- Prevents columns from becoming too narrow
- Persists across sessions

**Behavior:**
- Fixed bug in v1.0.3: Resize no longer gets "stuck"
- Mouse leave cancels resize
- Clean event listener management

---

### Condensed View

**What it does:**
Toggles between normal and compact row spacing for information density.

**How it works:**
Boolean state that controls row padding, persisted to localStorage.

**Usage:**

```typescript
const { isCondensed, toggleDensity } = table;

// Toggle button
<button onClick={toggleDensity}>
  {isCondensed ? 'Normal View' : 'Condensed View'}
</button>

// Apply conditional styling
<td className={isCondensed ? 'py-2' : 'py-4'}>
  {cellContent}
</td>
```

**Initial configuration:**

```typescript
<DataTable
  data={data}
  columns={columns}
  initialState={{
    isCondensed: true  // Start in condensed mode
  }}
/>
```

**Features:**
- Automatic persistence
- Works in controlled/uncontrolled mode
- Consumers control actual styling
- Common pattern: `py-2` (condensed) vs `py-4` (normal)

---

## Data Export

### CSV Export

**What it does:**
Exports table data (filtered and sorted) to a downloadable CSV file.

**How it works:**
Utility function that converts data to CSV format and triggers browser download.

**Usage:**

```typescript
import { exportToCsv } from '@morne004/headless-react-data-table';

const { sortedData } = table;

<button onClick={() => exportToCsv('users.csv', sortedData)}>
  Export to CSV
</button>
```

**Features:**
- Exports current filtered/sorted view
- Proper CSV formatting
- Handles special characters
- Works with any data type (converts to string)

**Advanced usage:**

```typescript
// Export only specific columns
const exportData = sortedData.map(row => ({
  name: row.firstName + ' ' + row.lastName,
  email: row.email,
  status: row.status
}));

exportToCsv('users-minimal.csv', exportData);

// Export with timestamp
const timestamp = new Date().toISOString();
exportToCsv(`users-${timestamp}.csv`, sortedData);
```

---

## State Management

### Persistent State

**What it does:**
Automatically saves table state to `localStorage` so users don't lose their preferences.

**What persists:**
- Global filter (search term)
- Advanced filters
- Sorting configuration
- Page size
- Column order
- Column visibility
- Column widths
- View density (condensed/normal)

**What doesn't persist:**
- Current page index (always resets to page 1)

**How it works:**

Each state property is stored with a key prefix:
```
datatable_globalFilter
datatable_filters
datatable_sorting
datatable_pageSize
datatable_columnOrder
datatable_columnVisibility
datatable_columnWidths
datatable_isCondensed
```

**Disabling persistence:**

If you don't want localStorage persistence, use controlled mode:

```typescript
const [tableState, setTableState] = useState({...});

<DataTable
  data={data}
  columns={columns}
  state={tableState}
  onStateChange={setTableState}
/>
```

**Clearing persisted state:**

```typescript
// Clear all data table state
const keys = [
  'datatable_globalFilter',
  'datatable_filters',
  'datatable_sorting',
  'datatable_pageSize',
  'datatable_columnOrder',
  'datatable_columnVisibility',
  'datatable_columnWidths',
  'datatable_isCondensed'
];

keys.forEach(key => localStorage.removeItem(key));
```

---

### Controlled Mode

**What it does:**
Gives you full control over table state for advanced use cases like URL synchronization.

**How it works:**
Pass `state` and `onStateChange` props to manage state externally.

**Usage:**

```typescript
const [tableState, setTableState] = useState<Partial<DataTableState>>({
  pageSize: 10,
  pageIndex: 0,
  globalFilter: '',
  isCondensed: false
});

<DataTable
  data={data}
  columns={columns}
  state={tableState}
  onStateChange={(newState) => {
    setTableState(prev => ({ ...prev, ...newState }));
  }}
/>
```

**Partial control:**

You can control only specific state properties:

```typescript
const [pageSize, setPageSize] = useState(25);

<DataTable
  data={data}
  columns={columns}
  state={{ pageSize }}
  onStateChange={(newState) => {
    if ('pageSize' in newState) {
      setPageSize(newState.pageSize);
    }
  }}
/>
```

**Complete state synchronization:**

Fixed in v1.0.2 - `onStateChange` now receives complete state object:

```typescript
// Before v1.0.2 (broken)
onStateChange={(newState) => {
  setTableState(newState); // ❌ Lost other properties
}}

// After v1.0.2 (fixed)
onStateChange={(newState) => {
  setTableState(newState); // ✅ Complete state preserved
}}
```

**Use cases:**
- URL parameter synchronization
- Global state management (Redux, Zustand)
- Server-side state storage
- Multi-table coordination

---

### Uncontrolled Mode

**What it does:**
Default mode where the table manages its own state automatically.

**How it works:**
The library handles all state internally with automatic localStorage persistence.

**Usage:**

```typescript
<DataTable
  data={data}
  columns={columns}
  initialState={{
    pageSize: 25,
    sorting: { key: 'name', direction: 'ascending' },
    columnVisibility: { email: false }
  }}
/>
```

**When to use:**
- Simple implementations
- Don't need external state access
- Want automatic persistence
- Default behavior is sufficient

**Benefits:**
- Zero boilerplate
- Automatic persistence
- No state management needed
- Works out of the box

---

## Customization

### Headless Architecture

**What it is:**
The library provides logic and state management but no UI components, giving you complete styling control.

**How it works:**
- Library handles: sorting, filtering, pagination, state
- You handle: rendering, styling, layout, interactions

**Customization levels:**

**Level 1: Use default components with custom styles**
```typescript
<DataTable data={data} columns={columns} />
// Then style with CSS, Tailwind, etc.
```

**Level 2: Replace specific components**
```typescript
<DataTable
  data={data}
  columns={columns}
  components={{
    Toolbar: MyCustomToolbar,
    Pagination: MyCustomPagination
  }}
/>
```

**Level 3: Build completely custom UI**
```typescript
const table = useDataTable({ data, columns });
// Use table object to build your own UI from scratch
```

---

### Component Slots

**What they are:**
Replaceable component slots for toolbar, pagination, filters, and loading states.

**Available slots:**

#### Toolbar Slot
```typescript
import type { TableComponentProps } from '@morne004/headless-react-data-table';

const CustomToolbar = <T extends object>({ table }: TableComponentProps<T>) => {
  const { globalFilter, handleGlobalFilterChange } = table;

  return (
    <div>
      <input
        value={globalFilter}
        onChange={(e) => handleGlobalFilterChange(e.target.value)}
      />
    </div>
  );
};
```

#### Pagination Slot
```typescript
const CustomPagination = <T extends object>({ table }: TableComponentProps<T>) => {
  const { pagination, pageCount, setPageIndex } = table;

  return (
    <div>
      <button onClick={() => setPageIndex(pagination.pageIndex - 1)}>
        Previous
      </button>
      <span>Page {pagination.pageIndex + 1} of {pageCount}</span>
      <button onClick={() => setPageIndex(pagination.pageIndex + 1)}>
        Next
      </button>
    </div>
  );
};
```

#### FilterBuilder Slot
```typescript
const CustomFilterBuilder = <T extends object>({ table, showFilters }: FilterBuilderComponentProps<T>) => {
  const { filters, applyFilters } = table;

  if (!showFilters) return null;

  return (
    <div>
      {/* Custom filter UI */}
    </div>
  );
};
```

#### Skeleton Slot
```typescript
const CustomSkeleton = ({ rows = 5, cols }: { rows?: number; cols: number }) => {
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

**Using slots:**

```typescript
<DataTable
  data={data}
  columns={columns}
  components={{
    Toolbar: CustomToolbar,
    Pagination: CustomPagination,
    FilterBuilder: CustomFilterBuilder,
    Skeleton: CustomSkeleton
  }}
/>
```

---

### Custom Cell Renderers

**What they are:**
Functions that control how cell content is rendered.

**Usage:**

```typescript
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'firstName',
    header: 'Name',
    // Default: renders value directly
  },
  {
    id: 'salary',
    accessorKey: 'salary',
    header: 'Salary',
    cell: ({ row }) => {
      // Custom: format as currency
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(row.salary);
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      // Custom: render status badge
      const colors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colors[row.status]}`}>
          {row.status}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      // Custom: render action buttons
      return (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row.id)}>Edit</button>
          <button onClick={() => handleDelete(row.id)}>Delete</button>
        </div>
      );
    }
  }
];
```

**Common patterns:**
- Currency formatting
- Date formatting
- Status badges
- Images/avatars
- Action buttons
- Links
- Progress bars
- Icons

---

## TypeScript Support

**What it provides:**
Full type safety with generics for your custom data types.

**Type-safe data:**

```typescript
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
}

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'firstName', // ✅ Type-safe: must be keyof User
    header: 'Name'
  }
];

<DataTable<User>
  data={userData}
  columns={columns}
/>
```

**Type-safe custom components:**

```typescript
import type { TableComponentProps } from '@morne004/headless-react-data-table';

const MyToolbar = <T extends object>({ table }: TableComponentProps<T>) => {
  // table is fully typed with your data type T
  const { paginatedData } = table;

  return <div>...</div>;
};
```

**Exported types:**

```typescript
import type {
  ColumnDef,
  Filter,
  SortConfig,
  DataTableState,
  ControlledDataTableState,
  DataTableProps,
  TableComponentProps,
  FilterBuilderComponentProps,
  Operator
} from '@morne004/headless-react-data-table';
```

**Type inference:**

```typescript
// ColumnDef infers types from your data
const columns: ColumnDef<User>[] = [
  {
    id: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => {
      // row is typed as User
      return `${row.firstName} ${row.lastName}`;
    }
  }
];
```

---

## Performance

**Built-in optimizations:**

1. **Memoized computations** - Expensive operations cached with `useMemo`
2. **Efficient filtering** - Early exits and optimized loops
3. **Pagination** - Only renders current page
4. **Stable callbacks** - Functions memoized with `useCallback`

**Best practices:**

```typescript
// ✅ Memoize columns
const columns = useMemo(() => [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  // ...
], []);

// ✅ Memoize data
const data = useMemo(() => fetchData(), [dependencies]);

// ❌ Don't recreate on every render
const columns = [
  { id: 'name', accessorKey: 'name', header: 'Name' }
];
```

**Large datasets:**

For datasets over 10,000 rows, consider:
- Server-side pagination (see EXAMPLES.md)
- Virtual scrolling
- Debounced search
- Lazy loading

**Performance tips:**
- Keep cell renderers simple
- Avoid expensive calculations in `cell` functions
- Use `React.memo` for custom components
- Profile with React DevTools

---

## See Also

- **[README.md](./README.md)** - Library overview and quick start
- **[EXAMPLES.md](./EXAMPLES.md)** - Real-world usage examples
- **[USAGE.md](./USAGE.md)** - Complete API reference and integration guide
