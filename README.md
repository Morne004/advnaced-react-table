
# Headless React Data Table

[![License](https://img.shields.io/npm/l/headless-react-data-table.svg)](https://opensource.org/licenses/MIT)

A lightweight, powerful, and fully headless data table library for React. It provides all the logic, state management, and functionality you need to build a feature-rich data grid, while leaving the rendering and styling completely in your hands.

Built with TypeScript and modern React hooks, it's designed for maximum flexibility and an excellent developer experience.

## Key Features

-   **🚀 Headless by Design**: Provides the engine, you provide the UI. Works with any styling solution (Tailwind CSS, CSS-in-JS, etc.).
-   **⚛️ Modern React**: Built entirely with hooks for a clean, declarative API.
-   **💾 Persistent State**: Remembers user preferences like column order, visibility, filters, and sorting in `localStorage`.
-   **⚙️ Fully Controlled Mode**: Optionally manage the table's state from your own components.
-   **🔍 Advanced Filtering**: Includes both global text search and a multi-filter builder.
-   **🔢 Advanced Pagination**: Fully-featured pagination logic ready for your custom UI.
-   **↔️ Column Resizing**: Let users resize columns to their liking.
-   **🔄 Column Reordering**: Simple drag-and-drop to reorder columns.
-   **📤 CSV Export**: Built-in utility to export table data.
-   **✅ TypeScript Native**: Full type safety for a great developer experience.

---

## Core Philosophy

This library is "headless," which means it **does not render any HTML markup or styles by default**. Instead, it gives you a powerful hook (`useDataTable`) and a component (`<DataTable />`) that manage the complex state and logic, providing you with everything you need to render your own components.

This approach gives you **100% control** over the look and feel of your table, ensuring it integrates perfectly with your existing design system and component library.

## Installation

This package is hosted on **GitHub Packages**. To use it, you'll need to configure your package manager to fetch packages from the GitHub registry under your scope.

1.  **Authenticate with GitHub Packages**: First, ensure you have a [Personal Access Token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `read:packages` scope. Then, configure your package manager to use it.

2.  **Configure `.npmrc`**: In your project's root directory, create a `.npmrc` file and add the following line. Replace `YOUR_GITHUB_USERNAME` with the GitHub username or organization under which this package is published.

    ```
    @YOUR_GITHUB_USERNAME:registry=https://npm.pkg.github.com/
    ```

3.  **Install the Package**: Now, you can install the library.

    ```bash
    # Using npm
    npm install @YOUR_GITHUB_USERNAME/headless-react-data-table

    # Using yarn
    yarn add @YOUR_GITHUB_USERNAME/headless-react-data-table
    ```

You also need to have `react` and `react-dom` installed in your project, as they are `peerDependencies`.

## Quick Start

Here is the most basic example of how to get the data table up and running. It will be unstyled, but fully functional.

```tsx
import React from 'react';
import { DataTable } from '@YOUR_GITHUB_USERNAME/headless-react-data-table';
import type { ColumnDef } from '@YOUR_GITHUB_USERNAME/headless-react-data-table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

const data: User[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
  { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25 },
  // ...more data
];

const columns: ColumnDef<User>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'firstName', accessorKey: 'firstName', header: 'First Name' },
  { id: 'lastName', accessorKey: 'lastName', header: 'Last Name' },
  { id: 'age', accessorKey: 'age', header: 'Age' },
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
---

## API Reference & In-Depth Guide

### The `data` Prop

The `data` prop is the simplest, yet most fundamental prop. It's the array of data that you want to render in the table.

-   **Type**: `T[]` (an array of objects)
-   **Description**: Each object in the array represents one row in the table. The library is generic, so it can handle any data structure you provide. For React's rendering to be efficient, each row object should have a unique identifier. By default, the library looks for an `id` property, but you can customize this with the `getRowId` prop.

#### Example `data` Structure:
```ts
// This is your data structure. It can be anything.
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  salary: number;
}

// This is the array you pass to the DataTable component.
const myUsers: User[] = [
  { id: 101, name: 'Alice', email: 'alice@example.com', isActive: true, salary: 80000 },
  { id: 102, name: 'Bob', email: 'bob@example.com', isActive: false, salary: 65000 },
  // ...
];

<DataTable data={myUsers} columns={...} />
```

---

### The `columns` Prop

The `columns` prop is an array of configuration objects that define what your table's columns should look like and how they should behave. This is where you connect your data to the table's display.

-   **Type**: `ColumnDef<T>[]`
-   **Description**: Each object in the array defines a single column.

#### `ColumnDef<T>` Object Properties:

| Key             | Type                                  | Description                                                                                                                              |
| --------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `id`            | `string`                              | **Required.** A unique string identifier for the column. Used internally for tracking column order, visibility, and resizing.                 |
| `header`        | `string`                              | **Required.** The text that will be displayed in the column's header.                                                                    |
| `accessorKey`   | `keyof T`                             | The key of the property in your data object to display in this column's cells. For example, `firstName` would access `row.firstName`.       |
| `cell`          | `(info: { row: T }) => React.ReactNode` | An optional **render prop** function. Use this for custom rendering, like formatting dates, adding buttons, or displaying status badges. |
| `enableSorting` | `boolean`                             | Set to `false` to disable sorting specifically for this column. Defaults to `true` if an `accessorKey` is provided.                      |

#### Example `columns` Configuration:

This example demonstrates a basic column, a column with sorting disabled, and a column with a custom cell renderer for a status badge.

```tsx
import type { ColumnDef } from '@YOUR_GITHUB_USERNAME/headless-react-data-table';

// Assuming the same User interface as above
const columns: ColumnDef<User>[] = [
  // A simple column that directly displays the 'name' property
  {
    id: 'fullName',
    accessorKey: 'name',
    header: 'Name',
  },
  // A column that is not sortable
  {
    id: 'emailAddress',
    accessorKey: 'email',
    header: 'Email',
    enableSorting: false,
  },
  // A column with a custom cell renderer to display a styled status badge
  {
    id: 'status',
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      // The 'row' object is the full data object for the current row
      const status = row.isActive ? 'Active' : 'Inactive';
      const color = row.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
      
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
          {status}
        </span>
      );
    },
  },
];
```

---

### The `components` Prop (Headless UI)

This is the most powerful feature of the library. The `components` prop allows you to replace the default, unstyled parts of the table with your own custom React components. This is how you achieve a fully custom design.

-   **Type**: `object`
-   **Description**: An object where keys are the names of the component "slots" you want to override.

#### Available Component Slots:

-   `Toolbar`: The area above the table, typically containing search, filters, and action buttons.
-   `Pagination`: The area below the table for navigating between pages.
-   `FilterBuilder`: The UI for creating complex, multi-column filters.
-   `Skeleton`: A component to display while `isLoading` is true.

#### How It Works:

When you provide a custom component, the `DataTable` will render it in the appropriate slot and pass it a set of props, most importantly the `table` object. This `table` object is the instance returned by the internal `useDataTable` hook and contains all the state and handler functions you need to make your component interactive.

#### The `table` Object

Your custom components will receive a `table` object containing everything needed to control the table. Here are some of the key properties:

-   **State**: `globalFilter`, `filters`, `sorting`, `pagination`, `columnVisibility`...
-   **Data**: `paginatedData`, `sortedData`, `totalCount`...
-   **Handlers**: `handleGlobalFilterChange`, `applyFilters`, `setSort`, `setPageSize`, `setPageIndex`...

#### Example: Creating a Custom Styled Toolbar

```tsx
import React from 'react';
import { DataTable } from '@YOUR_GITHUB_USERNAME/headless-react-data-table';
import type { TableComponentProps } from '@YOUR_GITHUB_USERNAME/headless-react-data-table';

