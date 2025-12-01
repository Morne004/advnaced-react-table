# Clear Old localStorage Keys

## The Problem
Before the fix, the table library was creating filter keys even with `disableFilterPersistence={true}`.
These old keys won't automatically disappear - you need to manually remove them.

## Solution: Add this utility to your application

```typescript
// utils/clearOldTableStorage.ts

/**
 * Clears old filter storage keys created by the table library before the fix.
 * Run this once after updating to the fixed version.
 */
export function clearOldTableFilterStorage(storageKey: string) {
  const keysToRemove = [
    `${storageKey}_filters`,           // Custom storage key version
    'datatable_filters',               // Default version
  ];

  keysToRemove.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`🧹 Removing old table filter key: ${key}`);
      localStorage.removeItem(key);
    }
  });
}

// Usage in your app initialization:
clearOldTableFilterStorage('_matched_Engen');
```

## Or manually in browser console:

```javascript
// Remove specific keys
localStorage.removeItem('_matched_Engen_filters');
localStorage.removeItem('datatable_filters');

// Or clear ALL localStorage (nuclear option)
localStorage.clear();
```

## Verify it's working:

After clearing and restarting:

1. Open DevTools → Application → Local Storage
2. You should see:
   - ✅ `_matched_Engen_columnOrder` (table library)
   - ✅ `_matched_Engen_columnVisibility` (table library)
   - ✅ `_matched_Engen_columnWidths` (table library)
   - ✅ `b4i_fms_filter_state__matched_Engen` (your FilterStorageService)
   - ❌ NO `_matched_Engen_filters` (should not be created anymore)

3. Add some filters using your FilterStorageService
4. Refresh the page
5. The `_matched_Engen_filters` key should NOT reappear
