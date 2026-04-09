'use client';

import { CSSProperties, Fragment, useCallback, useEffect, useRef } from 'react';
import { useParallax } from '@/components/hooks/useParallax';
import type { HeroPanelConfig } from './heroPanels';
import CountUp from '@/components/ui/CountUp';

interface HeroPanelProps {
  config: HeroPanelConfig;
  panelIndex: number;
  zIndex: number;
}

const DEPTH_SHADOW =
  '0 -24px 80px rgba(0,0,0,0.65), 0 -8px 32px rgba(0,0,0,0.5), 0 -2px 8px rgba(0,0,0,0.4)';

type EntryDirection = 'below' | 'above';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(value: number) {
  const x = clamp(value, 0, 1);
  return 1 - Math.pow(1 - x, 3);
}

function getElementDocumentTop(el: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

function renderLetterStream(text: string) {
  const lines = text.split('\n');
  let letterIndex = 0;

  return lines.map((line, lineIdx) => {
    const words = line.split(' ');

    return (
      <Fragment key={`line-${lineIdx}`}>
        {words.map((word, wordIdx) => (
          <Fragment key={`word-${lineIdx}-${wordIdx}`}>
            <span className="letter-word" aria-hidden="true">
              {Array.from(word).map((char, charIdx) => {
                const currentIndex = letterIndex;
                letterIndex += 1;
                return (
                  <span
                    key={`char-${lineIdx}-${wordIdx}-${charIdx}-${currentIndex}`}
                    className="letter"
                    style={{ '--letter-index': currentIndex } as CSSProperties}
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {wordIdx < words.length - 1 && (
              <span className="letter-gap" aria-hidden="true"> </span>
            )}
          </Fragment>
        ))}
        {lineIdx < lines.length - 1 && <br />}
      </Fragment>
    );
  });
}

export default function HeroPanel({ config, panelIndex, zIndex }: HeroPanelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef     = useRef<HTMLDivElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const statRef   = useRef<HTMLDivElement>(null);
  const revealRafRef = useRef<number | null>(null);
  const wasActiveRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const panelStartRef = useRef(0);

  useEffect(() => {
    const updatePanelStart = () => {
      if (!sectionRef.current) return;
      panelStartRef.current = getElementDocumentTop(sectionRef.current);
    };

    updatePanelStart();
    window.addEventListener('resize', updatePanelStart, { passive: true });
    return () => window.removeEventListener('resize', updatePanelStart);
  }, []);

  useEffect(() => {
    return () => {
      if (revealRafRef.current) {
        cancelAnimationFrame(revealRafRef.current);
      }
    };
  }, []);

  const triggerPanelReveal = useCallback((direction: EntryDirection) => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
    if (targets.length === 0) return;

    const hiddenClass = direction === 'below' ? 'is-below' : 'is-above';

    targets.forEach((target) => {
      target.classList.remove('is-visible', 'is-above', 'is-below');
      target.classList.add(hiddenClass);
    });

    const letterStreams = section.querySelectorAll<HTMLElement>('[data-letter-stream]');
    const hiddenLetterClass = direction === 'below' ? 'letters-from-below' : 'letters-from-above';
    letterStreams.forEach((stream) => {
      stream.classList.remove('letters-visible', 'letters-from-above', 'letters-from-below');
      stream.classList.add(hiddenLetterClass);
    });

    if (revealRafRef.current) {
      cancelAnimationFrame(revealRafRef.current);
    }

    revealRafRef.current = requestAnimationFrame(() => {
      revealRafRef.current = requestAnimationFrame(() => {
        targets.forEach((target) => target.classList.add('is-visible'));
        letterStreams.forEach((stream) => stream.classList.add('letters-visible'));
      });
    });
  }, []);

  const handleScrollUpdate = useCallback((scrollY: number) => {
    if (!bgRef.current) return;

    const viewportH = Math.max(window.innerHeight, 1);
    const panelProgress = (scrollY - panelStartRef.current) / viewportH;
    const depth = clamp(panelProgress, -0.8, 1.8);
    const presence = easeOutCubic(1 - clamp(Math.abs(panelProgress - 0.5) / 1.25, 0, 1));

    // Re-trigger text reveal every time this sticky panel becomes active.
    const isActive = panelProgress >= -0.18 && panelProgress <= 1.12;
    const isEntering = isActive && !wasActiveRef.current;
    if (isEntering) {
      const entryDirection: EntryDirection = scrollY >= lastScrollYRef.current ? 'below' : 'above';
      triggerPanelReveal(entryDirection);
    }
    wasActiveRef.current = isActive;
    lastScrollYRef.current = scrollY;

    const backgroundShift = depth * 170;
    const backgroundScale = 1.1 + presence * 0.16;
    const backgroundRotate = depth * -1.8;

    bgRef.current.style.transform =
      `translate3d(0, ${backgroundShift}px, 0) scale(${backgroundScale}) rotate(${backgroundRotate}deg)`;

    if (glowRef.current) {
      glowRef.current.style.transform =
        `translate3d(${depth * -48}px, ${depth * -86}px, 0) scale(${1 + presence * 0.22})`;
      glowRef.current.style.opacity = `${0.18 + presence * 0.42}`;
    }

    if (textRef.current) {
      const textDriftY = depth * 58;
      const textDriftX = (panelIndex - 1) * 10 * (0.25 + presence * 0.75);
      textRef.current.style.transform = `translate3d(${textDriftX}px, ${textDriftY}px, 0)`;
    }
    if (accentRef.current) accentRef.current.style.transform = `translate3d(0, ${depth * -84}px, 0)`;
    if (statRef.current) statRef.current.style.transform = `translate3d(0, ${depth * 108}px, 0)`;
  }, [panelIndex, triggerPanelReveal]);

  useParallax(handleScrollUpdate);

  return (
    <section
      ref={sectionRef}
      id={`hero-panel-${config.id}`}
      className="sticky top-0 w-full overflow-hidden"
      style={{
        height:    '100svh',
        minHeight: '580px',
        zIndex,
        boxShadow: panelIndex > 0 ? DEPTH_SHADOW : 'none',
      }}
      aria-label={`${config.tagline} — Mas Logistics`}
    >
      {/* ── Background (parallax) ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform origin-center"
        style={{
          backgroundImage:    `url("${config.image}")`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          top: '-15%', bottom: '-15%',
        } as CSSProperties}
      />

      {/* ── Gradient overlay ── */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.overlayFrom} ${config.overlayTo}`} />

      {/* ── Dynamic light sweep for depth ── */}
      <div
        ref={glowRef}
        className="absolute -inset-[24%] pointer-events-none mix-blend-screen will-change-transform"
        style={{
          opacity: 0.35,
          background: `radial-gradient(circle at 30% 20%, ${config.accentColorHex}80 0%, ${config.accentColorHex}22 28%, transparent 62%)`,
        }}
      />

      {/* ── Extra dark vignette so text is always legible on mobile ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)' }}
      />

      {/* ── Top depth edge ── */}
      {panelIndex > 0 && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${config.accentColorHex}55, transparent)` }}
        />
      )}

      {/* ── Left accent bar — hidden below sm to free padding ── */}
      <div
        ref={accentRef}
        className="absolute left-6 sm:left-10 md:left-14 top-0 bottom-0 will-change-transform flex-col items-center hidden sm:flex"
      >
        <div className="w-px flex-1 opacity-25"
          style={{ background: `linear-gradient(to bottom, transparent, ${config.accentColorHex}, transparent)` }} />
        <div className="w-1.5 h-1.5 rounded-full my-3"
          style={{ backgroundColor: config.accentColorHex, opacity: 0.8 }} />
        <div className="w-px flex-1 opacity-10"
          style={{ background: `linear-gradient(to bottom, ${config.accentColorHex}, transparent)` }} />
      </div>

      {/* ── Panel counter (top-right) ── */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-10 lg:right-20 font-mono text-white/25 text-[10px] sm:text-xs tracking-widest z-20">
        {String(panelIndex + 1).padStart(2, '0')} / 03
      </div>

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT
          Layout: full-height flex column, vertically centred.
          Left-padded to clear the accent bar on desktop.
          Content is capped at max-w-xl so it never stretches too wide.
          ════════════════════════════════════════════════════════════ */}
      <div
        ref={textRef}
        className="relative z-10 h-full flex flex-col justify-center will-change-transform
                   px-5 sm:pl-20 md:pl-28 lg:pl-36 xl:pl-44
                   pr-5 sm:pr-10 md:pr-16"
      >
        {/* ── Inner content wrapper — capped width ── */}
        <div className="w-full max-w-lg">

          {/* Tagline row */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5 reveal stagger-0">
            <div className="w-4 sm:w-6 h-px shrink-0" style={{ backgroundColor: config.accentColorHex }} />
            <span
              className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold"
              style={{ color: config.accentColorHex }}
              aria-label={config.tagline}
            >
              <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '0ms' } as CSSProperties}>
                {renderLetterStream(config.tagline)}
              </span>
            </span>
          </div>

          {/* Headline */}
          <h2
            className="text-white font-black leading-[0.88] mb-3 sm:mb-4 reveal stagger-1"
            style={{
              fontSize:   'clamp(2rem, 6.4vw, 7.3rem)',
              fontFamily: 'var(--font-display)',
              whiteSpace: 'pre-line',
              textShadow: '0 4px 40px rgba(0,0,0,0.65)',
            }}
            aria-label={config.headline.replace(/\n/g, ' ')}
          >
            <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '80ms' } as CSSProperties}>
              {renderLetterStream(config.headline)}
            </span>
          </h2>

          {/* Accent underline */}
          <div
            className="h-1 w-16 sm:w-24 mb-3 sm:mb-5 rounded-full reveal-scale stagger-2"
            style={{ backgroundColor: config.accentColorHex }}
          />

          {/* Sub-headline — hidden on very small screens to save vertical space */}
          <p
            className="text-white/70 text-[11px] sm:text-sm font-mono tracking-widest uppercase mb-3 sm:mb-4 reveal stagger-3 hidden xs:block sm:block"
            aria-label={config.subheadline}
          >
            <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '140ms' } as CSSProperties}>
              {renderLetterStream(config.subheadline)}
            </span>
          </p>

          {/* Description */}
          <p
            className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 reveal stagger-4"
            style={{ fontFamily: 'var(--font-body)' }}
            aria-label={config.description}
          >
            <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '220ms' } as CSSProperties}>
              {renderLetterStream(config.description)}
            </span>
          </p>

          {/* Badge row */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-7 reveal stagger-5">
            {config.badge.split(' • ').map((b) => (
              <span
                key={b}
                className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono tracking-wide border rounded-full text-white/50"
                style={{ borderColor: `${config.accentColorHex}40` }}
              >
                <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '260ms' } as CSSProperties}>
                  {renderLetterStream(b)}
                </span>
              </span>
            ))}
          </div>

          {/* ── CTA button — fully responsive ── */}
          <div className="reveal stagger-6">
            <button
              className="group relative inline-flex items-center gap-2 sm:gap-3
                         px-5 sm:px-7 md:px-8
                         py-3 sm:py-3.5 md:py-4
                         text-[11px] sm:text-sm
                         font-bold tracking-[0.12em] sm:tracking-widest uppercase
                         overflow-hidden rounded-lg sm:rounded
                         transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                backgroundColor: config.accentColorHex,
                color:           '#0a0a0a',
                fontFamily:      'var(--font-display)',
                boxShadow:       `0 4px 20px ${config.accentColorHex}50`,
              }}
              aria-label={config.cta}
            >
              <span className="relative z-10 whitespace-nowrap" aria-label={config.cta}>
                <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '320ms' } as CSSProperties}>
                  {renderLetterStream(config.cta)}
                </span>
              </span>
              {/* Arrow icon */}
              <svg
                className="relative z-10 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 16 16" fill="none"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white" />
            </button>
          </div>

        </div>{/* /max-w-lg */}
      </div>

      {/* ── Stat block ── */}
      {/* Desktop: absolute bottom-right. Mobile: tucked inside content flow below CTA  */}
      <div
        ref={statRef}
        className="absolute will-change-transform text-right reveal-right stagger-2
                   bottom-10 sm:bottom-14 md:bottom-16
                   right-4  sm:right-8  md:right-14 lg:right-20"
      >
        {/* Glassy chip */}
        <div
          className="inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl"
          style={{
            background:           'rgba(0,0,0,0.30)',
            backdropFilter:       'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border:               '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <div
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none font-mono flex items-center"
            style={{ color: config.accentColorHex }}
          >
            <CountUp
              from={0}
              to={config.stat.value}
              separator=","
              direction="up"
              duration={1.5}
            />
            {config.stat.suffix}
          </div>
          <div className="text-white/40 text-[9px] sm:text-xs tracking-widest uppercase mt-1 sm:mt-2 font-mono">
            {config.stat.label}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator (first panel only) ── */}
      {panelIndex === 0 && (
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 animate-bounce opacity-40">
          <span className="text-white/40 text-[9px] sm:text-xs tracking-widest font-mono">SCROLL</span>
          <svg width="12" height="18" viewBox="0 0 14 20" fill="none">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke="white" strokeOpacity=".4" strokeWidth="1.5" />
            <circle cx="7" cy="6" r="2.5" fill="white" fillOpacity=".5">
              <animate attributeName="cy"      values="6;12;6" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}
    </section>
  );
}
