import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { useDataTable } from '../hooks/useDataTable';
import type { DataTableProps } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';
import { useColumnResizing } from '../hooks/useColumnResizing';
import { useColumnDnd } from '../hooks/useColumnDnd';
import { useTableStickyHeader } from '../hooks/useTableStickyHeader';
import { TableToolbar } from './TableToolbar';
import { FilterBuilder } from './FilterBuilder';
import { TablePagination } from './TablePagination';
import { TableSkeleton } from './TableSkeleton';
import { DataTableStickyHeader } from './DataTableStickyHeader';

// Generic type constraint for data with an id
type DataWithId = { id: number | string };

// Memoized TableHeader component to prevent unnecessary re-renders
const TableHeader = memo(function TableHeader({
  col,
  sorting,
  draggedColumn,
  dropTarget,
  isResizing,
  columnWidths,
  getDraggableProps,
  getResizeHandler,
  onSort,
}: {
  col: any;
  sorting: any;
  draggedColumn: string | null;
  dropTarget: string | null;
  isResizing: boolean;
  columnWidths: Record<string, number>;
  getDraggableProps: (id: string) => any;
  getResizeHandler: (id: string, width: number) => any;
  onSort: (col: any) => void;
}) {
  const isBeingDragged = draggedColumn === col.id;
  const isDropTarget = dropTarget === col.id;
  
  const thStyle = useMemo(() => ({
    opacity: isBeingDragged ? 0.5 : 1,
    backgroundColor: isDropTarget ? 'rgba(59, 130, 246, 0.1)' : undefined
  }), [isBeingDragged, isDropTarget]);

  const getSortIcon = useCallback(() => {
    if (col.enableSorting !== false && col.accessorKey) {
      if (sorting && sorting.key === col.accessorKey) {
        return sorting.direction === 'ascending' ? ' ▲' : ' ▼';
      }
      return ' ↕';
    }
    return null;
  }, [col.enableSorting, col.accessorKey, sorting]);

  const handleClick = useCallback(() => {
    onSort(col);
  }, [onSort, col]);

  return (
    <th
      key={col.id}
      id={col.id}
      scope="col"
      style={thStyle}
      {...getDraggableProps(col.id)}
    >
      <div>
        <button
          onClick={handleClick}
          disabled={col.enableSorting === false || !col.accessorKey || isResizing}
          title={!isResizing ? "Drag to reorder or click to sort" : undefined}
        >
          <span>{col.header}</span>
          <span>{getSortIcon()}</span>
        </button>
        <div
          onMouseDown={getResizeHandler(col.id, columnWidths[col.id])}
          role="separator"
          aria-orientation="vertical"
          aria-controls={col.id}
          aria-label={`Resize column ${col.header}`}
        />
      </div>
    </th>
  );
});

// Memoized TableRow component to prevent unnecessary re-renders
const TableRow = memo(function TableRow<T>({
  row,
  rowId,
  columns,
  enableRowSelection,
  isSelected,
  onToggleRow,
}: {
  row: T;
  rowId: string;
  columns: any[];
  enableRowSelection: boolean;
  isSelected: boolean;
  onToggleRow: (rowId: string) => void;
}) {
  const rowStyle = useMemo(() => ({
    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : undefined
  }), [isSelected]);

  const checkboxStyle = useMemo(() => ({
    width: '50px',
    textAlign: 'center' as const
  }), []);

  const handleCheckboxChange = useCallback(() => {
    onToggleRow(rowId);
  }, [onToggleRow, rowId]);

  return (
    <tr style={rowStyle}>
      {enableRowSelection && (
        <td style={checkboxStyle}>
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={handleCheckboxChange}
            aria-label={`Select row ${rowId}`}
          />
        </td>
      )}
      {columns.map(col => (
        <TableCell key={col.id} col={col} row={row} />
      ))}
    </tr>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.rowId === nextProps.rowId &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.columns === nextProps.columns &&
    prevProps.enableRowSelection === nextProps.enableRowSelection
  );
});

