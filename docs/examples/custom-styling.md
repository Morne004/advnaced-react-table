# Custom Styling with Tailwind CSS

Complete example of styling DataTable with Tailwind CSS to match your design system.

---

## Overview

Learn how to:
- Style the complete table with Tailwind classes
- Create custom Toolbar with Tailwind
- Create custom Pagination with Tailwind
- Implement responsive design
- Add dark mode support
- Create loading skeletons

**Difficulty:** 🟢 Beginner (requires Tailwind CSS)

---

## Prerequisites

Install Tailwind CSS in your project:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure Tailwind:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## Complete Styled Example

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef, TableComponentProps } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

// Custom Toolbar Component
const StyledToolbar = <T,>({ table }: TableComponentProps<T>) => {
  const { globalFilter, filters, totalCount, handleGlobalFilterChange, toggleDensity, isCondensed } = table;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Search Input */}
      <div className="relative w-full sm:w-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => handleGlobalFilterChange(e.target.value)}
          placeholder="Search all columns..."
          className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {filters.length > 0 || globalFilter ? (
            <>{totalCount} results</>
          ) : (
            <>{totalCount} total</>
          )}
        </span>

        <button
          onClick={toggleDensity}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isCondensed ? 'Normal' : 'Compact'}
        </button>
      </div>
    </div>
  );
};

// Custom Pagination Component
const StyledPagination = <T,>({ table }: TableComponentProps<T>) => {
  const { pagination, pageCount, setPageSize, setPageIndex } = table;
  const { pageIndex, pageSize } = pagination;

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="block border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[10, 25, 50, 100].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* Page Info */}
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Page {pageIndex + 1} of {pageCount}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPageIndex(0)}
          disabled={!canPreviousPage}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={!canPreviousPage}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={!canNextPage}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={() => setPageIndex(pageCount - 1)}
          disabled={!canNextPage}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Main Component
function StyledUsersTable() {
  const columns: ColumnDef<User>[] = [
    { id: 'firstName', header: 'First Name', accessorKey: 'firstName' },
    { id: 'lastName', header: 'Last Name', accessorKey: 'lastName' },
    { id: 'email', header: 'Email', accessorKey: 'email' },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const colors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  const data: User[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'active' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', status: 'inactive' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Users Management
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <DataTable<User>
            data={data}
            columns={columns}
            components={{
              Toolbar: StyledToolbar,
              Pagination: StyledPagination,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StyledUsersTable;
```

---

## Dark Mode Toggle

Add a dark mode toggle:

```tsx
function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <StyledUsersTable />
    </div>
  );
}
```

---

## Responsive Design

The example above includes responsive classes:

- `flex-col sm:flex-row` - Stack on mobile, row on desktop
- `w-full sm:w-64` - Full width on mobile, fixed on desktop
- Mobile-optimized padding and spacing

---

## Next Steps

- **[Custom Components](./custom-components.md)** - Build more custom UI
- **[Advanced Features](./advanced-features.md)** - Add more functionality
- **[Customization Guide](../customization-guide.md)** - Learn more about styling

