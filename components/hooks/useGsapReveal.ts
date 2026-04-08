'use client';

import { useEffect, useRef } from 'react';

/**
 * useGsapReveal — scroll-progress-driven reveal (GSAP ScrollTrigger style).
 *
 * ZERO dependencies. Runs on every scroll frame via rAF.
 *
 * How it works:
 *   • Reads each [data-gsap] element's live getBoundingClientRect() on scroll.
 *   • Maps viewport-relative position to a 0→1 progress value.
 *   • Applies opacity, translateY, and blur directly to el.style every frame.
 *   • Direction-aware: elements enter from BELOW on scroll-down, from ABOVE
 *     on scroll-up — giving the "parallel rise/drop" effect the user asked for.
 *   • Stagger: each element's trigger point is offset by staggerPx, so they
 *     cascade one after another rather than all animating together.
 *
 * data-gsap          — marks the element (required)
 * data-delay         — extra delay in seconds → converted to px offset (×80)
 * data-from          — JSON: { x?: number } — lateral offset override
 */

interface UseGsapRevealOptions {
  /**
   * Pixels of scroll travel over which the animation completes (0→1).
   * Larger = slower, more cinematic. Default: 160
   */
  triggerDistance?: number;
  /**
   * Pixel gap between each successive element's trigger start.
   * Creates the staggered cascade. Default: 75
   */
  staggerPx?: number;
  /** Maximum translateY at start-of-animation. Default: 60 */
  yOffset?: number;
  /** Maximum blur at start-of-animation in px. Default: 6 */
  blurPx?: number;
}

/* ── cubic ease-out (power3.out equivalent) ── */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useGsapReveal<T extends HTMLElement = HTMLElement>(
  options: UseGsapRevealOptions & {
    /** Legacy — ignored, kept for backwards compatibility */
    rootMargin?: string;
    threshold?: number;
    stagger?: number;
    delay?: number;
  } = {}
) {
  const {
    triggerDistance = 160,
    staggerPx       = 75,
    yOffset         = 60,
    blurPx          = 6,
  } = options;

  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>('[data-gsap]')
    );
    if (!targets.length) return;

    /* ── Prep: set will-change and initial hidden state ── */
    targets.forEach((el, i) => {
      el.style.willChange = 'opacity, transform, filter';
      el.style.opacity    = '0';
      el.style.transform  = `translateY(${yOffset}px)`;
      el.style.filter     = `blur(${blurPx}px)`;

      /* Handle lateral data-from override */
      try {
        const raw = el.getAttribute('data-from');
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, number>;
          if (parsed.x !== undefined) {
            el.style.transform = `translateX(${parsed.x}px)`;
          }
        }
      } catch { /* ignore bad JSON */ }
    });

    /* ── Track scroll direction ── */
    let lastScrollY = window.scrollY;
    let rafId: number;
    let ticking = false;

    const applyFrame = () => {
      ticking = false;
      const currentScrollY = window.scrollY;
      const scrollingDown  = currentScrollY >= lastScrollY;
      lastScrollY = currentScrollY;

      const vh = window.innerHeight;

      targets.forEach((el, i) => {
        const rect = el.getBoundingClientRect();

        /* Per-element stagger: each element's animation starts staggerPx later */
        const dataDelay = parseFloat(el.getAttribute('data-delay') ?? '0') || 0;
        const pxOffset  = i * staggerPx + dataDelay * 80;

        /* ── Lateral offset override ── */
        let fromX = 0;
        try {
          const raw = el.getAttribute('data-from');
          if (raw) {
            const p = JSON.parse(raw) as Record<string, number>;
            fromX = p.x ?? 0;
          }
        } catch { /* ignore */ }

        /* ─────────────────────────────────────────────────────────────
           STATE MACHINE — 3 zones:

           ZONE A: element is BELOW viewport  → hide, ready for down-enter
           ZONE C: element is ABOVE viewport  → hide, ready for up-enter
           ZONE B: element is IN/NEAR viewport → animate live based on direction
           ───────────────────────────────────────────────────────────── */

        if (rect.top > vh + 16) {
          /* ── ZONE A: fully below — queue from-below state ── */
          el.style.opacity   = '0';
          el.style.transform = fromX !== 0
            ? `translateX(${fromX}px)`
            : `translateY(${yOffset}px)`;
          el.style.filter = `blur(${blurPx}px)`;

        } else if (rect.bottom < -16) {
          /* ── ZONE C: fully above — queue from-above state ── */
          el.style.opacity   = '0';
          el.style.transform = fromX !== 0
            ? `translateX(${-fromX}px)`
            : `translateY(${-yOffset}px)`;
          el.style.filter = `blur(${blurPx}px)`;

        } else {
          /* ── ZONE B: in/near viewport — compute live progress ── */

          /*
            Scroll-DOWN progress: how far FROM THE BOTTOM the element has entered.
              = 0 when elementTop == viewportBottom - pxOffset
              = 1 when elementTop == viewportBottom - pxOffset - triggerDistance
          */
          const progressDown = Math.min(1, Math.max(0,
            (vh - rect.top - pxOffset) / triggerDistance
          ));

          /*
            Scroll-UP progress: how far FROM THE TOP the element has entered.
              = 0 when elementBottom == pxOffset  (just peeking from top)
              = 1 when elementBottom == pxOffset + triggerDistance
          */
          const progressUp = Math.min(1, Math.max(0,
            (rect.bottom - pxOffset) / triggerDistance
          ));

          /* Choose active progress by scroll direction */
          const raw    = scrollingDown ? progressDown : progressUp;
          const eased  = easeOut(raw);

          /* Y direction: rise from below (↑) on scroll-down, drop from above (↓) on scroll-up */
          const ySign  = scrollingDown ? 1 : -1;

          el.style.opacity = eased.toFixed(4);
          el.style.filter  = `blur(${(blurPx * (1 - eased)).toFixed(2)}px)`;

          if (fromX !== 0) {
            /* Lateral slide override (stat chip) */
            const xDir  = scrollingDown ? 1 : -1;
            el.style.transform = `translateX(${(fromX * xDir * (1 - eased)).toFixed(2)}px)`;
          } else {
            el.style.transform = `translateY(${(yOffset * ySign * (1 - eased)).toFixed(2)}px)`;
          }
        }
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(applyFrame);
      }
    };

    /* Run once on mount to set correct initial state */
    applyFrame();

    window.addEventListener('scroll', onScroll, { passive: true });

    /* Also update on resize (viewport height changes) */
    window.addEventListener('resize', applyFrame, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', applyFrame);
      cancelAnimationFrame(rafId);
    };
  }, [triggerDistance, staggerPx, yOffset, blurPx]);

  return containerRef;
}
