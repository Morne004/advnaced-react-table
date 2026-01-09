# Custom Components Example

Learn how to replace default UI components using the component slots pattern.

---

## Overview

In this example, you'll learn how to:
- Use the component slots pattern
- Build custom Toolbar, Pagination, FilterBuilder, and Skeleton components
- Access the table instance
- Type custom components correctly with TypeScript

**Difficulty:** 🟡 Intermediate

---

## Component Slots Pattern

The `DataTable` component accepts a `components` prop where you can replace default UI:

```tsx
<DataTable<User>
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

Each custom component receives the `table` instance with full access to state and handlers.

---

## Complete Example

See [Custom Styling](./custom-styling.md) for a complete example with all custom components.

---

## Building Custom Components

### Custom Toolbar

```tsx
import type { TableComponentProps } from '@morne004/headless-react-data-table';

const CustomToolbar = <T,>({ table }: TableComponentProps<T>) => {
  const {
    globalFilter,
    totalCount,
    handleGlobalFilterChange,
    isCondensed,
    toggleDensity,
  } = table;

  return (
    <div className="p-4 flex items-center justify-between">
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => handleGlobalFilterChange(e.target.value)}
        placeholder="Search..."
        className="border rounded px-3 py-2"
      />

      <span>{totalCount} rows</span>

      <button onClick={toggleDensity}>
        {isCondensed ? 'Normal View' : 'Compact View'}
      </button>
    </div>
  );
};
```

### Custom Pagination

```tsx
const CustomPagination = <T,>({ table }: TableComponentProps<T>) => {
  const { pagination, pageCount, setPageSize, setPageIndex } = table;

  return (
    <div className="p-4 flex items-center justify-between">
      <select
        value={pagination.pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        {[10, 25, 50, 100].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>

      <span>Page {pagination.pageIndex + 1} of {pageCount}</span>

      <div className="flex gap-2">
        <button
          onClick={() => setPageIndex(pagination.pageIndex - 1)}
          disabled={pagination.pageIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setPageIndex(pagination.pageIndex + 1)}
          disabled={pagination.pageIndex >= pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

### Custom FilterBuilder

```tsx
import { useState } from 'react';
import type { FilterBuilderComponentProps, Filter } from '@morne004/headless-react-data-table';

const CustomFilterBuilder = <T,>({ table, showFilters }: FilterBuilderComponentProps<T>) => {
  if (!showFilters) return null;

  const { filters, applyFilters, allColumns } = table;
  const [stagedFilters, setStagedFilters] = useState(filters);

  const addFilter = () => {
    setStagedFilters([...stagedFilters, {
      id: `filter-${Date.now()}`,
      column: allColumns[0]?.id || '',
      operator: 'contains',
      value: '',
    }]);
  };

  return (
    <div className="p-4 border-b">
      <h3 className="font-semibold mb-2">Filters</h3>

      {stagedFilters.map((filter, index) => (
        <div key={filter.id} className="flex gap-2 mb-2">
          <select
            value={filter.column}
            onChange={(e) => {
              const updated = [...stagedFilters];
              updated[index] = { ...filter, column: e.target.value };
              setStagedFilters(updated);
            }}
          >
            {allColumns.map(col => (
              <option key={col.id} value={col.id}>{col.header}</option>
            ))}
          </select>

          <select
            value={filter.operator}
            onChange={(e) => {
              const updated = [...stagedFilters];
              updated[index] = { ...filter, operator: e.target.value as any };
              setStagedFilters(updated);
            }}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts with</option>
            <option value="endsWith">Ends with</option>
            <option value="greaterThan">Greater than</option>
            <option value="lessThan">Less than</option>
          </select>

          <input
            value={filter.value}
            onChange={(e) => {
              const updated = [...stagedFilters];
              updated[index] = { ...filter, value: e.target.value };
              setStagedFilters(updated);
            }}
            placeholder="Value..."
            className="border rounded px-2 py-1"
          />

          <button
            onClick={() => setStagedFilters(stagedFilters.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        <button onClick={addFilter} className="px-3 py-1 bg-blue-500 text-white rounded">
          Add Filter
        </button>
        <button
          onClick={() => applyFilters(stagedFilters)}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Apply Filters
        </button>
        <button
          onClick={() => {
            setStagedFilters([]);
            applyFilters([]);
          }}
          className="px-3 py-1 bg-gray-500 text-white rounded"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
```

### Custom Skeleton

```tsx
const CustomSkeleton = ({ rows = 5, cols }: { rows?: number; cols: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
```

---

## Next Steps

- **[Advanced Features](./advanced-features.md)** - Row selection, CSV export
- **[Server-Side Data](./server-side-data.md)** - API integration
- **[Customization Guide](../customization-guide.md)** - More customization options

