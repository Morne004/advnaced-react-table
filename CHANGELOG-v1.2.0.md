# Changelog - Version 1.2.0

## Saved Views Support

This release adds comprehensive support for **saved views** by exposing full state getters/setters instead of just toggle/piecewise APIs. This enables seamless integration with view management systems like TanStack Table's saved views.

---

## Breaking Changes

None. All changes are backward compatible additions.

---

## New Features

### 1. **Column Visibility - Direct Setter**

**Added:** `setColumnVisibility(visibility: Record<string, boolean>)`

Previously, only `toggleColumnVisibility(id)` was available, making it difficult to set multiple columns' visibility at once.

**Before:**
```ts
// Had to toggle each column individually - brittle and error-prone
table.toggleColumnVisibility('col1');
table.toggleColumnVisibility('col2');
table.toggleColumnVisibility('col3');
```

**Now:**
```ts
// Set all column visibility in one call
table.setColumnVisibility({
  col1: true,
  col2: false,
  col3: true,
});
```

**Exposed on table object:**
- `columnVisibility` (existing)
- `toggleColumnVisibility(id)` (existing)
- `setColumnVisibility(visibility)` ✨ **NEW**

---

### 2. **Column Order - Verified & Exposed**

**Confirmed:** `columnOrder` and `setColumnOrder` are properly exposed on the table object.

```ts
const { columnOrder, setColumnOrder } = table;

// Restore column order from saved view
setColumnOrder(['name', 'email', 'status', 'createdAt']);
```

---

### 3. **Column Sizing - State & Setters**

**Added:** `columnWidths` and `setColumnWidths(widths: Record<string, number>)`

Column widths are now part of the table state and can be saved/restored.

```ts
const { columnWidths, setColumnWidths } = table;

// Save current widths
const savedWidths = columnWidths; // { name: 200, email: 250, ... }

// Restore widths from saved view
setColumnWidths({
  name: 200,
  email: 250,
  status: 120,
});
```

**Added to `DataTableState`:**
```ts
interface DataTableState {
  // ... existing fields
  columnWidths: Record<string, number>; // ✨ NEW
}
```

---

### 4. **Sorting - State & Setter Exposed**

**Exposed:** `sorting`, `setSort`, and `setSorting` on the table object.

```ts
const { sorting, setSort, setSorting } = table;

// Current sorting state
console.log(sorting); // { key: 'name', direction: 'ascending' } | null

// Toggle sort on a column (existing)
setSort('email');

// Set sorting state directly (new)
setSorting({ key: 'createdAt', direction: 'descending' });
```

**Mapping for saved views:**
```ts
// Morne format: { key, direction }
// SavedView format: [{ id, desc }]

// When saving:
const savedSorting = sorting
  ? [{ id: sorting.key, desc: sorting.direction === 'descending' }]
  : [];

// When loading:
const firstSort = view.sorting?.[0];
if (firstSort) {
  setSorting({
    key: firstSort.id,
    direction: firstSort.desc ? 'descending' : 'ascending'
  });
}
```

---

### 5. **Filters - applyFilters Exposed**

**Confirmed:** `applyFilters(filters: Filter[])` is exposed on the table object.

```ts
const { filters, applyFilters } = table;

// Apply multiple filters at once
applyFilters([
  { id: '1', column: 'name', operator: 'contains', value: 'John' },
  { id: '2', column: 'status', operator: 'equals', value: 'active' },
]);
```

**Filter type:**
```ts
interface Filter {
  id: string;
  column: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: string;
}
```

---

### 6. **Disable Automatic Persistence**

**Added:** `disablePersistence` prop to `DataTableProps`

When using saved views, you can disable automatic localStorage persistence to prevent conflicts.

```ts
<DataTable
  data={data}
  columns={columns}
  disablePersistence={true} // ✨ NEW
/>
```

**Behavior:**
- When `disablePersistence={true}`, all state uses regular `useState` instead of `usePersistentState`
- No automatic saving to localStorage
- Perfect for saved views where you manage persistence externally

---

## Complete API Surface for Saved Views

The table object now exposes everything needed for saved views:

