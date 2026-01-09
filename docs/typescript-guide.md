# TypeScript Guide

Master type-safe table development with **@morne004/headless-react-data-table**.

---

## Table of Contents

1. [Generic Type Parameters](#generic-type-parameters)
2. [Type-Safe Column Definitions](#type-safe-column-definitions)
3. [Custom Cell Renderers](#custom-cell-renderers)
4. [Type-Safe Custom Components](#type-safe-custom-components)
5. [Type Inference](#type-inference)
6. [Common TypeScript Patterns](#common-typescript-patterns)
7. [Type Error Solutions](#type-error-solutions)

---

## Generic Type Parameters

The library is fully generic with type parameter `T` representing your data shape.

### Always Provide the Type Parameter

```tsx
// ✅ Good - Type safe
<DataTable<User> data={users} columns={columns} />

const table = useDataTable<User>({ data: users, columns });

// ❌ Bad - No type checking
<DataTable data={users} columns={columns} />
const table = useDataTable({ data: users, columns });
```

### Define Your Data Type

```tsx
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
```

### Type Constraint

The `DataTable` component requires an `id` property:

```tsx
// ✅ Valid - has id property
interface Product {
  id: string;  // string or number
  name: string;
}

<DataTable<Product> data={products} columns={columns} />

// ❌ Invalid - no id property
interface Item {
  itemId: number;  // Different property name
  name: string;
}

<DataTable<Item> data={items} columns={columns} />
// Error: Type 'Item' does not satisfy the constraint '{ id: number | string }'
```

### Custom ID Property

If your data uses a different identifier, use `getRowId`:

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

---

## Type-Safe Column Definitions

### Basic Column Definition

```tsx
import type { ColumnDef } from '@morne004/headless-react-data-table';

const columns: ColumnDef<User>[] = [
  {
    id: 'firstName',
    header: 'First Name',
    accessorKey: 'firstName',  // ✅ Type-checked against User properties
  },
  {
    id: 'age',
    header: 'Age',
    accessorKey: 'age',  // ✅ Autocomplete available
  },
];
```

### accessorKey is Type-Safe

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'fullName',  // ❌ Error: 'fullName' doesn't exist on User
  },
];
```

### Optional vs Required Properties

```tsx
interface ColumnDef<T> {
  id: string;              // Required
  header: string;          // Required
  accessorKey?: keyof T;   // Optional - for data access
  cell?: (info: { row: T }) => React.ReactNode;  // Optional - custom renderer
  enableSorting?: boolean; // Optional - default: true if accessorKey exists
}
```

### Using useMemo for Columns

```tsx
import { useMemo } from 'react';

function UsersTable() {
  // ✅ Good - Memoize columns to prevent recreation
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { id: 'id', header: 'ID', accessorKey: 'id' },
      { id: 'name', header: 'Name', accessorKey: 'firstName' },
      { id: 'email', header: 'Email', accessorKey: 'email' },
    ],
    []
  );

  return <DataTable<User> data={users} columns={columns} />;
}
```

---

## Custom Cell Renderers

### cell Function Signature

```tsx
interface ColumnDef<T> {
  cell?: (info: { row: T }) => React.ReactNode;
}
```

### Type-Safe Cell Renderers

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'salary',
    header: 'Salary',
    accessorKey: 'salary',
    cell: ({ row }) => {
      // ✅ row is typed as User
      // ✅ row.salary is number (inferred)
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(row.salary);
    },
  },
];
```

### Complex Cell Renderers

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      // ✅ row.status is typed as 'active' | 'inactive' | 'pending'
      const colorMap: Record<User['status'], string> = {
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
  },
];
```

### Computed Values

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'fullName',
    header: 'Full Name',
    // No accessorKey - this is a computed column
    cell: ({ row }) => {
      // ✅ Type-safe access to firstName and lastName
      return `${row.firstName} ${row.lastName}`;
    },
  },
];
```

### Conditional Rendering

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(row)}>Edit</button>
        {row.status === 'active' && (
          <button onClick={() => handleDeactivate(row)}>Deactivate</button>
        )}
      </div>
    ),
    enableSorting: false,
  },
];
```

---

## Type-Safe Custom Components

### Custom Toolbar Component

```tsx
import type { TableComponentProps } from '@morne004/headless-react-data-table';

