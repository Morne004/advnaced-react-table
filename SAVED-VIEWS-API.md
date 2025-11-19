# Saved Views API Reference

Quick reference for using Morne Table with saved views.

## Table Object API

All methods needed for saved views are exposed on the `table` object returned by `useDataTable`:

```ts
const table = useDataTable({ data, columns, disablePersistence: true });
```

---

## State Getters (Read)

| Property | Type | Description |
|----------|------|-------------|
| `columnVisibility` | `Record<string, boolean>` | Map of column IDs to visibility state |
| `columnOrder` | `string[]` | Array of column IDs in display order |
| `columnWidths` | `Record<string, number>` | Map of column IDs to widths in pixels |
| `sorting` | `{ key: keyof T, direction: 'ascending' \| 'descending' } \| null` | Current sort state |
| `filters` | `Filter[]` | Array of active filters |
| `globalFilter` | `string` | Global search text |
| `pagination` | `{ pageIndex: number, pageSize: number }` | Pagination state |
| `isCondensed` | `boolean` | Condensed/compact view toggle |

---

## State Setters (Write)

| Method | Signature | Description |
|--------|-----------|-------------|
| `setColumnVisibility` | `(visibility: Record<string, boolean>) => void` | Set visibility for all columns at once |
| `setColumnOrder` | `(order: string[]) => void` | Set column display order |
| `setColumnWidths` | `(widths: Record<string, number>) => void` | Set column widths |
| `setSorting` | `(sorting: SortConfig \| null) => void` | Set sort state directly |
| `applyFilters` | `(filters: Filter[]) => void` | Apply multiple filters at once |
| `setPageSize` | `(size: number) => void` | Set page size |
| `setPageIndex` | `(index: number) => void` | Set current page |

---

## Helper Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `toggleColumnVisibility` | `(id: string) => void` | Toggle a single column's visibility |
| `setSort` | `(key: keyof T) => void` | Toggle sort on a column (asc → desc → none) |
| `toggleDensity` | `() => void` | Toggle condensed view |
| `handleGlobalFilterChange` | `(value: string) => void` | Set global filter and reset to page 0 |

---

## Complete Example

```tsx
import { useRef } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { Filter, SortConfig } from '@morne004/headless-react-data-table';

interface SavedView {
  id: string;
  name: string;
  visible_columns: string[];
  column_order: string[];
  column_sizing: Record<string, number>;
  sorting: Array<{ id: string; desc: boolean }>;
  filters: Filter[];
}

function TableWithSavedViews() {
  const tableRef = useRef<any>(null);

  // Capture current state as a view
  const getCurrentViewState = (): Omit<SavedView, 'id' | 'name'> => {
    const table = tableRef.current;
    if (!table) return null;

    return {
      visible_columns: Object.keys(table.columnVisibility).filter(
        id => table.columnVisibility[id]
      ),
      column_order: table.columnOrder,
      column_sizing: table.columnWidths,
      sorting: table.sorting
        ? [{ 
            id: table.sorting.key, 
            desc: table.sorting.direction === 'descending' 
          }]
        : [],
      filters: table.filters,
    };
  };

  // Apply a saved view
  const loadView = (view: SavedView) => {
    const table = tableRef.current;
    if (!table) return;

    // 1. Column visibility
    const visibility: Record<string, boolean> = {};
    table.allColumns.forEach(col => {
      visibility[col.id] = view.visible_columns?.includes(col.id) ?? true;
    });
    table.setColumnVisibility(visibility);

    // 2. Column order
    if (view.column_order) {
      table.setColumnOrder(view.column_order);
    }

    // 3. Column widths
    if (view.column_sizing) {
      table.setColumnWidths(view.column_sizing);
    }

    // 4. Sorting
    const firstSort = view.sorting?.[0];
    if (firstSort) {
      table.setSorting({
        key: firstSort.id,
        direction: firstSort.desc ? 'descending' : 'ascending'
      });
    } else {
      table.setSorting(null);
    }

    // 5. Filters
    if (view.filters) {
      table.applyFilters(view.filters);
    }
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      disablePersistence={true} // Important: disable auto-persistence
      components={{
        Toolbar: (props) => {
          // Capture table ref
          tableRef.current = props.table;
          
          return (
            <div>
              <button onClick={() => {
                const viewState = getCurrentViewState();
                console.log('Current view:', viewState);
                // Save to your backend/state management
              }}>
                Save View
              </button>
              
              <button onClick={() => {
                // Load from your backend/state management
                const savedView = getSavedView();
                loadView(savedView);
              }}>
                Load View
              </button>
              
              {/* Original toolbar */}
              <TableToolbar {...props} />
            </div>
          );
        }
      }}
    />
  );
}
```

