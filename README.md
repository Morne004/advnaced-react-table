# Headless React Data Table

[![npm version](https://img.shields.io/npm/v/@morne004/headless-react-data-table.svg)](https://www.npmjs.com/package/@morne004/headless-react-data-table)
[![License](https://img.shields.io/npm/l/@morne004/headless-react-data-table.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@morne004/headless-react-data-table)](https://bundlephobia.com/package/@morne004/headless-react-data-table)

A lightweight, powerful, and fully **headless** data table library for React. Provides all the logic, state management, and functionality you need to build feature-rich data grids, while leaving rendering and styling completely in your hands.

Built with TypeScript and modern React hooks for maximum flexibility and an excellent developer experience.

**📦 [View on npm](https://www.npmjs.com/package/@morne004/headless-react-data-table) • 🐙 [GitHub](https://github.com/Morne004/advnaced-react-table) • 🐛 [Issues](https://github.com/Morne004/advnaced-react-table/issues)**

---

## 📚 Documentation

- **[FEATURES.md](./FEATURES.md)** - Complete feature catalog with detailed explanations
- **[EXAMPLES.md](./EXAMPLES.md)** - Real-world usage examples and patterns
- **[USAGE.md](./USAGE.md)** - Complete API reference and integration guide

---

## Quick Links

- [Why Choose This Library?](#why-choose-this-library)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Key Features](#key-features)
- [What's Next?](#whats-next)
- [Contributing](#contributing)
- [License](#license)

---

## Why Choose This Library?

### ✅ What You Get

- **Complete Table Logic** - Sorting, filtering, pagination, column management all handled
- **Persistent State** - User preferences auto-saved to localStorage
- **TypeScript Native** - Full type safety and IntelliSense
- **Zero Dependencies** - Only React peer dependencies
- **Small Bundle** - ~30KB minified, tree-shakeable
- **Production Ready** - Performance and reliability focused

### 🎨 What You Control

- **Your UI** - Complete control over HTML structure
- **Your Styling** - Works with Tailwind, Material-UI, styled-components, or any framework
- **Your Components** - Replace any part with custom React components

### 🆚 Comparison

| Feature | This Library | TanStack Table | From Scratch |
|---------|-------------|----------------|--------------|
| Learning Curve | Low | Medium | High |
| Bundle Size | Small (~30KB) | Medium (~100KB) | Varies |
| Built-in Persistence | ✅ Yes | ❌ No | ❌ No |
| Time to Implement | Minutes | Hours | Days |

---

## Installation

```bash
npm install @morne004/headless-react-data-table
```

Or using yarn/pnpm:

```bash
yarn add @morne004/headless-react-data-table
pnpm add @morne004/headless-react-data-table
```

**Peer Dependencies:**
- React 18.0.0+ or React 19.0.0+
- React-DOM 18.0.0+ or React 19.0.0+

---

## Quick Start

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
];

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className={row.status === 'active' ? 'text-green-600' : 'text-gray-400'}>
        {row.status}
      </span>
    ),
  },
];

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
```

That's it! The table now has:
- ✅ Sorting (click headers)
- ✅ Search (global filter)
- ✅ Pagination
- ✅ Column visibility toggle
- ✅ Persistent state in localStorage

**Style it your way:**

```tsx
// Add Tailwind CSS classes
<DataTable data={data} columns={columns} />

// Or use custom components
<DataTable
  data={data}
  columns={columns}
  components={{
    Toolbar: MyCustomToolbar,
    Pagination: MyCustomPagination,
  }}
/>
```

👉 **[See more examples in EXAMPLES.md](./EXAMPLES.md)**

---

## Key Features

### Core Functionality
- **Sorting** - Click headers to sort ascending/descending/unsorted • [Learn more →](./FEATURES.md#sorting)
- **Filtering** - Global search + advanced multi-column filters with 6 operators • [Learn more →](./FEATURES.md#filtering)
- **Pagination** - Client-side pagination with customizable page sizes • [Learn more →](./FEATURES.md#pagination)
- **Search** - Instant search across all columns • [Learn more →](./FEATURES.md#global-search)

### UI Features
- **Column Visibility** - Show/hide columns with persistence • [Learn more →](./FEATURES.md#column-visibility)
- **Column Reordering** - Drag-and-drop to reorder • [Learn more →](./FEATURES.md#column-reordering)
- **Column Resizing** - Manual width adjustment • [Learn more →](./FEATURES.md#column-resizing)
- **Condensed View** - Toggle between normal and compact density • [Learn more →](./FEATURES.md#condensed-view)

### Developer Experience
- **TypeScript** - Full type safety with generics • [Learn more →](./FEATURES.md#typescript-support)
- **Headless Architecture** - Complete UI customization • [Learn more →](./FEATURES.md#headless-architecture)
- **State Management** - Controlled and uncontrolled modes • [Learn more →](./FEATURES.md#state-management)
- **CSV Export** - Built-in export utility • [Learn more →](./FEATURES.md#csv-export)
- **Custom Cell Renderers** - Render any React component • [Learn more →](./FEATURES.md#custom-cell-renderers)
- **Component Slots** - Replace toolbar, pagination, filters, skeleton • [Learn more →](./FEATURES.md#component-slots)

👉 **[View all features with examples →](./FEATURES.md)**

---

## What's Next?

### Learn the Features

Explore all capabilities with detailed explanations:

📖 **[FEATURES.md](./FEATURES.md)** - Complete feature catalog
- Core features (sorting, filtering, pagination)
- UI features (column controls, condensed view)
- State management (persistence, controlled mode)
- Customization options

### See Real Examples

Copy-paste ready code for common use cases:

💡 **[EXAMPLES.md](./EXAMPLES.md)** - Real-world patterns
- Basic examples (minimal setup, TypeScript)
- Styled examples (Tailwind, Material-UI)
- Server-side integration (REST API, React Query)
- Framework examples (Next.js, Remix)
- Advanced patterns (editable cells, row selection, master-detail)
- Custom cell renderers (currency, dates, badges, actions)

### Read the API Docs

Complete reference for all props, hooks, and types:

📚 **[USAGE.md](./USAGE.md)** - API reference and integration guide
- Installation and setup
- Complete API reference
- TypeScript usage
- State management guide
- Performance tips
- Troubleshooting
- Migration guides

---

## Real-World Examples

### Server-Side Pagination

```tsx
const [tableState, setTableState] = useState({
  pageIndex: 0,
  pageSize: 25,
  globalFilter: '',
});

useEffect(() => {
  fetch(`/api/users?page=${tableState.pageIndex}&search=${tableState.globalFilter}`)
    .then(res => res.json())
    .then(data => setUsers(data));
}, [tableState]);

<DataTable
  data={users}
  columns={columns}
  state={tableState}
  onStateChange={setTableState}
/>
```

### React Query Integration

```tsx
const { data, isLoading } = useQuery(['users'], fetchUsers);

<DataTable
  data={data || []}
  columns={columns}
  isLoading={isLoading}
/>
```

### Custom Cell Renderers

```tsx
const columns: ColumnDef<Product>[] = [
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(row.price),
  },
];
```

👉 **[See 20+ complete examples →](./EXAMPLES.md)**

---

## Community & Support

### Get Help

- 💬 **[GitHub Discussions](https://github.com/Morne004/advnaced-react-table/discussions)** - Ask questions, share ideas
- 🐛 **[GitHub Issues](https://github.com/Morne004/advnaced-react-table/issues)** - Report bugs, request features
- 📖 **[Documentation](./FEATURES.md)** - Complete feature guide

### Stay Updated

- 📦 **[npm Package](https://www.npmjs.com/package/@morne004/headless-react-data-table)** - Latest version
- 🐙 **[GitHub Repository](https://github.com/Morne004/advnaced-react-table)** - Source code, releases
- 📝 **[Changelog](https://github.com/Morne004/advnaced-react-table/releases)** - What's new

---

## Contributing

Contributions are welcome! Here's how you can help:

### Report Issues

Found a bug or have a feature request?
1. Check [existing issues](https://github.com/Morne004/advnaced-react-table/issues)
2. Create a new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Code example if possible

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Morne004/advnaced-react-table.git
cd advnaced-react-table

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests (if available)
npm test
```

### Project Structure

```
src/
├── lib/                 # Library source code
│   ├── components/      # React components (DataTable, etc.)
│   ├── hooks/          # Custom hooks (useDataTable, etc.)
│   ├── types.ts        # TypeScript type definitions
│   ├── utils/          # Utility functions (CSV export, etc.)
│   └── index.ts        # Main entry point
└── demo/               # Demo application
    └── App.tsx         # Demo examples
```

### Guidelines

- Write clear, descriptive commit messages
- Follow existing code style
- Add TypeScript types for new features
- Update documentation for API changes
- Test your changes locally before submitting
- Be respectful and constructive in discussions

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## Changelog

See [GitHub Releases](https://github.com/Morne004/advnaced-react-table/releases) for version history and release notes.

### Recent Updates

- **v1.0.4** - Added condensed view as first-class feature
- **v1.0.3** - Fixed column resize stuck bug (stale closure issue)
- **v1.0.2** - Fixed controlled mode state loss bug
- **v1.0.1** - Added missing `exportToCsv` export, removed demo types
- **v1.0.0** - Initial release

---

## License

MIT © [Morne004](https://github.com/Morne004)

This library is free and open-source. You can use it in personal and commercial projects without restriction.

See [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

Built with:
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool

Inspired by:
- [TanStack Table](https://tanstack.com/table) - Headless UI patterns
- [Headless UI](https://headlessui.com/) - Component design philosophy

---

## Star History

If you find this library useful, please consider giving it a star on GitHub! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=Morne004/advnaced-react-table&type=Date)](https://star-history.com/#Morne004/advnaced-react-table&Date)

---

<div align="center">

**Made with ❤️ by [Morne004](https://github.com/Morne004)**

[Documentation](./FEATURES.md) • [Examples](./EXAMPLES.md) • [API Reference](./USAGE.md)

</div>
