# Customization Guide

Learn how to style and customize **@morne004/headless-react-data-table** to match your application's design.

---

## Table of Contents

1. [Three Levels of Customization](#three-levels-of-customization)
2. [Level 1: CSS Styling](#level-1-css-styling)
3. [Level 2: Component Slots](#level-2-component-slots)
4. [Level 3: Fully Headless](#level-3-fully-headless)
5. [Styling with Tailwind CSS](#styling-with-tailwind-css)
6. [Responsive Design](#responsive-design)
7. [Dark Mode](#dark-mode)
8. [Accessibility](#accessibility)

---

## Three Levels of Customization

Choose the approach that best fits your needs:

### Level 1: CSS Styling
**Best for:** Quick styling, small adjustments

- Use the default `DataTable` component
- Override styles with CSS
- Minimal code changes
- **Effort:** Low

### Level 2: Component Slots
**Best for:** Custom UI while keeping table logic

- Replace default UI components (Toolbar, Pagination, etc.)
- Keep all table logic and state management
- Full control over UI appearance
- **Effort:** Medium

### Level 3: Fully Headless
**Best for:** Complete control, unique designs

- Use `useDataTable` hook directly
- Build your own table UI from scratch
- Maximum flexibility
- **Effort:** High

---

## Level 1: CSS Styling

### Default Class Names

The `DataTable` component renders with these class names:

```html
<div class="data-table-container">
  <div class="data-table-toolbar">
    <!-- Toolbar content -->
  </div>

  <div class="data-table-filter-builder">
    <!-- Filter builder (when active) -->
  </div>

  <table class="data-table">
    <thead class="data-table-header">
      <tr class="data-table-header-row">
        <th class="data-table-header-cell">
          <!-- Column header -->
        </th>
      </tr>
    </thead>
    <tbody class="data-table-body">
      <tr class="data-table-row">
        <td class="data-table-cell">
          <!-- Cell content -->
        </td>
      </tr>
    </tbody>
  </table>

  <div class="data-table-pagination">
    <!-- Pagination controls -->
  </div>
</div>
```

### Basic CSS Example

```css
/* Container */
.data-table-container {
  font-family: 'Inter', sans-serif;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

/* Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

/* Header */
.data-table-header {
  background-color: #f9fafb;
}

.data-table-header-cell {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

/* Rows */
.data-table-row {
  border-bottom: 1px solid #e5e7eb;
}

.data-table-row:hover {
  background-color: #f9fafb;
}

/* Cells */
.data-table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #1f2937;
}

/* Toolbar */
.data-table-toolbar {
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

/* Pagination */
.data-table-pagination {
  padding: 16px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}
```

### Inline Styles

You can also use inline styles:

```tsx
<div style={{ padding: '20px' }}>
  <DataTable<User>
    data={users}
    columns={columns}
  />
</div>
```

---

## Level 2: Component Slots

Replace default UI components while keeping table logic.

### Available Component Slots

| Slot | Purpose | Props Received |
|------|---------|----------------|
| `Toolbar` | Search bar, filters, column visibility, etc. | `TableComponentProps<T>` |
| `Pagination` | Page navigation controls | `TableComponentProps<T>` |
| `FilterBuilder` | Multi-filter UI | `FilterBuilderComponentProps<T>` |
| `Skeleton` | Loading state | `{ rows?: number; cols: number }` |

### TableComponentProps Interface

```tsx
interface TableComponentProps<T> {
  table: {
    // State
    globalFilter: string;
    filters: Filter[];
    sorting: SortConfig<T> | null;
    pagination: { pageIndex: number; pageSize: number };
    columnOrder: string[];
    columnVisibility: Record<string, boolean>;
    columnWidths: Record<string, number>;
    rowSelection: Record<string, boolean>;
    isCondensed: boolean;

    // Derived data
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
    setColumnVisibility: (visibility: Record<string, boolean>) => void;
    toggleColumnVisibility: (columnId: string) => void;
    toggleDensity: () => void;
    // ... more methods
  };
}
```

### Custom Toolbar Example

```tsx
import type { TableComponentProps } from '@morne004/headless-react-data-table';

const CustomToolbar = <T,>({ table }: TableComponentProps<T>) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={table.globalFilter}
          onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border rounded-md"
        />
      </div>

      {/* Row count */}
      <div className="text-sm text-gray-600">
        {table.totalCount} total rows
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={table.toggleDensity}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          {table.isCondensed ? 'Normal' : 'Compact'}
        </button>
      </div>
    </div>
  );
};

// Use custom toolbar
<DataTable<User>
  data={users}
  columns={columns}
  components={{
    Toolbar: CustomToolbar
  }}
/>
```

### Custom Pagination Example

```tsx
const CustomPagination = <T,>({ table }: TableComponentProps<T>) => {
  const { pagination, pageCount, setPageSize, setPageIndex } = table;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Show</span>
        <select
          value={pagination.pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[10, 25, 50, 100].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="text-sm">entries</span>
      </div>

      {/* Page info and navigation */}
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Page {pagination.pageIndex + 1} of {pageCount}
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => setPageIndex(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPageIndex(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex >= pageCount - 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

<DataTable<User>
  data={users}
  columns={columns}
  components={{
    Pagination: CustomPagination
  }}
/>
```

See [Custom Components Example](./examples/custom-components.md) for more details.

---

## Level 3: Fully Headless

Build your own table UI from scratch using the `useDataTable` hook.

```tsx
import { useDataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'email', header: 'Email', accessorKey: 'email' },
];

function CustomTable() {
  const table = useDataTable({
    data: users,
    columns: columns,
  });

  return (
    <div className="custom-table">
      {/* Custom search */}
      <input
        value={table.globalFilter}
        onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
      />

      {/* Custom table rendering */}
      <table>
        <thead>
          <tr>
            {table.orderedAndVisibleColumns.map(col => (
              <th
                key={col.id}
                onClick={() => col.accessorKey && table.setSort(col.accessorKey)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.paginatedData.map(row => (
            <tr key={row.id}>
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
        <button onClick={() => table.setPageIndex(table.pagination.pageIndex - 1)}>
          Previous
        </button>
        <span>Page {table.pagination.pageIndex + 1}</span>
        <button onClick={() => table.setPageIndex(table.pagination.pageIndex + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## Styling with Tailwind CSS

Complete example using Tailwind CSS classes (matches the demo app).

### Styled Table

```tsx
<div className="w-full">
  <DataTable<User>
    data={users}
    columns={columns}
  />
</div>

<style jsx>{`
  :global(.data-table-container) {
    @apply border border-gray-200 rounded-lg overflow-hidden shadow-sm;
  }

  :global(.data-table) {
    @apply w-full;
  }

  :global(.data-table-header-cell) {
    @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50;
  }

  :global(.data-table-row) {
    @apply border-t border-gray-200;
  }

  :global(.data-table-row:hover) {
    @apply bg-gray-50;
  }

  :global(.data-table-cell) {
    @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
  }
`}</style>
```

### Tailwind with Component Slots

```tsx
const TailwindToolbar = <T,>({ table }: TableComponentProps<T>) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
    {/* Search */}
    <div className="relative w-full sm:w-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={table.globalFilter}
        onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
        placeholder="Search all columns..."
        className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>

    {/* Total count */}
    <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
      {table.totalCount} total rows
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2">
      <button
        onClick={table.toggleDensity}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {table.isCondensed ? 'Normal' : 'Compact'}
      </button>
    </div>
  </div>
);

<DataTable<User>
  data={users}
  columns={columns}
  components={{ Toolbar: TailwindToolbar }}
/>
```

See [Custom Styling Example](./examples/custom-styling.md) for complete Tailwind implementation.

---

## Responsive Design

### Mobile-First Approach

```tsx
const ResponsiveToolbar = <T,>({ table }: TableComponentProps<T>) => (
  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4">
    {/* Search - full width on mobile, auto on desktop */}
    <input
      value={table.globalFilter}
      onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
      className="w-full md:w-64 px-4 py-2 border rounded"
      placeholder="Search..."
    />

    {/* Actions - stack on mobile, row on desktop */}
    <div className="flex flex-col sm:flex-row gap-2">
      <button className="px-4 py-2 border rounded">
        Filter
      </button>
      <button className="px-4 py-2 border rounded">
        Export
      </button>
    </div>
  </div>
);
```

### Horizontal Scroll on Mobile

```tsx
<div className="overflow-x-auto">
  <DataTable<User>
    data={users}
    columns={columns}
  />
</div>

<style jsx>{`
  :global(.data-table) {
    @apply min-w-full;
  }

  @media (max-width: 640px) {
    :global(.data-table) {
      min-width: 600px; /* Force horizontal scroll on small screens */
    }
  }
`}</style>
```

### Hide Columns on Mobile

```tsx
const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

useEffect(() => {
  // Hide email and phone columns on mobile
  const isMobile = window.innerWidth < 768;
  setColumnVisibility({
    email: !isMobile,
    phone: !isMobile,
  });
}, []);

<DataTable<User>
  data={users}
  columns={columns}
  initialState={{
    columnVisibility
  }}
/>
```

---

## Dark Mode

### Tailwind Dark Mode

```tsx
<div className="dark:bg-gray-900">
  <DataTable<User>
    data={users}
    columns={columns}
  />
</div>

<style jsx>{`
  :global(.data-table-container) {
    @apply border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800;
  }

  :global(.data-table-header-cell) {
    @apply bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400;
  }

  :global(.data-table-row) {
    @apply border-gray-200 dark:border-gray-700;
  }

  :global(.data-table-row:hover) {
    @apply bg-gray-50 dark:bg-gray-700;
  }

  :global(.data-table-cell) {
    @apply text-gray-900 dark:text-gray-100;
  }
`}</style>
```

### CSS Variables for Dark Mode

```css
:root {
  --table-bg: #ffffff;
  --table-border: #e5e7eb;
  --table-text: #1f2937;
  --table-header-bg: #f9fafb;
  --table-hover-bg: #f9fafb;
}

[data-theme="dark"] {
  --table-bg: #1f2937;
  --table-border: #374151;
  --table-text: #f3f4f6;
  --table-header-bg: #111827;
  --table-hover-bg: #374151;
}

.data-table-container {
  background-color: var(--table-bg);
  border-color: var(--table-border);
}

.data-table-cell {
  color: var(--table-text);
}

.data-table-header-cell {
  background-color: var(--table-header-bg);
}

.data-table-row:hover {
  background-color: var(--table-hover-bg);
}
```

---

## Accessibility

### Keyboard Navigation

The `DataTable` component includes keyboard navigation by default:
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and toggle sort
- **Escape**: Close dropdowns

### ARIA Labels

Add ARIA labels to custom components:

```tsx
const AccessibleToolbar = <T,>({ table }: TableComponentProps<T>) => (
  <div role="toolbar" aria-label="Table controls">
    <input
      type="text"
      value={table.globalFilter}
      onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
      placeholder="Search..."
      aria-label="Search table"
    />

    <button
      onClick={table.toggleDensity}
      aria-label={table.isCondensed ? 'Switch to normal view' : 'Switch to compact view'}
      aria-pressed={table.isCondensed}
    >
      Toggle Density
    </button>
  </div>
);
```

### Focus Styles

```css
.data-table-header-cell:focus,
button:focus,
input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Screen Reader Support

```tsx
<table aria-label="Users table" aria-describedby="table-description">
  <caption id="table-description" className="sr-only">
    A table of users with their name, email, and status.
    Use arrow keys to navigate and enter to sort by column.
  </caption>
  {/* ... */}
</table>
```

---

## Summary

**Choose your customization level:**

| Level | Effort | Flexibility | Use Case |
|-------|--------|-------------|----------|
| **CSS Styling** | Low | Low | Quick styling, small tweaks |
| **Component Slots** | Medium | Medium | Custom UI, keep logic |
| **Fully Headless** | High | High | Complete control, unique designs |

**Best practices:**
- Start with CSS styling for quick changes
- Use component slots for significant UI changes
- Go fully headless only if you need complete control
- Always maintain accessibility
- Test responsive design on multiple devices
- Provide dark mode support when possible

---

## Next Steps

- **[Custom Styling Example](./examples/custom-styling.md)** - Complete Tailwind CSS example
- **[Custom Components Example](./examples/custom-components.md)** - Build custom UI components
- **[API Reference](./api-reference.md)** - Complete prop reference
- **[TypeScript Guide](./typescript-guide.md)** - Type-safe customization
