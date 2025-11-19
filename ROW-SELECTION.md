# Row Selection Feature

Complete guide for using row selection in Morne Table.

## Overview

Row selection allows users to select individual rows or all rows at once using checkboxes. Selected rows are highlighted and can be retrieved for bulk actions.

---

## Basic Usage

Enable row selection by setting `enableRowSelection={true}`:

```tsx
import { DataTable } from '@morne004/headless-react-data-table';

<DataTable
  data={data}
  columns={columns}
  enableRowSelection={true} // ✨ Enable row selection
/>
```

This adds:
- ✅ Checkbox column (first column)
- ✅ Header checkbox for "select all"
- ✅ Row checkboxes for individual selection
- ✅ Visual feedback (selected rows highlighted)
- ✅ Indeterminate state (when some rows selected)

---

## Accessing Selection State

The table object exposes row selection state and handlers:

```tsx
const table = useDataTable({ data, columns });

// Current selection state
const { rowSelection } = table;
// Example: { '1': true, '3': true, '5': false }

// Get selected rows
const selectedRows = table.getSelectedRows();
// Returns: Array of selected row objects

// Number of selected rows
const selectedCount = Object.values(rowSelection).filter(Boolean).length;
```

---

## Selection Handlers

### Individual Row Selection

```tsx
const { toggleRowSelection } = table;

// Toggle a specific row
toggleRowSelection('row-id-123');
```

### Select All / Deselect All

```tsx
const { toggleAllRows } = table;

// Toggle all rows on current page
toggleAllRows();
```

### Set Selection Programmatically

```tsx
const { setRowSelection } = table;

// Set specific rows as selected
setRowSelection({
  '1': true,
  '2': true,
  '3': false,
});
```

### Clear All Selection

```tsx
const { clearRowSelection } = table;

// Clear all selections
clearRowSelection();
```

---

## Complete Example

```tsx
import { useRef, useState } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

function UsersTable() {
  const tableRef = useRef<any>(null);
  const [users] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
  ]);

  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
    { id: 'status', accessorKey: 'status', header: 'Status' },
  ];

  const handleBulkDelete = () => {
    const table = tableRef.current;
    if (!table) return;

    const selectedRows = table.getSelectedRows();
    console.log('Deleting rows:', selectedRows);
    
    // Perform bulk delete
    // ... your delete logic here
    
    // Clear selection after action
    table.clearRowSelection();
  };

  const handleBulkActivate = () => {
    const table = tableRef.current;
    if (!table) return;

    const selectedRows = table.getSelectedRows();
    console.log('Activating users:', selectedRows);
    
    // Perform bulk activate
    // ... your activate logic here
  };

  return (
    <div>
      <DataTable
        data={users}
        columns={columns}
        enableRowSelection={true}
        components={{
          Toolbar: (props) => {
            tableRef.current = props.table;
            const selectedCount = Object.values(props.table.rowSelection).filter(Boolean).length;

            return (
              <div>
                {/* Original toolbar */}
                <TableToolbar {...props} />
                
                {/* Bulk actions */}
                {selectedCount > 0 && (
                  <div style={{ padding: '10px', backgroundColor: '#f0f9ff' }}>
                    <span>{selectedCount} row(s) selected</span>
                    <button onClick={handleBulkDelete}>Delete Selected</button>
                    <button onClick={handleBulkActivate}>Activate Selected</button>
                    <button onClick={() => props.table.clearRowSelection()}>Clear Selection</button>
                  </div>
                )}
              </div>
            );
          }
        }}
      />
    </div>
  );
}
```

---

## API Reference

### State

| Property | Type | Description |
|----------|------|-------------|
| `rowSelection` | `Record<string, boolean>` | Map of row IDs to selection state |

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `setRowSelection` | `(selection: Record<string, boolean>) => void` | Set selection state for all rows |
| `toggleRowSelection` | `(rowId: string) => void` | Toggle selection for a specific row |
| `toggleAllRows` | `() => void` | Toggle selection for all rows on current page |
| `getSelectedRows` | `() => T[]` | Get array of selected row objects |
| `clearRowSelection` | `() => void` | Clear all selections |

---

## Features

### ✅ Visual Feedback

- Selected rows have light blue background (`rgba(59, 130, 246, 0.05)`)
- Checkbox column is fixed width (50px)
- Header checkbox shows indeterminate state when some rows selected

### ✅ Accessibility

- All checkboxes have proper `aria-label` attributes
- Keyboard navigation supported
- Screen reader friendly

### ✅ State Persistence

Row selection state is automatically persisted to localStorage (unless `disablePersistence={true}`).

### ✅ Saved Views Support

Row selection state is included in saved views:

```ts
// Save view
const viewState = {
  // ... other state
  rowSelection: table.rowSelection,
};

// Load view
table.setRowSelection(view.rowSelection || {});
```

