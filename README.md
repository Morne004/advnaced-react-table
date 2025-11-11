# Headless React Data Table

[![npm version](https://img.shields.io/npm/v/@morne004/headless-react-data-table.svg)](https://www.npmjs.com/package/@morne004/headless-react-data-table)
[![License](https://img.shields.io/npm/l/@morne004/headless-react-data-table.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@morne004/headless-react-data-table)](https://bundlephobia.com/package/@morne004/headless-react-data-table)

A lightweight, powerful, and fully **headless** data table library for React. It provides all the logic, state management, and functionality you need to build a feature-rich data grid, while leaving the rendering and styling completely in your hands.

Built with TypeScript and modern React hooks, it's designed for maximum flexibility and an excellent developer experience.

**📦 [View on npm](https://www.npmjs.com/package/@morne004/headless-react-data-table) • 🐙 [View on GitHub](https://github.com/Morne004/advnaced-react-table) • 🐛 [Report Issues](https://github.com/Morne004/advnaced-react-table/issues)**

---

## Table of Contents

- [Why Choose This Library?](#why-choose-this-library)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
  - [Data Prop](#the-data-prop)
  - [Columns Prop](#the-columns-prop)
  - [Components Prop (Headless UI)](#the-components-prop-headless-ui)
  - [Other DataTable Props](#other-datatable-props)
  - [State Management](#state-management)
- [Styling Your Table](#styling-your-table)
- [Advanced Usage](#advanced-usage)
  - [CSV Export](#csv-export)
  - [Custom Pagination](#custom-pagination)
  - [Filter Builder](#filter-builder)
  - [Controlled Mode](#controlled-mode)
- [Common Patterns](#common-patterns)
- [TypeScript Support](#typescript-support)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Why Choose This Library?

### ✅ What You Get

- **Complete Table Logic**: Sorting, filtering, pagination, column management - all handled for you
- **Persistent State**: User preferences automatically saved to localStorage
- **TypeScript Native**: Full type safety and IntelliSense support
- **Zero Dependencies**: Only React peer dependencies
- **Small Bundle**: ~23KB minified, tree-shakeable
- **Production Ready**: Built with performance and reliability in mind

### 🎨 What You Bring

- **Your UI**: Complete control over HTML structure and styling
- **Your Design System**: Works seamlessly with Tailwind, Material-UI, Ant Design, or any other framework
- **Your Components**: Replace any part with your own React components

### 🆚 Compared to Other Solutions

| Feature | This Library | TanStack Table | Building from Scratch |
|---------|-------------|----------------|----------------------|
| Learning Curve | Low | Medium | High |
| Bundle Size | Small (~23KB) | Medium (~100KB) | Varies |
| Customization | Complete | Complete | Complete |
| Built-in Persistence | ✅ Yes | ❌ No | ❌ No |
| TypeScript | ✅ Native | ✅ Native | Depends |
| Time to Implement | Minutes | Hours | Days |

---

## Key Features

- **🚀 Headless by Design**: Provides the engine, you provide the UI. Works with any styling solution (Tailwind CSS, styled-components, CSS Modules, etc.)
- **⚛️ Modern React**: Built entirely with hooks for a clean, declarative API
- **💾 Persistent State**: Remembers user preferences like column order, visibility, filters, and sorting in `localStorage`
- **⚙️ Fully Controlled Mode**: Optionally manage the table's state from your own components or sync with URL params
- **🔍 Advanced Filtering**: Includes both global text search and a multi-filter builder with 6 operators
- **🔢 Smart Pagination**: Fully-featured pagination logic ready for your custom UI
- **↔️ Column Resizing**: Let users resize columns to their liking with drag handles
- **🔄 Column Reordering**: Simple drag-and-drop to reorder columns
- **👁️ Column Visibility**: Toggle column visibility with persistence
- **📤 CSV Export**: Built-in utility to export table data
- **✅ TypeScript Native**: Full type safety for a great developer experience
- **📦 Tree-Shakeable**: Import only what you need
- **🎯 Zero Dependencies**: Only peer dependencies on React and React-DOM

---

## Installation

Install via npm:

```bash
npm install @morne004/headless-react-data-table
```

Or using yarn:

```bash
yarn add @morne004/headless-react-data-table
```

Or using pnpm:

```bash
pnpm add @morne004/headless-react-data-table
```

### Peer Dependencies

This library requires **React 18+** or **React 19+**. Make sure you have `react` and `react-dom` installed:

```bash
npm install react react-dom
```

---

## Quick Start

Here's the simplest possible example to get you started. This creates a fully functional table with sorting and pagination (unstyled):

```tsx
import React from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

const data: User[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', age: 30, email: 'john@example.com' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25, email: 'jane@example.com' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', age: 35, email: 'bob@example.com' },
];

const columns: ColumnDef<User>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'firstName', accessorKey: 'firstName', header: 'First Name' },
  { id: 'lastName', accessorKey: 'lastName', header: 'Last Name' },
  { id: 'age', accessorKey: 'age', header: 'Age' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
];

function MyApp() {
  return (
    <div>
      <h1>My Users</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
}

export default MyApp;
```

**What this gives you:**
- ✅ Sortable columns (click headers)
- ✅ Pagination controls
- ✅ Search functionality
- ✅ Column visibility toggle
- ✅ All state persisted to localStorage

**Note:** The table is completely unstyled by default. See [Styling Your Table](#styling-your-table) for examples.

---

## Core Concepts

### What "Headless" Means

A headless component library provides **logic and behavior** without prescribing **presentation**. This library handles:

- ✅ Data processing (filtering, sorting, pagination)
- ✅ State management (what's selected, sorted, filtered)
- ✅ User interactions (column resizing, reordering)

**You provide:**
- 🎨 HTML structure
- 🎨 CSS styles
- 🎨 Custom components

### The Two Pieces

1. **`<DataTable />`** - The main component that renders a basic table structure
2. **`useDataTable()`** - The hook that powers everything (used internally, but you can use it directly too)

### Customization Levels

You can customize at three levels:

**Level 1: Style the Default Components** (Easiest)
```tsx
<div className="my-custom-wrapper">
  <DataTable data={data} columns={columns} />
</div>
```
Then add CSS to style the table, headers, cells, etc.

**Level 2: Replace Component Slots**
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

**Level 3: Use the Hook Directly** (Maximum Control)
```tsx
const table = useDataTable({ data, columns });
// Build your own UI from scratch using table.paginatedData, table.setSort, etc.
```

---

## API Reference

### The `data` Prop

The `data` prop is the array of objects you want to display in the table.

**Type:** `T[]` (an array of objects)

**Requirements:**
- Each object should have a unique identifier (defaults to `id` property)
- All objects should have the same shape/interface

**Example:**

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics', inStock: true },
  { id: 2, name: 'Mouse', price: 29, category: 'Electronics', inStock: true },
  { id: 3, name: 'Keyboard', price: 79, category: 'Electronics', inStock: false },
];

<DataTable data={products} columns={columns} />
```

**Custom Row ID:**

If your data uses a different unique identifier:

```typescript
<DataTable
  data={products}
  columns={columns}
  getRowId={(row) => row.productCode} // Use productCode instead of id
/>
```

---

### The `columns` Prop

The `columns` prop defines what columns to display and how to display them.

**Type:** `ColumnDef<T>[]`

#### Column Definition Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ Yes | Unique identifier for the column |
| `header` | `string` | ✅ Yes | Text displayed in the column header |
| `accessorKey` | `keyof T` | No | Property key to access data from each row |
| `cell` | `(info: { row: T }) => ReactNode` | No | Custom render function for cell content |
| `enableSorting` | `boolean` | No | Enable/disable sorting (default: `true` if accessorKey exists) |

#### Basic Column Example

```typescript
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Full Name',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email Address',
    enableSorting: false, // Disable sorting for this column
  },
];
```

#### Custom Cell Rendering

Use the `cell` property to customize how data is displayed:

**Example 1: Format Currency**
```typescript
{
  id: 'price',
  accessorKey: 'price',
  header: 'Price',
  cell: ({ row }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(row.price);
  },
}
```

**Example 2: Status Badge**
```typescript
{
  id: 'status',
  accessorKey: 'isActive',
  header: 'Status',
  cell: ({ row }) => {
    const isActive = row.isActive;
    return (
      <span className={`
        px-2 py-1 text-xs font-semibold rounded-full
        ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      `}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  },
}
```

**Example 3: Action Buttons**
```typescript
{
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) => {
    return (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(row.id)}>Edit</button>
        <button onClick={() => handleDelete(row.id)}>Delete</button>
      </div>
    );
  },
  enableSorting: false,
}
```

**Example 4: Format Date**
```typescript
{
  id: 'createdAt',
  accessorKey: 'createdAt',
  header: 'Created',
  cell: ({ row }) => {
    return new Date(row.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
}
```

---

### The `components` Prop (Headless UI)

The `components` prop is where the "headless" magic happens. Replace any of the default UI components with your own.

**Type:** `object`

#### Available Slots

| Slot | Description | Props Received |
|------|-------------|----------------|
| `Toolbar` | Search bar, filters, column visibility | `table`, `isColumnDropdownOpen`, `setIsColumnDropdownOpen`, `columnDropdownRef`, `showFilters`, `setShowFilters` |
| `Pagination` | Page navigation controls | `table` |
| `FilterBuilder` | Advanced multi-filter UI | `table`, `showFilters` |
| `Skeleton` | Loading state placeholder | `rows`, `cols` |

#### The `table` Object

All custom components receive a `table` prop containing:

**State:**
- `globalFilter` - Current search term
- `filters` - Array of active advanced filters
- `sorting` - Current sort configuration
- `pagination` - `{ pageIndex, pageSize }`
- `columnOrder` - Array of column IDs in current order
- `columnVisibility` - Object mapping column IDs to visibility boolean
- `isCondensed` - Boolean indicating condensed/normal view mode

**Derived Data:**
- `paginatedData` - Current page of data
- `sortedData` - All data after filtering and sorting
- `pageCount` - Total number of pages
- `totalCount` - Total number of rows (before filtering)
- `orderedAndVisibleColumns` - Columns in correct order with hidden ones filtered out
- `allColumns` - All column definitions

**Handlers:**
- `handleGlobalFilterChange(value: string)` - Update search
- `applyFilters(filters: Filter[])` - Apply advanced filters
- `setSort(key: keyof T)` - Toggle sort on a column
- `setPageSize(size: number)` - Change page size
- `setPageIndex(index: number)` - Navigate to a page
- `setColumnOrder(order: string[])` - Reorder columns
- `toggleColumnVisibility(columnId: string)` - Show/hide a column
- `toggleDensity()` - Toggle between condensed and normal view

#### Example: Custom Toolbar with Tailwind CSS

```tsx
import type { TableComponentProps } from '@morne004/headless-react-data-table';

const MyToolbar = <T extends object>({ table }: TableComponentProps<T>) => {
  const { globalFilter, handleGlobalFilterChange, sortedData, filters, totalCount } = table;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
      {/* Search */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => handleGlobalFilterChange(e.target.value)}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* Results count */}
        <span className="text-sm text-gray-600">
          {filters.length > 0 || globalFilter
            ? `Showing ${sortedData.length} of ${totalCount} results`
            : `${totalCount} total rows`
          }
        </span>
      </div>

      {/* Export button */}
      <button
        onClick={() => exportToCsv('data.csv', sortedData)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Export CSV
      </button>
    </div>
  );
};

// Use it
<DataTable
  data={data}
  columns={columns}
  components={{ Toolbar: MyToolbar }}
/>
```

#### Example: Custom Pagination

```tsx
const MyPagination = <T extends object>({ table }: TableComponentProps<T>) => {
  const { pagination, pageCount, setPageIndex, setPageSize } = table;
  const { pageIndex, pageSize } = pagination;

  return (
    <div className="flex items-center justify-between p-4">
      {/* Page size selector */}
      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="px-3 py-2 border rounded"
      >
        {[10, 25, 50, 100].map(size => (
          <option key={size} value={size}>{size} rows</option>
        ))}
      </select>

      {/* Page info */}
      <span>
        Page {pageIndex + 1} of {pageCount}
      </span>

      {/* Navigation buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setPageIndex(0)}
          disabled={pageIndex === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => setPageIndex(pageCount - 1)}
          disabled={pageIndex >= pageCount - 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};
```

---

### Other `<DataTable />` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | **Required** | Array of data objects to display |
| `columns` | `ColumnDef<T>[]` | **Required** | Column definitions |
| `getRowId` | `(row: T) => string \| number` | `row => row.id` | Extract unique ID from each row |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `noDataMessage` | `ReactNode` | "No data available." | Message when table is empty |
| `initialState` | `Partial<DataTableState>` | `{}` | Initial table state (page size, sorting, etc.) |
| `state` | `ControlledDataTableState` | `undefined` | External state (controlled mode) |
| `onStateChange` | `(state) => void` | `undefined` | State change callback (controlled mode) |
| `components` | `object` | `{}` | Custom component overrides |

#### Example: Initial State

```tsx
<DataTable
  data={users}
  columns={columns}
  initialState={{
    pageSize: 25,
    sorting: { key: 'lastName', direction: 'ascending' },
    columnVisibility: {
      'id': false, // Hide ID column by default
    },
  }}
/>
```

#### Example: Loading State

```tsx
const [isLoading, setIsLoading] = useState(true);
const [data, setData] = useState([]);

useEffect(() => {
  fetchData().then(result => {
    setData(result);
    setIsLoading(false);
  });
}, []);

<DataTable
  data={data}
  columns={columns}
  isLoading={isLoading}
/>
```

---

### State Management

The table supports two modes:

#### 1. Uncontrolled Mode (Default)

The table manages its own state and automatically persists it to `localStorage`.

```tsx
<DataTable data={data} columns={columns} />
```

**Persisted state includes:**
- Global filter (search term)
- Advanced filters
- Sorting configuration
- Page size
- Column order
- Column visibility
- Column widths
- View density (condensed/normal)

**Not persisted:**
- Current page index (always resets to first page)

#### 2. Controlled Mode

You manage the state yourself, perfect for syncing with URL params or external state management.

```tsx
const [tableState, setTableState] = useState({
  pageSize: 10,
  pageIndex: 0,
  globalFilter: '',
});

<DataTable
  data={data}
  columns={columns}
  state={tableState}
  onStateChange={(newState) => {
    setTableState(prev => ({ ...prev, ...newState }));
    // Optionally sync with URL
    updateURLParams(newState);
  }}
/>
```

**Partial control is supported:**

```tsx
// Only control page size, let table handle everything else
<DataTable
  data={data}
  columns={columns}
  state={{ pageSize: 25 }}
  onStateChange={(newState) => {
    if ('pageSize' in newState) {
      // User changed page size
      trackAnalytics('page_size_changed', newState.pageSize);
    }
  }}
/>
```

---

## Styling Your Table

Since this is a headless library, styling is entirely up to you. Here are examples with popular styling approaches:

### With Tailwind CSS

```tsx
<div className="w-full">
  <DataTable data={data} columns={columns} />

  <style jsx>{`
    table {
      @apply w-full border-collapse;
    }

    th {
      @apply bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b-2 border-gray-200;
    }

    td {
      @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200;
    }

    tr:hover td {
      @apply bg-gray-50;
    }

    th button {
      @apply w-full text-left font-semibold cursor-pointer hover:text-gray-900;
    }
  `}</style>
</div>
```

### With CSS Modules

```tsx
import styles from './Table.module.css';

<div className={styles.tableWrapper}>
  <DataTable data={data} columns={columns} />
</div>
```

```css
/* Table.module.css */
.tableWrapper table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.tableWrapper th {
  background: #f7fafc;
  padding: 12px 24px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
}

.tableWrapper td {
  padding: 12px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.tableWrapper tr:hover {
  background: #f7fafc;
}
```

### With styled-components

```tsx
import styled from 'styled-components';

const StyledWrapper = styled.div`
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    background: ${props => props.theme.colors.gray100};
    padding: 1rem 1.5rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid ${props => props.theme.colors.gray300};
  }

  td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid ${props => props.theme.colors.gray200};
  }

  tr:hover td {
    background: ${props => props.theme.colors.gray50};
  }
`;

<StyledWrapper>
  <DataTable data={data} columns={columns} />
</StyledWrapper>
```

---

## Advanced Usage

### CSV Export

The library includes a built-in CSV export utility:

```tsx
import { DataTable, exportToCsv } from '@morne004/headless-react-data-table';

const MyToolbar = ({ table }) => {
  const { sortedData } = table; // Get filtered and sorted data

  const handleExport = () => {
    exportToCsv('my-data.csv', sortedData);
  };

  return (
    <button onClick={handleExport}>
      Export to CSV
    </button>
  );
};
```

The `exportToCsv` function:
- Automatically escapes quotes and commas
- Handles multi-line values
- Generates proper CSV format
- Triggers browser download

### Custom Pagination

Build completely custom pagination UI:

```tsx
const CustomPagination = ({ table }) => {
  const { pageIndex, pageSize } = table.pagination;
  const { pageCount, setPageIndex, sortedData } = table;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, sortedData.length);

  return (
    <div>
      <p>Showing {startRow}-{endRow} of {sortedData.length} results</p>

      {/* Jump to page input */}
      <input
        type="number"
        min={1}
        max={pageCount}
        value={pageIndex + 1}
        onChange={(e) => setPageIndex(Number(e.target.value) - 1)}
      />

      {/* Page number buttons */}
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          onClick={() => setPageIndex(i)}
          className={pageIndex === i ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
```

### Filter Builder

The library includes multi-column filtering with 6 operators:

- `contains` - Case-insensitive substring match
- `equals` - Exact match
- `startsWith` - Starts with value
- `endsWith` - Ends with value
- `greaterThan` - Numeric greater than
- `lessThan` - Numeric less than

**Using the default FilterBuilder:**

```tsx
<DataTable
  data={data}
  columns={columns}
  // Default FilterBuilder is included, toggle with the filters button in toolbar
/>
```

**Building a custom filter UI:**

```tsx
const CustomFilterBuilder = ({ table }) => {
  const { filters, applyFilters, allColumns } = table;
  const [stagedFilters, setStagedFilters] = useState(filters);

  const addFilter = () => {
    setStagedFilters([
      ...stagedFilters,
      { id: Date.now().toString(), column: '', operator: 'contains', value: '' }
    ]);
  };

  return (
    <div>
      {stagedFilters.map((filter, index) => (
        <div key={filter.id}>
          <select
            value={filter.column}
            onChange={(e) => {
              const newFilters = [...stagedFilters];
              newFilters[index].column = e.target.value;
              setStagedFilters(newFilters);
            }}
          >
            <option value="">Select column</option>
            {allColumns.map(col => (
              <option key={col.id} value={col.accessorKey}>
                {col.header}
              </option>
            ))}
          </select>

          <select
            value={filter.operator}
            onChange={(e) => {
              const newFilters = [...stagedFilters];
              newFilters[index].operator = e.target.value;
              setStagedFilters(newFilters);
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
              const newFilters = [...stagedFilters];
              newFilters[index].value = e.target.value;
              setStagedFilters(newFilters);
            }}
            placeholder="Filter value"
          />
        </div>
      ))}

      <button onClick={addFilter}>Add Filter</button>
      <button onClick={() => applyFilters(stagedFilters)}>Apply</button>
    </div>
  );
};
```

**Implementing condensed view:**

The library provides built-in support for condensed/normal view density that automatically persists to localStorage.

```tsx
// In your custom toolbar component
const MyToolbar = ({ table }) => {
  const { isCondensed, toggleDensity } = table;

  return (
    <div>
      <button onClick={toggleDensity}>
        {isCondensed ? 'Switch to Normal View' : 'Switch to Condensed View'}
      </button>
    </div>
  );
};

// In your table rendering (apply conditional styling)
<table>
  <thead>
    <tr>
      {table.orderedAndVisibleColumns.map(col => (
        <th
          key={col.id}
          className={table.isCondensed ? 'py-2' : 'py-4'}
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
          <td
            key={col.id}
            className={table.isCondensed ? 'py-2' : 'py-4'}
          >
            {col.cell ? col.cell({ row }) : row[col.accessorKey]}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

The `isCondensed` state is automatically persisted to localStorage and synced across page reloads.

### Controlled Mode

Sync table state with URL parameters:

```tsx
import { useSearchParams } from 'react-router-dom';

function MyComponent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tableState = {
    pageIndex: Number(searchParams.get('page')) || 0,
    pageSize: Number(searchParams.get('pageSize')) || 10,
    globalFilter: searchParams.get('search') || '',
  };

  const handleStateChange = (newState) => {
    const params = new URLSearchParams(searchParams);

    if ('pageIndex' in newState) params.set('page', newState.pageIndex);
    if ('pageSize' in newState) params.set('pageSize', newState.pageSize);
    if ('globalFilter' in newState) params.set('search', newState.globalFilter);

    setSearchParams(params);
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      state={tableState}
      onStateChange={handleStateChange}
    />
  );
}
```

---

## Common Patterns

### Server-Side Pagination

```tsx
const [data, setData] = useState([]);
const [totalCount, setTotalCount] = useState(0);
const [pageIndex, setPageIndex] = useState(0);
const [pageSize, setPageSize] = useState(10);

useEffect(() => {
  fetchData({ page: pageIndex, pageSize }).then(response => {
    setData(response.data);
    setTotalCount(response.total);
  });
}, [pageIndex, pageSize]);

<DataTable
  data={data}
  columns={columns}
  state={{ pageIndex, pageSize }}
  onStateChange={(newState) => {
    if ('pageIndex' in newState) setPageIndex(newState.pageIndex);
    if ('pageSize' in newState) setPageSize(newState.pageSize);
  }}
/>
```

### Integration with React Query

```tsx
import { useQuery } from '@tanstack/react-query';

function UserTable() {
  const [tableState, setTableState] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ['users', tableState.pageIndex, tableState.pageSize],
    queryFn: () => fetchUsers(tableState.pageIndex, tableState.pageSize),
  });

  return (
    <DataTable
      data={data?.users || []}
      columns={columns}
      isLoading={isLoading}
      state={tableState}
      onStateChange={setTableState}
    />
  );
}
```

### Editable Cells

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const [editing, setEditing] = useState(false);
      const [value, setValue] = useState(row.name);

      if (editing) {
        return (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              updateUser(row.id, { name: value });
              setEditing(false);
            }}
            autoFocus
          />
        );
      }

      return (
        <span onClick={() => setEditing(true)}>
          {row.name}
        </span>
      );
    },
  },
];
```

### Row Selection

```tsx
const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: 'Select',
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selectedRows.has(row.id)}
        onChange={() => {
          const newSelected = new Set(selectedRows);
          if (newSelected.has(row.id)) {
            newSelected.delete(row.id);
          } else {
            newSelected.add(row.id);
          }
          setSelectedRows(newSelected);
        }}
      />
    ),
    enableSorting: false,
  },
  // ... other columns
];
```

---

## TypeScript Support

This library is written in TypeScript and provides full type safety.

### Type-Safe Column Definitions

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: 'electronics' | 'clothing' | 'food';
}

const columns: ColumnDef<Product>[] = [
  {
    id: 'name',
    accessorKey: 'name', // ✅ TypeScript knows this must be a key of Product
    header: 'Product Name',
  },
  {
    id: 'price',
    accessorKey: 'price', // ✅ Type-safe
    header: 'Price',
    cell: ({ row }) => {
      // ✅ row is typed as Product
      return `$${row.price.toFixed(2)}`;
    },
  },
];
```

### Custom Component Types

```typescript
import type { TableComponentProps } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
}

const MyToolbar = <T extends User>({ table }: TableComponentProps<T>) => {
  // table is fully typed with T
  const { globalFilter, handleGlobalFilterChange } = table;

  return <input value={globalFilter} onChange={e => handleGlobalFilterChange(e.target.value)} />;
};
```

### Extending Type Definitions

```typescript
// Create custom types for your specific use case
import type { DataTableState, ColumnDef } from '@morne004/headless-react-data-table';

interface MyCustomState extends DataTableState {
  customField: string;
}

interface MyUser {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

const columns: ColumnDef<MyUser>[] = [
  // Fully type-safe column definitions
];
```

---

## Troubleshooting

### Common Issues

#### "Cannot find module '@morne004/headless-react-data-table'"

Make sure the package is installed:
```bash
npm install @morne004/headless-react-data-table
```

#### Table not sorting/filtering

Ensure your data objects have unique `id` properties, or provide a custom `getRowId` function:

```tsx
<DataTable
  data={data}
  columns={columns}
  getRowId={(row) => row.uniqueId}
/>
```

#### State not persisting

State persistence uses `localStorage` with keys prefixed with `datatable_`. If localStorage is disabled or full, persistence will fail silently and fall back to session-only state.

To check:
```javascript
console.log(localStorage.getItem('datatable_sorting'));
```

#### TypeScript errors with accessorKey

Ensure your `accessorKey` matches a property on your data type:

```typescript
// ❌ Wrong
{ id: 'name', accessorKey: 'fullName', header: 'Name' }

// ✅ Correct
interface User {
  fullName: string; // Property must exist
}
{ id: 'name', accessorKey: 'fullName', header: 'Name' }
```

#### Styling not applying

Remember, this is a headless library! It doesn't include any default styles. You must add your own CSS.

Quick test:
```tsx
<div style={{ border: '1px solid red' }}>
  <DataTable data={data} columns={columns} />
</div>
```

If you see a red border, the component is rendering but needs styling.

### Performance Tips

**1. Memoize your columns:**
```tsx
const columns = useMemo<ColumnDef<User>[]>(() => [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  // ...
], []);
```

**2. Memoize your data:**
```tsx
const memoizedData = useMemo(() => data, [data]);
```

**3. Use pagination:**
Don't render thousands of rows at once. Use appropriate page sizes (10-50 rows).

**4. Optimize custom cell renderers:**
```tsx
// ❌ Slow: Creates new function every render
cell: ({ row }) => <button onClick={() => handleClick(row.id)}>Click</button>

// ✅ Fast: Memoized handler
const handleClick = useCallback((id: number) => {
  // handle click
}, []);

cell: ({ row }) => <button onClick={() => handleClick(row.id)}>Click</button>
```

### Getting Help

- **📖 Documentation**: You're reading it!
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/Morne004/advnaced-react-table/issues)
- **💬 Questions**: [GitHub Discussions](https://github.com/Morne004/advnaced-react-table/discussions)
- **📦 Package Info**: [npm](https://www.npmjs.com/package/@morne004/headless-react-data-table)

---

## Contributing

Contributions are welcome! Whether it's bug reports, feature requests, or code contributions.

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Morne004/advnaced-react-table.git
   cd advnaced-react-table
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the demo application:**
   ```bash
   npm run dev
   ```

   This starts a Vite development server with a demo application at `http://localhost:5173`. The demo is located in `src/demo/App.tsx` - this is the perfect place to test your changes.

4. **Build the library:**
   ```bash
   npm run build
   ```

   Outputs to `dist/` folder.

### Project Structure

```
src/
├── lib/                    # The library code (what gets published)
│   ├── components/         # React components
│   │   ├── DataTable.tsx   # Main table component
│   │   ├── TableToolbar.tsx
│   │   ├── TablePagination.tsx
│   │   └── FilterBuilder.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useDataTable.ts          # Core table logic
│   │   ├── usePersistentState.ts    # localStorage hook
│   │   ├── useColumnResizing.ts     # Column resize logic
│   │   └── useColumnDnd.ts          # Drag-and-drop logic
│   ├── utils/              # Utilities
│   │   └── csv.ts          # CSV export
│   ├── types.ts            # TypeScript definitions
│   └── index.ts            # Public API exports
└── demo/                   # Demo application (not published)
    └── App.tsx             # Example usage
```

### Contribution Guidelines

- Write TypeScript
- Add tests for new features
- Update documentation
- Follow the existing code style
- Keep bundle size small

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Built with ❤️ using:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

---

**Made by [Morne004](https://github.com/Morne004)**

If this library helped you, consider giving it a ⭐ on [GitHub](https://github.com/Morne004/advnaced-react-table)!
