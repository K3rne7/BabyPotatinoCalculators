import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * A custom hook that triggers a handler when a click or touch event
 * occurs outside of the referenced element.
 *
 * @param ref A React ref attached to the element to monitor.
 * @param handler The function to call when an outside click is detected.
 */
export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
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
  }, [ref, handler]); // Reload only if ref or handler changes
};
