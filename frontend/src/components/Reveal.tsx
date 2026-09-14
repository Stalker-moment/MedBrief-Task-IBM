'use client';

import { useEffect, useRef } from 'react';

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || preference.matches || !('IntersectionObserver' in window)) return;
    // Only hide off-screen content; SSR and unavailable JS remain readable.
    if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('reveal-pending');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.remove('reveal-pending');
        element.classList.add('reveal-visible');
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(element);
    const show = () => { if (preference.matches) { element.classList.remove('reveal-pending'); observer.disconnect(); } };
    preference.addEventListener('change', show);
    return () => { observer.disconnect(); preference.removeEventListener('change', show); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
