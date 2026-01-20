// Centralized orbit class color definitions
// These colors are used consistently across all components

export const ORBIT_COLORS = {
  LEO: {
    hex: '#00d4ff', // Primary cyan
    hsl: 'hsl(var(--primary))',
    tailwind: 'text-primary',
    bg: 'bg-primary/20',
    border: 'border-primary/30',
    badge: 'bg-primary/20 text-primary border-primary/30',
  },
  MEO: {
    hex: '#eab308', // Yellow
    hsl: 'hsl(45, 93%, 47%)',
    tailwind: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  GEO: {
    hex: '#a855f7', // Purple/Accent
    hsl: 'hsl(var(--accent))',
    tailwind: 'text-accent',
    bg: 'bg-accent/20',
    border: 'border-accent/30',
    badge: 'bg-accent/20 text-accent border-accent/30',
  },
  HEO: {
    hex: '#22c55e', // Green
    hsl: 'hsl(142, 71%, 45%)',
    tailwind: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
} as const;

export type OrbitClass = keyof typeof ORBIT_COLORS;

// Helper function to get orbit color by class
export function getOrbitColor(orbitClass: OrbitClass): typeof ORBIT_COLORS[OrbitClass] {
  return ORBIT_COLORS[orbitClass] || ORBIT_COLORS.LEO;
}

// Get hex color for visualizations (globe, charts, etc.)
export function getOrbitHexColor(orbitClass: OrbitClass): string {
  return ORBIT_COLORS[orbitClass]?.hex || ORBIT_COLORS.LEO.hex;
}

// Get Tailwind classes for badges
export function getOrbitBadgeClasses(orbitClass: OrbitClass): string {
  return ORBIT_COLORS[orbitClass]?.badge || ORBIT_COLORS.LEO.badge;
}

// Get Tailwind text color class
export function getOrbitTextClass(orbitClass: OrbitClass): string {
  return ORBIT_COLORS[orbitClass]?.tailwind || ORBIT_COLORS.LEO.tailwind;
}
