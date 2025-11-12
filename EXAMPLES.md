# Examples

Real-world, copy-paste ready examples for the Headless React Data Table library.

## Table of Contents

- [Basic Examples](#basic-examples)
  - [Minimal Setup](#minimal-setup)
  - [TypeScript Example](#typescript-example)
- [Styled Examples](#styled-examples)
  - [Tailwind CSS](#tailwind-css-complete-example)
  - [Material-UI Integration](#material-ui-integration)
- [Custom Components](#custom-components)
  - [Custom Toolbar](#custom-toolbar)
  - [Custom Pagination](#custom-pagination)
  - [Custom Filter Builder](#custom-filter-builder)
- [Server-Side Integration](#server-side-integration)
  - [REST API Pagination](#rest-api-pagination)
  - [React Query Integration](#react-query-integration)
  - [Debounced Search](#debounced-search-with-api)
- [Framework Examples](#framework-examples)
  - [Next.js App Router](#nextjs-app-router)
  - [Next.js Pages Router](#nextjs-pages-router)
  - [Remix](#remix-integration)
- [Advanced Patterns](#advanced-patterns)
  - [Editable Cells](#editable-cells-with-validation)
  - [Row Selection](#row-selection-and-bulk-actions)
  - [Master-Detail View](#master-detail-view)
  - [URL State Synchronization](#url-state-synchronization)
- [Custom Cell Renderers](#custom-cell-renderers)
  - [Currency Formatting](#currency-formatting)
  - [Date Formatting](#date-formatting)
  - [Status Badges](#status-badges)
  - [Action Buttons](#action-buttons)

---

## Basic Examples

### Minimal Setup

The simplest possible implementation:

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
}

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const columns: ColumnDef<User>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
];

function App() {
  return <DataTable data={data} columns={columns} />;
}
```

### TypeScript Example

Full TypeScript setup with type safety:

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

// Define your data type
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  rating: number;
}

// Sample data
const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', inStock: true, rating: 4.5 },
  { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics', inStock: true, rating: 4.2 },
  { id: 3, name: 'Keyboard', price: 79.99, category: 'Electronics', inStock: false, rating: 4.8 },
];

// Define columns with type safety
const columns: ColumnDef<Product>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Product Name',
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `$${row.price.toFixed(2)}`,
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
  },
  {
    id: 'inStock',
    accessorKey: 'inStock',
    header: 'In Stock',
    cell: ({ row }) => (row.inStock ? 'Yes' : 'No'),
  },
  {
    id: 'rating',
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => `${row.rating} ⭐`,
  },
];

export default function ProductTable() {
  return (
    <div className="p-4">
      <h1>Product Catalog</h1>
      <DataTable<Product> data={products} columns={columns} />
    </div>
  );
}
```

---

## Styled Examples

### Tailwind CSS Complete Example

Production-ready table with Tailwind CSS:

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef, TableComponentProps } from '@morne004/headless-react-data-table';
import { exportToCsv } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
}

const users: User[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'user', status: 'active' },
  // ... more users
];

// Custom Toolbar Component
const CustomToolbar = <T extends object>({ table }: TableComponentProps<T>) => {
  const {
    globalFilter,
    handleGlobalFilterChange,
    sortedData,
    filters,
    totalCount,
    isCondensed,
    toggleDensity,
    allColumns,
    columnVisibility,
    toggleColumnVisibility,
  } = table;

  const [showColumns, setShowColumns] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 border-b">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => handleGlobalFilterChange(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <span className="text-sm text-gray-600 whitespace-nowrap">
          {filters.length > 0 || globalFilter
            ? `${sortedData.length} of ${totalCount}`
            : `${totalCount} rows`}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Density Toggle */}
        <button
          onClick={toggleDensity}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
        >
          {isCondensed ? 'Normal' : 'Compact'}
        </button>

        {/* Column Visibility */}
        <div className="relative">
          <button
            onClick={() => setShowColumns(!showColumns)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Columns
          </button>
          {showColumns && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                {allColumns.map((col) => (
                  <label key={col.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={columnVisibility[col.id] ?? true}
                      onChange={() => toggleColumnVisibility(col.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{col.header}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export */}
        <button
          onClick={() => exportToCsv('users.csv', sortedData)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Export
        </button>
      </div>
    </div>
  );
};

// Custom Pagination Component
const CustomPagination = <T extends object>({ table }: TableComponentProps<T>) => {
  const { pagination, pageCount, setPageSize, setPageIndex } = table;
  const { pageIndex, pageSize } = pagination;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Page {pageIndex + 1} of {pageCount}
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex === pageCount - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={pageIndex === pageCount - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Column Definitions with Custom Cells
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
          {row.firstName[0]}{row.lastName[0]}
        </div>
        <span className="font-medium">{row.firstName} {row.lastName}</span>
      </div>
    ),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline">
        {row.email}
      </a>
    ),
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const colors = {
        admin: 'bg-purple-100 text-purple-800',
        user: 'bg-blue-100 text-blue-800',
        guest: 'bg-gray-100 text-gray-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.role]}`}>
          {row.role}
        </span>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        row.status === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          row.status === 'active' ? 'bg-green-600' : 'bg-red-600'
        }`} />
        {row.status}
      </span>
    ),
  },
];

export default function UserTable() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their roles</p>
          </div>

          <DataTable
            data={users}
            columns={columns}
            components={{
              Toolbar: CustomToolbar,
              Pagination: CustomPagination,
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

### Material-UI Integration

Using Material-UI components:

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef, TableComponentProps } from '@morne004/headless-react-data-table';
import {
  Paper,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Search,
  Download,
  ViewColumn,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const CustomToolbar = <T extends object>({ table }: TableComponentProps<T>) => {
  const {
    globalFilter,
    handleGlobalFilterChange,
    allColumns,
    columnVisibility,
    toggleColumnVisibility,
  } = table;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => handleGlobalFilterChange(e.target.value)}
        InputProps={{
          startAdornment: <Search />,
        }}
        sx={{ minWidth: 300 }}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          variant="outlined"
          startIcon={<ViewColumn />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Columns
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {allColumns.map((col) => (
            <MenuItem key={col.id} dense>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={columnVisibility[col.id] ?? true}
                    onChange={() => toggleColumnVisibility(col.id)}
                  />
                }
                label={col.header}
              />
            </MenuItem>
          ))}
        </Menu>

        <Button variant="contained" startIcon={<Download />}>
          Export
        </Button>
      </div>
    </div>
  );
};

const columns: ColumnDef<User>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Chip
        label={row.status}
        color={row.status === 'active' ? 'success' : 'default'}
        size="small"
      />
    ),
  },
];

export default function MUITable() {
  const users: User[] = [/* ... */];

  return (
    <Paper elevation={2}>
      <DataTable
        data={users}
        columns={columns}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </Paper>
  );
}
```

---

## Server-Side Integration

### REST API Pagination

Complete server-side pagination with sorting and filtering.

**Note:** This example uses `manualPagination`, `manualFiltering`, and `manualSorting` to disable client-side data processing. The server handles all filtering, sorting, and pagination logic.

```tsx
import { useState, useEffect } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef, DataTableState } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface APIResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

export default function ServerSideTable() {
  const [data, setData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tableState, setTableState] = useState<Partial<DataTableState>>({
    pageIndex: 0,
    pageSize: 25,
    globalFilter: '',
    sorting: null,
  });

  // Fetch data whenever table state changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: String(tableState.pageIndex || 0),
          pageSize: String(tableState.pageSize || 25),
          search: tableState.globalFilter || '',
        });

        if (tableState.sorting) {
          params.append('sortBy', String(tableState.sorting.key));
          params.append('sortOrder', tableState.sorting.direction === 'ascending' ? 'asc' : 'desc');
        }

        const response = await fetch(`/api/users?${params}`);
        const result: APIResponse = await response.json();

        setData(result.data);
        setTotalCount(result.total);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableState.pageIndex, tableState.pageSize, tableState.globalFilter, tableState.sorting]);

  const columns: ColumnDef<User>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
    { id: 'email', accessorKey: 'email', header: 'Email', enableSorting: true },
    { id: 'role', accessorKey: 'role', header: 'Role', enableSorting: true },
  ];

  return (
    <div>
      <h1>Users ({totalCount})</h1>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        state={tableState}
        onStateChange={setTableState}
        manualPagination={true}
        manualFiltering={true}
        manualSorting={true}
        totalRowCount={totalCount}
        pageCount={Math.ceil(totalCount / (tableState.pageSize || 25))}
      />
    </div>
  );
}

// Example Express.js API endpoint
/*
app.get('/api/users', async (req, res) => {
  const {
    page = 0,
    pageSize = 25,
    search = '',
    sortBy = 'name',
    sortOrder = 'asc',
  } = req.query;

  const offset = Number(page) * Number(pageSize);
  const limit = Number(pageSize);

  let query = db('users');

  // Search
  if (search) {
    query = query.where('name', 'like', `%${search}%`)
      .orWhere('email', 'like', `%${search}%`);
  }

  // Get total count
  const [{ count }] = await query.clone().count('* as count');

  // Sort and paginate
  const data = await query
    .orderBy(sortBy, sortOrder)
    .limit(limit)
    .offset(offset);

  res.json({
    data,
    total: count,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});
*/
```

### React Query Integration

Complete CRUD operations with React Query:

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// API functions
const api = {
  getUsers: async (): Promise<User[]> => {
    const response = await fetch('/api/users');
    return response.json();
  },
  deleteUser: async (id: number): Promise<void> => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
  },
  updateUser: async (user: User): Promise<User> => {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },
};

export default function ReactQueryTable() {
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      // Refetch users after delete
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: api.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns: ColumnDef<User>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
    { id: 'role', accessorKey: 'role', header: 'Role' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleDelete(row.id)}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-800"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
}
```

### Debounced Search with API

Optimize API calls with debounced search:

```tsx
import { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef, DataTableState } from '@morne004/headless-react-data-table';

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function DebouncedSearchTable() {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableState, setTableState] = useState<Partial<DataTableState>>({
    pageIndex: 0,
    pageSize: 25,
    globalFilter: '',
  });

  // Debounce the search term
  const debouncedSearch = useDebounce(tableState.globalFilter || '', 500);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(tableState.pageIndex || 0),
          pageSize: String(tableState.pageSize || 25),
          search: debouncedSearch,
        });

        const response = await fetch(`/api/users?${params}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, tableState.pageIndex, tableState.pageSize]);

  const columns: ColumnDef<User>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      state={tableState}
      onStateChange={setTableState}
    />
  );
}
```

---

## Framework Examples

### Next.js App Router

Using Server Components and Client Components:

```tsx
// app/users/page.tsx (Server Component)
import { UserTable } from './UserTable';

async function getUsers() {
  const response = await fetch('https://api.example.com/users', {
    cache: 'no-store', // or use revalidate
  });
  return response.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <UserTable initialData={users} />
    </div>
  );
}

// app/users/UserTable.tsx (Client Component)
'use client';

import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  initialData: User[];
}

export function UserTable({ initialData }: Props) {
  const columns: ColumnDef<User>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
  ];

  return <DataTable data={initialData} columns={columns} />;
}
```

### Next.js Pages Router

Traditional Next.js with getServerSideProps:

```tsx
// pages/users.tsx
import { GetServerSideProps } from 'next';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  users: User[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const response = await fetch('https://api.example.com/users');
  const users = await response.json();

  return {
    props: { users },
  };
};

export default function UsersPage({ users }: Props) {
  const columns: ColumnDef<User>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <DataTable data={users} columns={columns} />
    </div>
  );
}
```

### Remix Integration

Using Remix loaders:

```tsx
// app/routes/users.tsx
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';
import type { LoaderFunctionArgs } from '@remix-run/node';

interface User {
  id: number;
  name: string;
  email: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '0';
  const search = url.searchParams.get('search') || '';

  const response = await fetch(`https://api.example.com/users?page=${page}&search=${search}`);
  const data = await response.json();

  return json(data);
}

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>();

  const columns: ColumnDef<User>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <DataTable data={users} columns={columns} />
    </div>
  );
}
```

---

## Advanced Patterns

### Editable Cells with Validation

Inline editing with form validation:

```tsx
import { useState } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export default function EditableTable() {
  const [data, setData] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  ]);

  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    columnId: string;
  } | null>(null);

  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  const handleStartEdit = (rowId: number, columnId: string, currentValue: any) => {
    setEditingCell({ rowId, columnId });
    setEditValue(String(currentValue));
    setError('');
  };

  const handleSave = async (rowId: number, columnId: string) => {
    // Validate
    if (columnId === 'email' && !editValue.includes('@')) {
      setError('Invalid email format');
      return;
    }

    if (columnId === 'age' && (isNaN(Number(editValue)) || Number(editValue) < 0)) {
      setError('Age must be a positive number');
      return;
    }

    // Update data
    setData(prev =>
      prev.map(row =>
        row.id === rowId
          ? { ...row, [columnId]: columnId === 'age' ? Number(editValue) : editValue }
          : row
      )
    );

    // API call would go here
    // await updateUser(rowId, { [columnId]: editValue });

    setEditingCell(null);
    setError('');
  };

  const handleCancel = () => {
    setEditingCell(null);
    setError('');
  };

  const EditableCell = ({ row, columnId, value }: { row: User; columnId: string; value: any }) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === columnId;

    if (isEditing) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <input
              type={columnId === 'age' ? 'number' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave(row.id, columnId);
                if (e.key === 'Escape') handleCancel();
              }}
              className="border px-2 py-1 rounded text-sm"
              autoFocus
            />
            <button
              onClick={() => handleSave(row.id, columnId)}
              className="px-2 py-1 bg-green-600 text-white rounded text-sm"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 bg-red-600 text-white rounded text-sm"
            >
              ✕
            </button>
          </div>
          {error && <span className="text-red-600 text-xs">{error}</span>}
        </div>
      );
    }

    return (
      <div
        onClick={() => handleStartEdit(row.id, columnId, value)}
        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
      >
        {value}
      </div>
    );
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <EditableCell row={row} columnId="name" value={row.name} />,
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <EditableCell row={row} columnId="email" value={row.email} />,
    },
    {
      id: 'age',
      accessorKey: 'age',
      header: 'Age',
      cell: ({ row }) => <EditableCell row={row} columnId="age" value={row.age} />,
    },
  ];

  return (
    <div>
      <h1>Editable User Table</h1>
      <p className="text-sm text-gray-600 mb-4">Click any cell to edit. Press Enter to save, Escape to cancel.</p>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
```

### Row Selection and Bulk Actions

Multi-select rows with bulk operations:

```tsx
import { useState } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export default function SelectableTable() {
  const [data, setData] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
  ]);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(row => row.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} users?`)) return;

    // API call
    // await deleteUsers(Array.from(selectedIds));

    setData(prev => prev.filter(row => !selectedIds.has(row.id)));
    setSelectedIds(new Set());
  };

  const handleBulkActivate = async () => {
    // await updateUsers(Array.from(selectedIds), { status: 'active' });

    setData(prev =>
      prev.map(row =>
        selectedIds.has(row.id) ? { ...row, status: 'active' as const } : row
      )
    );
    setSelectedIds(new Set());
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: () => (
        <input
          type="checkbox"
          checked={selectedIds.size === data.length && data.length > 0}
          onChange={toggleAll}
          className="cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={() => toggleSelection(row.id)}
          className="cursor-pointer"
        />
      ),
    },
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      {selectedIds.size > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.size} row(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkActivate}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Activate Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <DataTable data={data} columns={columns} />
    </div>
  );
}
```

### Master-Detail View

Expandable rows showing detailed information:

```tsx
import { useState } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  product: string;
  quantity: number;
  price: number;
}

export default function MasterDetailTable() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const data: Order[] = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customer: 'John Doe',
      date: '2024-01-15',
      total: 299.99,
      status: 'Shipped',
      items: [
        { id: 1, product: 'Laptop', quantity: 1, price: 199.99 },
        { id: 2, product: 'Mouse', quantity: 2, price: 50.00 },
      ],
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customer: 'Jane Smith',
      date: '2024-01-16',
      total: 599.99,
      status: 'Processing',
      items: [
        { id: 3, product: 'Monitor', quantity: 1, price: 599.99 },
      ],
    },
  ];

  const DetailRow = ({ order }: { order: Order }) => (
    <tr>
      <td colSpan={6} className="bg-gray-50 p-4">
        <div className="max-w-4xl">
          <h3 className="font-semibold mb-3">Order Items</h3>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-right">Quantity</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.product}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                  <td className="p-2 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan={3} className="p-2 text-right">Total:</td>
                <td className="p-2 text-right">${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </td>
    </tr>
  );

  const columns: ColumnDef<Order>[] = [
    {
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => toggleRow(row.id)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {expandedRows.has(row.id) ? '▼' : '▶'}
        </button>
      ),
    },
    { id: 'orderNumber', accessorKey: 'orderNumber', header: 'Order #' },
    { id: 'customer', accessorKey: 'customer', header: 'Customer' },
    { id: 'date', accessorKey: 'date', header: 'Date' },
    {
      id: 'total',
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => `$${row.total.toFixed(2)}`,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.status === 'Shipped' ? 'bg-green-100 text-green-800' :
          row.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="border rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {columns.map(col => (
                <th key={col.id} className="p-3 text-left text-sm font-medium">
                  {typeof col.header === 'function' ? col.header() : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(order => (
              <>
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={col.id} className="p-3">
                      {col.cell ? col.cell({ row: order }) : order[col.accessorKey!]}
                    </td>
                  ))}
                </tr>
                {expandedRows.has(order.id) && <DetailRow order={order} />}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### URL State Synchronization

Sync table state with URL parameters (React Router v6):

```tsx
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef, DataTableState } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function URLSyncTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data] = useState<User[]>([/* ... */]);

  // Initialize state from URL
  const [tableState, setTableState] = useState<Partial<DataTableState>>(() => ({
    pageIndex: Number(searchParams.get('page') || '0'),
    pageSize: Number(searchParams.get('pageSize') || '25'),
    globalFilter: searchParams.get('search') || '',
  }));

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (tableState.pageIndex) params.set('page', String(tableState.pageIndex));
    if (tableState.pageSize) params.set('pageSize', String(tableState.pageSize));
    if (tableState.globalFilter) params.set('search', tableState.globalFilter);

    setSearchParams(params, { replace: true });
  }, [tableState, setSearchParams]);

  const columns: ColumnDef<User>[] = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      state={tableState}
      onStateChange={setTableState}
    />
  );
}
```

---

## Custom Cell Renderers

### Currency Formatting

```tsx
const columns: ColumnDef<Product>[] = [
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(row.price);
    },
  },
];
```

### Date Formatting

```tsx
const columns: ColumnDef<Order>[] = [
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.createdAt);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    },
  },
];
```

### Status Badges

```tsx
const columns: ColumnDef<Task>[] = [
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusConfig = {
        todo: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'To Do' },
        inProgress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
        done: { bg: 'bg-green-100', text: 'text-green-800', label: 'Done' },
        blocked: { bg: 'bg-red-100', text: 'text-red-800', label: 'Blocked' },
      };

      const config = statusConfig[row.status];

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    },
  },
];
```

### Action Buttons

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const handleEdit = () => {
        // Open edit modal
        console.log('Edit user:', row.id);
      };

      const handleDelete = async () => {
        if (!confirm('Are you sure?')) return;
        // Delete user
        await deleteUser(row.id);
      };

      const handleViewDetails = () => {
        // Navigate to detail page
        navigate(`/users/${row.id}`);
      };

      return (
        <div className="flex items-center gap-2">
          <button
            onClick={handleViewDetails}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="View Details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={handleEdit}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      );
    },
  },
];
```

---

## See Also

- **[README.md](./README.md)** - Library overview and quick start
- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[USAGE.md](./USAGE.md)** - Complete API reference and integration guide
