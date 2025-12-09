// FIX: Import React to make the React namespace available for types.
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface UseColumnResizingProps {
  setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  minWidth?: number;
}

/**
 * A custom hook to manage the logic for resizing table columns.
 * It encapsulates state and event handlers for a smoother resizing experience.
 *
 * Fixed stale closure bug where event listeners wouldn't be properly removed,
 * causing resize to get "stuck" even after mouse release.
 *
 * @param setColumnWidths - State setter for column widths from the parent component.
 * @param minWidth - The minimum width a column can be resized to.
 * @returns An object containing the resizing state and a mouse down handler.
 */
export const useColumnResizing = ({ setColumnWidths, minWidth = 80 }: UseColumnResizingProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizingColumnRef = useRef<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Store latest callbacks in refs to avoid stale closure issues
  const handleMouseMoveCallback = useCallback((e: MouseEvent) => {
    if (!resizingColumnRef.current) return;
    const diff = e.clientX - startXRef.current;
    const newWidth = Math.max(startWidthRef.current + diff, minWidth);
    setColumnWidths(prev => ({...prev, [resizingColumnRef.current!]: newWidth}));
  }, [setColumnWidths, minWidth]);

  const handleMouseMoveRef = useRef(handleMouseMoveCallback);
  useEffect(() => {
    handleMouseMoveRef.current = handleMouseMoveCallback;
  }, [handleMouseMoveCallback]);

  // Cleanup function to stop resizing
  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Stable wrapper for mousemove - always uses latest callback from ref
  const stableMouseMove = useCallback((e: MouseEvent) => {
    handleMouseMoveRef.current(e);
  }, []);

  // Shared cleanup function to remove all event listeners
  // Uses refs to avoid circular dependencies
  const cleanupListeners = useCallback(() => {
    // Remove all event listeners from both window and document for maximum compatibility
    window.removeEventListener('mousemove', stableMouseMove);
    window.removeEventListener('mouseup', stableMouseUpRef.current);
    window.removeEventListener('mouseleave', stableMouseUpRef.current);
    window.removeEventListener('keydown', stableKeyDownRef.current);
    document.removeEventListener('mousemove', stableMouseMove);
    document.removeEventListener('mouseup', stableMouseUpRef.current);
    document.removeEventListener('keydown', stableKeyDownRef.current);
    
    // Reset resizing state
    resizingColumnRef.current = null;
    stopResizing();
  }, [stableMouseMove, stopResizing]);

  // Stable wrapper for mouseup - removes stable references (not stale ones)
  const stableMouseUp = useCallback(() => {
    cleanupListeners();
  }, [cleanupListeners]);

  // Stable wrapper for keyboard events - allows canceling resize with Escape key
  const stableKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && resizingColumnRef.current) {
      e.preventDefault();
      cleanupListeners();
    }
  }, [cleanupListeners]);

  // Store stable handlers in refs for cleanup
  const stableMouseUpRef = useRef(stableMouseUp);
  const stableKeyDownRef = useRef(stableKeyDown);
  
  useEffect(() => {
    stableMouseUpRef.current = stableMouseUp;
    stableKeyDownRef.current = stableKeyDown;
  }, [stableMouseUp, stableKeyDown]);

  // Cleanup on unmount - remove all event listeners
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', stableMouseMove);
      window.removeEventListener('mouseup', stableMouseUpRef.current);
      window.removeEventListener('mouseleave', stableMouseUpRef.current);
      window.removeEventListener('keydown', stableKeyDownRef.current);
      document.removeEventListener('mousemove', stableMouseMove);
      document.removeEventListener('mouseup', stableMouseUpRef.current);
      document.removeEventListener('keydown', stableKeyDownRef.current);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [stableMouseMove]);

  const getResizeHandler = (columnId: string, currentWidth: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizingColumnRef.current = columnId;
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    // Attach stable event handlers that never change reference
    // Use both window and document for maximum browser compatibility
    window.addEventListener('mousemove', stableMouseMove);
    window.addEventListener('mouseup', stableMouseUp);
    window.addEventListener('mouseleave', stableMouseUp); // Cancel resize if mouse leaves window
    window.addEventListener('keydown', stableKeyDown); // Allow Escape key to cancel
    
    // Document listeners as fallback for edge cases
    document.addEventListener('mousemove', stableMouseMove);
    document.addEventListener('mouseup', stableMouseUp);
    document.addEventListener('keydown', stableKeyDown);
  };

  return { isResizing, getResizeHandler };
};