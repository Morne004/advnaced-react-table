# Quick Start Guide

Get your first data table up and running in **5 minutes**! This guide will walk you through creating a fully functional table with sorting, filtering, pagination, and more.

---

## Prerequisites

- ✅ Package installed (see [Installation Guide](./installation.md))
- ✅ React 18+ project set up
- ✅ Basic knowledge of React and TypeScript

---

## Step 1: Define Your Data Type

First, define the shape of your data using TypeScript:

```tsx
// User.ts (or inline in your component file)
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
}
```

---

## Step 2: Create Sample Data

```tsx
const users: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    age: 32,
    status: 'active',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    age: 28,
    status: 'active',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    age: 45,
    status: 'inactive',
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@example.com',
    age: 36,
    status: 'pending',
  },
];
```

---

## Step 3: Define Your Columns

Configure which columns to display and how to access the data:

```tsx
import type { ColumnDef } from '@morne004/headless-react-data-table';

const columns: ColumnDef<User>[] = [
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
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
  },
];
```

**Column Configuration Explained:**
- `id` - Unique identifier for the column
- `header` - Display text in the column header
- `accessorKey` - Property name from your data object
- `enableSorting` - Optional, enables/disables sorting (default: true if accessorKey exists)

---

## Step 4: Render the DataTable

```tsx
import { DataTable } from '@morne004/headless-react-data-table';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Users Table</h1>
      <DataTable<User>
        data={users}
        columns={columns}
      />
    </div>
  );
}

export default App;
```

---

## Complete Example

Here's the full working code you can copy and paste:

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

// Define data type
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
}

// Sample data
const users: User[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', age: 32, status: 'active' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', age: 28, status: 'active' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', age: 45, status: 'inactive' },
  { id: 4, firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com', age: 36, status: 'pending' },
  { id: 5, firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', age: 29, status: 'active' },
];

// Column definitions
const columns: ColumnDef<User>[] = [
  { id: 'id', header: 'ID', accessorKey: 'id' },
  { id: 'firstName', header: 'First Name', accessorKey: 'firstName' },
  { id: 'lastName', header: 'Last Name', accessorKey: 'lastName' },
  { id: 'email', header: 'Email', accessorKey: 'email', enableSorting: false },
  { id: 'age', header: 'Age', accessorKey: 'age' },
  { id: 'status', header: 'Status', accessorKey: 'status' },
];

// Main component
export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Users Table</h1>
      <DataTable<User> data={users} columns={columns} />
    </div>
  );
}
```

---

## What You Get Out-of-the-Box

🎉 **Congratulations!** With just those few lines of code, you now have:

- ✅ **Global Search** - Search bar that filters across all columns
- ✅ **Advanced Filtering** - Multi-column filters with 6 different operators
- ✅ **Sorting** - Click column headers to sort (ascending/descending/none)
- ✅ **Pagination** - Navigate through pages with customizable page sizes (10, 25, 50, 100)
- ✅ **Column Visibility** - Toggle which columns are shown
- ✅ **Column Reordering** - Drag and drop column headers to reorder
- ✅ **Column Resizing** - Drag column separators to resize
- ✅ **Density Toggle** - Switch between normal and condensed row heights
- ✅ **CSV Export** - Export filtered/sorted data to CSV
- ✅ **State Persistence** - Table state saved to localStorage automatically
- ✅ **Keyboard Navigation** - Fully keyboard accessible
- ✅ **Responsive Design** - Works on mobile and desktop

**All of this with ZERO additional configuration!**

---

## Try It Out

### Interact with Your Table

1. **Search** - Type in the search bar to filter rows across all columns
2. **Sort** - Click on "Age" column header, then click again to reverse, click once more to clear
3. **Filter** - Click "Filters" button to build advanced multi-column filters
4. **Paginate** - Use pagination controls at the bottom to navigate pages
5. **Resize** - Drag the column separator between headers to resize columns
6. **Reorder** - Drag a column header to a new position
7. **Toggle Columns** - Click "Columns" to show/hide specific columns
8. **Export** - Click "Export All" to download CSV

---

## Customizing the Initial State

You can customize the initial state of your table:

```tsx
<DataTable<User>
  data={users}
  columns={columns}
  initialState={{
    pageSize: 25,              // Start with 25 rows per page
    globalFilter: 'john',      // Pre-fill search with "john"
    sorting: {
      key: 'age',
      direction: 'descending'
    },
    columnVisibility: {        // Hide email column by default
      email: false,
    },
  }}
