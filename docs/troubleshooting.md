# Troubleshooting Guide

Solutions to common issues and frequently asked questions about **@morne004/headless-react-data-table**.

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [State Not Updating](#state-not-updating)
- [TypeScript Errors](#typescript-errors)
- [Performance Issues](#performance-issues)
- [Styling Issues](#styling-issues)
- [Integration Issues](#integration-issues)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Debugging Tips](#debugging-tips)

---

## Installation Issues

### Package Not Found (404)

**Error:**
```
npm ERR! 404 Not Found - GET https://npm.pkg.github.com/@morne004/headless-react-data-table
```

**Solutions:**
1. Verify `.npmrc` configuration:
   ```
   @morne004:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_TOKEN
   ```
2. Check GitHub token has `read:packages` scope
3. Verify package name is correct: `@morne004/headless-react-data-table`

### Authentication Error (401)

**Error:**
```
npm ERR! 401 Unauthorized - GET https://npm.pkg.github.com/@morne004/headless-react-data-table
```

**Solutions:**
1. Regenerate GitHub Personal Access Token
2. Update token in `.npmrc`
3. Clear npm cache: `npm cache clean --force`
4. Try installing again

### Module Not Found After Installation

**Error:**
```
Module not found: Can't resolve '@morne004/headless-react-data-table'
```

**Solutions:**
1. Verify installation: `npm list @morne004/headless-react-data-table`
2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check import path is correct
4. Restart development server

### React Version Mismatch

**Error:**
```
npm ERR! peer react@"^18.0.0 || ^19.0.0" from @morne004/headless-react-data-table@1.3.4
```

**Solutions:**
1. Upgrade React to 18.x or higher:
   ```bash
   npm install react@^18.0.0 react-dom@^18.0.0
   ```
2. If you must use React 17, use `--legacy-peer-deps`:
   ```bash
   npm install @morne004/headless-react-data-table --legacy-peer-deps
   ```
   ⚠️ **Warning:** React 17 is not officially supported

---

## State Not Updating

### Filters Not Applied

**Problem:** Filters don't seem to work or data doesn't change

**Solutions:**

1. **Check you're using `paginatedData`, not raw `data`:**
   ```tsx
   // ❌ Wrong - using raw data
   {data.map(row => <tr>...</tr>)}

   // ✅ Correct - using paginated data
   const table = useDataTable({ data, columns });
   {table.paginatedData.map(row => <tr>...</tr>)}
   ```

2. **Verify filter structure:**
   ```tsx
   const filters: Filter[] = [
     {
       id: '1',
       column: 'status',      // Must match column id
       operator: 'equals',
       value: 'active'
     }
   ];
   ```

3. **Check column ID matches:**
   ```tsx
   // Column definition
   { id: 'status', accessorKey: 'status', header: 'Status' }

   // Filter must use same id
   { column: 'status', operator: 'equals', value: 'active' }
   ```

### Search Not Working

**Problem:** Global search doesn't filter data

**Solutions:**

1. **Ensure you're calling the handler:**
   ```tsx
   // ✅ Correct
   <input
     value={table.globalFilter}
     onChange={(e) => table.handleGlobalFilterChange(e.target.value)}
   />

   // ❌ Wrong - not calling handler
   <input
     value={table.globalFilter}
     onChange={(e) => console.log(e.target.value)}
   />
   ```

2. **Check for typos in accessorKey:**
   ```tsx
   // Data has 'firstName', but column uses 'firstname'
   const columns = [
     { id: 'name', accessorKey: 'firstname', header: 'Name' }  // ❌ Wrong
   ];

   // Should be:
   { id: 'name', accessorKey: 'firstName', header: 'Name' }  // ✅ Correct
   ```

### Sorting Not Working

**Problem:** Clicking headers doesn't sort data

**Solutions:**

1. **Ensure column has `accessorKey`:**
   ```tsx
   // ❌ Wrong - no accessorKey
   { id: 'name', header: 'Name' }

   // ✅ Correct
   { id: 'name', header: 'Name', accessorKey: 'name' }
   ```

2. **Check `enableSorting` is not false:**
   ```tsx
   // ❌ Sorting disabled
   { id: 'name', header: 'Name', accessorKey: 'name', enableSorting: false }

   // ✅ Sorting enabled (default)
   { id: 'name', header: 'Name', accessorKey: 'name' }
   ```

### State Not Persisting

**Problem:** Table state doesn't save to localStorage

**Solutions:**

1. **Check `disablePersistence` is not set:**
   ```tsx
   // ❌ Persistence disabled
   <DataTable disablePersistence />

   // ✅ Persistence enabled (default)
   <DataTable data={data} columns={columns} />
   ```

2. **Verify localStorage is available:**
   ```tsx
   // Check if localStorage works
   try {
     localStorage.setItem('test', 'test');
     localStorage.removeItem('test');
   } catch (error) {
     console.error('localStorage not available:', error);
   }
   ```

3. **Clear corrupted storage:**
   ```tsx
   // Clear all table state
   Object.keys(localStorage)
     .filter(key => key.startsWith('datatable_'))
     .forEach(key => localStorage.removeItem(key));
   ```

---

## TypeScript Errors

### Cannot Find Module

**Error:**
```
Cannot find module '@morne004/headless-react-data-table' or its corresponding type declarations
```

**Solutions:**
1. Verify package is installed
2. Check TypeScript can find declarations:
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "moduleResolution": "node"
     }
   }
   ```
3. Restart TypeScript server (VS Code: Cmd/Ctrl + Shift + P → "Restart TS Server")

### Property Does Not Exist on Type 'never'

**Error:**
```
Property 'globalFilter' does not exist on type 'never'
```

**Solution:** Add generic type parameter:
```tsx
// ❌ Wrong
const table = useDataTable({ data, columns });

// ✅ Correct
const table = useDataTable<User>({ data, columns });
```

### Type 'X' is Not Assignable

**Error:**
```
Type 'string' is not assignable to type 'keyof User'
```

**Solution:** Use proper typing:
```tsx
// ❌ Wrong
const columnKey = 'name';
table.setSort(columnKey);

// ✅ Correct
const columnKey: keyof User = 'name';
table.setSort(columnKey);

// Or use assertion
table.setSort('name' as keyof User);
```

### JSX Element Type Does Not Have Construct Signatures

**Error:**
```
'CustomToolbar' cannot be used as a JSX component
```

**Solution:** Make component generic:
```tsx
// ❌ Wrong
const CustomToolbar = ({ table }: TableComponentProps<User>) => {...};

// ✅ Correct
const CustomToolbar = <T,>({ table }: TableComponentProps<T>) => {...};
```

See [TypeScript Guide](./typescript-guide.md#type-error-solutions) for more.

---

## Performance Issues

### Table Renders Slowly

**Problem:** Table is slow to render or update

**Solutions:**

1. **Memoize columns:**
   ```tsx
   // ✅ Good - Memoized
   const columns = useMemo<ColumnDef<User>[]>(() => [
     { id: 'name', header: 'Name', accessorKey: 'name' },
   ], []);

   // ❌ Bad - Recreated every render
   const columns = [
     { id: 'name', header: 'Name', accessorKey: 'name' },
   ];
   ```

2. **Memoize data:**
   ```tsx
   const [users, setUsers] = useState<User[]>([]);

   // ✅ Good - Only recalculate when users change
   const memoizedUsers = useMemo(() => users, [users]);

   <DataTable data={memoizedUsers} columns={columns} />
   ```

3. **Use smaller page sizes:**
   ```tsx
   <DataTable
     data={data}
     columns={columns}
     initialState={{
       pageSize: 25  // Instead of 100
     }}
   />
   ```

4. **Consider server-side pagination for large datasets:**
   ```tsx
   // For datasets > 10,000 rows
   <DataTable
     manualPagination
     manualFiltering
     manualSorting
     // ... server-side props
   />
   ```

### Too Many Re-renders

**Problem:** "Maximum update depth exceeded" error

**Solutions:**

1. **Wrap handlers in useCallback:**
   ```tsx
   const handleEdit = useCallback((row: User) => {
     // Edit logic
   }, []);

   const columns: ColumnDef<User>[] = [
     {
       id: 'actions',
       header: 'Actions',
       cell: ({ row }) => <button onClick={() => handleEdit(row)}>Edit</button>
     }
   ];
   ```

2. **Don't call setState in render:**
   ```tsx
   // ❌ Wrong - causes infinite loop
   function Component() {
     setTableState({...});  // Called on every render
     return <DataTable ... />;
   }

   // ✅ Correct - use useEffect
   function Component() {
     useEffect(() => {
       setTableState({...});
     }, []);
     return <DataTable ... />;
   }
   ```

### Memory Leaks

**Problem:** Memory usage increases over time

**Solutions:**

1. **Clean up event listeners:**
   ```tsx
   useEffect(() => {
     const handler = () => {...};
     window.addEventListener('resize', handler);

     return () => window.removeEventListener('resize', handler);
   }, []);
   ```

2. **Cancel pending requests:**
   ```tsx
   useEffect(() => {
     const abortController = new AbortController();

     fetch('/api/users', { signal: abortController.signal })
       .then(res => res.json())
       .then(setUsers);

     return () => abortController.abort();
   }, []);
   ```

---

## Styling Issues

### Styles Not Applied

**Problem:** Custom CSS doesn't affect the table

**Solutions:**

1. **Check CSS specificity:**
   ```css
   /* ❌ Low specificity */
   .data-table-cell {
     color: red;
   }

   /* ✅ Higher specificity */
   .my-container .data-table-cell {
     color: red;
   }

   /* ✅ Or use !important (last resort) */
   .data-table-cell {
     color: red !important;
   }
   ```

2. **Verify CSS is loaded:**
   ```tsx
   // Check in browser DevTools that CSS file is loaded
   import './MyTable.css';
   ```

3. **Check for CSS Modules:**
   ```tsx
   // If using CSS Modules
   import styles from './MyTable.module.css';

   <div className={styles.container}>
     <DataTable ... />
   </div>
   ```

### Tailwind Classes Not Working

**Problem:** Tailwind utility classes have no effect

**Solutions:**

1. **Ensure Tailwind is configured:**
   ```js
   // tailwind.config.js
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
   };
   ```

2. **Check for class name conflicts:**
   ```tsx
   // Some classes might be overridden
   className="p-4"  // Overridden by default styles

   // Use !important or more specific selectors
   className="!p-4"
   ```

3. **Verify Tailwind directives:**
   ```css
   /* index.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

---

## Integration Issues

### Next.js "Window is not defined" Error

**Problem:** Server-side rendering error with localStorage

**Solution:** The library uses `localStorage` which is only available client-side. This should be handled automatically, but if you encounter issues:

```tsx
'use client';  // Mark as client component (App Router)

import { DataTable } from '@morne004/headless-react-data-table';

export default function UsersPage() {
  return <DataTable data={users} columns={columns} />;
}
```

### React Query Integration

**Problem:** Table doesn't update when query refetches

**Solution:** Ensure you're passing the latest data:

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// ✅ Correct - uses latest data
<DataTable
  data={data?.users ?? []}
  isLoading={isLoading}
  columns={columns}
/>
```

---

## Frequently Asked Questions

### How do I reset all filters?

```tsx
const table = useDataTable({ data, columns });

// Clear all filters
table.applyFilters([]);

// Clear search
table.handleGlobalFilterChange('');

// Reset to page 0
table.setPageIndex(0);
```

### Can I have multiple tables on one page?

Yes! Each `DataTable` instance has its own state. However, they'll share the same localStorage keys by default. To avoid conflicts:

```tsx
// Option 1: Use controlled state
const [table1State, setTable1State] = useState({});
const [table2State, setTable2State] = useState({});

<DataTable state={table1State} onStateChange={setTable1State} />
<DataTable state={table2State} onStateChange={setTable2State} />

// Option 2: Disable persistence
<DataTable disablePersistence />
```

### How do I customize the "no data" message?

```tsx
<DataTable
  data={[]}
  columns={columns}
  noDataMessage={
    <div className="text-center py-10">
      <h3>No data available</h3>
      <p>Try adjusting your filters or search.</p>
      <button onClick={handleReset}>Reset</button>
    </div>
  }
/>
```

### Can I disable specific features?

Yes, by using custom components:

```tsx
// Disable search by using custom toolbar without search
const MinimalToolbar = <T,>({ table }: TableComponentProps<T>) => (
  <div>
    {/* Only show column toggle, no search */}
    <button onClick={() => {...}}>Columns</button>
  </div>
);

