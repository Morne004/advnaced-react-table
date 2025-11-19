# Changelog - Version 1.3.0

## Row Selection Feature

This release adds **row selection** with checkboxes, allowing users to select individual rows or all rows at once for bulk actions.

---

## New Features

### 1. **Row Selection with Checkboxes** ✨

Enable row selection by setting `enableRowSelection={true}`:

```tsx
<DataTable
  data={data}
  columns={columns}
  enableRowSelection={true} // ✨ NEW
/>
```

**What you get:**
- ✅ Checkbox column (first column, 50px wide)
- ✅ Header checkbox for "select all"
- ✅ Individual row checkboxes
- ✅ Visual feedback (selected rows highlighted)
- ✅ Indeterminate state (when some rows selected)
- ✅ Keyboard accessible
- ✅ State persistence (localStorage)

---

### 2. **Row Selection State**

**Added to `DataTableState`:**
```ts
interface DataTableState {
  // ... existing fields
  rowSelection: Record<string, boolean>; // ✨ NEW
}
```

**Example:**
```ts
const { rowSelection } = table;
// { '1': true, '2': false, '3': true }
```

---

### 3. **Row Selection Handlers**

**New methods exposed on table object:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `setRowSelection` | `(selection: Record<string, boolean>) => void` | Set selection state for all rows |
| `toggleRowSelection` | `(rowId: string) => void` | Toggle selection for a specific row |
| `toggleAllRows` | `() => void` | Toggle all rows on current page |
| `getSelectedRows` | `() => T[]` | Get array of selected row objects |
| `clearRowSelection` | `() => void` | Clear all selections |

**Examples:**

```ts
// Toggle individual row
table.toggleRowSelection('123');

// Toggle all rows on current page
table.toggleAllRows();

// Set specific selection
table.setRowSelection({
  '1': true,
  '2': true,
  '3': false,
});

// Get selected rows
const selectedRows = table.getSelectedRows();
console.log(`${selectedRows.length} rows selected`);

// Clear all
table.clearRowSelection();
```

---

### 4. **Visual Feedback**

**Selected rows:**
- Light blue background: `rgba(59, 130, 246, 0.05)`
- Persists across page navigation
- Checkbox reflects selection state

**Header checkbox:**
- Checked: All rows on page selected
- Indeterminate: Some rows selected
- Unchecked: No rows selected

---

### 5. **Accessibility**

- All checkboxes have `aria-label` attributes
- Header checkbox: `"Select all rows"`
- Row checkboxes: `"Select row {id}"`
- Keyboard navigation supported
- Screen reader friendly

---

## Usage Examples

### Basic Usage

```tsx
import { DataTable } from '@morne004/headless-react-data-table';

<DataTable
  data={users}
  columns={columns}
  enableRowSelection={true}
/>
```

### With Bulk Actions

```tsx
import { useRef } from 'react';

function UsersTable() {
  const tableRef = useRef<any>(null);

  const handleBulkDelete = () => {
    const selectedRows = tableRef.current.getSelectedRows();
    console.log('Deleting:', selectedRows);
    
    // Perform delete
    deleteUsers(selectedRows.map(r => r.id));
    
    // Clear selection
    tableRef.current.clearRowSelection();
  };

  return (
    <DataTable
      data={users}
      columns={columns}
      enableRowSelection={true}
      components={{
        Toolbar: (props) => {
          tableRef.current = props.table;
          const selectedCount = Object.values(props.table.rowSelection)
            .filter(Boolean).length;

          return (
            <div>
              <TableToolbar {...props} />
              
              {selectedCount > 0 && (
                <div>
                  <span>{selectedCount} selected</span>
                  <button onClick={handleBulkDelete}>Delete</button>
                  <button onClick={() => props.table.clearRowSelection()}>
                    Clear
                  </button>
                </div>
              )}
            </div>
          );
        }
      }}
    />
  );
}
```

### Programmatic Selection

```tsx
// Select all active users
const activeUserIds = users
  .filter(u => u.status === 'active')
  .reduce((acc, u) => ({ ...acc, [u.id]: true }), {});

table.setRowSelection(activeUserIds);
```

### Saved Views Integration

```tsx
// Save view
const saveView = () => ({
  // ... other state
  rowSelection: table.rowSelection,
});

// Load view
const loadView = (view) => {
  // ... restore other state
  table.setRowSelection(view.rowSelection || {});
};
```

---

## Breaking Changes

None. All changes are backward compatible additions.

**Default behavior:**
- Row selection is **disabled by default**
- Set `enableRowSelection={true}` to enable
- Existing tables continue to work without changes

---

## API Changes

### DataTableState

```ts
// Before (v1.2.0)
interface DataTableState {
  pageIndex: number;
  pageSize: number;
  sorting: SortConfig<any> | null;
  filters: Filter[];
  globalFilter: string;
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnWidths: Record<string, number>;
  isCondensed: boolean;
}

// After (v1.3.0)
interface DataTableState {
  pageIndex: number;
  pageSize: number;
  sorting: SortConfig<any> | null;
  filters: Filter[];
  globalFilter: string;
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnWidths: Record<string, number>;
  rowSelection: Record<string, boolean>; // ✨ NEW
  isCondensed: boolean;
}
```

### DataTableProps