// --- 1. Define your custom, styled Toolbar component ---
// It receives `TableComponentProps<T>` which includes the `table` object.
const MyStyledToolbar = <T extends object>({ table }: TableComponentProps<T>) => {
  // --- 2. Destructure the state and handlers you need from the `table` object ---
  const { globalFilter, handleGlobalFilterChange, sortedData } = table;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
      <h2 className="text-xl font-semibold">User Data</h2>
      
      {/* Example: Export to CSV button using a handler from the table instance */}
      <button 
        onClick={() => exportToCsv('users.csv', sortedData)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Export CSV
      </button>

      {/* Example: A search input connected to the table's state */}
      <input
        type="text"
        value={globalFilter} // Use state from the table
        onChange={(e) => handleGlobalFilterChange(e.target.value)} // Use handler from the table
        placeholder="Search..."
        className="px-4 py-2 border rounded-md"
      />
    </div>
  );
};

// --- 3. Pass your custom component to the DataTable ---
const App = () => {
  // ... (data and columns definitions)
  
  return (
    <div className="p-8 bg-white shadow-lg rounded-xl">
      <DataTable
        data={myUsers}
        columns={columns}
        components={{
          Toolbar: MyStyledToolbar, // Here is the override
          // You could also override Pagination, Skeleton, etc.
          // Pagination: MyStyledPagination,
        }}
      />
      {/* Don't forget to style the table itself! */}
    </div>
  );
};
```

---

### Other `<DataTable />` Props

| Prop              | Type                                                  | Default     | Description                                                                                             |
| ----------------- | ----------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `getRowId`        | `(row: T) => string \| number`                          | `row => row.id` | A function to extract a unique ID from each row object.                                                 |
| `isLoading`       | `boolean`                                             | `false`     | If true, displays the `Skeleton` component instead of the table body.                                   |
| `noDataMessage`   | `React.ReactNode`                                     | "No data."  | A message or component to display when the table has no data.                                           |
| `initialState`    | `Partial<DataTableState>`                             | `{}`        | An object to set the initial state of the table (e.g., page size, initial sorting).                     |
| `state`           | `ControlledDataTableState`                            | `undefined` | **For controlled mode.** An object representing the current state of the table.                         |
| `onStateChange`   | `(newState: ControlledDataTableState) => void` | `undefined` | **For controlled mode.** A callback that fires whenever the internal state changes.                     |

### State Management

The table can operate in two modes:

1.  **Uncontrolled (Default)**: The table manages its own state internally and persists it to `localStorage`. This is the easiest way to get started. Use the `initialState` prop to set default values.
2.  **Controlled**: You manage the state yourself. To enable this, pass the `state` and `onStateChange` props. The table will always reflect the `state` you provide, and it will call `onStateChange` with any updates (e.g., user clicks the sort button), allowing you to update your state accordingly.

## Contributing

Contributions are welcome! If you have a feature request, bug report, or a pull request, please feel free to open an issue or PR.

### Development Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run the demo application: `npm run dev`

This will start a Vite development server with the demo application located in `src/demo/App.tsx`, which is the perfect place to test your changes to the library in `src/lib`.

## License

This project is licensed under the **MIT License**.
