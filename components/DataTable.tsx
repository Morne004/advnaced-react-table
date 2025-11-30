import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDataTable } from '../hooks/useDataTable';
import type { ColumnDef, Filter } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';
import ChevronsUpDownIcon from './icons/ChevronsUpDownIcon';
import { TableToolbar } from './TableToolbar';
import { FilterBuilder } from './FilterBuilder';
import { TablePagination } from './TablePagination';
import { useClickOutside } from '../hooks/useClickOutside';
import { useColumnResizing } from '../hooks/useColumnResizing';
import { useColumnDnd } from '../hooks/useColumnDnd';
import { usePersistentState } from '../hooks/usePersistentState';

interface DataTableProps<T extends { id: number | string }> {
  data: T[];
  columns: ColumnDef<T>[];
  enablePersistence?: boolean;
  storageKey?: string;
  disableFilterPersistence?: boolean;
}

export const DataTable = <T extends { id: number | string },>({ 
  data, 
  columns, 
  enablePersistence = true,
  storageKey = 'datatable',
  disableFilterPersistence = false 
}: DataTableProps<T>) => {
  const tableState = useDataTable({ data, columns, enablePersistence, storageKey, disableFilterPersistence });
  const {
    sorting,
    paginatedData,
    setSort,
    columnOrder,
    setColumnOrder,
    orderedAndVisibleColumns,
  } = tableState;

  const [showFilters, setShowFilters] = useState(false);
  const [stagedFilters, setStagedFilters] = useState<Filter[]>(tableState.filters);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  
  const [columnWidths, setColumnWidths] = usePersistentState<Record<string, number>>(
    `${storageKey}_columnWidths`,
    () => {
      const initialWidths: Record<string, number> = {};
      columns.forEach(c => initialWidths[c.id] = 150);
      return initialWidths;
    },
    enablePersistence
  );

  const columnDropdownRef = useRef<HTMLDivElement>(null);
  
  const { isResizing, getResizeHandler } = useColumnResizing({ setColumnWidths });
  const { draggedColumn, dropTarget, getDraggableProps } = useColumnDnd({ columnOrder, setColumnOrder, isResizing });

  useClickOutside(columnDropdownRef, () => setIsColumnDropdownOpen(false));

  // Reconcile widths when columns change
  useEffect(() => {
    setColumnWidths(currentWidths => {
      const newWidths = { ...currentWidths };
      const columnIds = new Set(columns.map(c => c.id));
      let changed = false;
      
      Object.keys(newWidths).forEach(id => {
        if (!columnIds.has(id)) {
          delete newWidths[id];
          changed = true;
        }
      });
      
      columns.forEach(col => {
        if (!(col.id in newWidths)) {
          newWidths[col.id] = 150;
          changed = true;
        }
      });

      return changed ? newWidths : currentWidths;
    });
  }, [columns, setColumnWidths]);


  useEffect(() => {
    if (isColumnDropdownOpen) {
      const firstItem = columnDropdownRef.current?.querySelector('input[type="checkbox"]');
      if (firstItem instanceof HTMLElement) {
        firstItem.focus();
      }
    }
  }, [isColumnDropdownOpen]);
  
  const hasChanges = useMemo(() => JSON.stringify(stagedFilters) !== JSON.stringify(tableState.filters), [stagedFilters, tableState.filters]);

  const totalWidth = useMemo(() => {
    return orderedAndVisibleColumns.reduce((total, col) => total + (columnWidths[col.id] || 150), 0);
  }, [orderedAndVisibleColumns, columnWidths]);

  useEffect(() => {
    setStagedFilters(tableState.filters);
  }, [tableState.filters]);

  const colgroup = useMemo(() => (
    <colgroup>
      {orderedAndVisibleColumns.map(col => (
        <col key={col.id} style={{ width: `${columnWidths[col.id]}px` }} />
      ))}
    </colgroup>
  ), [orderedAndVisibleColumns, columnWidths]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
      <TableToolbar
        tableState={tableState}
        isCondensed={isCondensed}
        setIsCondensed={setIsCondensed}
        isColumnDropdownOpen={isColumnDropdownOpen}
        setIsColumnDropdownOpen={setIsColumnDropdownOpen}
        columnDropdownRef={columnDropdownRef}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      
      {showFilters && (
        <FilterBuilder
          stagedFilters={stagedFilters}
          setStagedFilters={setStagedFilters}
          filters={tableState.filters}
          hasChanges={hasChanges}
          allColumns={tableState.allColumns}
          applyFilters={tableState.applyFilters}
        />
      )}
      
      {/* Table Container */}
      <div className='relative mt-4 overflow-x-auto border border-gray-200 rounded-lg'>
        <table style={{ tableLayout: 'fixed', width: `${totalWidth}px` }} className="min-w-full border-collapse">
            {colgroup}
            <thead className="bg-gray-50">
                <tr>
                {orderedAndVisibleColumns.map(col => {
                    const isBeingDragged = draggedColumn === col.id;
                    const isDropTarget = dropTarget === col.id;
                    return (
                        <th
                        key={col.id}
                        id={col.id}
                        scope="col"
                        className={`group relative sticky top-0 bg-gray-50 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider transition-colors z-10 ${isCondensed ? 'py-2' : 'py-3'} ${isDropTarget ? 'bg-blue-100' : ''}`}
                        {...getDraggableProps(col.id)}
                        >
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => col.enableSorting !== false && col.accessorKey && setSort(col.accessorKey)}
                                className={`flex items-center justify-between w-full text-left transition-opacity ${isBeingDragged ? 'opacity-50' : 'opacity-100'} ${(col.enableSorting !== false && col.accessorKey) ? 'hover:text-gray-900 cursor-pointer' : 'cursor-default'}`}
                                disabled={col.enableSorting === false || !col.accessorKey || isResizing}
                                title={!isResizing ? "Drag to reorder" : undefined}
                            >
                            <span>{col.header}</span>
                            <span className="ml-1 flex-shrink-0">
                                {(() => {
                                    if (col.enableSorting !== false && col.accessorKey) {
                                        if (sorting && sorting.key === col.accessorKey) {
                                            return sorting.direction === 'ascending'
                                                ? <ChevronUpIcon className="w-3.5 h-3.5" />
                                                : <ChevronDownIcon className="w-3.5 h-3.5" />;
                                        }
                                        return <ChevronsUpDownIcon className="w-3.5 h-3.5 text-gray-400" />;
                                    }
                                    return null;
                                })()}
                            </span>
                            </button>
                            <div
                                onMouseDown={getResizeHandler(col.id, columnWidths[col.id])}
                                className="absolute top-0 right-0 h-full w-2 cursor-col-resize opacity-0 group-hover:opacity-100 bg-blue-300 z-20"
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
            <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map(row => (
                <tr 
                    key={row.id}
                    className="group transition-colors hover:bg-gray-50"
                >
                    {orderedAndVisibleColumns.map(col => (
                    <td key={col.id} className={`px-6 whitespace-nowrap text-sm text-gray-800 overflow-hidden text-ellipsis ${isCondensed ? 'py-2' : 'py-4'}`}>
                         {col.cell ? col.cell({ row }) : col.accessorKey ? String(row[col.accessorKey]) : null}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      <TablePagination tableState={tableState} />
    </div>
  );
};
