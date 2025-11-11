import { useState, DragEvent } from 'react';

interface UseColumnDndProps {
  columnOrder: string[];
  setColumnOrder: (newOrder: string[] | ((prev: string[]) => string[])) => void;
  isResizing: boolean;
}

/**
 * A custom hook to manage the logic for reordering table columns via drag-and-drop.
 * It encapsulates all related state and event handlers.
 * @param columnOrder - The current order of columns.
 * @param setColumnOrder - State setter for column order.
 * @param isResizing - A boolean to disable drag-and-drop while resizing.
 * @returns An object containing DnD state and event handlers.
 */
export const useColumnDnd = ({ setColumnOrder, isResizing }: UseColumnDndProps) => {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent<HTMLTableHeaderCellElement>, columnId: string) => {
    if (isResizing) return;
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);
  };

  const handleDragOver = (e: DragEvent<HTMLTableHeaderCellElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLTableHeaderCellElement>, columnId: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== columnId) {
      setDropTarget(columnId);
    }
  };

  const handleDrop = (_e: DragEvent<HTMLTableHeaderCellElement>, targetColumnId: string) => {
    if (!draggedColumn) return;

    setColumnOrder(currentOrder => {
      const newOrder = [...currentOrder];
      const sourceIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(targetColumnId);
  
      if (sourceIndex > -1 && targetIndex > -1) {
        const [movedColumn] = newOrder.splice(sourceIndex, 1);
        newOrder.splice(targetIndex, 0, movedColumn);
        return newOrder;
      }
      return currentOrder;
    });

    setDraggedColumn(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDropTarget(null);
  };

  return {
    draggedColumn,
    dropTarget,
    getDraggableProps: (columnId: string) => ({
      draggable: !isResizing,
      onDragStart: (e: DragEvent<HTMLTableHeaderCellElement>) => handleDragStart(e, columnId),
      onDragOver: handleDragOver,
      onDragEnter: (e: DragEvent<HTMLTableHeaderCellElement>) => handleDragEnter(e, columnId),
      onDrop: (e: DragEvent<HTMLTableHeaderCellElement>) => handleDrop(e, columnId),
      onDragEnd: handleDragEnd,
      'aria-grabbed': draggedColumn === columnId,
    }),
  };
};