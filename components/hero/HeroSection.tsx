'use client';

import HeroPanel from './HeroPanel';
import { heroPanels } from './heroPanels';

/**
 * HeroSection — Sticky stacking hero
 *
 * The outer container is 300svh tall (one viewport per panel) so the browser
 * has scrollable space for each panel to "arrive" and sit sticky at the top
 * while the next one slides over it.
 *
 * z-index ladder:   panel 1 → 10 / panel 2 → 20 / panel 3 → 30
 * shadow:           panel 2 + 3 carry shadow-2xl equivalent on their top
 *                   edge to simulate physical depth as they slide over.
 */
export default function HeroSection() {
  return (
    <div
      id="hero"
      role="banner"
      aria-label="GravityFreight — Hero"
      style={{ height: `${heroPanels.length * 100}svh` }}
    >
      {heroPanels.map((panel, index) => (
        <HeroPanel
          key={panel.id}
          config={panel}
          panelIndex={index}
          zIndex={(index + 1) * 10}
        />
      ))}
    </div>
  );
}