// Generic component
const CustomToolbar = <T,>({ table }: TableComponentProps<T>) => {
  // ✅ table.globalFilter is typed as string
  // ✅ table.handleGlobalFilterChange is typed correctly
  return (
    <input
      value={table.globalFilter}
      onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
      placeholder="Search..."
    />
  );
};

// Usage
<DataTable<User>
  data={users}
  columns={columns}
  components={{
    Toolbar: CustomToolbar  // ✅ Type-checked
  }}
/>
```

### Custom Pagination Component

```tsx
const CustomPagination = <T,>({ table }: TableComponentProps<T>) => {
  const { pagination, pageCount, setPageSize, setPageIndex } = table;

  return (
    <div>
      <select
        value={pagination.pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        {[10, 25, 50, 100].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>

      <button onClick={() => setPageIndex(pagination.pageIndex - 1)}>
        Previous
      </button>
      <span>Page {pagination.pageIndex + 1} of {pageCount}</span>
      <button onClick={() => setPageIndex(pagination.pageIndex + 1)}>
        Next
      </button>
    </div>
  );
};
```

### Type Error: Missing Generic

```tsx
// ❌ Error: Cannot use JSX element 'CustomToolbar' as a component
const CustomToolbar = ({ table }: TableComponentProps<User>) => {
  // ...
};

// ✅ Fix: Make it generic
const CustomToolbar = <T,>({ table }: TableComponentProps<T>) => {
  // ...
};
```

---

## Type Inference

### Infer from Data

```tsx
const users = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
];

// ✅ TypeScript infers the type
type User = typeof users[number];
// Equivalent to: { id: number; name: string; age: number }

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'age', header: 'Age', accessorKey: 'age' },
];
```

### Extract Type from API Response

```tsx
// API response type
interface ApiResponse {
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

// Extract data type
type User = ApiResponse['data'][number];

// Use in table
<DataTable<User> data={response.data} columns={columns} />
```

### Utility Types

```tsx
// Pick only specific properties
type UserSummary = Pick<User, 'id' | 'firstName' | 'email'>;

// Omit specific properties
type PublicUser = Omit<User, 'salary' | 'ssn'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make specific properties required
type RequiredEmail = Required<Pick<User, 'email'>> & Omit<User, 'email'>;
```

---

## Common TypeScript Patterns

### Type-Safe Filter

```tsx
import type { Filter, Operator } from '@morne004/headless-react-data-table';

const createFilter = (
  column: keyof User,
  operator: Operator,
  value: string
): Filter => ({
  id: `${column}-${operator}-${value}`,
  column: String(column),
  operator,
  value,
});

// ✅ Type-safe usage
const ageFilter = createFilter('age', 'greaterThan', '30');
const statusFilter = createFilter('status', 'equals', 'active');

// ❌ Type error
const invalidFilter = createFilter('invalidColumn', 'equals', 'value');
// Error: Argument of type '"invalidColumn"' is not assignable to parameter of type 'keyof User'
```

### Type-Safe Sorting

```tsx
import type { SortConfig } from '@morne004/headless-react-data-table';

const createSort = (
  key: keyof User,
  direction: 'ascending' | 'descending'
): SortConfig<User> => ({
  key,
  direction,
});

// ✅ Type-safe
const sorting = createSort('createdAt', 'descending');

// ❌ Type error
const invalidSort = createSort('invalidKey', 'ascending');
```

### Controlled State Type

```tsx
import { useState } from 'react';
import type { ControlledDataTableState } from '@morne004/headless-react-data-table';

function UsersTable() {
  const [tableState, setTableState] = useState<ControlledDataTableState>({
    pageIndex: 0,
    pageSize: 25,
    globalFilter: '',
    sorting: {
      key: 'createdAt' as keyof User,  // Type assertion needed
      direction: 'descending',
    },
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

### Type-Safe Event Handlers

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const handleEdit = (user: User) => {
        console.log('Editing user:', user.id);
      };

      const handleDelete = (userId: number) => {
        console.log('Deleting user:', userId);
      };

      return (
        <div>
          <button onClick={() => handleEdit(row)}>Edit</button>
          <button onClick={() => handleDelete(row.id)}>Delete</button>
        </div>
      );
    },
  },
];
```

---

## Type Error Solutions

### Error: Property does not exist on type 'never'

```tsx
// ❌ Error
const table = useDataTable({ data: users, columns });
console.log(table.globalFilter);
// Error: Property 'globalFilter' does not exist on type 'never'

// ✅ Fix: Provide generic type parameter
const table = useDataTable<User>({ data: users, columns });
console.log(table.globalFilter);  // ✅ Works
```

### Error: Type 'X' is not assignable to type 'ColumnDef<T>[]'

```tsx
// ❌ Error
const columns = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
];
<DataTable<User> data={users} columns={columns} />
// Error: Type inferred as any[]