<DataTable
  components={{ Toolbar: MinimalToolbar }}
/>
```

### How do I get only selected rows?

```tsx
const table = useDataTable({ data: users, columns });

// Get selected rows
const selectedRows = table.getSelectedRows();
console.log(selectedRows);  // Array of user objects

// Get count
console.log(selectedRows.length);  // Number of selected rows

// Get IDs only
const selectedIds = Object.keys(table.rowSelection).filter(
  id => table.rowSelection[id]
);
```

### Can I use this with React 17?

The library requires React 18+. While you can install it with `--legacy-peer-deps`, it's not officially supported and may have issues.

### How do I implement infinite scroll?

This library uses pagination by default. For infinite scroll, you'd need to:
1. Use the headless `useDataTable` hook
2. Build custom UI with infinite scroll
3. Manage page state yourself

Consider using a different library designed for infinite scroll if that's your primary use case.

### How large of a dataset can it handle?

- **Client-side:** Comfortably handles 1,000-10,000 rows
- **10,000-100,000 rows:** Use server-side pagination
- **100,000+ rows:** Strongly recommend server-side mode

###Does it support multi-column sorting?

No, only single-column sorting is supported. You can cycle through ascending → descending → none for one column at a time.

---

## Debugging Tips

### Enable React DevTools Profiler

1. Install React DevTools browser extension
2. Open Profiler tab
3. Record a session while interacting with table
4. Look for unnecessary re-renders

### Log Table State

```tsx
const table = useDataTable({ data, columns });

