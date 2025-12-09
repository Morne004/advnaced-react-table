# Test: disableFilterPersistence Fix

## Test Case: Verify filter persistence is disabled

### Setup
```typescript
import { DataTable } from '@your-scope/advanced-react-table';

<DataTable
  data={mockData}
  columns={mockColumns}
  storageKey="_matched_Engen"
  disableFilterPersistence={true}
/>
```

### Expected Behavior

#### ✅ What SHOULD be created in localStorage:
- `_matched_Engen_globalFilter` (global search)
- `_matched_Engen_sorting` (sort state)
- `_matched_Engen_pageSize` (page size)
- `_matched_Engen_columnOrder` (column order)
- `_matched_Engen_columnVisibility` (column visibility)
- `_matched_Engen_columnWidths` (column widths)
- `_matched_Engen_isCondensed` (density)
- `_matched_Engen_rowSelection` (selected rows)

#### ❌ What should NOT be created:
- `_matched_Engen_filters` (advanced filters - DISABLED)

### Test Steps

1. **Clear localStorage**
   ```javascript
   localStorage.clear();
   ```

2. **Load the page with DataTable**
   - The table should render normally
   - No `_matched_Engen_filters` key should exist

3. **Add an advanced filter**
   - Click "Add Filter"
   - Select column: "Supplier Name"
   - Operator: "equals"
   - Value: "Engen"
   - Click "Apply"

4. **Check localStorage**
   ```javascript
   console.log('Filter key exists?', localStorage.getItem('_matched_Engen_filters'));
   // Should be: null
   ```

5. **Refresh the page**
   - The filter should NOT persist (because disableFilterPersistence={true})
   - Your FilterStorageService should handle filter persistence separately

6. **Verify other state persists**
   - Resize a column → refresh → width should persist ✅
   - Hide a column → refresh → visibility should persist ✅
   - Reorder columns → refresh → order should persist ✅

### Debug: If filters are still being saved

Add console logs to verify props are passed correctly:

```typescript
// In your component
console.log('🔍 DataTable Props:', {
  storageKey: '_matched_Engen',
  disableFilterPersistence: true
});

// In useDataTable.ts (line 71)
console.log('🔍 Filter persistence enabled?', !disablePersistence && !disableFilterPersistence);
// Should log: false

// In usePersistentState.ts (line 39-41)
console.log('🔍 Writing to localStorage?', {
  key,
  enablePersistence,
  willWrite: enablePersistence
});
```

### Common Issues

**Issue 1: Old build of library**
- Solution: Rebuild the library and reinstall in your app
- See: BUILD_INSTRUCTIONS.md

**Issue 2: Old localStorage keys from before the fix**
- Solution: Clear old keys manually
- See: CLEAR_OLD_STORAGE.md

**Issue 3: Using wrong prop name**
- ❌ `disablePersistence={true}` - Disables ALL persistence
- ✅ `disableFilterPersistence={true}` - Disables ONLY filter persistence

### Success Criteria

✅ `_matched_Engen_filters` key is never created in localStorage
✅ Column state (order, visibility, widths) still persists correctly
✅ Your FilterStorageService handles filter persistence independently
✅ No interference between table library and your custom filter management
