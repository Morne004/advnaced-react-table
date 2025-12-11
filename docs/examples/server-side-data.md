# Server-Side Data Management

Learn how to integrate DataTable with backend APIs for large datasets.

---

## Overview

This example demonstrates:
- Server-side pagination
- Server-side filtering and sorting
- Loading states
- Error handling
- React Query integration
- Plain fetch implementation

**Difficulty:** 🟡 Intermediate

---

## When to Use Server-Side Mode

Use server-side data management when:
- Dataset is large (>10,000 rows)
- Filtering/sorting is expensive
- Data comes from a database with built-in pagination

---

## React Query Example

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef, ControlledDataTableState } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface ApiResponse {
  users: User[];
  totalRows: number;
  totalPages: number;
}

// API fetch function
const fetchUsers = async (state: ControlledDataTableState): Promise<ApiResponse> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: state.pageIndex ?? 0,
      pageSize: state.pageSize ?? 10,
      search: state.globalFilter ?? '',
      filters: state.filters ?? [],
      sorting: state.sorting,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

function UsersTable() {
  const [tableState, setTableState] = useState<ControlledDataTableState>({
    pageIndex: 0,
    pageSize: 10,
    globalFilter: '',
    filters: [],
    sorting: null,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', tableState],
    queryFn: () => fetchUsers(tableState),
    keepPreviousData: true,  // Keep showing old data while loading new
  });

  const columns: ColumnDef<User>[] = [
    { id: 'firstName', header: 'First Name', accessorKey: 'firstName' },
    { id: 'lastName', header: 'Last Name', accessorKey: 'lastName' },
    { id: 'email', header: 'Email', accessorKey: 'email' },
  ];

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <DataTable<User>
      data={data?.users ?? []}
      columns={columns}
      isLoading={isLoading}
      manualPagination
      manualFiltering
      manualSorting
      totalRowCount={data?.totalRows}
      pageCount={data?.totalPages}
      state={tableState}
      onStateChange={setTableState}
    />
  );
}

export default UsersTable;
```

---

## Plain Fetch Example

```tsx
import { useState, useEffect } from 'react';
import { DataTable } from '@morne004/headless-react-data-table';
import type { ControlledDataTableState } from '@morne004/headless-react-data-table';

function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableState, setTableState] = useState<ControlledDataTableState>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tableState),
        });

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        setUsers(data.users);
        setTotalRows(data.totalRows);
        setPageCount(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableState]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DataTable<User>
      data={users}
      columns={columns}
      isLoading={isLoading}
      manualPagination
      manualFiltering
      manualSorting
      totalRowCount={totalRows}
      pageCount={pageCount}
      state={tableState}
      onStateChange={setTableState}
    />
  );
}
```

---

## Backend API Example (Express)

```ts
// server.ts
app.post('/api/users', async (req, res) => {
  const { page = 0, pageSize = 10, search = '', filters = [], sorting = null } = req.body;

  let query = db('users');

  // Apply global search
  if (search) {
    query = query.where((builder) => {
      builder
        .where('firstName', 'like', `%${search}%`)
        .orWhere('lastName', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`);
    });
  }

  // Apply advanced filters
  filters.forEach((filter: Filter) => {
    switch (filter.operator) {
      case 'contains':
        query = query.where(filter.column, 'like', `%${filter.value}%`);
        break;
      case 'equals':
        query = query.where(filter.column, '=', filter.value);
        break;
      case 'startsWith':
        query = query.where(filter.column, 'like', `${filter.value}%`);
        break;
      case 'endsWith':
        query = query.where(filter.column, 'like', `%${filter.value}`);
        break;
      case 'greaterThan':
        query = query.where(filter.column, '>', Number(filter.value));
        break;
      case 'lessThan':
        query = query.where(filter.column, '<', Number(filter.value));
        break;
    }
  });

  // Apply sorting
  if (sorting) {
    query = query.orderBy(sorting.key, sorting.direction === 'ascending' ? 'asc' : 'desc');
  }

  // Get total count
  const totalRows = await query.clone().count('* as count').first();

  // Apply pagination
  const users = await query
    .offset(page * pageSize)
    .limit(pageSize);

  res.json({
    users,
    totalRows: totalRows.count,
    totalPages: Math.ceil(totalRows.count / pageSize),
  });
});
```

---

## Key Points

1. **Manual Flags**: Set `manualPagination`, `manualFiltering`, `manualSorting` to `true`
2. **Controlled State**: Use `state` and `onStateChange` props
3. **Total Counts**: Provide `totalRowCount` and `pageCount` from server
4. **Loading State**: Set `isLoading` while fetching
5. **Error Handling**: Display errors appropriately

---

## Next Steps

- **[Advanced Features](./advanced-features.md)** - More table features
- **[API Reference](../api-reference.md)** - Complete documentation

