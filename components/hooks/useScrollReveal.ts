'use client';

import { useEffect, useRef } from 'react';

interface UseScrollRevealOptions {
  /**
   * How much of the element must be visible before it triggers.
   * 0 = as soon as 1px is visible, 0.2 = 20% visible.
   * @default 0.1
   */
  threshold?: number;
  /**
   * Margin around the root viewport.
   * Negative value = trigger fires once the element has entered by that amount.
   * @default '-40px 0px'
   */
  rootMargin?: string;
}

/**
 * Bidirectional scroll-reveal hook.
 *
 * Trigger fires when 15% of the element is visible AND it has
 * travelled 80px past the viewport edge — giving a deliberate
 * "buffer" hold before the animation starts. Feels premium.
 *
 * ScrollDown  → element enters from BELOW  (translateY +ve → 0)
 * ScrollUp    → element enters from ABOVE  (translateY -ve → 0)
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>({
  threshold  = 0.15,
  rootMargin = '-80px 0px',
}: UseScrollRevealOptions = {}) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            // — ENTER: clear directional hint, add visible —
            el.classList.remove('is-above', 'is-below');
            el.classList.add('is-visible');
          } else {
            // — EXIT: stamp direction so next entry knows which side to come from —
            el.classList.remove('is-visible');

            if (entry.boundingClientRect.top < 0) {
              // Element exited from the TOP (user scrolled DOWN past it)
              // → next entry will be scroll-up, so come from ABOVE
              el.classList.add('is-above');
              el.classList.remove('is-below');
            } else {
              // Element exited from the BOTTOM (user scrolled UP past it)
              // → next entry will be scroll-down, so come from BELOW
              el.classList.add('is-below');
              el.classList.remove('is-above');
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    targets.forEach((el) => {
      // Initialise all targets as "coming from below" (standard on-load direction)
      el.classList.add('is-below');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return containerRef;
}
