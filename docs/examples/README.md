# Examples

Practical, copy-paste-ready examples for **@morne004/headless-react-data-table**.

---

## Quick Navigation

| Example | Difficulty | Description |
|---------|-----------|-------------|
| [Basic Usage](#basic-usage) | Beginner | Simple table with TypeScript |
| [Custom Styling](#custom-styling) | Beginner | Tailwind CSS styling patterns |
| [Custom Components](#custom-components) | Intermediate | Replace default UI components |
| [Server-Side Data](#server-side-data) | Intermediate | API integration with pagination/filtering |
| [Advanced Features](#advanced-features) | Advanced | Row selection, CSV export, state management |

---

## Basic Usage

**File:** [basic-usage.md](./basic-usage.md)

Learn the fundamentals of using the DataTable component.

**What you'll learn:**
- Define columns with TypeScript
- Basic and custom cell renderers
- Currency, date, and status badge formatting
- Initial state configuration
- Loading and empty states

**Prerequisites:**
- Basic React knowledge
- TypeScript basics

**Difficulty:** 🟢 Beginner

[View Example →](./basic-usage.md)

---

## Custom Styling

**File:** [custom-styling.md](./custom-styling.md)

Style your tables with Tailwind CSS to match your design system.

**What you'll learn:**
- Complete Tailwind CSS implementation
- Custom toolbar styling
- Custom pagination styling
- Custom filter builder styling
- Responsive design patterns
- Dark mode implementation
- Loading skeleton customization

**Prerequisites:**
- Tailwind CSS installed in your project
- Basic Tailwind knowledge

**Difficulty:** 🟢 Beginner

[View Example →](./custom-styling.md)

---

## Custom Components

**File:** [custom-components.md](./custom-components.md)

Replace default UI components with your own implementations.

**What you'll learn:**
- Component slots pattern
- Building custom Toolbar
- Building custom Pagination
- Building custom FilterBuilder
- Building custom Skeleton
- TypeScript typing for custom components
- Accessing table instance

**Prerequisites:**
- Understanding of React components
- TypeScript knowledge

**Difficulty:** 🟡 Intermediate

[View Example →](./custom-components.md)

---

## Server-Side Data

**File:** [server-side-data.md](./server-side-data.md)

Integrate with backend APIs for large datasets.

**What you'll learn:**
- Server-side pagination
- Server-side filtering
- Server-side sorting
- Loading states
- Error handling
- React Query integration
- Plain fetch implementation
- Vite + Express API example

**Prerequisites:**
- Understanding of async/await
- Basic API knowledge
- Optional: React Query experience

**Difficulty:** 🟡 Intermediate

[View Example →](./server-side-data.md)

---

## Advanced Features

**File:** [advanced-features.md](./advanced-features.md)

Master advanced table functionality.

**What you'll learn:**
- **Row Selection**
  - Single and multi-select
  - Bulk actions
  - Select all functionality
- **CSV Export**
  - Export filtered/sorted data
  - Custom filenames
- **Controlled State**
  - Full state control
  - Partial state control
  - URL synchronization
- **State Persistence**
  - Custom storage keys
  - Disable persistence
- **Loading & Empty States**
  - Custom loading skeletons
  - Custom empty messages

**Prerequisites:**
- Comfortable with React hooks
- TypeScript knowledge
- Understanding of controlled components

**Difficulty:** 🔴 Advanced

[View Example →](./advanced-features.md)

---

## Example Data

All examples use this sample User data type:

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

const sampleUsers: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    age: 32,
    status: 'active',
    salary: 85000,
    department: 'Engineering',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    age: 28,
    status: 'active',
    salary: 92000,
    department: 'Product',
    createdAt: '2023-03-22',
  },
  // ... more users
];
```

---

## Learning Path

### For Beginners

1. Start with [Basic Usage](./basic-usage.md)
2. Learn [Custom Styling](./custom-styling.md)
3. Explore other guides as needed

### For Intermediate Developers

1. Review [Basic Usage](./basic-usage.md) quickly
2. Study [Custom Components](./custom-components.md)
3. Implement [Server-Side Data](./server-side-data.md)

### For Advanced Users

1. Skim basics
2. Jump to [Advanced Features](./advanced-features.md)
3. Reference [Server-Side Data](./server-side-data.md) for API patterns

---

## Code Sandbox Links

Each example includes a link to a live CodeSandbox where you can:
- See the code running live
- Experiment with modifications
- Fork to create your own version

---

## Running Examples Locally

All examples can be run in your own project:

1. **Install the package:**
   ```bash
   npm install @morne004/headless-react-data-table
   ```

2. **Copy the example code**

3. **Install additional dependencies if needed:**
   - Tailwind CSS (for styling examples)
   - React Query (for server-side examples)

4. **Run your development server:**
   ```bash
   npm run dev
   ```

---

## Need Help?

- **Can't find what you're looking for?** Check the [API Reference](../api-reference.md)
- **Having issues?** See [Troubleshooting](../troubleshooting.md)
- **Need TypeScript help?** Read the [TypeScript Guide](../typescript-guide.md)
- **Want to customize?** See [Customization Guide](../customization-guide.md)

---

## Contributing Examples

Have a great example to share? We'd love to see it!

1. Create your example following the existing format
2. Test it thoroughly
3. Submit a pull request to the repository

---

## Next Steps

Choose an example to start:

- 🟢 **[Basic Usage](./basic-usage.md)** - Start here if you're new
- 🟢 **[Custom Styling](./custom-styling.md)** - Make it look great
- 🟡 **[Custom Components](./custom-components.md)** - Build custom UI
- 🟡 **[Server-Side Data](./server-side-data.md)** - Handle large datasets
- 🔴 **[Advanced Features](./advanced-features.md)** - Master the library

Happy coding! 🚀
