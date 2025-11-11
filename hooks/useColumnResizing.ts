// FIX: Import React to make the React namespace available for types.
import React, { useState, useRef, useCallback } from 'react';

interface UseColumnResizingProps {
  setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  minWidth?: number;
}

/**
 * A custom hook to manage the logic for resizing table columns.
 * It encapsulates state and event handlers for a smoother resizing experience.
 * @param setColumnWidths - State setter for column widths from the parent component.
 * @param minWidth - The minimum width a column can be resized to.
 * @returns An object containing the resizing state and a mouse down handler.
 */
export const useColumnResizing = ({ setColumnWidths, minWidth = 80 }: UseColumnResizingProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizingColumnRef = useRef<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingColumnRef.current) return;
    const diff = e.clientX - startXRef.current;
    const newWidth = Math.max(startWidthRef.current + diff, minWidth);
    setColumnWidths(prev => ({...prev, [resizingColumnRef.current!]: newWidth}));
  }, [setColumnWidths, minWidth]);

  const handleMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    resizingColumnRef.current = null;
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  const getResizeHandler = (columnId: string, currentWidth: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizingColumnRef.current = columnId;
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  return { isResizing, getResizeHandler };
};