---

## Advanced Usage

### Custom Row ID

By default, rows are identified by their `id` property. You can customize this:

```tsx
<DataTable
  data={data}
  columns={columns}
  enableRowSelection={true}
  getRowId={(row) => row.customId} // Use custom ID field
/>
```

### Conditional Selection

Disable selection for specific rows by filtering in your bulk action handlers:

```tsx
const handleBulkAction = () => {
  const selectedRows = table.getSelectedRows();
  
  // Filter out rows that can't be modified
  const validRows = selectedRows.filter(row => row.status !== 'locked');
  
  // Perform action on valid rows only
  performAction(validRows);
};
```

### Selection Across Pages

Selection state persists across page changes:

```tsx
// User selects rows on page 1
table.toggleRowSelection('1');
table.toggleRowSelection('2');

// Navigate to page 2
table.setPageIndex(1);

// Navigate back to page 1
table.setPageIndex(0);

// Rows 1 and 2 are still selected ✅
```

### Programmatic Selection

Select rows based on criteria:

```tsx
// Select all active users
const activeUserIds = data
  .filter(user => user.status === 'active')
  .reduce((acc, user) => ({ ...acc, [user.id]: true }), {});

table.setRowSelection(activeUserIds);
```

---

## Styling

### Default Styles

The component includes minimal inline styles:

```tsx
// Selected row
<tr style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>

// Checkbox column
<th style={{ width: '50px', textAlign: 'center' }}>
<td style={{ width: '50px', textAlign: 'center' }}>
```

### Custom Styles

Override with your own styles:

```tsx
<DataTable
  data={data}
  columns={columns}
  enableRowSelection={true}
  components={{
    // Custom rendering with your styles
  }}
/>
```

Or use CSS:

```css
/* Selected row */
tr[data-selected="true"] {
  background-color: #e0f2fe;
}

/* Checkbox column */
th:first-child,
td:first-child {
  width: 50px;
  text-align: center;
}

/* Checkbox */
input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}
```

---

## Performance Tips

1. **Use `getRowId`** - Provide a stable ID function for better performance
2. **Memoize handlers** - Wrap bulk action handlers in `useCallback`
3. **Batch updates** - Use `setRowSelection` instead of multiple `toggleRowSelection` calls
4. **Clear after actions** - Call `clearRowSelection()` after bulk operations

---

## Troubleshooting

### Problem: Selection not working

**Solution:** Make sure `enableRowSelection={true}` is set on `<DataTable>`

---

### Problem: Selected rows not highlighted

**Solution:** Check if custom styles are overriding the default background color

---

### Problem: Selection lost on page change

**Solution:** This is expected behavior. Selection persists across pages, but only visible rows show checkboxes. Use `getSelectedRows()` to see all selected rows.

---

### Problem: Can't get selected rows

**Solution:** Make sure you're accessing the table object correctly:

```tsx
// ✅ Correct
const table = useDataTable({ data, columns });
const selectedRows = table.getSelectedRows();

// ❌ Wrong - table object not accessible
<DataTable data={data} columns={columns} />
// Can't access table.getSelectedRows() here
```

Use a custom Toolbar component to access the table object:

```tsx
<DataTable
  data={data}
  columns={columns}
  components={{
    Toolbar: (props) => {
      const selectedRows = props.table.getSelectedRows();
      // Now you can use selectedRows
      return <TableToolbar {...props} />;
    }
  }}
/>
```

---

## Examples

### Bulk Delete

```tsx
const handleBulkDelete = () => {
  const selectedRows = table.getSelectedRows();
  if (selectedRows.length === 0) {
    alert('No rows selected');
    return;
  }

  if (confirm(`Delete ${selectedRows.length} row(s)?`)) {
    // Delete rows
    deleteRows(selectedRows.map(r => r.id));
    
    // Clear selection
    table.clearRowSelection();
  }
};
```

### Bulk Export

```tsx
const handleBulkExport = () => {
  const selectedRows = table.getSelectedRows();
  
  if (selectedRows.length === 0) {
    // Export all if none selected
    exportToCsv(data, columns, 'all-data.csv');
  } else {
    // Export selected only
    exportToCsv(selectedRows, columns, 'selected-data.csv');
  }
};
```

### Select by Filter

```tsx
const handleSelectFiltered = () => {
  // Get currently filtered/sorted data
  const visibleRows = table.sortedData;
  
  // Select all visible rows
  const selection = visibleRows.reduce(
    (acc, row) => ({ ...acc, [row.id]: true }),
    {}
  );
  
  table.setRowSelection(selection);
};
```

---

## Next Steps

- See `CHANGELOG-v1.3.0.md` for complete feature list
- Check `SAVED-VIEWS-API.md` for saved views integration
- Read `EXAMPLES.md` for more usage patterns