```ts
// Before (v1.2.0)
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T) => string | number;
  initialState?: Partial<DataTableState>;
  disablePersistence?: boolean;
  // ... other props
}

// After (v1.3.0)
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T) => string | number;
  initialState?: Partial<DataTableState>;
  disablePersistence?: boolean;
  enableRowSelection?: boolean; // ✨ NEW
  // ... other props
}
```

### Table Object

```ts
// Before (v1.2.0)
const table = useDataTable({ data, columns });
const {
  globalFilter, filters, sorting, pagination,
  columnOrder, columnVisibility, columnWidths, isCondensed,
  paginatedData, sortedData, pageCount, totalCount,
  orderedAndVisibleColumns, allColumns,
  handleGlobalFilterChange, applyFilters, setSort, setSorting,
  setPageSize, setPageIndex, setColumnOrder, setColumnVisibility,
  setColumnWidths, toggleColumnVisibility, toggleDensity,
} = table;

// After (v1.3.0)
const table = useDataTable({ data, columns });
const {
  // ... all existing properties
  rowSelection, // ✨ NEW
  // ... all existing methods
  setRowSelection, // ✨ NEW
  toggleRowSelection, // ✨ NEW
  toggleAllRows, // ✨ NEW
  getSelectedRows, // ✨ NEW
  clearRowSelection, // ✨ NEW
} = table;
```

---

## Migration Guide

### From v1.2.0 to v1.3.0

No breaking changes! All existing code continues to work.

**To add row selection:**

1. **Enable the feature:**
   ```tsx
   <DataTable
     data={data}
     columns={columns}
     enableRowSelection={true} // Add this
   />
   ```

2. **Access selection state:**
   ```tsx
   const { rowSelection, getSelectedRows } = table;
   ```

3. **Add bulk actions:**
   ```tsx
   components={{
     Toolbar: (props) => {
       const selectedCount = Object.values(props.table.rowSelection)
         .filter(Boolean).length;
       
       return (
         <div>
           <TableToolbar {...props} />
           {selectedCount > 0 && (
             <button onClick={() => handleBulkAction(props.table.getSelectedRows())}>
               Action ({selectedCount})
             </button>
           )}
         </div>
       );
     }
   }}
   ```

---

## Technical Details

### Internal Changes

1. **`useDataTable` hook:**
   - Added `rowSelection` state management
   - Added `setRowSelection`, `toggleRowSelection`, `toggleAllRows`, `getSelectedRows`, `clearRowSelection` handlers
   - Row selection state persists to localStorage (unless `disablePersistence={true}`)

2. **`DataTable` component:**
   - Added `enableRowSelection` prop
   - Renders checkbox column when enabled
   - Header checkbox with indeterminate state
   - Row checkboxes with selection state
   - Selected rows have light blue background

3. **Type updates:**
   - Added `rowSelection: Record<string, boolean>` to `DataTableState`
   - Added `enableRowSelection?: boolean` to `DataTableProps`

### Performance

- Checkbox column is fixed width (50px)
- Selection state is memoized
- `getSelectedRows()` filters data efficiently
- No performance impact when `enableRowSelection={false}` (default)

---

## Testing Recommendations

When upgrading, test:

1. **Existing functionality** - All features should work as before
2. **Row selection** - Enable and test checkbox interactions
3. **Select all** - Test header checkbox (all/some/none states)
4. **Bulk actions** - Verify `getSelectedRows()` returns correct data
5. **Persistence** - Check selection persists across page navigation
6. **Saved views** - If using, include `rowSelection` in save/load

---

## Known Limitations

1. **Row ID requirement** - Rows must have a unique `id` property (or provide custom `getRowId`)
2. **Page-level selection** - `toggleAllRows()` only affects current page (not all pages)
3. **No row-level disable** - Can't disable selection for specific rows (filter in handlers instead)

---

## Future Enhancements

Potential features for future releases:

- Row-level selection disable (e.g., `row.selectable`)
- Select all across all pages (not just current page)
- Selection range (shift+click)
- Custom checkbox rendering
- Selection callbacks (`onSelectionChange`)

---

## Credits

This release adds row selection to bring Morne Table closer to feature parity with enterprise data grids while maintaining its lightweight, headless architecture.

---

## Complete Feature List (v1.3.0)

### Core Features
- ✅ Sorting
- ✅ Filtering (global + advanced)
- ✅ Pagination
- ✅ Search

### UI Features
- ✅ Column visibility
- ✅ Column reordering
- ✅ Column resizing
- ✅ Condensed view
- ✅ **Row selection** ✨ NEW

### State Management
- ✅ Saved views support
- ✅ State persistence (localStorage)
- ✅ Controlled/uncontrolled modes
- ✅ Disable persistence option

### Developer Experience
- ✅ TypeScript native
- ✅ Headless architecture
- ✅ Zero dependencies
- ✅ Small bundle (~45KB)
- ✅ Tree-shakeable

---

## Resources

- **[ROW-SELECTION.md](./ROW-SELECTION.md)** - Complete row selection guide
- **[SAVED-VIEWS-API.md](./SAVED-VIEWS-API.md)** - Saved views integration
- **[CHANGELOG-v1.2.0.md](./CHANGELOG-v1.2.0.md)** - Previous release notes
- **[EXAMPLES.md](./EXAMPLES.md)** - Usage examples
- **[FEATURES.md](./FEATURES.md)** - Complete feature catalog