// ✅ Fix: Add type annotation
const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
];
```

### Error: Cannot find name 'ColumnDef'

```tsx
// ❌ Error
const columns: ColumnDef<User>[] = [];
// Error: Cannot find name 'ColumnDef'

// ✅ Fix: Import the type
import type { ColumnDef } from '@morne004/headless-react-data-table';

const columns: ColumnDef<User>[] = [];
```

### Error: JSX element type does not have any construct or call signatures

```tsx
// ❌ Error
const CustomToolbar = ({ table }: TableComponentProps<User>) => {
  return <div>...</div>;
};

<DataTable
  components={{
    Toolbar: CustomToolbar  // Error here
  }}
/>

// ✅ Fix: Make component generic
const CustomToolbar = <T,>({ table }: TableComponentProps<T>) => {
  return <div>...</div>;
};
```

### Error: Object is possibly 'undefined'

```tsx
// ❌ Error with strictNullChecks
<th onClick={() => table.setSort(col.accessorKey)}>
  {col.header}
</th>
// Error: Argument of type 'keyof T | undefined' is not assignable to parameter of type 'keyof T'

// ✅ Fix: Check for undefined
<th onClick={() => col.accessorKey && table.setSort(col.accessorKey)}>
  {col.header}
</th>
```

---

## Best Practices

### 1. Always Use Type Parameters

```tsx
// ✅ Good
<DataTable<User> data={users} columns={columns} />
const table = useDataTable<User>({ data, columns });

// ❌ Bad
<DataTable data={users} columns={columns} />
const table = useDataTable({ data, columns });
```

### 2. Define Interfaces, Not Types

```tsx
// ✅ Preferred for data models
interface User {
  id: number;
  name: string;
}

// ✅ OK for unions and simple types
type Status = 'active' | 'inactive';
```

### 3. Use Const Assertions for Data

```tsx
const statuses = ['active', 'inactive', 'pending'] as const;
type Status = typeof statuses[number];  // 'active' | 'inactive' | 'pending'
```

### 4. Memoize Columns

```tsx
// ✅ Prevents column recreation on every render
const columns = useMemo<ColumnDef<User>[]>(() => [...], []);
```

### 5. Leverage Type Inference

```tsx
// ✅ Let TypeScript infer when possible
const columns: ColumnDef<User>[] = [
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      // row.status is automatically inferred as User['status']
      return <StatusBadge status={row.status} />;
    },
  },
];
```

---

## Summary

Key TypeScript patterns for type-safe tables:

- ✅ Always provide generic type parameters
- ✅ Define your data types with interfaces
- ✅ Use `ColumnDef<T>` for type-safe columns
- ✅ Leverage type inference in cell renderers
- ✅ Make custom components generic with `<T,>`
- ✅ Import types from the package
- ✅ Memoize columns with `useMemo`

---

## Next Steps

- **[API Reference](./api-reference.md)** - Complete type definitions
- **[Examples](./examples/README.md)** - See TypeScript in practice
- **[Customization Guide](./customization-guide.md)** - Build type-safe custom components
- **[Troubleshooting](./troubleshooting.md)** - Solve type errors
