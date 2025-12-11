# Headless React Data Table Documentation

Welcome to the complete documentation for **@morne004/headless-react-data-table** - a lightweight, powerful, and fully headless data table library for React.

## What is Headless React Data Table?

A headless UI library that provides all the logic, state management, and functionality needed for feature-rich data grids while leaving rendering and styling completely up to you. Build beautiful, custom data tables without reinventing the wheel.

**Version:** 1.3.4
**License:** MIT
**React Support:** 18.x, 19.x

## Key Features

- **Fully Headless** - Complete control over rendering and styling
- **TypeScript First** - Full type safety with generics
- **Global Search** - Search across all columns instantly
- **Advanced Filtering** - Multi-column filters with 6 operators
- **Sorting** - Single-column sort with ascending/descending/none states
- **Pagination** - Client-side and server-side support
- **Column Management** - Reorder, resize, and toggle visibility
- **Row Selection** - Single and multi-select with bulk actions
- **State Persistence** - Automatic localStorage integration
- **CSV Export** - Export filtered/sorted data
- **Component Slots** - Replace default UI components
- **Zero Dependencies** - Only React as peer dependency

---

## Quick Navigation

### I want to...

| Goal | Documentation |
|------|---------------|
| **Get started quickly** | [Quick Start Guide](./quick-start.md) |
| **Install the package** | [Installation Guide](./installation.md) |
| **See all available props and methods** | [API Reference](./api-reference.md) |
| **Learn about all features** | [Features Overview](./features-overview.md) |
| **Customize the look and feel** | [Customization Guide](./customization-guide.md) |
| **Use with TypeScript** | [TypeScript Guide](./typescript-guide.md) |
| **See practical examples** | [Examples Index](./examples/README.md) |
| **Fix an issue** | [Troubleshooting](./troubleshooting.md) |
| **Migrate from another library** | [Migration Guide](./migration-guide.md) |

---

## Documentation Structure

### Getting Started
- **[Installation](./installation.md)** - Install from GitHub Packages, setup authentication
- **[Quick Start](./quick-start.md)** - Get a table running in 5 minutes

### Core Documentation
- **[API Reference](./api-reference.md)** - Complete API documentation
  - DataTable component props
  - useDataTable hook
  - TypeScript types
  - Utility functions
- **[Features Overview](./features-overview.md)** - All features with code examples
  - Global search
  - Advanced filtering (6 operators)
  - Sorting
  - Pagination
  - Column visibility, reordering, resizing
  - Row selection
  - CSV export
  - State persistence

### Guides
- **[Customization Guide](./customization-guide.md)** - Style and customize your tables
  - Three levels of customization
  - Component slots pattern
  - Tailwind CSS examples
  - Responsive design
  - Dark mode
- **[TypeScript Guide](./typescript-guide.md)** - Type-safe table implementation
  - Generic types
  - Type-safe columns
  - Custom cell renderers
  - Type inference

### Examples
- **[Examples Index](./examples/README.md)** - All examples organized by difficulty
- **[Basic Usage](./examples/basic-usage.md)** - Minimal setup and basic features
- **[Custom Styling](./examples/custom-styling.md)** - Tailwind CSS styling patterns
- **[Custom Components](./examples/custom-components.md)** - Replace default UI components
- **[Server-Side Data](./examples/server-side-data.md)** - Pagination and filtering with APIs
- **[Advanced Features](./examples/advanced-features.md)** - Row selection, CSV export, state management

### Support
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions
- **[Migration Guide](./migration-guide.md)** - Migrate from TanStack Table and others

---

## Popular Pages

**Most Visited:**
1. [Quick Start Guide](./quick-start.md) - Get up and running fast
2. [API Reference](./api-reference.md) - Complete prop and method reference
3. [Custom Styling Example](./examples/custom-styling.md) - Tailwind CSS patterns
4. [Server-Side Data Example](./examples/server-side-data.md) - API integration

**Most Helpful:**
- [Troubleshooting Guide](./troubleshooting.md) - Solutions to common problems
- [TypeScript Guide](./typescript-guide.md) - Type safety patterns
- [Customization Guide](./customization-guide.md) - Making it your own

---

## Learning Path

### Beginner
1. Read [Installation Guide](./installation.md)
2. Follow [Quick Start](./quick-start.md)
3. Try [Basic Usage Example](./examples/basic-usage.md)
4. Explore [Features Overview](./features-overview.md)

### Intermediate
1. Study [Customization Guide](./customization-guide.md)
2. Try [Custom Styling Example](./examples/custom-styling.md)
3. Learn [TypeScript patterns](./typescript-guide.md)
4. Explore [Custom Components Example](./examples/custom-components.md)

### Advanced
1. Implement [Server-Side Data](./examples/server-side-data.md)
2. Master [Advanced Features](./examples/advanced-features.md)
3. Build custom solutions with [useDataTable hook](./api-reference.md#usedatatable-hook)
4. Optimize with [Performance Tips](./troubleshooting.md#performance-issues)

---

## Quick Example

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const columns: ColumnDef<User>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'status', accessorKey: 'status', header: 'Status' },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
];

function App() {
  return <DataTable data={data} columns={columns} />;
}
```

See the [Quick Start Guide](./quick-start.md) for more details.

---

## Version Compatibility

| Package Version | React Version | TypeScript Version |
|----------------|---------------|-------------------|
| 1.3.x | 18.x, 19.x | 5.x |

---

## Support & Community

- **Issues:** [GitHub Issues](https://github.com/Morne004/advnaced-react-table/issues)
- **Repository:** [GitHub Repository](https://github.com/Morne004/advnaced-react-table)
- **NPM Package:** [@morne004/headless-react-data-table](https://github.com/Morne004/advnaced-react-table/packages)

---

## Contributing

Contributions are welcome! Please see the repository's contributing guidelines.

---

## License

MIT License - see LICENSE file for details.

---

**Next Steps:**
- New to the library? Start with the [Quick Start Guide](./quick-start.md)
- Need to install? See [Installation Guide](./installation.md)
- Want to see examples? Browse the [Examples](./examples/README.md)