```ts
const table = useDataTable({ ... });

// State (read)
const {
  columnVisibility,    // Record<string, boolean>
  columnOrder,         // string[]
  columnWidths,        // Record<string, number> ✨ NEW
  sorting,             // { key, direction } | null
  filters,             // Filter[]
  globalFilter,        // string
  isCondensed,         // boolean
  pagination,          // { pageIndex, pageSize }
} = table;

// Setters (write)
const {
  setColumnVisibility, // (visibility: Record<string, boolean>) => void ✨ NEW
  setColumnOrder,      // (order: string[]) => void
  setColumnWidths,     // (widths: Record<string, number>) => void ✨ NEW
  setSorting,          // (sorting: SortConfig | null) => void ✨ EXPOSED
  applyFilters,        // (filters: Filter[]) => void
  setSort,             // (key: keyof T) => void (toggle helper)
  setPageSize,         // (size: number) => void
  setPageIndex,        // (index: number) => void
  toggleColumnVisibility, // (id: string) => void (helper)
  toggleDensity,       // () => void
} = table;
```

---

## Usage Example: Saved Views Integration

```tsx
import { useRef } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';

function MyTable() {
  const tableRef = useRef(null);

  // Save current view
  const saveView = () => {
    const table = tableRef.current;
    return {
      visible_columns: Object.keys(table.columnVisibility).filter(
        id => table.columnVisibility[id]
      ),
      column_order: table.columnOrder,
      column_sizing: table.columnWidths,
      sorting: table.sorting 
        ? [{ id: table.sorting.key, desc: table.sorting.direction === 'descending' }]
        : [],
      filters: table.filters,
    };
  };

  // Load a saved view
  const loadView = (view) => {
    const table = tableRef.current;
    
    // Set column visibility
    const visibility = {};
    table.allColumns.forEach(col => {
      visibility[col.id] = view.visible_columns?.includes(col.id) ?? true;
    });
    table.setColumnVisibility(visibility);
    
    // Set column order
    if (view.column_order) {
      table.setColumnOrder(view.column_order);
    }
    
    // Set column widths
    if (view.column_sizing) {
      table.setColumnWidths(view.column_sizing);
    }
    
    // Set sorting
    const firstSort = view.sorting?.[0];
    if (firstSort) {
      table.setSorting({
        key: firstSort.id,
        direction: firstSort.desc ? 'descending' : 'ascending'
      });
    }
    
    // Set filters
    if (view.filters) {
      table.applyFilters(view.filters);
    }
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      disablePersistence={true} // Use saved views instead of localStorage
      components={{
        Toolbar: (props) => {
          tableRef.current = props.table;
          return <CustomToolbar {...props} onSave={saveView} onLoad={loadView} />;
        }
      }}
    />
  );
}
```

---

## Migration Guide

### From v1.1.x to v1.2.0

No breaking changes! All existing code continues to work.

**Optional upgrades:**

1. **Replace toggle loops with direct setters:**
   ```ts
   // Old way (still works)
   columns.forEach(col => {
     if (!shouldShow(col.id)) {
       table.toggleColumnVisibility(col.id);
     }
   });
   
   // New way (cleaner)
   table.setColumnVisibility(
     columns.reduce((acc, col) => ({ ...acc, [col.id]: shouldShow(col.id) }), {})
   );
   ```

2. **Use `disablePersistence` for saved views:**
   ```ts
   <DataTable
     data={data}
     columns={columns}
     disablePersistence={true} // Add this when using saved views
   />
   ```

3. **Access column widths from table state:**
   ```ts
   // Old way (component-level state)
   const [columnWidths, setColumnWidths] = usePersistentState('datatable_columnWidths', {});
   
   // New way (from table object)
   const { columnWidths, setColumnWidths } = table;
   ```

---

## Technical Details

### Internal Changes

1. **`useDataTable` hook:**
   - Added `disablePersistence` parameter
   - Added `columnWidths` state management
   - Exposed `setColumnVisibility`, `setSorting`, `setColumnWidths`
   - Conditional state: uses `useState` when `disablePersistence={true}`, `usePersistentState` otherwise

2. **`DataTable` component:**
   - Removed local `columnWidths` state
   - Now uses `columnWidths` from `useDataTable` hook
   - Passes `disablePersistence` prop through

3. **Type updates:**
   - Added `columnWidths: Record<string, number>` to `DataTableState`
   - Added `disablePersistence?: boolean` to `DataTableProps`

---

## Testing Recommendations

When upgrading, test:

1. **Existing functionality** - All features should work as before
2. **Column visibility** - Try `setColumnVisibility` with multiple columns
3. **Column widths** - Verify widths persist correctly (or don't, if `disablePersistence={true}`)
4. **Saved views** - If implementing, test save/load cycles
5. **Sorting state** - Verify `setSorting` works correctly

---

## Credits

This release was designed to bring Morne Table's API to parity with TanStack Table's saved views capabilities, enabling seamless integration with view management systems.
