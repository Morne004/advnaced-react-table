# Migration Guide

Guide for migrating to **@morne004/headless-react-data-table** from other table libraries.

---

## Migrating from TanStack Table (React Table)

### Key Differences

| Feature | TanStack Table | Headless React Data Table |
|---------|----------------|---------------------------|
| **Philosophy** | Maximum flexibility | Balanced (headless + default UI) |
| **Bundle Size** | ~45KB | ~15KB |
| **Learning Curve** | Steep | Gentle |
| **Built-in UI** | None | Default components included |
| **State Management** | Manual | Automatic + localStorage |
| **Filtering** | Plugin | Built-in (6 operators) |
| **Column Resizing** | Plugin | Built-in |

### Code Comparison

#### TanStack Table

```tsx
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table';

function Table() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Manual rendering required
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.column.columnDef.header}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* ... more manual rendering */}
    </table>
  );
}
```

#### Headless React Data Table

```tsx
import { DataTable } from '@morne004/headless-react-data-table';

function Table() {
  return (
    <DataTable<User>
      data={data}
      columns={columns}
    />
  );
  // Sorting, pagination, filtering included!
}
```

### Migration Steps

1. **Install the package:**
   ```bash
   npm install @morne004/headless-react-data-table
   npm uninstall @tanstack/react-table
   ```

2. **Update column definitions:**
   ```tsx
   // TanStack Table
   const columns = [
     {
       accessorKey: 'firstName',
       header: 'First Name',
     }
   ];

   // Headless React Data Table
   const columns: ColumnDef<User>[] = [
     {
       id: 'firstName',           // Add id
       accessorKey: 'firstName',
       header: 'First Name',
     }
   ];
   ```

3. **Replace table hook:**
   ```tsx
   // TanStack Table
   const table = useReactTable({ ... });

   // Headless React Data Table
   // Option 1: Use DataTable component (recommended)
   <DataTable data={data} columns={columns} />

   // Option 2: Use hook for custom UI
   const table = useDataTable({ data, columns });
   ```

4. **Update cell renderers:**
   ```tsx
   // TanStack Table
   cell: (info) => info.getValue()

   // Headless React Data Table
   cell: ({ row }) => row.firstName
   ```

---

## Migrating from Material-UI DataGrid

### Key Differences

| Feature | MUI DataGrid | Headless React Data Table |
|---------|--------------|---------------------------|
| **UI Framework** | Material-UI required | Framework-agnostic |
| **Customization** | MUI theme system | Full CSS control |
| **Bundle Size** | ~200KB | ~15KB |
| **License** | Free + Pro (paid) | MIT (free) |
| **TypeScript** | Built-in | Built-in |

### Code Comparison

#### MUI DataGrid

```tsx
import { DataGrid } from '@mui/x-data-grid';

<DataGrid
  rows={rows}
  columns={columns}
  pageSize={10}
  rowsPerPageOptions={[10, 25, 50]}
/>
```

#### Headless React Data Table

```tsx
import { DataTable } from '@morne004/headless-react-data-table';

<DataTable
  data={rows}
  columns={columns}
  initialState={{ pageSize: 10 }}
/>
```

### Migration Steps

1. **Update column format:**
   ```tsx
   // MUI DataGrid
   const columns = [
     { field: 'firstName', headerName: 'First Name', width: 150 }
   ];

   // Headless React Data Table
   const columns: ColumnDef<User>[] = [
     { id: 'firstName', accessorKey: 'firstName', header: 'First Name' }
   ];
   ```

2. **Update row format:**
   ```tsx
   // MUI requires 'id' field
   const rows = [{ id: 1, firstName: 'John' }];

   // Same requirement
   const data = [{ id: 1, firstName: 'John' }];
   ```

---

## Migrating from AG Grid

### Key Differences

| Feature | AG Grid | Headless React Data Table |
|---------|---------|---------------------------|
| **Complexity** | Enterprise-grade | Lightweight |
| **License** | Free + Enterprise (paid) | MIT (free) |
| **Bundle Size** | ~500KB | ~15KB |
| **Use Case** | Large enterprise apps | Small to medium apps |

### When to Stay with AG Grid

- Need virtual scrolling for 100,000+ rows
- Need tree data / master-detail
- Need pivot tables
- Need Excel export (not just CSV)
- Budget for enterprise license

### When to Migrate

- Want simpler API
- Don't need enterprise features
- Want smaller bundle size
- Prefer React-first approach

---

## General Migration Checklist

- [ ] Install new package
- [ ] Update column definitions (add `id` field)
- [ ] Update cell renderers
- [ ] Test sorting functionality
- [ ] Test pagination
- [ ] Test filtering
- [ ] Update custom styling
- [ ] Remove old package

---

## Feature Parity Table

| Feature | Included? | Notes |
|---------|-----------|-------|
| Sorting | ✅ | Single-column only |
| Filtering | ✅ | Global + 6 operators |
| Pagination | ✅ | Client & server-side |
| Column Visibility | ✅ | Toggle columns |
| Column Reordering | ✅ | Drag & drop |
| Column Resizing | ✅ | Drag separators |
| Row Selection | ✅ | Multi-select |
| CSV Export | ✅ | Built-in utility |
| State Persistence | ✅ | localStorage |
| Custom Cell Renderers | ✅ | Full React components |
| Virtual Scrolling | ❌ | Use pagination instead |
| Multi-Column Sort | ❌ | Single-column only |
| Tree Data | ❌ | Not supported |
| Pivoting | ❌ | Not supported |

---

## Need Help?

- [API Reference](./api-reference.md) - Complete documentation
- [Examples](./examples/README.md) - Practical examples
- [Troubleshooting](./troubleshooting.md) - Common issues
- [GitHub Issues](https://github.com/Morne004/advnaced-react-table/issues) - Get support

