export interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  icon: string; // SVG path data
  accentColor: string;
  tag: string;
  metric: string;
  metricLabel: string;
  src: string;
}

export const servicesData: ServiceCardData[] = [
  {
    id: 'air-freight',
    title: 'Air Freight Services',
    description:
      'Global air freight solutions with strong carrier partnerships, handling everything from standard shipments to oversized and hazardous cargo with fast and secure delivery.',
    icon: 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    accentColor: '#FF4B41',
    tag: 'Air',
    metric: '120+',
    metricLabel: 'Countries',
    src: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=3540&auto=format&fit=crop',
  },
  {
    id: 'warehouse',
    title: 'Warehouse Services',
    description:
      'Complete warehousing solutions including storage, cargo handling, palletization, labeling, and nationwide pickup/delivery with cost-efficient and insured operations.',
    icon: 'M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13M3 21h18M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M5 10h4M15 10h4',
    accentColor: '#FF5C53',
    tag: 'Storage',
    metric: '24/7',
    metricLabel: 'Operations',
    src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=3540&auto=format&fit=crop',
  },
  {
    id: 'ocean-freight',
    title: 'Ocean Freight Services',
    description:
      'Flexible sea freight services for LCL, FCL, and oversized cargo with full documentation, global shipping support, and insurance options for import/export businesses.',
    icon: 'M2 2h20v14H2V2zm2 2v10h16V4H4zm-2 12h20v2H2v-2zm4 4h12v2H6v-2zM9 7h6v4H9V7z',
    accentColor: '#E63D34',
    tag: 'Ocean',
    metric: '99%',
    metricLabel: 'Reliability',
    src: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=3540&auto=format&fit=crop',
  },
  {
    id: 'inland-transport',
    title: 'Inland Transportation',
    description:
      'Reliable domestic and international land transport solutions ensuring timely delivery with full transparency, tracking, and efficient logistics management.',
    icon: 'M8 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm12 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3 5h13l2 7H5L3 5zm-1-3h2l.5 2H20a1 1 0 0 1 .97 1.24l-2 7A1 1 0 0 1 18 13H5a1 1 0 0 1-.97-.76L2.06 4H2a1 1 0 0 1 0-2z',
    accentColor: '#FF6D65',
    tag: 'Land',
    metric: '<24h',
    metricLabel: 'Dispatch Time',
    src: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=3540&auto=format&fit=crop',
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain Development',
    description:
      'Optimized supply chain solutions designed to improve efficiency, reduce costs, and streamline logistics operations for better business performance.',
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 1.92l8.73 5.04M12 22.08V12',
    accentColor: '#CC322A',
    tag: 'Strategy',
    metric: '30%',
    metricLabel: 'Cost Reduction',
    src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=3540&auto=format&fit=crop',
  },
  {
    id: 'break-bulk',
    title: 'Break Bulk & Out of Gauge',
    description:
      'Specialized handling of heavy, oversized, and non-containerized cargo using advanced equipment and expert planning for complex logistics projects.',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l6 6h-6V4zM8 12h8v2H8v-2zm0 4h8v2H8v-2z',
    accentColor: '#FF4B41',
    tag: 'Heavy Lift',
    metric: '500t',
    metricLabel: 'Max Capacity',
    src: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=3540&auto=format&fit=crop',
  },
];
