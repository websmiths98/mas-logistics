'use client';

import { useRef, useCallback, Fragment, CSSProperties } from 'react';
import { useParallax } from '@/components/hooks/useParallax';
import ServiceCard from './ServiceCard';
import { servicesData } from './servicesData';

import { Carousel, Card } from '@/components/ui/apple-cards-carousel';

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

export default function ServicesSection() {
  const bgRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((scrollY: number) => {
    if (bgRef.current) {
      // Subtle background parallax for the section
      const sectionEl = bgRef.current.parentElement;
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const relativeScroll = scrollY - (rect.top + scrollY - window.innerHeight);
      const offset = relativeScroll * 0.18;
      bgRef.current.style.transform = `translateY(${offset}px)`;
    }
  }, []);

  useParallax(handleScroll);

  const carouselItems = servicesData.map((service, index) => (
    <Card 
      key={service.id} 
      index={index}
      card={{
        src: service.src,
        title: service.title,
        category: service.tag,
        content: <ServiceCard data={service} />
      }}
    />
  ));

  return (
    <section
      id="services"
      className="relative overflow-hidden"
      aria-labelledby="services-heading"
      style={{
        // Creamy White background gradient
        background: 'linear-gradient(180deg, #FDFBF7 0%, #F5F3E9 100%)',
      }}
    >
      {/* ── Background parallax layer ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          top: '-10%',
          bottom: '-10%',
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(255, 75, 65, 0.05) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 70%, rgba(255, 75, 65, 0.03) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Grid dot background ── */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(5,24,105,0.4) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-28 md:py-36">
        {/* ── Section header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6 reveal stagger-0">
            <div className="w-8 h-px bg-[#FF4B41]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#FF4B41]/90" aria-label="Our Services">
              <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '0ms' } as CSSProperties}>
                {renderLetterStream('Our Services')}
              </span>
            </span>
          </div>

          <h2
            id="services-heading"
            className="text-black font-black leading-tight mb-6 reveal stagger-1"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontFamily: 'var(--font-display)',
              maxWidth: '18ch',
            }}
            aria-label="Every Mode. Every Route."
          >
            <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '80ms' } as CSSProperties}>
              {renderLetterStream('Every Mode. ')}
            </span>
            <span style={{ color: '#FF4B41' }}>
              <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '150ms' } as CSSProperties}>
                {renderLetterStream('Every Route.')}
              </span>
            </span>
          </h2>

          <p
            className="text-black/60 text-lg max-w-2xl leading-relaxed reveal stagger-2"
            style={{ fontFamily: 'var(--font-body)' }}
            aria-label="GravityFreight operates as the single point of control across land, ocean, and air — combining carrier networks, customs expertise, and real-time technology into one seamless freight operation."
          >
            <span data-letter-stream className="inline-block align-top" style={{ '--letter-base': '220ms' } as CSSProperties}>
              {renderLetterStream('GravityFreight operates as the single point of control across land, ocean, and air — combining carrier networks, customs expertise, and real-time technology into one seamless freight operation.')}
            </span>
          </p>
        </div>

        {/* ── Service Cards Carousel ── */}
        <div className="-mx-6 md:-mx-12 lg:-mx-16 reveal stagger-3">
          <Carousel items={carouselItems} />
        </div>

        {/* ── Bottom CTA strip ── */}
        <div
          className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl reveal stagger-4"
          style={{
            background: 'linear-gradient(135deg, rgba(255,75,65,0.08) 0%, rgba(255,75,65,0.02) 100%)',
            border: '1px solid rgba(255,75,65,0.15)',
          }}
        >
          <div>
            <h3
              className="text-black text-xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Need a custom freight solution?
            </h3>
            <p className="text-black/60 text-sm font-mono">
              Speak to a GravityFreight specialist. We lift what others can&apos;t.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <button
              id="get-quote-btn"
              className="px-6 py-3 text-sm font-bold tracking-widest uppercase rounded transition-all duration-300 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #FF4B41, #CC3C34)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
              }}
            >
              Get a Quote
            </button>
            <button
              id="contact-specialist-btn"
              className="px-6 py-3 text-sm font-bold tracking-widest uppercase rounded border border-black/20 text-black/80 hover:border-[#FF4B41]/50 hover:text-black transition-all duration-300"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Contact Specialist
            </button>
          </div>
        </div>

        {/* ── Footer strip ── */}
        <div
          className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 pt-8 reveal stagger-5"
          style={{ borderTop: '1px solid rgba(5,24,105,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF4B41, #CC3C34)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-black font-bold tracking-wider text-sm"
              style={{ fontFamily: 'var(--font-display)' }}>
              GRAVITYFREIGHT
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <p className="text-black/40 text-xs font-mono tracking-widest mt-4 md:mt-0">
              © 2025 GravityFreight. We Move What Others Can&apos;t Lift.
            </p>
            <p className="text-black/70 text-[10px] font-bold tracking-[0.2em] uppercase">
              Powered by Websmith&apos;s
            </p>
          </div>
          <div className="flex gap-6 text-black/40 text-xs font-mono tracking-wider">
            <span className="hover:text-black transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-black transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-black transition-colors cursor-pointer">Carriers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
