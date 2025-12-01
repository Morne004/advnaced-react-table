import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDataTable } from '../hooks/useDataTable';
import type { DataTableProps } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';
import { useColumnResizing } from '../hooks/useColumnResizing';
import { useColumnDnd } from '../hooks/useColumnDnd';
import { TableToolbar } from './TableToolbar';
import { FilterBuilder } from './FilterBuilder';
import { TablePagination } from './TablePagination';
import { TableSkeleton } from './TableSkeleton';

// Generic type constraint for data with an id
type DataWithId = { id: number | string };

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
    enableRowSelection = false
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
      
      <div>
        <table {...tableProps}>
            {colgroup}
            <thead>
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
                      onChange={toggleAllRows}
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {orderedAndVisibleColumns.map(col => {
                    const isBeingDragged = draggedColumn === col.id;
                    const isDropTarget = dropTarget === col.id;
                    return (
                        <th
                        key={col.id}
                        id={col.id}
                        scope="col"
                        style={{
                            opacity: isBeingDragged ? 0.5 : 1,
                            backgroundColor: isDropTarget ? 'rgba(59, 130, 246, 0.1)' : undefined
                        }}
                        {...getDraggableProps(col.id)}
                        >
                        <div>
                            <button
                                onClick={() => col.enableSorting !== false && col.accessorKey && setSort(col.accessorKey)}
                                disabled={col.enableSorting === false || !col.accessorKey || isResizing}
                                title={!isResizing ? "Drag to reorder or click to sort" : undefined}
                            >
                            <span>{col.header}</span>
                            <span>
                                {(() => {
                                    if (col.enableSorting !== false && col.accessorKey) {
                                        if (sorting && sorting.key === col.accessorKey) {
                                            return sorting.direction === 'ascending' ? ' ▲' : ' ▼';
                                        }
                                        return ' ↕';
                                    }
                                    return null;
                                })()}
                            </span>
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
                    )
                })}
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
                    paginatedData.map(row => {
                      const rowId = String(getRowId(row));
                      const isSelected = enableRowSelection && rowSelection[rowId];
                      return (
                        <tr key={rowId} style={{ backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : undefined }}>
                          {enableRowSelection && (
                            <td style={{ width: '50px', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={() => toggleRowSelection(rowId)}
                                aria-label={`Select row ${rowId}`}
                              />
                            </td>
                          )}
                          {orderedAndVisibleColumns.map(col => (
                            <td key={col.id}>
                              {col.cell ? col.cell({ row }) : col.accessorKey ? String(row[col.accessorKey]) : null}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                )}
            </tbody>
        </table>
      </div>
      
      {!isLoading && paginatedData.length > 0 && <Pagination table={table} />}
    </div>
  );
};