---

## Type Definitions

```ts
// Filter type
interface Filter {
  id: string;
  column: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: string;
}

// Sort config
interface SortConfig<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}

// Complete table state
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
```

---

## Important Notes

### 1. **Always use `disablePersistence={true}`**

When using saved views, disable automatic localStorage persistence:

```tsx
<DataTable
  data={data}
  columns={columns}
  disablePersistence={true} // ← Required for saved views
/>
```

### 2. **Sorting Format Conversion**

Morne uses `{ key, direction }`, but you may need `[{ id, desc }]` for compatibility:

```ts
// Morne → SavedView
const toSavedView = (sorting: SortConfig | null) => 
  sorting ? [{ id: sorting.key, desc: sorting.direction === 'descending' }] : [];

// SavedView → Morne
const fromSavedView = (sorting: Array<{ id: string; desc: boolean }>) => {
  const first = sorting?.[0];
  return first ? {
    key: first.id,
    direction: first.desc ? 'descending' : 'ascending'
  } : null;
};
```

### 3. **Column Visibility Default**

When loading a view, explicitly set visibility for ALL columns:

```ts
// ✅ Good - explicit for all columns
const visibility = {};
table.allColumns.forEach(col => {
  visibility[col.id] = view.visible_columns?.includes(col.id) ?? true;
});
table.setColumnVisibility(visibility);

// ❌ Bad - only sets some columns
table.setColumnVisibility(
  view.visible_columns.reduce((acc, id) => ({ ...acc, [id]: true }), {})
);
```

### 4. **Filters - Keep It Simple**

Morne's `Filter` type is minimal. If you need extra metadata (like `dataType`, `label`), store it separately:

```ts
// Option A: Store metadata separately
const filterMetadata = {
  'filter-1': { dataType: 'string', label: 'Name' },
  'filter-2': { dataType: 'number', label: 'Age' },
};

// Option B: Extend the type (requires package modification)
interface ExtendedFilter extends Filter {
  dataType?: string;
  label?: string;
  displayColumnName?: string;
}
```

---

## Quick Checklist

When implementing saved views:

- [ ] Add `disablePersistence={true}` to `<DataTable>`
- [ ] Capture table ref in custom Toolbar component
- [ ] Implement `getCurrentViewState()` to read all state
- [ ] Implement `loadView(view)` to restore all state
- [ ] Convert sorting format if needed (`{ key, direction }` ↔ `[{ id, desc }]`)
- [ ] Set visibility for ALL columns when loading
- [ ] Test save → load → save cycle for consistency
- [ ] Handle edge cases (no sorting, empty filters, etc.)

---

## Troubleshooting

**Problem:** Column visibility not working after load

**Solution:** Make sure you set visibility for ALL columns, not just visible ones:
```ts
const visibility = {};
table.allColumns.forEach(col => {
  visibility[col.id] = view.visible_columns?.includes(col.id) ?? true;
});
table.setColumnVisibility(visibility);
```

---

**Problem:** Sorting not applying

**Solution:** Check format conversion and use `setSorting`, not `setSort`:
```ts
// ✅ Correct
table.setSorting({ key: 'name', direction: 'ascending' });

// ❌ Wrong - this toggles, doesn't set
table.setSort('name');
```

---

**Problem:** State persists even with `disablePersistence={true}`

**Solution:** Clear localStorage once after adding the prop:
```ts
// Run once in browser console
Object.keys(localStorage)
  .filter(key => key.startsWith('datatable_'))
  .forEach(key => localStorage.removeItem(key));
```

---

## Performance Tips

1. **Debounce view saves** - Don't save on every state change
2. **Batch state updates** - Use all setters before re-render
3. **Memoize view state** - Cache `getCurrentViewState()` result
4. **Lazy load views** - Only fetch when user opens view selector

---

## Next Steps

- See `CHANGELOG-v1.2.0.md` for complete feature list
- Check `EXAMPLES.md` for more usage patterns
- Read `USAGE.md` for full API documentation
