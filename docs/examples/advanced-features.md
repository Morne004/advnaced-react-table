# Advanced Features Example

Master advanced table functionality including row selection, CSV export, and state management.

---

## Overview

This example covers:
- Row selection (single and multi-select)
- Bulk actions
- CSV export
- Controlled vs uncontrolled state
- State persistence
- Loading and empty states

**Difficulty:** 🔴 Advanced

---

## Row Selection

### Enable Row Selection

```tsx
<DataTable<User>
  data={users}
  columns={columns}
  enableRowSelection  // Adds checkbox column
/>
```

### Access Selected Rows

```tsx
import { useDataTable } from '@morne004/headless-react-data-table';

function UsersTable() {
  const table = useDataTable({
    data: users,
    columns,
  });

  const selectedRows = table.getSelectedRows();

  return (
    <div>
      <DataTable<User> data={users} columns={columns} enableRowSelection />

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="p-4 bg-blue-50 border-t">
          <p>{selectedRows.length} rows selected</p>
          <button onClick={() => handleBulkDelete(selectedRows)}>
            Delete Selected
          </button>
          <button onClick={() => table.clearRowSelection()}>
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
```

### Programmatic Selection

```tsx
const table = useDataTable({ data: users, columns });

// Select specific rows
table.setRowSelection({
  '1': true,
  '2': true,
  '5': true,
});

// Toggle single row
table.toggleRowSelection('3');

// Toggle all rows on current page
table.toggleAllRows();

// Clear all
table.clearRowSelection();

// Get selected
const selected = table.getSelectedRows();
```

---

## CSV Export

### Basic Export

```tsx
import { exportToCsv } from '@morne004/headless-react-data-table';

function UsersTable() {
  const table = useDataTable({ data: users, columns });

  const handleExport = () => {
    // Export filtered/sorted data
    exportToCsv('users.csv', table.sortedData);
  };

  return (
    <div>
      <button onClick={handleExport}>Export to CSV</button>
      <DataTable<User> data={users} columns={columns} />
    </div>
  );
}
```

### Export with Timestamp

```tsx
const handleExport = () => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `users_${timestamp}.csv`;
  exportToCsv(filename, table.sortedData);
};
```

### Export Selected Rows

```tsx
const handleExportSelected = () => {
  const selectedRows = table.getSelectedRows();
  if (selectedRows.length === 0) {
    alert('No rows selected');
    return;
  }
  exportToCsv('selected_users.csv', selectedRows);
};
```

---

## Controlled State

### Full Control

```tsx
import { useState } from 'react';
import type { ControlledDataTableState } from '@morne004/headless-react-data-table';

function UsersTable() {
  const [tableState, setTableState] = useState<ControlledDataTableState>({
    pageIndex: 0,
    pageSize: 25,
    globalFilter: '',
    sorting: null,
    filters: [],
  });

  return (
    <DataTable<User>
      data={users}
      columns={columns}
      state={tableState}
      onStateChange={setTableState}
    />
  );
}
```

### Partial Control

```tsx
// Control only pagination and sorting
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
const [sorting, setSorting] = useState(null);

<DataTable
  state={{ pagination, sorting }}
  onStateChange={(newState) => {
    if (newState.pagination) setPagination(newState.pagination);
    if (newState.sorting !== undefined) setSorting(newState.sorting);
  }}
/>
```

### URL State Synchronization

```tsx
import { useSearchParams } from 'react-router-dom';

function UsersTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tableState: ControlledDataTableState = {
    pageIndex: Number(searchParams.get('page')) || 0,
    pageSize: Number(searchParams.get('size')) || 10,
    globalFilter: searchParams.get('search') || '',
  };

  const handleStateChange = (newState: ControlledDataTableState) => {
    const params = new URLSearchParams();
    if (newState.pageIndex) params.set('page', String(newState.pageIndex));
    if (newState.pageSize) params.set('size', String(newState.pageSize));
    if (newState.globalFilter) params.set('search', newState.globalFilter);
    setSearchParams(params);
  };

  return (
    <DataTable
      data={users}
      columns={columns}
      state={tableState}
      onStateChange={handleStateChange}
    />
  );
}
```

---

## State Persistence

### Disable Persistence

```tsx
<DataTable
  data={users}
  columns={columns}
  disablePersistence  // State won't be saved to localStorage
/>
```

### Clear Persisted State

```tsx
// Clear all table state from localStorage
Object.keys(localStorage)
  .filter(key => key.startsWith('datatable_'))
  .forEach(key => localStorage.removeItem(key));
```

### Custom Storage

```tsx
import { useState, useEffect } from 'react';

function UsersTable() {
  const [tableState, setTableState] = useState<ControlledDataTableState>(() => {
    // Load from custom storage
    const saved = sessionStorage.getItem('my_table_state');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // Save to custom storage
    sessionStorage.setItem('my_table_state', JSON.stringify(tableState));
  }, [tableState]);

  return (
    <DataTable
      data={users}
      columns={columns}
      state={tableState}
      onStateChange={setTableState}
      disablePersistence  // Disable default persistence
    />
  );
}
```

---

## Loading States

### Basic Loading

```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchUsers().then(() => setIsLoading(false));
}, []);

<DataTable isLoading={isLoading} data={users} columns={columns} />
```

### Custom Loading Skeleton

```tsx
const CustomSkeleton = ({ rows = 5, cols }: { rows?: number; cols: number }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

<DataTable
  isLoading={isLoading}
  data={users}
  columns={columns}
  components={{ Skeleton: CustomSkeleton }}
/>
```

---

## Empty States

### Custom Empty Message

```tsx
<DataTable
  data={[]}
  columns={columns}
  noDataMessage={
    <div className="text-center py-10">
      <h3 className="text-lg font-semibold mb-2">No users found</h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your search or filter criteria.
      </p>
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Reset Filters
      </button>
    </div>
  }
/>
```

---

## Complete Advanced Example

```tsx
import { useState } from 'react';
import { DataTable, exportToCsv, useDataTable } from '@morne004/headless-react-data-table';

function AdvancedUsersTable() {
  const [isLoading, setIsLoading] = useState(false);

  const table = useDataTable({
    data: users,
    columns,
  });

  const selectedRows = table.getSelectedRows();

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedRows.length} users?`)) return;

    setIsLoading(true);
    try {
      await deleteUsers(selectedRows.map(r => r.id));
      table.clearRowSelection();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="p-4 bg-blue-50 flex items-center justify-between">
          <span>{selectedRows.length} selected</span>
          <div className="flex gap-2">
            <button onClick={() => exportToCsv('selected.csv', selectedRows)}>
              Export Selected
            </button>
            <button onClick={handleBulkDelete} className="text-red-600">
              Delete Selected
            </button>
            <button onClick={() => table.clearRowSelection()}>
              Clear
            </button>
          </div>
        </div>
      )}

      <DataTable<User>
        data={users}
        columns={columns}
        isLoading={isLoading}
        enableRowSelection
      />
    </div>
  );
}
```

---

## Next Steps

- **[API Reference](../api-reference.md)** - Complete documentation
- **[Troubleshooting](../troubleshooting.md)** - Solve issues

