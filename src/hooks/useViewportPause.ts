import { useEffect, useState, type RefObject } from 'react';

/**
 * Tracks whether a target container is visible in the viewport so the
 * WebGL Hero canvas can pause rendering when scrolled off-screen.
 */
export function useViewportPause(ref: RefObject<HTMLElement | null>): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}
