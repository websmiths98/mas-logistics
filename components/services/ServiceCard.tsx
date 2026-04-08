'use client';

import { useState } from 'react';
import type { ServiceCardData } from './servicesData';

interface ServiceCardProps {
  data: ServiceCardData;
}

/**
 * 3-D flip card — hovers trigger a CSS perspective flip.
 * Front: background image + title + tag.
 * Back:  cream panel with icon, description, metric, and CTA.
 *
 * All animation is pure CSS transitions — no GSAP, no Framer Motion.
 * Back-face content staggers in with transition-delay chains.
 */
export default function ServiceCard({ data }: ServiceCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    /* ── Perspective wrapper ── */
    <div
      id={`service-card-${data.id}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{
        perspective: '1000px',
        width:  '100%',
        height: '100%',
        cursor: 'default',
      }}
    >
      {/* ── Inner (rotates on Y axis) ── */}
      <div
        style={{
          position:        'relative',
          width:           '100%',
          height:          '100%',
          transformStyle:  'preserve-3d',
          /* Slow, cinematic flip — 0.85s with custom ease */
          transition:      'transform 0.85s cubic-bezier(0.45, 0, 0.12, 1)',
          transform:       flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          borderRadius:    '24px',
        }}
      >

        {/* ════════════════════════════════
            FRONT FACE — image + overlay
            ════════════════════════════════ */}
        <div
          style={{
            position:           'absolute',
            inset:              0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius:       '24px',
            overflow:           'hidden',
          }}
        >
          {/* Background image */}
          <img
            src={data.src}
            alt={data.title}
            loading="lazy"
            decoding="async"
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              display:    'block',
              transition: 'transform 0.8s ease',
              transform:  flipped ? 'scale(1.06)' : 'scale(1)',
            }}
          />

          {/* Dark gradient overlay */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)',
          }} />

          {/* Tag chip */}
          <div style={{
            position:        'absolute',
            top:             '20px',
            left:            '20px',
            padding:         '4px 12px',
            borderRadius:    '99px',
            fontSize:        '10px',
            fontFamily:      'var(--font-body)',
            letterSpacing:   '0.2em',
            textTransform:   'uppercase',
            color:           data.accentColor,
            backgroundColor: `${data.accentColor}22`,
            border:          `1px solid ${data.accentColor}44`,
          }}>
            {data.tag}
          </div>

          {/* Title + "hover" hint */}
          <div style={{
            position: 'absolute',
            bottom:   0,
            left:     0,
            right:    0,
            padding:  '24px 22px 22px',
          }}>
            <div style={{
              fontSize:    'clamp(1rem, 1.5vw, 1.25rem)',
              fontFamily:  'var(--font-display)',
              fontWeight:  700,
              color:       '#fff',
              lineHeight:  1.25,
              marginBottom: '8px',
            }}>
              {data.title}
            </div>
            {/* Hover hint */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '6px',
              fontSize:       '11px',
              color:          'rgba(255,255,255,0.45)',
              fontFamily:     'var(--font-body)',
              letterSpacing:  '0.08em',
            }}>
              <span style={{
                display:         'inline-block',
                width:           '16px',
                height:          '1px',
                backgroundColor: data.accentColor,
                flexShrink:      0,
              }} />
              Hover to explore
            </div>
          </div>
        </div>

        {/* ════════════════════════════════
            BACK FACE — cream description
            ════════════════════════════════ */}
        <div
          style={{
            position:           'absolute',
            inset:              0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform:          'rotateY(180deg)',
            borderRadius:       '24px',
            overflow:           'hidden',
            /* Premium cream white */
            background:         'linear-gradient(145deg, #FBF8F3 0%, #F5F0E8 100%)',
            border:             `1px solid ${data.accentColor}28`,
            boxShadow:          `0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px ${data.accentColor}18`,
            display:            'flex',
            flexDirection:      'column',
            padding:            '26px 24px 22px',
          }}
        >
          {/* ── Back: Icon + Tag row ── */}
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'flex-start',
            marginBottom:   '18px',
            opacity:        flipped ? 1 : 0,
            transform:      flipped ? 'translateY(0)' : 'translateY(16px)',
            /* Step 1: fires right after flip peaks (0.28s) */
            transition:     'opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.28s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.28s',
          }}>
            {/* Icon box */}
            <div style={{
              padding:         '10px',
              borderRadius:    '12px',
              backgroundColor: `${data.accentColor}16`,
              border:          `1px solid ${data.accentColor}28`,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={data.accentColor} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round">
                <path d={data.icon} />
              </svg>
            </div>
            {/* Tag chip */}
            <span style={{
              padding:         '4px 10px',
              borderRadius:    '99px',
              fontSize:        '10px',
              letterSpacing:   '0.18em',
              textTransform:   'uppercase' as const,
              color:           data.accentColor,
              backgroundColor: `${data.accentColor}14`,
              border:          `1px solid ${data.accentColor}30`,
              fontFamily:      'var(--font-body)',
            }}>
              {data.tag}
            </span>
          </div>

          {/* ── Back: Title ── */}
          <div style={{
            fontSize:    'clamp(0.95rem, 1.3vw, 1.1rem)',
            fontFamily:  'var(--font-display)',
            fontWeight:  700,
            color:       '#1a1a1a',
            lineHeight:  1.3,
            marginBottom:'10px',
            opacity:     flipped ? 1 : 0,
            transform:   flipped ? 'translateY(0)' : 'translateY(16px)',
            /* Step 2 */
            transition:  'opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.40s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.40s',
          }}>
            {data.title}
          </div>

          {/* ── Back: Accent line ── */}
          <div style={{
            width:           flipped ? '40px' : '0px',
            height:          '2px',
            borderRadius:    '2px',
            backgroundColor: data.accentColor,
            marginBottom:    '14px',
            /* Step 3 — accent line draws itself */
            transition:      'width 0.60s cubic-bezier(0.22,1,0.36,1) 0.52s',
          }} />

          {/* ── Back: Description ── */}
          <p style={{
            fontSize:   '13px',
            lineHeight: 1.75,
            color:      '#4a4a4a',
            fontFamily: 'var(--font-body)',
            flex:       1,
            opacity:    flipped ? 1 : 0,
            transform:  flipped ? 'translateY(0)' : 'translateY(20px)',
            /* Step 4 — description drifts in last */
            transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1) 0.64s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.64s',
          }}>
            {data.description}
          </p>

          {/* ── Back: Metric + CTA ── */}
          <div style={{
            display:        'flex',
            alignItems:     'flex-end',
            justifyContent: 'space-between',
            paddingTop:     '14px',
            borderTop:      `1px solid ${data.accentColor}18`,
            marginTop:      '12px',
            opacity:        flipped ? 1 : 0,
            transform:      flipped ? 'translateY(0)' : 'translateY(14px)',
            /* Step 5 — metric/CTA arrives last, feels conclusive */
            transition:     'opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.76s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.76s',
          }}>
            {/* Metric */}
            <div>
              <div style={{
                fontSize:   '24px',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                color:      data.accentColor,
                lineHeight: 1,
              }}>
                {data.metric}
              </div>
              <div style={{
                fontSize:      '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:         '#999',
                marginTop:     '4px',
                fontFamily:    'var(--font-body)',
              }}>
                {data.metricLabel}
              </div>
            </div>

            {/* CTA arrow button */}
            <div style={{
              width:           '34px',
              height:          '34px',
              borderRadius:    '50%',
              backgroundColor: data.accentColor,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              flexShrink:      0,
              boxShadow:       `0 4px 14px ${data.accentColor}44`,
            }}>
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10L10 2M10 2H4M10 2v6" />
              </svg>
            </div>
          </div>

          {/* Accent top-edge glow — immediate, sets the mood */}
          <div style={{
            position:     'absolute',
            top:          0,
            left:         '10%',
            right:        '10%',
            height:       '2px',
            borderRadius: '0 0 4px 4px',
            background:   `linear-gradient(90deg, transparent, ${data.accentColor}70, transparent)`,
            opacity:      flipped ? 1 : 0,
            transition:   'opacity 0.45s cubic-bezier(0.22,1,0.36,1) 0.20s',
          }} />
        </div>
      </div>
    </div>
  );
}