useEffect(() => {
  console.log('Table state:', {
    globalFilter: table.globalFilter,
    filters: table.filters,
    sorting: table.sorting,
    pagination: table.pagination,
  });
}, [table.globalFilter, table.filters, table.sorting, table.pagination]);
```

### Check localStorage

```tsx
// View all table state in localStorage
Object.keys(localStorage)
  .filter(key => key.startsWith('datatable_'))
  .forEach(key => {
    console.log(key, localStorage.getItem(key));
  });
```

### Verify Data Structure

```tsx
console.log('Data sample:', data[0]);
console.log('Columns:', columns);
console.log('Paginated data:', table.paginatedData);
console.log('Total count:', table.totalCount);
```

---

## Still Having Issues?

1. **Search GitHub Issues:** [github.com/Morne004/advnaced-react-table/issues](https://github.com/Morne004/advnaced-react-table/issues)
2. **Check documentation:** Review [API Reference](./api-reference.md) and [Examples](./examples/README.md)
3. **Create minimal reproduction:** Isolate the issue in a small example
4. **Open an issue:** Include:
   - Package version
   - React version
   - Node/npm version
   - Error messages
   - Minimal code to reproduce

---

## Next Steps

- **[API Reference](./api-reference.md)** - Complete documentation
- **[Examples](./examples/README.md)** - See working examples
- **[TypeScript Guide](./typescript-guide.md)** - Solve type errors
