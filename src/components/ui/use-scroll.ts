'use client';
import { useEffect, useState, type RefObject } from 'react';

export function useScroll(threshold = 10, target?: RefObject<HTMLElement | null>) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const element = target?.current;
    const source = element ?? window;
    const update = () => setScrolled((element ? element.scrollTop : window.scrollY) > threshold);
    update();
    source.addEventListener('scroll', update, { passive: true });
    return () => source.removeEventListener('scroll', update);
  }, [threshold, target]);
  return scrolled;
}
