import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * A custom hook that triggers a callback when a click is detected outside of the referenced element.
 * @param ref - The ref of the element to monitor.
 * @param handler - The callback function to execute on an outside click.
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref.current;
      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