/>
```

---

## Loading State

Show a skeleton loader while data is being fetched:

```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Simulate API call
  setTimeout(() => setIsLoading(false), 2000);
}, []);

<DataTable<User>
  data={users}
  columns={columns}
  isLoading={isLoading}
/>
```

---

## Empty State

Customize the message shown when there's no data:

```tsx
<DataTable<User>
  data={[]}
  columns={columns}
  noDataMessage={
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h3>No users found</h3>
      <p>Try adjusting your search or filters.</p>
    </div>
  }
/>
```

---

## Next Steps

Now that you have a basic table running, explore these topics:

### Customize the Look
- **[Customization Guide](./customization-guide.md)** - Learn how to style your table
- **[Custom Styling Example](./examples/custom-styling.md)** - See Tailwind CSS patterns

### Add Advanced Features
- **[Features Overview](./features-overview.md)** - Deep dive into all features
- **[Advanced Features Example](./examples/advanced-features.md)** - Row selection, CSV export, etc.

### Work with APIs
- **[Server-Side Data Example](./examples/server-side-data.md)** - Integrate with backend APIs

### Go Fully Custom
- **[API Reference](./api-reference.md)** - Explore the `useDataTable` hook
- **[Custom Components Example](./examples/custom-components.md)** - Replace default UI components

### TypeScript Deep Dive
- **[TypeScript Guide](./typescript-guide.md)** - Master type-safe table development

---

## Common Gotchas

### 1. Data Must Have `id` Property

By default, `DataTable` expects each row to have an `id` property (string or number).

If your data uses a different identifier:

```tsx
interface Product {
  productId: string;  // Using productId instead of id
  name: string;
  price: number;
}

<DataTable<Product>
  data={products}
  columns={columns}
  getRowId={(row) => row.productId}  // Tell DataTable how to get the ID
/>
```

### 2. Columns Should Be Memoized

For optimal performance, memoize your columns array:

```tsx
import { useMemo } from 'react';

function App() {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { id: 'id', header: 'ID', accessorKey: 'id' },
      // ... other columns
    ],
    []
  );

  return <DataTable data={users} columns={columns} />;
}
```

### 3. Generic Type Parameter

Always provide the type parameter to `DataTable` for type safety:

```tsx
// ✅ Good - Type safe
<DataTable<User> data={users} columns={columns} />

// ❌ Bad - No type checking
<DataTable data={users} columns={columns} />
```

---

## Troubleshooting

**Table not rendering?**
- Check browser console for errors
- Verify `data` is an array
- Verify `columns` is an array with at least one column
- Ensure each row has an `id` property (or provide `getRowId`)

**TypeScript errors?**
- Make sure you're importing types: `import type { ColumnDef } from '@morne004/headless-react-data-table'`
- Provide the generic type parameter: `<DataTable<User> />`
- See [TypeScript Guide](./typescript-guide.md) for more help

**Need more help?**
- Check [Troubleshooting Guide](./troubleshooting.md)
- Browse [Examples](./examples/README.md)
- Search [GitHub Issues](https://github.com/Morne004/advnaced-react-table/issues)

---

## Summary

You've learned how to:
- ✅ Define data types and columns
- ✅ Render a DataTable component
- ✅ Customize initial state
- ✅ Handle loading and empty states
- ✅ Avoid common pitfalls

**You're ready to build powerful data tables!** 🚀

Explore the [Features Overview](./features-overview.md) to learn about all available capabilities.