// Memoized TableCell component
const TableCell = memo(function TableCell({
  col,
  row,
}: {
  col: any;
  row: any;
}) {
  const content = useMemo(() => {
    if (col.cell) {
      return col.cell({ row });
    }
    if (col.accessorKey) {
      return String(row[col.accessorKey]);
    }
    return null;
  }, [col, row]);

  return <td>{content}</td>;
}, (prevProps, nextProps) => {
  // Only re-render if the cell value actually changed
  const prevValue = prevProps.col.accessorKey ? prevProps.row[prevProps.col.accessorKey] : null;
  const nextValue = nextProps.col.accessorKey ? nextProps.row[nextProps.col.accessorKey] : null;
  return prevValue === nextValue && prevProps.col === nextProps.col;
});

export const DataTable = <T extends DataWithId>({
    data,
    columns,
    getRowId = (row) => row.id,
    isLoading = false,
    noDataMessage = 'No data available.',
    components,
    initialState,
    state: controlledState,
    onStateChange,
    manualPagination,
    manualFiltering,
    manualSorting,
    totalRowCount,
    pageCount,
    disablePersistence,
    disableFilterPersistence,
    storageKey,
    enableRowSelection = false,
    enableStickyHeader = true,
    stickyHeaderOffset = 0
}: DataTableProps<T>) => {
  
  const [showFilters, setShowFilters] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  
  const { 
    Toolbar = TableToolbar, 
    Pagination = TablePagination,
    FilterBuilder: FilterBuilderComponent = FilterBuilder,
    Skeleton = TableSkeleton,
  } = components || {};

  const table = useDataTable({
    data,
    columns,
    getRowId,
    initialState,
    state: controlledState,
    onStateChange,
    manualPagination,
    manualFiltering,
    manualSorting,
    totalRowCount,
    pageCount,
    disablePersistence,
    disableFilterPersistence,
    storageKey
  });
  const {
    sorting,
    paginatedData,
    setSort,
    columnOrder,
    setColumnOrder,
    columnWidths,
    setColumnWidths,
    orderedAndVisibleColumns,
    rowSelection,
    toggleRowSelection,
    toggleAllRows,
  } = table;
  
  const columnDropdownRef = useRef<HTMLDivElement>(null);
  const { isResizing, getResizeHandler } = useColumnResizing({ setColumnWidths });
  const { draggedColumn, dropTarget, getDraggableProps } = useColumnDnd({ columnOrder, setColumnOrder, isResizing });

  const isEmpty = paginatedData.length === 0;
  const stickyHeader = useTableStickyHeader(isEmpty || !enableStickyHeader, stickyHeaderOffset);

  useClickOutside(columnDropdownRef, () => setIsColumnDropdownOpen(false));

  // Initialize column widths for new columns
  useEffect(() => {
    setColumnWidths(currentWidths => {
      const newWidths = { ...currentWidths };
      const columnIds = new Set(columns.map(c => c.id));
      let changed = false;
      Object.keys(newWidths).forEach(id => { if (!columnIds.has(id)) { delete newWidths[id]; changed = true; }});
      columns.forEach(col => { if (!(col.id in newWidths)) { newWidths[col.id] = 150; changed = true; }});
      return changed ? newWidths : currentWidths;
    });
  }, [columns, setColumnWidths]);

  useEffect(() => {
    if (isColumnDropdownOpen) {
      const firstItem = columnDropdownRef.current?.querySelector('input[type="checkbox"]');
      if (firstItem instanceof HTMLElement) firstItem.focus();
    }
  }, [isColumnDropdownOpen]);
  
  const totalWidth = useMemo(() => {
    const columnsWidth = orderedAndVisibleColumns.reduce((total, col) => total + (columnWidths[col.id] || 150), 0);
    return enableRowSelection ? columnsWidth + 50 : columnsWidth; // Add 50px for checkbox column
  }, [orderedAndVisibleColumns, columnWidths, enableRowSelection]);

  // Check if all rows on current page are selected
  const allRowsSelected = useMemo(() => {
    if (!enableRowSelection || paginatedData.length === 0) return false;
    return paginatedData.every(row => rowSelection[String(getRowId(row))]);
  }, [enableRowSelection, paginatedData, rowSelection, getRowId]);

  // Check if some (but not all) rows are selected
  const someRowsSelected = useMemo(() => {
    if (!enableRowSelection || paginatedData.length === 0) return false;
    const selectedCount = paginatedData.filter(row => rowSelection[String(getRowId(row))]).length;
    return selectedCount > 0 && selectedCount < paginatedData.length;
  }, [enableRowSelection, paginatedData, rowSelection, getRowId]);

  const colgroup = useMemo(() => (
    <colgroup>
      {enableRowSelection && <col style={{ width: '50px' }} />}
      {orderedAndVisibleColumns.map(col => (
        <col key={col.id} style={{ width: `${columnWidths[col.id]}px` }} />
      ))}
    </colgroup>
  ), [orderedAndVisibleColumns, columnWidths, enableRowSelection]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleSort = useCallback((col: typeof orderedAndVisibleColumns[0]) => {
    if (col.enableSorting !== false && col.accessorKey && !isResizing) {
      setSort(col.accessorKey);
    }
  }, [setSort, isResizing]);

  const handleToggleAllRows = useCallback(() => {
    toggleAllRows();
  }, [toggleAllRows]);

  const handleToggleRow = useCallback((rowId: string) => {
    toggleRowSelection(rowId);
  }, [toggleRowSelection]);

  const tableToolbarProps = {
    table, isColumnDropdownOpen, setIsColumnDropdownOpen, columnDropdownRef, showFilters, setShowFilters
  };

  const tableProps = {
    style: { tableLayout: 'fixed', width: `${totalWidth}px` } as React.CSSProperties,
  };

  return (
    <div>
      <Toolbar {...tableToolbarProps} />
      {showFilters && (
        <FilterBuilderComponent table={table} showFilters={showFilters}/>
      )}
      
      <div ref={stickyHeader.mainTableContainerRef} style={{ position: 'relative', width: '100%' }}>
        <table {...tableProps}>
          {colgroup}
          <thead ref={stickyHeader.mainTableHeaderRef}>
            <tr>
              {enableRowSelection && (
                <th style={{ width: '50px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={allRowsSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = someRowsSelected;
                      }
                    }}
                    onChange={handleToggleAllRows}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {orderedAndVisibleColumns.map(col => (
                <TableHeader
                  key={col.id}
                  col={col}
                  sorting={sorting}
                  draggedColumn={draggedColumn}
                  dropTarget={dropTarget}
                  isResizing={isResizing}
                  columnWidths={columnWidths}
                  getDraggableProps={getDraggableProps}
                  getResizeHandler={getResizeHandler}
                  onSort={handleSort}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <Skeleton cols={orderedAndVisibleColumns.length} />
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={orderedAndVisibleColumns.length}>
                  {noDataMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map(row => (
                <TableRow
                  key={String(getRowId(row))}
                  row={row}
                  rowId={String(getRowId(row))}
                  columns={orderedAndVisibleColumns}
                  enableRowSelection={enableRowSelection}
                  isSelected={enableRowSelection && rowSelection[String(getRowId(row))]}
                  onToggleRow={handleToggleRow}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && paginatedData.length > 0 && <Pagination table={table} />}
      
      {enableStickyHeader && (
        <DataTableStickyHeader
          showStickyHeader={stickyHeader.showStickyHeader}
          stickyRect={stickyHeader.stickyRect}
          orderedAndVisibleColumns={orderedAndVisibleColumns}
          enableRowSelection={enableRowSelection}
          allRowsSelected={allRowsSelected}
          someRowsSelected={someRowsSelected}
          handleToggleAllRows={handleToggleAllRows}
          stickyHeaderContainerRef={stickyHeader.stickyHeaderContainerRef}
          stickyHeaderContentRef={stickyHeader.stickyHeaderContentRef}
          sorting={sorting}
          draggedColumn={draggedColumn}
          dropTarget={dropTarget}
          isResizing={isResizing}
          columnWidths={columnWidths}
          getDraggableProps={getDraggableProps}
          getResizeHandler={getResizeHandler}
          handleSort={handleSort}
        />
      )}
    </div>
  );
};