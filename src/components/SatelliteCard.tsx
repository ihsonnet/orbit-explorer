import { motion } from 'framer-motion';
import { Satellite, Radio, Navigation, Cloud, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SatelliteData {
  name: string;
  noradId?: string;
  norad_id?: string;
  operator: string;
  orbitClass?: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  orbit_class?: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  type: 'COMMUNICATION' | 'GNSS' | 'EARTH_OBSERVATION' | 'WEATHER' | 'SCIENCE' | 'OTHER';
  impactTags?: string[];
  impact_tags?: string[];
  description?: string;
  elevation?: number;
  azimuth?: number;
}

interface SatelliteCardProps {
  satellite: SatelliteData;
  index?: number;
}

const typeIcons = {
  COMMUNICATION: Radio,
  GNSS: Navigation,
  WEATHER: Cloud,
  EARTH_OBSERVATION: Eye,
  SCIENCE: Satellite,
  OTHER: Satellite,
};

const typeColors = {
  COMMUNICATION: 'text-accent',
  GNSS: 'text-yellow-400',
  WEATHER: 'text-blue-400',
  EARTH_OBSERVATION: 'text-green-400',
  SCIENCE: 'text-primary',
  OTHER: 'text-muted-foreground',
};

const orbitColors = {
  LEO: 'bg-primary/20 text-primary border-primary/30',
  MEO: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  GEO: 'bg-accent/20 text-accent border-accent/30',
  HEO: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const SatelliteCard = ({ satellite, index = 0 }: SatelliteCardProps) => {
  const Icon = typeIcons[satellite.type];
  // Support both camelCase and snake_case from API
  const orbitClass = satellite.orbitClass || satellite.orbit_class || 'LEO';
  const impactTags = satellite.impactTags || satellite.impact_tags || [];
  const noradId = satellite.noradId || satellite.norad_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-glow rounded-xl p-4 hover:scale-[1.02] transition-transform cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          'bg-secondary/50'
        )}>
          <Icon className={cn('w-6 h-6', typeColors[satellite.type])} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-foreground truncate">
                {satellite.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {satellite.operator}
                {noradId && ` • NORAD ${noradId}`}
              </p>
            </div>
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded-md border shrink-0',
              orbitColors[orbitClass]
            )}>
              {orbitClass}
            </span>
          </div>

          {satellite.description && (
            <p className="text-sm text-muted-foreground/80 mt-2 line-clamp-2">
              {satellite.description}
            </p>
          )}

          {/* Impact Tags */}
          {impactTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {impactTags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'impact-tag',
                    tag === 'weather' && 'impact-tag-weather',
                    tag === 'navigation' && 'impact-tag-nav',
                    tag === 'internet' && 'impact-tag-comm',
                    tag === 'earth' && 'impact-tag-earth'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Position info if available */}
          {satellite.elevation !== undefined && (
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span>Elevation: {satellite.elevation.toFixed(1)}°</span>
              <span>Azimuth: {satellite.azimuth?.toFixed(1)}°</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SatelliteCard;
