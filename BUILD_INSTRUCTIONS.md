# Build and Update Instructions

## After making changes to the library:

### Option 1: If using npm link
```bash
# In this library directory
npm run build

# In your application directory
npm link @your-scope/advanced-react-table
# or just restart your dev server
```

### Option 2: If using local path in package.json
```bash
# In this library directory
npm run build

# In your application directory
rm -rf node_modules/@your-scope/advanced-react-table
npm install
# or
npm install --force
```

### Option 3: If published to npm
```bash
# In this library directory
npm run build
npm version patch
npm publish

# In your application directory
npm update @your-scope/advanced-react-table
```

## Verify the fix is working:

1. Clear localStorage in your browser
2. Restart your dev server
3. Open your app with the DataTable
4. Check localStorage - you should see:
   - ✅ `_matched_Engen_columnOrder`
   - ✅ `_matched_Engen_columnVisibility`
   - ✅ `_matched_Engen_columnWidths`
   - ✅ `b4i_fms_filter_state__matched_Engen` (from your FilterStorageService)
   - ❌ NO `_matched_Engen_filters` (should not exist with disableFilterPersistence={true})

## Debug if still not working:

Add this to your DataTable usage to verify props are being passed:

```typescript
console.log('DataTable props:', {
  disableFilterPersistence: true,
  storageKey: '_matched_Engen'
});

<DataTable
  data={data}
  columns={columns}
  storageKey="_matched_Engen"
  disableFilterPersistence={true}
/>
```
