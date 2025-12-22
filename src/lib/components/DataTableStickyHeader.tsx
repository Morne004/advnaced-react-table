import React, { memo } from 'react';
import type { ColumnDef, StickyHeaderStyle } from '../types';

interface StickyRect {
  top: number;
  left: number;
  width: number;
}

interface DataTableStickyHeaderProps<T> {
  showStickyHeader: boolean;
  stickyRect: StickyRect;
  orderedAndVisibleColumns: ColumnDef<T>[];
  enableRowSelection: boolean;
  allRowsSelected: boolean;
  someRowsSelected: boolean;
  handleToggleAllRows: () => void;
  stickyHeaderContainerRef: React.RefObject<HTMLDivElement>;
  stickyHeaderContentRef: React.RefObject<HTMLDivElement>;
  sorting: any;
  draggedColumn: string | null;
  dropTarget: string | null;
  isResizing: boolean;
  columnWidths: Record<string, number>;
  getDraggableProps: (id: string) => any;
  getResizeHandler: (id: string, width: number) => any;
  handleSort: (col: ColumnDef<T>) => void;
  stickyHeaderStyle?: StickyHeaderStyle;
}

export const DataTableStickyHeader = memo(function DataTableStickyHeader<T>({
  showStickyHeader,
  stickyRect,
  orderedAndVisibleColumns,
  enableRowSelection,
  allRowsSelected,
  someRowsSelected,
  handleToggleAllRows,
  stickyHeaderContainerRef,
  stickyHeaderContentRef,
  sorting,
  draggedColumn,
  dropTarget,
  isResizing,
  columnWidths,
  getDraggableProps,
  getResizeHandler,
  handleSort,
  stickyHeaderStyle,
}: DataTableStickyHeaderProps<T>) {
  if (!showStickyHeader) return null;

  const getSortIcon = (col: ColumnDef<T>) => {
    if (col.enableSorting !== false && col.accessorKey) {
      if (sorting && sorting.key === col.accessorKey) {
        return sorting.direction === 'ascending' ? ' ▲' : ' ▼';
      }
      return ' ↕';
    }
    return null;
  };

  return (
    <div
      ref={stickyHeaderContainerRef}
      style={{
        position: 'fixed',
        top: `${stickyRect.top}px`,
        left: `${stickyRect.left}px`,
        width: `${stickyRect.width}px`,
        zIndex: 50,
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        ...stickyHeaderStyle?.containerStyle,
      }}
    >
      <div
        ref={stickyHeaderContentRef}
        style={{
          willChange: 'transform',
        }}
      >
        <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {enableRowSelection && (
                <th style={{ width: '50px', textAlign: 'center', padding: '0.75rem 1.5rem', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
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
                      backgroundColor: isDropTarget ? 'rgba(59, 130, 246, 0.1)' : '#f9fafb',
                      padding: '0.75rem 1.5rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      color: '#4b5563',
                      borderBottom: '1px solid #e5e7eb',
                      position: 'relative',
                      ...stickyHeaderStyle?.headerCellStyle,
                    }}
                    {...getDraggableProps(col.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <button
                        onClick={() => handleSort(col)}
                        disabled={col.enableSorting === false || !col.accessorKey || isResizing}
                        title={!isResizing ? "Drag to reorder or click to sort" : undefined}
                        style={{
                          all: 'unset',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: (col.enableSorting !== false && col.accessorKey) ? 'pointer' : 'default',
                          width: '100%',
                        }}
                      >
                        <span style={{ ...stickyHeaderStyle?.headerTextStyle }}>{col.header}</span>
                        <span style={{ marginLeft: '0.25rem' }}>{getSortIcon(col)}</span>
                      </button>
                      <div
                        onMouseDown={getResizeHandler(col.id, columnWidths[col.id])}
                        role="separator"
                        aria-orientation="vertical"
                        aria-controls={col.id}
                        aria-label={`Resize column ${col.header}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          height: '100%',
                          width: '0.5rem',
                          cursor: 'col-resize',
                          zIndex: 10,
                        }}
                      />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}) as <T>(props: DataTableStickyHeaderProps<T>) => JSX.Element | null;
