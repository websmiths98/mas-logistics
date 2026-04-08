'use client';

import { useRef, useCallback } from 'react';
import { useParallax } from '@/components/hooks/useParallax';
import ServiceCard from './ServiceCard';
import { servicesData } from './servicesData';

import { Carousel, Card } from '@/components/ui/apple-cards-carousel';

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
        content: <ServiceCard data={service} index={index} />
      }}
    />
  ));

  return (
    <section
      id="services"
      className="relative overflow-hidden"
      aria-labelledby="services-heading"
      style={{
        // Deep Navy Blue background gradient
        background: 'linear-gradient(180deg, #0B132B 0%, #060B19 40%, #03050A 100%)',
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
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-28 md:py-36">
        {/* ── Section header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#FF4B41]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#FF4B41]/90">
              Our Services
            </span>
          </div>

          <h2
            id="services-heading"
            className="text-white font-black leading-tight mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontFamily: 'var(--font-display)',
              maxWidth: '18ch',
            }}
          >
            Every Mode.{' '}
            <span
              style={{
                // Warm Red mix gradient
                background: 'linear-gradient(135deg, #FF4B41, #FFACA8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Every Route.
            </span>
          </h2>

          <p
            className="text-white/60 text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            GravityFreight operates as the single point of control across land, ocean, and air — 
            combining carrier networks, customs expertise, and real-time technology into one 
            seamless freight operation.
          </p>
        </div>

        {/* ── Service Cards Carousel ── */}
        <div className="-mx-6 md:-mx-12 lg:-mx-16">
          <Carousel items={carouselItems} />
        </div>

        {/* ── Bottom CTA strip ── */}
        <div
          className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,75,65,0.08) 0%, rgba(255,75,65,0.02) 100%)',
            border: '1px solid rgba(255,75,65,0.15)',
          }}
        >
          <div>
            <h3
              className="text-white text-xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Need a custom freight solution?
            </h3>
            <p className="text-[#FFFFFF]/60 text-sm font-mono">
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
              className="px-6 py-3 text-sm font-bold tracking-widest uppercase rounded border border-white/20 text-white/80 hover:border-[#FF4B41]/50 hover:text-white transition-all duration-300"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Contact Specialist
            </button>
          </div>
        </div>

        {/* ── Footer strip ── */}
        <div
          className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF4B41, #CC3C34)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-white font-bold tracking-wider text-sm"
              style={{ fontFamily: 'var(--font-display)' }}>
              GRAVITYFREIGHT
            </span>
          </div>
          <p className="text-[#FFFFFF]/40 text-xs font-mono tracking-widest">
            © 2025 GravityFreight. We Move What Others Can&apos;t Lift.
          </p>
          <div className="flex gap-6 text-[#FFFFFF]/40 text-xs font-mono tracking-wider">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-white transition-colors cursor-pointer">Carriers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
