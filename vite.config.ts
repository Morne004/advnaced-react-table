import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      // FIX: `__dirname` is not available in an ES module context by default.
      // `path.resolve` will resolve from the current working directory, which is
      // the project root when running Vite.
      entry: resolve('src/lib/index.ts'),
      name: 'HeadlessReactDataTable',
      formats: ['es', 'umd'],
      fileName: (format) => `headless-react-data-table.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
