export interface HeroPanelConfig {
  id: 'land' | 'ocean' | 'air';
  image: string;
  accentColor: string;
  accentColorHex: string;
  overlayFrom: string;
  overlayTo: string;
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  stat: { value: string; label: string };
  badge: string;
  cta: string;
}

export const heroPanels: HeroPanelConfig[] = [
  {
    id: 'land',
    image: '/Red container lifted in foggy port.png',
    accentColor: 'text-amber-400',
    accentColorHex: '#f59e0b',
    overlayFrom: 'from-amber-950/80',
    overlayTo: 'to-stone-900/60',
    tagline: 'Land Freight',
    headline: 'Ground\nIntelligence',
    subheadline: 'Connecting Every Mile of the Road',
    description:
      'Full-truckload and LTL services across 180+ coverage zones. Real-time tracking, dedicated lanes, and express delivery SLAs that move your cargo when it matters most.',
    stat: { value: '180+', label: 'Coverage Zones' },
    badge: 'Express Land Delivery • FTL/LTL • Last-Mile',
    cta: 'Plan a Land Shipment',
  },
  {
    id: 'ocean',
    image: '/Twilight voyage of the container ship.png',
    accentColor: 'text-cyan-400',
    accentColorHex: '#22d3ee',
    overlayFrom: 'from-blue-950/85',
    overlayTo: 'to-slate-900/60',
    tagline: 'Ocean Freight',
    headline: 'Deep Horizon\nLogistics',
    subheadline: 'FCL & LCL — Any Port, Any Cargo',
    description:
      'Full Container Load and Less-than-Container Load solutions backed by 40+ carrier partnerships. Customs brokerage, port-to-door freight forwarding, and reefer cargo expertise.',
    stat: { value: '200+', label: 'Global Ports' },
    badge: 'FCL • LCL • Customs Brokerage • Reefer',
    cta: 'Book Ocean Freight',
  },
  {
    id: 'air',
    image: '/Plane emerging from foggy skies.png',
    accentColor: 'text-sky-300',
    accentColorHex: '#7dd3fc',
    overlayFrom: 'from-indigo-950/80',
    overlayTo: 'to-blue-900/50',
    tagline: 'Air Freight',
    headline: 'Above the\nWeather',
    subheadline: 'Charter & Commercial Air Cargo',
    description:
      'Time-critical air freight with guaranteed transit times. Air charter, consolidated cargo, dangerous goods handling (IATA-certified), and next-flight-out emergency logistics.',
    stat: { value: '72hr', label: 'Global Transit' },
    badge: 'Air Charter • DG Cargo • IATA Certified',
    cta: 'Get Air Quote',
  },
];
