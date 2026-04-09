'use client';
import { useEffect, useRef } from 'react';

export default function GlobalRevealTracker() {
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observerOptions = {
      root: null,
      rootMargin: '-5% 0px -5% 0px', // Trigger slighly before edges for perfect cinematic timing
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY >= lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;

        if (entry.isIntersecting) {
          // Entering view
          target.classList.remove('is-above', 'is-below', 'letters-from-above', 'letters-from-below');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              target.classList.add('is-visible');
              if (target.hasAttribute('data-letter-stream')) {
                target.classList.add('letters-visible');
              }
            });
          });
        } else {
          // Exiting view
          target.classList.remove('is-visible', 'letters-visible');
          
          if (scrollingDown) {
            target.classList.add('is-above');
            if (target.hasAttribute('data-letter-stream')) {
              target.classList.add('letters-from-above');
            }
          } else {
            target.classList.add('is-below');
            if (target.hasAttribute('data-letter-stream')) {
              target.classList.add('letters-from-below');
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const refreshObserver = () => {
      const elements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale, [data-letter-stream]'
      );
      
      elements.forEach((el) => {
        if (!el.hasAttribute('data-reveal-observed')) {
          el.setAttribute('data-reveal-observed', 'true');
          
          if (!el.classList.contains('is-visible')) {
            el.classList.add('is-below');
            if (el.hasAttribute('data-letter-stream')) {
              el.classList.add('letters-from-below');
            }
          }
          observer.observe(el);
        }
      });
    };

    // Initial hookup
    refreshObserver();
    
    // Keep checking for newly rendered React nodes across pages
    const interval = setInterval(refreshObserver, 1500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}
