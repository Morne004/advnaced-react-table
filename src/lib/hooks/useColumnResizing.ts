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
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Stable wrapper for mousemove - always uses latest callback from ref
  const stableMouseMove = useCallback((e: MouseEvent) => {
    handleMouseMoveRef.current(e);
  }, []);

  // Store refs for event handlers to avoid circular dependencies
  const stableMouseUpRef = useRef<() => void>();
  const stableKeyDownRef = useRef<(e: KeyboardEvent) => void>();

  // Cleanup function to stop resizing
  const stopResizing = useCallback(() => {
    resizingColumnRef.current = null;
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Stable wrapper for mouseup - removes event listeners and resets state
  const stableMouseUp = useCallback(() => {
    // Clear safety timeout
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    
    // Remove all event listeners from both window and document with capture option
    const options = { capture: true };
    
    window.removeEventListener('mousemove', stableMouseMove, options);
    if (stableMouseUpRef.current) {
      window.removeEventListener('mouseup', stableMouseUpRef.current, options);
      document.removeEventListener('mouseup', stableMouseUpRef.current, options);
    }
    if (stableKeyDownRef.current) {
      window.removeEventListener('keydown', stableKeyDownRef.current, options);
      document.removeEventListener('keydown', stableKeyDownRef.current, options);
    }
    document.removeEventListener('mousemove', stableMouseMove, options);
    
    stopResizing();
  }, [stableMouseMove, stopResizing]);

  // Stable wrapper for keyboard events - allows canceling resize with Escape key
  const stableKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && resizingColumnRef.current) {
      e.preventDefault();
      // Call the mouseup handler to clean up
      if (stableMouseUpRef.current) {
        stableMouseUpRef.current();
      }
    }
  }, []);

  useEffect(() => {
    stableMouseUpRef.current = stableMouseUp;
    stableKeyDownRef.current = stableKeyDown;
  }, [stableMouseUp, stableKeyDown]);

  // Cleanup on unmount - remove all event listeners
  useEffect(() => {
    return () => {
      const options = { capture: true };
      
      window.removeEventListener('mousemove', stableMouseMove, options);
      if (stableMouseUpRef.current) {
        window.removeEventListener('mouseup', stableMouseUpRef.current, options);
        document.removeEventListener('mouseup', stableMouseUpRef.current, options);
      }
      if (stableKeyDownRef.current) {
        window.removeEventListener('keydown', stableKeyDownRef.current, options);
        document.removeEventListener('keydown', stableKeyDownRef.current, options);
      }
      document.removeEventListener('mousemove', stableMouseMove, options);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [stableMouseMove, stableMouseUpRef, stableKeyDownRef]);

  const getResizeHandler = (columnId: string, currentWidth: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizingColumnRef.current = columnId;
    startXRef.current = e.clientX;
    startWidthRef.current = currentWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    // Safety timeout: forcefully release resize after 1 second as a failsafe
    safetyTimeoutRef.current = setTimeout(() => {
      console.warn('Resize safety timeout triggered - forcefully releasing resize');
      if (stableMouseUpRef.current) {
        stableMouseUpRef.current();
      }
    }, 1000);
    
    // Use capture phase to ensure we catch the events before anything else
    // This is critical for catching mouseup when the mouse moves quickly
    const options = { capture: true };
    
    window.addEventListener('mousemove', stableMouseMove, options);
    window.addEventListener('mouseup', stableMouseUp, options);
    window.addEventListener('keydown', stableKeyDown, options);
    
    // Document listeners as fallback
    document.addEventListener('mousemove', stableMouseMove, options);
    document.addEventListener('mouseup', stableMouseUp, options);
    document.addEventListener('keydown', stableKeyDown, options);
  };

  return { isResizing, getResizeHandler };
};