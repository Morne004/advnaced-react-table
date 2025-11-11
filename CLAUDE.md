# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Headless React Data Table** - a lightweight, headless data table library for React. It provides all the logic, state management, and functionality needed for feature-rich data grids while leaving rendering and styling to the consumer.

**Package Name**: `@Morne004/headless-react-data-table`
**Build Tool**: Vite
**Published to**: GitHub Packages (npm.pkg.github.com)

## Common Commands

```bash
# Development
npm run dev          # Start Vite dev server with demo app

# Build
npm run build        # TypeScript compilation + Vite library build

# Preview
npm run preview      # Preview production build
```

## Architecture

### Library Structure

The library is located in `src/lib/` and follows this structure:

```
src/lib/
├── index.ts              # Main entry point - exports all public APIs
├── types.ts              # TypeScript type definitions
├── components/           # React components (headless + default implementations)
│   ├── DataTable.tsx     # Main table component
│   ├── TableToolbar.tsx  # Default toolbar with search/filters
│   ├── FilterBuilder.tsx # Multi-filter UI
│   ├── TablePagination.tsx # Pagination controls
│   ├── TableSkeleton.tsx # Loading skeleton
│   ├── ActionsMenu.tsx   # Column visibility dropdown
│   └── icons/            # SVG icon components
├── hooks/                # Custom React hooks
│   ├── useDataTable.ts   # Core table logic hook
│   ├── usePersistentState.ts # localStorage integration
│   ├── useColumnResizing.ts  # Column resize logic
│   ├── useColumnDnd.ts   # Drag-and-drop reordering
│   └── useClickOutside.ts # Outside click detection
└── utils/
    └── csv.ts            # CSV export utility
```

### Core Hook: useDataTable

`useDataTable` is the heart of the library. It manages:

- **Filtering**: Global text search + multi-column advanced filters with operators (contains, equals, startsWith, endsWith, greaterThan, lessThan)
- **Sorting**: Single-column sort (ascending/descending/none)
- **Pagination**: Page size and page index management
- **Column Management**: Dynamic column ordering and visibility
- **State Persistence**: Automatically saves state to localStorage using `usePersistentState`

The hook accepts both **controlled** and **uncontrolled** modes:
- **Uncontrolled** (default): Table manages its own state internally
- **Controlled**: Pass `state` and `onStateChange` props to manage state externally

#### Data Processing Pipeline

Data flows through this processing pipeline in order:

1. **Raw data** → 2. **Global filtering** → 3. **Advanced filtering** → 4. **Sorting** → 5. **Pagination**

The hook exposes:
- Derived data: `paginatedData`, `sortedData`, `pageCount`, `totalCount`
- State: `globalFilter`, `filters`, `sorting`, `pagination`, `columnOrder`, `columnVisibility`
- Handlers: `handleGlobalFilterChange`, `applyFilters`, `setSort`, `setPageSize`, `setPageIndex`, `setColumnOrder`, `toggleColumnVisibility`

### Component Slots Pattern

The `DataTable` component supports a "component slots" pattern for customization. Consumers can override default implementations by passing custom components via the `components` prop:

- `Toolbar`: Search bar, filters toggle, column visibility, export buttons
- `Pagination`: Page navigation controls
- `FilterBuilder`: Multi-filter UI builder
- `Skeleton`: Loading state component

All custom components receive a `table` prop containing the `useDataTable` instance, providing full access to state and handlers.

### State Management Strategy

**Persistent State** (survives page refreshes via localStorage):
- `globalFilter`, `filters`, `sorting`, `pageSize`, `columnOrder`, `columnVisibility`, `columnWidths`

**Session State** (resets on page refresh):
- `pageIndex` (always resets to first page)

**Controlled vs Uncontrolled**:
- The hook uses `useControlledOrInternalState` helper to seamlessly switch between controlled and uncontrolled modes
- When `state` prop is provided with a specific key (e.g., `state.sorting`), that piece of state becomes controlled
- Partial control is supported - you can control only specific parts of the state

### Column Interactions

**Sorting**: Click column header to cycle through ascending → descending → none

**Resizing**: Drag the column separator. Minimum width is 80px (configurable). Widths are persisted.

**Reordering**: Drag-and-drop column headers. Disabled during resize to prevent conflicts.

All column widths are stored in localStorage with the key `datatable_columnWidths`.

### Type System

The library is fully generic with type parameter `T` representing the row data shape. Key constraints:

- `DataTable` requires `T extends { id: number | string }` for default row identification
- Use `getRowId` prop to customize row ID extraction
- `ColumnDef<T>` uses `accessorKey: keyof T` for type-safe property access
- Custom cell renderers receive `{ row: T }` parameter

## Development Notes

### Demo Application

The demo app is located in `src/demo/App.tsx` and serves as both:
1. A testing environment during development
2. A reference implementation showing all features

Run `npm run dev` to start the demo server at `http://localhost:5173`.

### Build Output

The library builds to `dist/` with dual formats:
- **ES Module**: `dist/headless-react-data-table.js`
- **UMD**: `dist/headless-react-data-table.umd.cjs`
- **TypeScript Declarations**: `dist/index.d.ts`

React and React DOM are externalized as peer dependencies.

### Key Implementation Details

**Column Order Sync**: `useDataTable` automatically syncs `columnOrder` and `columnVisibility` when the `columns` prop changes. New columns are appended, removed columns are cleaned up.

**Page Index Bounds**: An effect ensures `pageIndex` stays within valid bounds when data changes (e.g., after filtering reduces total pages).

**Resize vs Drag Conflict**: Column drag-and-drop is disabled during resize operations via the `isResizing` flag shared between hooks.

**Filter Application**: Applying filters or changing global search automatically resets to page 0.

### CSV Export

The `exportToCsv` utility in `src/lib/utils/csv.ts` handles:
- Escaping quotes and commas
- Multi-line cell values
- Empty/null values
- Automatic file download via Blob API

Pass `sortedData` from the table instance to export the current filtered/sorted view.

## Type Definitions Reference

**ColumnDef<T>**: Column configuration
- `id`: Unique identifier (required)
- `header`: Display text (required)
- `accessorKey`: Property key for data access
- `cell`: Custom render function
- `enableSorting`: Toggle sorting (default: true if accessorKey exists)

**Filter**: Advanced filter object
- `id`: Unique filter ID
- `column`: Column ID to filter
- `operator`: One of: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan'
- `value`: Filter value (string)

**DataTableState**: Complete internal state shape with all properties

**ControlledDataTableState**: Partial state for controlled mode
