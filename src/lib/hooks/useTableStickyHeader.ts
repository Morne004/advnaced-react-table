import { useRef, useEffect, useState, useCallback } from 'react';

const STICKY_TOP_PX = 0; // Distance from top of viewport

interface StickyRect {
  top: number;
  left: number;
  width: number;
}

export const useTableStickyHeader = (isEmpty: boolean) => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [stickyRect, setStickyRect] = useState<StickyRect>({ top: STICKY_TOP_PX, left: 0, width: 0 });

  const mainTableContainerRef = useRef<HTMLDivElement>(null);
  const mainTableHeaderRef = useRef<HTMLTableSectionElement>(null);
  const stickyHeaderContainerRef = useRef<HTMLDivElement>(null);
  const stickyHeaderContentRef = useRef<HTMLDivElement>(null);

  const rafIdRef = useRef<number | null>(null);
  const lastScrollLeftRef = useRef(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Sync column widths from main header to sticky header
  const syncColumnWidths = useCallback(() => {
    const mainThs = mainTableHeaderRef.current?.querySelectorAll('th');
    const stickyThs = stickyHeaderContainerRef.current?.querySelectorAll('th');
    
    if (!mainThs || !stickyThs || mainThs.length === 0) return;

    const len = Math.min(mainThs.length, stickyThs.length);
    for (let i = 0; i < len; i++) {
      const w = mainThs[i].offsetWidth;
      (stickyThs[i] as HTMLElement).style.width = `${w}px`;
      (stickyThs[i] as HTMLElement).style.minWidth = `${w}px`;
      (stickyThs[i] as HTMLElement).style.maxWidth = `${w}px`;
    }
  }, []);

  // Update sticky header position and dimensions
  const updateStickyRect = useCallback(() => {
    const container = mainTableContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setStickyRect({
      top: STICKY_TOP_PX,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  // RequestAnimationFrame loop for smooth scroll sync
  useEffect(() => {
    if (!showStickyHeader || isEmpty) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const scroller = mainTableContainerRef.current;
    const stickyContent = stickyHeaderContentRef.current;

    if (!scroller || !stickyContent) return;

    const loop = () => {
      const sl = scroller.scrollLeft;
      if (sl !== lastScrollLeftRef.current) {
        stickyContent.style.transform = `translate3d(-${sl}px, 0, 0)`;
        lastScrollLeftRef.current = sl;
      }
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [showStickyHeader, isEmpty]);

  // Sync column widths when sticky header becomes visible or on resize
  useEffect(() => {
    if (!showStickyHeader || isEmpty) return;

    syncColumnWidths();

    // Set up ResizeObserver to watch for column width changes
    const mainHeader = mainTableHeaderRef.current;
    if (!mainHeader) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      syncColumnWidths();
      updateStickyRect();
    });

    resizeObserverRef.current.observe(mainHeader);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [showStickyHeader, isEmpty, syncColumnWidths, updateStickyRect]);

  // Wheel event forwarding - allows scrolling table by hovering over sticky header
  useEffect(() => {
    if (!showStickyHeader || isEmpty) return;

    const stickyContainer = stickyHeaderContainerRef.current;
    const scroller = mainTableContainerRef.current;

    if (!stickyContainer || !scroller) return;

    const onWheel = (e: WheelEvent) => {
      const deltaX = e.deltaX || (e.shiftKey ? e.deltaY : 0);
      if (deltaX !== 0) {
        e.preventDefault();
        scroller.scrollLeft += deltaX;
      }
    };

    stickyContainer.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      stickyContainer.removeEventListener('wheel', onWheel);
    };
  }, [showStickyHeader, isEmpty]);

  // IntersectionObserver to detect when main header scrolls out of view
  useEffect(() => {
    if (isEmpty) {
      setShowStickyHeader(false);
      return;
    }

    const mainHeader = mainTableHeaderRef.current;
    if (!mainHeader) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyHeader(!entry.isIntersecting);
      },
      { 
        threshold: 0, 
        rootMargin: `-${STICKY_TOP_PX}px 0px 0px 0px` 
      }
    );

    observer.observe(mainHeader);

    return () => {
      observer.disconnect();
    };
  }, [isEmpty]);

  // Update sticky rect on scroll and resize
  useEffect(() => {
    if (!showStickyHeader) return;

    updateStickyRect();

    const handleScrollOrResize = () => {
      updateStickyRect();
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [showStickyHeader, updateStickyRect]);

  return {
    showStickyHeader,
    stickyRect,
    mainTableContainerRef,
    mainTableHeaderRef,
    stickyHeaderContainerRef,
    stickyHeaderContentRef,
  };
};
