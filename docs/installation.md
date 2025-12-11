# Installation Guide

This guide will walk you through installing **@morne004/headless-react-data-table** from GitHub Packages and setting up your development environment.

---

## Prerequisites

Before installing, ensure you have:

- **Node.js** 16.x or higher
- **npm** 7.x or higher (or yarn/pnpm equivalent)
- **React** 18.x or 19.x in your project

---

## Installation Steps

### Step 1: GitHub Packages Authentication

Since this package is published to GitHub Packages (not npm), you need to authenticate with GitHub.

#### Create a Personal Access Token (PAT)

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "npm packages")
4. Select the `read:packages` scope
5. Click "Generate token"
6. **Copy the token** (you won't be able to see it again)

#### Configure npm to Use GitHub Packages

Create or edit `.npmrc` in your project root (or your home directory `~/.npmrc` for global config):

```bash
# .npmrc
@morne004:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Replace `YOUR_GITHUB_TOKEN` with the token you created.

> **Security Note:** Never commit `.npmrc` with your token to version control. Add `.npmrc` to your `.gitignore` file.

---

### Step 2: Install the Package

#### Using npm

```bash
npm install @morne004/headless-react-data-table
```

#### Using yarn

```bash
yarn add @morne004/headless-react-data-table
```

#### Using pnpm

```bash
pnpm add @morne004/headless-react-data-table
```

---

### Step 3: Verify Installation

Check that the package was installed successfully:

```bash
npm list @morne004/headless-react-data-table
```

You should see:

```
your-project@1.0.0
└── @morne004/headless-react-data-table@1.3.4
```

---

## Peer Dependencies

The library requires React as a peer dependency. If you haven't already installed React:

```bash
npm install react react-dom
```

**Supported React Versions:**
- React 18.x ✅
- React 19.x ✅

---

## Package Information

| Property | Value |
|----------|-------|
| **Package Name** | `@morne004/headless-react-data-table` |
| **Current Version** | 1.3.4 |
| **Bundle Size** | ~15KB (minified + gzipped) |
| **License** | MIT |
| **TypeScript** | Included ✅ |
| **Dependencies** | None (React as peer dependency only) |

---

## TypeScript Configuration

The package includes TypeScript declarations out of the box. No additional setup is required.

If you're using TypeScript, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "jsx": "react-jsx"
  }
}
```

---

## Import the Package

Once installed, you can import components and types:

```tsx
// Import the main DataTable component
import { DataTable } from '@morne004/headless-react-data-table';

// Import the headless hook
import { useDataTable } from '@morne004/headless-react-data-table';

// Import TypeScript types
import type { ColumnDef, Filter, DataTableState } from '@morne004/headless-react-data-table';

// Import utilities
import { exportToCsv } from '@morne004/headless-react-data-table';
```

---

## Vite Configuration

If you're using Vite (recommended for React projects), no additional configuration is needed. The package works out of the box.

**Example `vite.config.ts`:**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

---

## Next.js Configuration

For Next.js projects, the package works with both App Router and Pages Router.

**Next.js 13+ (App Router):**

The package uses client-side React hooks, so you'll need to mark components as client components:

```tsx
'use client';

import { DataTable } from '@morne004/headless-react-data-table';
// ... rest of your code
```

**Next.js 12 (Pages Router):**

No special configuration needed - import and use normally.

---

## Troubleshooting Installation

### Issue: Authentication Error (401)

**Error Message:**
```
npm ERR! 401 Unauthorized - GET https://npm.pkg.github.com/@morne004/headless-react-data-table
```

**Solutions:**
1. Verify your `.npmrc` file contains the correct auth token
2. Check that your PAT has the `read:packages` scope
3. Ensure the token hasn't expired
4. Try regenerating your GitHub token

---

### Issue: Package Not Found (404)

**Error Message:**
```
npm ERR! 404 Not Found - GET https://npm.pkg.github.com/@morne004/headless-react-data-table
```

**Solutions:**
1. Verify the package name is correct: `@morne004/headless-react-data-table`
2. Check your `.npmrc` has the correct registry:
   ```
   @morne004:registry=https://npm.pkg.github.com
   ```
3. Ensure you're authenticated with GitHub Packages

---

### Issue: Module Not Found After Installation

**Error Message:**
```
Module not found: Can't resolve '@morne004/headless-react-data-table'
```

**Solutions:**
1. Verify the package was installed: `npm list @morne004/headless-react-data-table`
2. Try deleting `node_modules` and `package-lock.json`, then reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check your import path is correct
4. Restart your development server

---

### Issue: TypeScript Errors

**Error Message:**
```
Could not find a declaration file for module '@morne004/headless-react-data-table'
```

**Solutions:**
1. The package includes TypeScript declarations - this shouldn't happen
2. Try deleting `node_modules` and reinstalling
3. Check your `tsconfig.json` has `"moduleResolution": "node"`
4. Restart your TypeScript server (VS Code: `Cmd/Ctrl + Shift + P` → "Restart TS Server")

---

### Issue: React Version Mismatch

**Error Message:**
```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! peer react@"^18.0.0 || ^19.0.0" from @morne004/headless-react-data-table@1.3.4
```

**Solutions:**
1. Upgrade React to version 18.x or higher:
   ```bash
   npm install react@^18.0.0 react-dom@^18.0.0
   ```
2. If you must use React 17, use the `--legacy-peer-deps` flag:
   ```bash
   npm install @morne004/headless-react-data-table --legacy-peer-deps
   ```
   ⚠️ **Warning:** React 17 is not officially supported and may have issues.

---

## Verifying Your Setup

Create a test file to verify everything works:

**`src/TableTest.tsx`:**

```tsx
import { DataTable } from '@morne004/headless-react-data-table';
import type { ColumnDef } from '@morne004/headless-react-data-table';

interface TestData {
  id: number;
  name: string;
}

const columns: ColumnDef<TestData>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'name', accessorKey: 'name', header: 'Name' },
];

const data: TestData[] = [
  { id: 1, name: 'Test 1' },
  { id: 2, name: 'Test 2' },
];

export default function TableTest() {
  return <DataTable data={data} columns={columns} />;
}
```

If this renders without errors, you're all set! ✅

---

## Getting Help

If you encounter issues not covered here:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Search [GitHub Issues](https://github.com/Morne004/advnaced-react-table/issues)
3. Open a new issue with:
   - Your package version
   - Node/npm version
   - Error messages
   - Minimal reproduction code

---

## Next Steps

Now that you've installed the package:

- **[Quick Start Guide](./quick-start.md)** - Build your first table in 5 minutes
- **[API Reference](./api-reference.md)** - Explore all available props and methods
- **[Examples](./examples/README.md)** - See practical implementation examples

---

**Installation Complete!** 🎉

Ready to build your first table? Head to the [Quick Start Guide](./quick-start.md).
