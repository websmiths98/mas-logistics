'use client';

import { useEffect, useRef, useCallback } from 'react';

export type ParallaxCallback = (scrollY: number) => void;

export function useParallax(callback: ParallaxCallback, disabled = false) {
  const rafId = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const targetScrollYRef = useRef(0);
  const smoothedScrollYRef = useRef(0);
  const prefersReducedMotion = useRef(false);
  const callbackRef = useRef(callback);
  const animateRef = useRef<() => void>(() => {});

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mql.matches;
    const onChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const stopAnimation = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    isAnimatingRef.current = false;
  }, []);

  useEffect(() => {
    animateRef.current = () => {
      const delta = targetScrollYRef.current - smoothedScrollYRef.current;

      // Premium smoothing curve: fast enough to feel responsive, slow enough to remove choppiness.
      smoothedScrollYRef.current += delta * 0.14;

      const shouldStop = Math.abs(delta) < 0.12;
      if (shouldStop) {
        smoothedScrollYRef.current = targetScrollYRef.current;
      }

      callbackRef.current(smoothedScrollYRef.current);

      if (shouldStop) {
        stopAnimation();
        return;
      }

      rafId.current = requestAnimationFrame(animateRef.current);
    };
  }, [stopAnimation]);

  const handleScroll = useCallback(() => {
    if (disabled) return;

    targetScrollYRef.current = window.scrollY;

    if (prefersReducedMotion.current) {
      smoothedScrollYRef.current = targetScrollYRef.current;
      callbackRef.current(targetScrollYRef.current);
      return;
    }

    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      rafId.current = requestAnimationFrame(animateRef.current);
    }
  }, [disabled]);

  useEffect(() => {
    targetScrollYRef.current = window.scrollY;
    smoothedScrollYRef.current = window.scrollY;
    callbackRef.current(window.scrollY);

    if (disabled) {
      stopAnimation();
      return;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      stopAnimation();
    };
  }, [disabled, handleScroll, stopAnimation]);

  return smoothedScrollYRef;
}
