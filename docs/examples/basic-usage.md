# Basic Usage Example

Complete example showing fundamental features of the DataTable component.

---

## Overview

This example demonstrates:
- Defining data types with TypeScript
- Creating column definitions
- Custom cell renderers (currency, date, status badges)
- Initial state configuration
- Loading and empty states

**Difficulty:** 🟢 Beginner

---

## Complete Code Example

```tsx
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

// Step 1: Define your data type
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
  salary: number;
  department: string;
  createdAt: string;
}

// Step 2: Sample data
const users: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    age: 32,
    status: 'active',
    salary: 85000,
    department: 'Engineering',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    age: 28,
    status: 'active',
    salary: 92000,
    department: 'Product',
    createdAt: '2023-03-22T14:15:00Z',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    age: 45,
    status: 'inactive',
    salary: 78000,
    department: 'Marketing',
    createdAt: '2022-11-08T09:00:00Z',
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@example.com',
    age: 36,
    status: 'pending',
    salary: 95000,
    department: 'Engineering',
    createdAt: '2023-06-30T16:45:00Z',
  },
];

// Step 3: Define columns
function UsersTable() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Memoize columns for performance
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        enableSorting: true,
      },
      {
        id: 'firstName',
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        id: 'lastName',
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        enableSorting: false,
      },
      {
        id: 'age',
        header: 'Age',
        accessorKey: 'age',
      },
      {
        id: 'salary',
        header: 'Salary',
        accessorKey: 'salary',
        cell: ({ row }) => {
          // Currency formatting
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
          }).format(row.salary);
        },
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          // Status badge with conditional styling
          const colorMap = {
            active: 'bg-green-200 text-green-800',
            inactive: 'bg-red-200 text-red-800',
            pending: 'bg-yellow-200 text-yellow-800',
          };

          return (
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                colorMap[row.status]
              }`}
            >
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </span>
          );
        },
      },
      {
        id: 'createdAt',
        header: 'Created',
        accessorKey: 'createdAt',
        cell: ({ row }) => {
          // Date formatting
          const date = new Date(row.createdAt);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      <DataTable<User>
        data={users}
        columns={columns}
        isLoading={isLoading}
        initialState={{
          pageSize: 10,
          sorting: { key: 'createdAt', direction: 'descending' },
        }}
        noDataMessage={
          <div className="text-center py-10 text-gray-500">
            <h3 className="text-lg font-semibold">No users found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        }
      />
    </div>
  );
}

export default UsersTable;
```

---

## Code Breakdown

### 1. Data Type Definition

```tsx
interface User {
  id: number;               // Required for DataTable
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';  // Union type
  salary: number;
  department: string;
  createdAt: string;        // ISO date string
}
```

**Key points:**
- `id` property is required (number or string)
- Use TypeScript unions for limited options (`status`)
- Store dates as ISO strings for easy formatting

### 2. Column Definitions

#### Basic Column (Text)

```tsx
{
  id: 'firstName',           // Unique identifier
  header: 'First Name',      // Display text
  accessorKey: 'firstName',  // Property from data
}
```

#### Currency Column

```tsx
{
  id: 'salary',
  header: 'Salary',
  accessorKey: 'salary',
  cell: ({ row }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(row.salary);
  },
}
```

#### Status Badge Column

```tsx
{
  id: 'status',
  header: 'Status',
  accessorKey: 'status',
  cell: ({ row }) => {
    const colorMap = {
      active: 'bg-green-200 text-green-800',
      inactive: 'bg-red-200 text-red-800',
      pending: 'bg-yellow-200 text-yellow-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colorMap[row.status]}`}>
        {row.status}
      </span>
    );
  },
}
```

#### Date Column

```tsx
{
  id: 'createdAt',
  header: 'Created',
  accessorKey: 'createdAt',
  cell: ({ row }) => {
    return new Date(row.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
}
```

### 3. Initial State

```tsx
<DataTable<User>
  data={users}
  columns={columns}
  initialState={{
    pageSize: 10,                                           // Rows per page
    sorting: { key: 'createdAt', direction: 'descending' }, // Default sort
    columnVisibility: { email: false },                     // Hide columns
    globalFilter: 'John',                                   // Pre-fill search
  }}
/>
```

### 4. Loading State

```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setIsLoading(false), 1500);
  return () => clearTimeout(timer);
}, []);

<DataTable<User>
  data={users}
  columns={columns}
  isLoading={isLoading}  // Shows skeleton rows
/>
```

### 5. Empty State

```tsx
<DataTable<User>
  data={[]}
  columns={columns}
  noDataMessage={
    <div className="text-center py-10">
      <h3>No data available</h3>
      <button onClick={handleReset}>Reset Filters</button>
    </div>
  }
/>
```

---

## Variations

### Disable Sorting on Specific Columns

```tsx
{
  id: 'email',
  header: 'Email',
  accessorKey: 'email',
  enableSorting: false,  // Can't sort by email
}
```

### Custom ID Property

```tsx
interface Product {
  productId: string;  // Not 'id'
  name: string;
}

<DataTable<Product>
  data={products}
  columns={columns}
  getRowId={(row) => row.productId}  // Tell DataTable how to get ID
/>
```

### Action Buttons Column

```tsx
{
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) => (
    <div className="flex gap-2">
      <button onClick={() => handleEdit(row)}>Edit</button>
      <button onClick={() => handleDelete(row.id)}>Delete</button>
    </div>
  ),
  enableSorting: false,
}
```

---

## Common Patterns

### Boolean Values

```tsx
interface User {
  isActive: boolean;
}

{
  id: 'isActive',
  header: 'Active',
  accessorKey: 'isActive',
  cell: ({ row }) => (row.isActive ? 'Yes' : 'No'),
}
```

### Computed Values

```tsx
{
  id: 'fullName',
  header: 'Full Name',
  // No accessorKey - computed value
  cell: ({ row }) => `${row.firstName} ${row.lastName}`,
}
```

### Truncated Text

```tsx
{
  id: 'description',
  header: 'Description',
  accessorKey: 'description',
  cell: ({ row }) => {
    const text = row.description;
    return text.length > 50 ? `${text.substring(0, 50)}...` : text;
  },
}
```

---

## Next Steps

- **[Custom Styling](./custom-styling.md)** - Style with Tailwind CSS
- **[Custom Components](./custom-components.md)** - Replace default UI
- **[Advanced Features](./advanced-features.md)** - Row selection, CSV export
- **[API Reference](../api-reference.md)** - Complete documentation

---

**Happy coding!** 🚀
