# Features Overview

Comprehensive guide to all features available in **@morne004/headless-react-data-table** with complete examples.

---

## Table of Contents

1. [Global Search](#global-search)
2. [Advanced Filtering](#advanced-filtering)
3. [Sorting](#sorting)
4. [Pagination](#pagination)
5. [Column Visibility](#column-visibility)
6. [Column Reordering](#column-reordering)
7. [Column Resizing](#column-resizing)
8. [Row Selection](#row-selection)
9. [Density Toggle](#density-toggle)
10. [CSV Export](#csv-export)
11. [State Persistence](#state-persistence)
12. [Loading States](#loading-states)
13. [Server-Side Data Management](#server-side-data-management)

---

## Global Search

Search across all columns simultaneously with a single text input.

### How It Works

- Searches through all column values (converted to strings)
- Case-insensitive matching
- Automatically resets to page 0 when search changes
- Persisted to localStorage

### Using with DataTable Component

The default toolbar includes a search bar automatically.

```tsx
<DataTable<User> data={users} columns={columns} />
// Search bar is included by default ✅
```

### Using with useDataTable Hook

```tsx
const table = useDataTable({ data: users, columns });

<input
  type="text"
  value={table.globalFilter}
  onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
  placeholder="Search..."
/>
```

### Programmatic Search

```tsx
// Set initial search
<DataTable
  data={users}
  columns={columns}
  initialState={{
    globalFilter: 'john',  // Pre-fill search with "john"
  }}
/>

// With useDataTable
const table = useDataTable({
  data: users,
  columns,
  initialState: { globalFilter: 'active' }
});
```

### Controlled Search

```tsx
const [searchTerm, setSearchTerm] = useState('');

<DataTable
  data={users}
  columns={columns}
  state={{ globalFilter: searchTerm }}
  onStateChange={(newState) => {
    if (newState.globalFilter !== undefined) {
      setSearchTerm(newState.globalFilter);
    }
  }}
/>
```

---

## Advanced Filtering

Create complex multi-column filters with various operators.

### Available Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `contains` | Column value contains the filter value | `name contains "john"` |
| `equals` | Exact match | `status equals "active"` |
| `startsWith` | Column value starts with filter value | `email startsWith "admin"` |
| `endsWith` | Column value ends with filter value | `email endsWith "@company.com"` |
| `greaterThan` | Numeric comparison (>) | `age greaterThan "30"` |
| `lessThan` | Numeric comparison (<) | `salary lessThan "50000"` |

### Using with DataTable Component

Click the "Filters" button in the default toolbar to open the filter builder.

```tsx
<DataTable<User> data={users} columns={columns} />
// Click "Filters" button to add/edit filters
```

### Using with useDataTable Hook

```tsx
import type { Filter } from '@morne004/headless-react-data-table';

const table = useDataTable({ data: users, columns });

// Apply filters programmatically
const filters: Filter[] = [
  {
    id: '1',
    column: 'status',
    operator: 'equals',
    value: 'active'
  },
  {
    id: '2',
    column: 'age',
    operator: 'greaterThan',
    value: '30'
  }
];

table.applyFilters(filters);
```

### Multiple Filters (AND Logic)

All filters are combined with AND logic:

```tsx
const filters: Filter[] = [
  { id: '1', column: 'status', operator: 'equals', value: 'active' },
  { id: '2', column: 'department', operator: 'equals', value: 'Engineering' },
  { id: '3', column: 'salary', operator: 'greaterThan', value: '80000' }
];

// Results: Active AND Engineering AND Salary > 80000
table.applyFilters(filters);
```

### Initial Filters

```tsx
<DataTable
  data={users}
  columns={columns}
  initialState={{
    filters: [
      { id: '1', column: 'status', operator: 'equals', value: 'active' }
    ]
  }}
/>
```

---

## Sorting

Click column headers to sort data in ascending, descending, or no order.

### How It Works

- Click once: Sort ascending
- Click twice: Sort descending
- Click three times: Clear sort
- Only one column can be sorted at a time
- Automatically resets to page 0 when sort changes
- Persisted to localStorage

### Enable/Disable Sorting Per Column

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    enableSorting: true,  // ✅ Sortable (default if accessorKey exists)
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    enableSorting: false,  // ❌ Not sortable
  },
];
```

### Using with DataTable Component

Click column headers to sort (default behavior).

### Using with useDataTable Hook

```tsx
const table = useDataTable({ data: users, columns });

// Toggle sort on click
<th onClick={() => table.setSort('age')}>
  Age
  {table.sorting?.key === 'age' && (
    <span>{table.sorting.direction === 'ascending' ? ' ↑' : ' ↓'}</span>
  )}
</th>
```

### Programmatic Sorting

#### Toggle Sort

```tsx
table.setSort('age');  // Cycles through: asc → desc → none
```

#### Set Sort Directly

```tsx
table.setSorting({
  key: 'createdAt',
  direction: 'descending'
});

// Or clear sort
table.setSorting(null);
```

### Initial Sort

```tsx
<DataTable
  data={users}
  columns={columns}
  initialState={{
    sorting: { key: 'createdAt', direction: 'descending' }
  }}
/>
```

---

## Pagination

Navigate through large datasets with configurable page sizes.

### Default Behavior

- **Default page size:** 10 rows
- **Page size options:** 10, 25, 50, 100
- **Page index:** 0-based (page 1 = index 0)
- Automatically adjusts when filtered data changes
- Page size persisted to localStorage
- Page index resets to 0 on page refresh

### Using with DataTable Component

Pagination controls are included at the bottom by default.

### Using with useDataTable Hook

```tsx
const table = useDataTable({ data: users, columns });

<div>
  {/* Page size selector */}
  <select
    value={table.pagination.pageSize}
    onChange={(e) => table.setPageSize(Number(e.target.value))}
  >
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
  </select>

  {/* Page info */}
  <span>
    Page {table.pagination.pageIndex + 1} of {table.pageCount}
  </span>

  {/* Navigation buttons */}
  <button
    onClick={() => table.setPageIndex(0)}
    disabled={table.pagination.pageIndex === 0}
  >
    First
  </button>
  <button
    onClick={() => table.setPageIndex(table.pagination.pageIndex - 1)}
    disabled={table.pagination.pageIndex === 0}
  >
    Previous
  </button>
  <button
    onClick={() => table.setPageIndex(table.pagination.pageIndex + 1)}
    disabled={table.pagination.pageIndex >= table.pageCount - 1}
  >
    Next
  </button>
  <button
    onClick={() => table.setPageIndex(table.pageCount - 1)}
    disabled={table.pagination.pageIndex >= table.pageCount - 1}
  >
    Last
  </button>
</div>
```

### Custom Initial Page Size

```tsx
<DataTable
  data={users}
  columns={columns}
  initialState={{
    pageSize: 50,  // Start with 50 rows per page
  }}
/>
```

### Accessing Paginated Data

```tsx
const table = useDataTable({ data: users, columns });

// Current page data (after filtering, sorting, pagination)
console.log(table.paginatedData);  // e.g., 10 rows

// All data (after filtering, sorting, before pagination)
console.log(table.sortedData);  // e.g., 237 rows

// Total count
console.log(table.totalCount);  // e.g., 237
console.log(table.pageCount);   // e.g., 24 pages (at 10 per page)
```

---

## Column Visibility

Show and hide columns dynamically.

### How It Works

- All columns visible by default
- Visibility state persisted to localStorage
- Default toolbar includes "Columns" dropdown

### Using with DataTable Component

Click "Columns" button in the toolbar to toggle column visibility.

### Using with useDataTable Hook

```tsx
const table = useDataTable({ data: users, columns });

{table.allColumns.map(col => (
  <label key={col.id}>
    <input
      type="checkbox"
      checked={table.columnVisibility[col.id] ?? true}
      onChange={() => table.toggleColumnVisibility(col.id)}
    />
    {col.header}
  </label>
))}
```

### Programmatic Control

```tsx
// Toggle single column
table.toggleColumnVisibility('email');

// Set visibility for multiple columns
table.setColumnVisibility({
  email: false,
  phone: false,
  address: true,
});
```

### Initial Visibility

```tsx
<DataTable
  data={users}
  columns={columns}
  initialState={{
    columnVisibility: {
      email: false,    // Hide email column
      ssn: false,      // Hide SSN column
    }
  }}
/>
```

### Get Visible Columns

```tsx
const table = useDataTable({ data: users, columns });

// Only visible columns in display order
console.log(table.orderedAndVisibleColumns);

// All columns (includes hidden)
console.log(table.allColumns);
```

---

## Column Reordering

Drag and drop column headers to reorder columns.

### How It Works

- Drag column header to new position
- Order persisted to localStorage
- Disabled during column resize (to prevent conflicts)
- Works automatically with DataTable component

### Using with DataTable Component

Simply drag column headers to reorder (default behavior).

### Using with useDataTable Hook

```tsx
// Implementing drag-and-drop requires additional libraries
// See examples/custom-components.md for full implementation

const table = useDataTable({ data: users, columns });

// Set column order programmatically
table.setColumnOrder(['id', 'name', 'email', 'status']);
```

### Initial Order

```tsx
<DataTable
  data={users}
  columns={columns}
  initialState={{
    columnOrder: ['status', 'name', 'email', 'id'],  // Custom order
  }}
/>
```

---

## Column Resizing

Drag column separator to adjust column widths.

### How It Works

- Drag the separator between column headers
- Minimum width: 80px (default)
- Widths persisted to localStorage
- Column drag (reordering) disabled during resize

### Using with DataTable Component

Drag column separators to resize (default behavior).

### Using with useDataTable Hook

```tsx
const table = useDataTable({ data: users, columns });

// Set widths programmatically
table.setColumnWidths({
  name: 200,
  email: 300,
  status: 120,
});

// Get current widths
console.log(table.columnWidths);  // { name: 200, email: 300, ... }
```

### Initial Widths

```tsx
<DataTable
  data={users}
  columns={columns}
  initialState={{
    columnWidths: {
      name: 250,
      email: 350,
    }
  }}
/>
```

---

## Row Selection

Select individual rows or all rows with checkboxes.

### Enable Row Selection

```tsx
<DataTable<User>
  data={users}
  columns={columns}
  enableRowSelection  // Adds checkbox column
/>
```

### Using with useDataTable Hook

```tsx
const table = useDataTable({ data: users, columns });

// Toggle single row
table.toggleRowSelection('user-123');

// Toggle all rows on current page
table.toggleAllRows();

// Get selected rows
const selectedRows = table.getSelectedRows();
console.log(selectedRows);  // Array of selected user objects

// Clear all selections
table.clearRowSelection();

// Set selection programmatically
table.setRowSelection({
  'user-123': true,
  'user-456': true,
});
```

### Check If Row Is Selected

```tsx
const isSelected = table.rowSelection[rowId];
```

### Bulk Actions Example

```tsx
const table = useDataTable({ data: users, columns });

<button
  onClick={() => {
    const selected = table.getSelectedRows();
    console.log(`Deleting ${selected.length} users`);
    // Perform bulk delete
  }}
  disabled={table.getSelectedRows().length === 0}
>
  Delete Selected ({table.getSelectedRows().length})
</button>
```

See [Advanced Features Example](./examples/advanced-features.md#row-selection) for complete implementation.

---

## Density Toggle

Switch between normal and condensed row heights.

### How It Works

- **Normal mode:** Standard row padding
- **Condensed mode:** Reduced padding for more rows on screen
- State persisted to localStorage
- Default toolbar includes density toggle button

### Using with DataTable Component

Click the density toggle button in the toolbar (icon changes based on state).

### Using with useDataTable Hook

```tsx
const table = useDataTable({ data: users, columns });

<button onClick={table.toggleDensity}>
  {table.isCondensed ? 'Normal View' : 'Condensed View'}
</button>

// Apply CSS class based on state
<table className={table.isCondensed ? 'table-condensed' : 'table-normal'}>
  {/* ... */}
</table>
```

### Initial Density

```tsx
<DataTable
  data={users}
  columns={columns}
  initialState={{
    isCondensed: true,  // Start in condensed mode
  }}
/>
```

---

## CSV Export

Export table data to CSV file with one click.

### Import

```tsx
import { exportToCsv } from '@morne004/headless-react-data-table';
```

### Using with DataTable Component

Click "Export All" button in the default toolbar.

### Using with useDataTable Hook

```tsx
import { exportToCsv } from '@morne004/headless-react-data-table';

const table = useDataTable({ data: users, columns });

// Export all data (with current filters and sorting)
<button onClick={() => exportToCsv('users.csv', table.sortedData)}>
  Export to CSV
</button>

// Export only visible columns
const visibleData = table.sortedData.map(row => {
  const visibleRow: any = {};
  table.orderedAndVisibleColumns.forEach(col => {
    if (col.accessorKey) {
      visibleRow[col.accessorKey] = row[col.accessorKey];
    }
  });
  return visibleRow;
});

<button onClick={() => exportToCsv('users.csv', visibleData)}>
  Export Visible Columns
</button>
```

### Export with Timestamp

```tsx
const filename = `users_${new Date().toISOString().split('T')[0]}.csv`;
exportToCsv(filename, table.sortedData);
// Creates: users_2024-01-15.csv
```

### Export Selected Rows

```tsx
const selectedRows = table.getSelectedRows();
exportToCsv('selected_users.csv', selectedRows);
```

See [CSV Export Reference](./api-reference.md#exporttocsv) for more details.

---

## State Persistence

Automatically save and restore table state across page refreshes.

### What Gets Persisted

✅ **Saved to localStorage:**
- Global search text
- Advanced filters
- Sorting configuration
- Page size (not page index)
- Column order
- Column visibility
- Column widths
- Row selection
- Density mode (normal/condensed)

❌ **NOT persisted:**
- Page index (always resets to 0)

### Storage Keys

All state is stored in localStorage with these keys:
- `datatable_globalFilter`
- `datatable_filters`
- `datatable_sorting`
- `datatable_pageSize`
- `datatable_columnOrder`
- `datatable_columnVisibility`
- `datatable_columnWidths`
- `datatable_rowSelection`
- `datatable_isCondensed`

### Disable Persistence

```tsx
<DataTable
  data={users}
  columns={columns}
  disablePersistence  // State will not be saved to localStorage
/>
```

### Clear Persisted State

```tsx
// Clear all table state from localStorage
localStorage.removeItem('datatable_globalFilter');
localStorage.removeItem('datatable_filters');
localStorage.removeItem('datatable_sorting');
localStorage.removeItem('datatable_pageSize');
localStorage.removeItem('datatable_columnOrder');
localStorage.removeItem('datatable_columnVisibility');
localStorage.removeItem('datatable_columnWidths');
localStorage.removeItem('datatable_rowSelection');
localStorage.removeItem('datatable_isCondensed');
```

### Custom Storage Keys

To use custom storage keys or implement your own persistence logic, use controlled mode with your own state management:

```tsx
const [tableState, setTableState] = useState<ControlledDataTableState>(() => {
  // Load from custom storage
  const saved = localStorage.getItem('my_custom_table_state');
  return saved ? JSON.parse(saved) : {};
});

useEffect(() => {
  // Save to custom storage
  localStorage.setItem('my_custom_table_state', JSON.stringify(tableState));
}, [tableState]);

<DataTable
  data={users}
  columns={columns}
  state={tableState}
  onStateChange={setTableState}
  disablePersistence  // Disable default persistence
/>
```

---

## Loading States

Show skeleton loaders while data is being fetched.

### Using with DataTable Component

```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchUsers().then(data => {
    setUsers(data);
    setIsLoading(false);
  });
}, []);

<DataTable<User>
  data={users}
  columns={columns}
  isLoading={isLoading}  // Shows skeleton rows
/>
```

### Custom Skeleton Component

```tsx
const CustomSkeleton = ({ rows = 5, cols }: { rows?: number; cols: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j}>
              <div className="skeleton-loader" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

<DataTable
  data={users}
  columns={columns}
  isLoading={isLoading}
  components={{
    Skeleton: CustomSkeleton
  }}
/>
```

### Empty State

```tsx
<DataTable<User>
  data={[]}
  columns={columns}
  noDataMessage={
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h3>No users found</h3>
      <p>Try adjusting your search or filter criteria.</p>
      <button onClick={handleReset}>Reset Filters</button>
    </div>
  }
/>
```

---

## Server-Side Data Management

Handle filtering, sorting, and pagination on the server for large datasets.

### When to Use

Use server-side mode when:
- Dataset is too large to load entirely (>10,000 rows)
- Filtering/sorting is expensive
- Data comes from a database with built-in pagination

### Enable Server-Side Mode

```tsx
const [users, setUsers] = useState<User[]>([]);
const [totalRows, setTotalRows] = useState(0);
const [pageCount, setPageCount] = useState(0);
const [tableState, setTableState] = useState<ControlledDataTableState>({});

const fetchUsers = async (state: ControlledDataTableState) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: state.pageIndex ?? 0,
      pageSize: state.pageSize ?? 10,
      search: state.globalFilter ?? '',
      filters: state.filters ?? [],
      sorting: state.sorting ?? null,
    })
  });

  const data = await response.json();
  setUsers(data.users);
  setTotalRows(data.totalRows);
  setPageCount(data.totalPages);
};

useEffect(() => {
  fetchUsers(tableState);
}, [tableState]);

<DataTable<User>
  data={users}                         // Data from server
  columns={columns}
  manualPagination                     // Server handles pagination
  manualFiltering                      // Server handles filtering
  manualSorting                        // Server handles sorting
  totalRowCount={totalRows}            // Total rows from server
  pageCount={pageCount}                // Total pages from server
  state={tableState}
  onStateChange={setTableState}        // Triggers server fetch
/>
```

### Server-Side with React Query

```tsx
import { useQuery } from '@tanstack/react-query';

const fetchUsers = async (state: ControlledDataTableState) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(state),
  });
  return response.json();
};

function UsersTable() {
  const [tableState, setTableState] = useState<ControlledDataTableState>({});

  const { data, isLoading } = useQuery({
    queryKey: ['users', tableState],
    queryFn: () => fetchUsers(tableState),
  });

  return (
    <DataTable<User>
      data={data?.users ?? []}
      columns={columns}
      isLoading={isLoading}
      manualPagination
      manualFiltering
      manualSorting
      totalRowCount={data?.totalRows}
      pageCount={data?.totalPages}
      state={tableState}
      onStateChange={setTableState}
    />
  );
}
```

See [Server-Side Data Example](./examples/server-side-data.md) for complete implementation.

---

## Summary

You now know all the features available in the library:

- ✅ **Global Search** - Search across all columns
- ✅ **Advanced Filtering** - Multi-column filters with 6 operators
- ✅ **Sorting** - Click headers to sort
- ✅ **Pagination** - Navigate large datasets
- ✅ **Column Visibility** - Show/hide columns
- ✅ **Column Reordering** - Drag to reorder
- ✅ **Column Resizing** - Drag to resize
- ✅ **Row Selection** - Select rows with checkboxes
- ✅ **Density Toggle** - Normal/condensed views
- ✅ **CSV Export** - Export to CSV
- ✅ **State Persistence** - Auto-save to localStorage
- ✅ **Loading States** - Skeleton loaders
- ✅ **Server-Side Data** - Handle large datasets

---

## Next Steps

- **[Customization Guide](./customization-guide.md)** - Style and customize your tables
- **[Examples](./examples/README.md)** - See practical implementations
- **[API Reference](./api-reference.md)** - Complete API documentation
- **[TypeScript Guide](./typescript-guide.md)** - Type-safe patterns
