import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'framer-motion';
import { useTLEData, useSatellitePositions } from '@/hooks/useTLEData';
import { SatelliteFilters } from './SatelliteFilterPanel';
import { Progress } from './ui/progress';
import { ORBIT_COLORS } from '@/lib/orbitColors';
import { Check, X } from 'lucide-react';

interface SatellitePoint {
  lat: number;
  lng: number;
  alt: number;
  name: string;
  noradId: string;
  type: string;
  operator: string;
  orbitClass: string;
  color: string;
}

const typeColors: Record<string, string> = {
  COMMUNICATION: '#a855f7',
  GNSS: '#eab308',
  WEATHER: '#3b82f6',
  EARTH_OBSERVATION: '#22c55e',
  SCIENCE: '#00d4ff',
  OTHER: '#6b7280',
};

const SATELLITE_TYPES = [
  { id: 'COMMUNICATION', label: 'Communication' },
  { id: 'GNSS', label: 'Navigation' },
  { id: 'WEATHER', label: 'Weather' },
  { id: 'EARTH_OBSERVATION', label: 'Earth Obs' },
  { id: 'SCIENCE', label: 'Science' },
  { id: 'OTHER', label: 'Other' },
];

const ORBIT_CLASSES = [
  { id: 'LEO' as const, label: 'LEO' },
  { id: 'MEO' as const, label: 'MEO' },
  { id: 'GEO' as const, label: 'GEO' },
  { id: 'HEO' as const, label: 'HEO' },
];

const MAJOR_OPERATORS = [
  'SpaceX',
  'NASA',
  'NOAA',
  'ESA',
  'US Space Force',
  'Roscosmos',
  'Iridium',
];

interface GlobeVisualizationProps {
  filters: SatelliteFilters;
  onFiltersChange: (filters: SatelliteFilters) => void;
  onOperatorsLoaded?: (operators: string[]) => void;
}

const GlobeVisualization = ({ filters, onFiltersChange, onOperatorsLoaded }: GlobeVisualizationProps) => {
  const globeRef = useRef<any>();
  const { isLoading, loadProgress, satelliteCount } = useTLEData();
  const satellites = useSatellitePositions(30000);
  const [allPoints, setAllPoints] = useState<SatellitePoint[]>([]);
  const [selectedSatellite, setSelectedSatellite] = useState<SatellitePoint | null>(null);
  const [satelliteScreenPos, setSatelliteScreenPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [availableOperators, setAvailableOperators] = useState<string[]>([]);

  // Filter toggle functions
  const toggleType = (typeId: string) => {
    const newTypes = filters.types.includes(typeId)
      ? filters.types.filter(t => t !== typeId)
      : [...filters.types, typeId];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const toggleOrbitClass = (orbitId: string) => {
    const newOrbits = filters.orbitClasses.includes(orbitId)
      ? filters.orbitClasses.filter(o => o !== orbitId)
      : [...filters.orbitClasses, orbitId];
    onFiltersChange({ ...filters, orbitClasses: newOrbits });
  };

  const toggleOperator = (operator: string) => {
    const newOperators = filters.operators.includes(operator)
      ? filters.operators.filter(o => o !== operator)
      : [...filters.operators, operator];
    onFiltersChange({ ...filters, operators: newOperators });
  };

  const clearAllFilters = () => {
    onFiltersChange({ types: [], orbitClasses: [], operators: [] });
  };

  const hasActiveFilters = filters.types.length > 0 || filters.orbitClasses.length > 0 || filters.operators.length > 0;

  useEffect(() => {
    const satPoints: SatellitePoint[] = satellites.map((sat) => {
      const normalizedAlt = sat.orbitClass === 'GEO' ? 0.5 : 
                           sat.orbitClass === 'MEO' ? 0.3 : 
                           0.05 + (sat.alt / 2000) * 0.1;

      return {
        lat: sat.lat,
        lng: sat.lng,
        alt: Math.min(normalizedAlt, 0.6),
        name: sat.name,
        noradId: sat.noradId,
        type: sat.type,
        operator: sat.operator,
        orbitClass: sat.orbitClass,
        color: typeColors[sat.type] || typeColors.OTHER,
      };
    });

    setAllPoints(satPoints);

    // Extract unique operators
    if (satPoints.length > 0) {
      const operators = [...new Set(satPoints.map(p => p.operator))].filter(Boolean);
      setAvailableOperators(operators);
      if (onOperatorsLoaded) {
        onOperatorsLoaded(operators);
      }
    }
  }, [satellites, onOperatorsLoaded]);

  // Apply filters to points - limit each satellite type to 300 on initial load for performance
  const filteredPoints = useMemo(() => {
    const hasTypeFilter = filters?.types.length > 0;
    const hasOrbitFilter = filters?.orbitClasses.length > 0;
    const hasOperatorFilter = filters?.operators.length > 0;
    const hasAnyFilter = hasTypeFilter || hasOrbitFilter || hasOperatorFilter;

    // When no filters applied, limit each satellite type to 300 for smooth initial experience
    if (!hasAnyFilter) {
      const MAX_PER_TYPE = 300;
      const sampledPoints: SatellitePoint[] = [];
      const typeGroups: Record<string, SatellitePoint[]> = {};
      
      allPoints.forEach(point => {
        if (!typeGroups[point.type]) {
          typeGroups[point.type] = [];
        }
        typeGroups[point.type].push(point);
      });
      
      Object.values(typeGroups).forEach(group => {
        if (group.length <= MAX_PER_TYPE) {
          sampledPoints.push(...group);
        } else {
          const step = Math.ceil(group.length / MAX_PER_TYPE);
          const sampled = group.filter((_, i) => i % step === 0);
          sampledPoints.push(...sampled);
        }
      });
      
      return sampledPoints;
    }

    // When filters are active, show ALL matching satellites
    return allPoints.filter(point => {
      const matchesType = !hasTypeFilter || filters.types.includes(point.type);
      const matchesOrbit = !hasOrbitFilter || filters.orbitClasses.includes(point.orbitClass);
      const matchesOperator = !hasOperatorFilter || filters.operators.includes(point.operator);
      
      return matchesType && matchesOrbit && matchesOperator;
    });
  }, [allPoints, filters]);

  // Update satellite screen position when selected
  useEffect(() => {
    if (!selectedSatellite || !globeRef.current) {
      setSatelliteScreenPos(null);
      return;
    }

    const updatePosition = () => {
      if (!globeRef.current) return;
      
      const coords = globeRef.current.getScreenCoords(
        selectedSatellite.lat,
        selectedSatellite.lng,
        selectedSatellite.alt
      );
      
      if (coords && coords.x !== undefined && coords.y !== undefined) {
        setSatelliteScreenPos({ x: coords.x, y: coords.y });
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [selectedSatellite]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ altitude: 2.5 });
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Combine major operators with available operators
  const displayOperators = [...new Set([...MAJOR_OPERATORS, ...availableOperators])].slice(0, 10);

  return (
    <div ref={containerRef} className="relative w-full h-[600px] rounded-2xl overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      {(isLoading || allPoints.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center max-w-xs w-full px-4">
            <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground mb-3">
              {loadProgress.phase || 'Loading satellite positions...'}
            </p>
            <Progress value={loadProgress.loaded} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {satelliteCount > 0 ? `${satelliteCount.toLocaleString()} satellites` : `${loadProgress.loaded}%`}
            </p>
          </div>
        </div>
      )}
      
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#00d4ff"
        atmosphereAltitude={0.15}
        htmlElementsData={filteredPoints}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude="alt"
        htmlElement={(d: any) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${d.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px ${d.color});">
              <path d="M13 7 9 3 5 7l4 4" />
              <path d="m17 11 4 4-4 4-4-4" />
              <path d="m8 12 4 4 6-6-4-4Z" />
              <path d="m16 8 3-3" />
              <path d="M9 21a6 6 0 0 0-6-6" />
            </svg>
          `;
          el.style.cursor = 'pointer';
          el.style.pointerEvents = 'auto';
          el.title = `${d.name}\n${d.operator}\n${d.type.replace('_', ' ')} • ${d.orbitClass}`;
          el.onclick = () => setSelectedSatellite(d);
          return el;
        }}
      />

      {/* Top Left: Stats + Orbit Class Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-20 space-y-3"
      >
        {/* Satellite Count */}
        <div className="bg-card/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-border">
          <div className="text-2xl font-display font-bold text-primary">{filteredPoints.length.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">
            {hasActiveFilters 
              ? `of ${allPoints.length.toLocaleString()} satellites` 
              : `Showing (max 300/type)`}
          </div>
          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Orbit Class Filters */}
        <div className="bg-card/90 backdrop-blur-sm rounded-xl p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Orbit Class</p>
          <div className="flex flex-wrap gap-1.5">
            {ORBIT_CLASSES.map((orbit) => {
              const isActive = filters.orbitClasses.includes(orbit.id);
              const colors = ORBIT_COLORS[orbit.id];
              return (
                <button
                  key={orbit.id}
                  onClick={() => toggleOrbitClass(orbit.id)}
                  className={`
                    flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all
                    ${isActive 
                      ? `${colors.bg} ${colors.border} ${colors.tailwind}` 
                      : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }
                    border
                  `}
                >
                  {orbit.label}
                  {isActive && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Bottom Left: Satellite Type Filters (Legend) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 left-4 z-20 bg-card/90 backdrop-blur-sm rounded-xl p-4 border border-border"
      >
        <h4 className="font-display text-sm font-semibold mb-3 text-foreground">Satellite Types</h4>
        <div className="space-y-1.5">
          {SATELLITE_TYPES.map((type) => {
            const isActive = filters.types.includes(type.id);
            const color = typeColors[type.id];
            return (
              <button
                key={type.id}
                onClick={() => toggleType(type.id)}
                className={`
                  flex items-center gap-2 w-full text-left px-2 py-1 rounded-lg text-xs transition-all
                  ${isActive 
                    ? 'bg-primary/20 text-foreground' 
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }
                `}
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="flex-1">{type.label}</span>
                {isActive && <Check className="w-3 h-3 text-primary" />}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Right Side: Operator Filters */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 bottom-6 z-20 w-36"
      >
        <div className="bg-card/90 backdrop-blur-sm rounded-xl p-3 border border-border h-full overflow-hidden flex flex-col">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Operators</p>
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {displayOperators.map((operator) => {
              const isActive = filters.operators.includes(operator);
              return (
                <button
                  key={operator}
                  onClick={() => toggleOperator(operator)}
                  className={`
                    flex items-center gap-1 w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all
                    ${isActive 
                      ? 'bg-primary/20 text-foreground' 
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }
                  `}
                >
                  <span className="flex-1 truncate">{operator}</span>
                  {isActive && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Satellite Info - Follows satellite position */}
      <AnimatePresence>
        {selectedSatellite && satelliteScreenPos && (
          <motion.div
            key="satellite-info"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute',
              left: Math.min(Math.max(satelliteScreenPos.x + 20, 10), dimensions.width - 200),
              top: Math.min(Math.max(satelliteScreenPos.y - 60, 10), dimensions.height - 150),
            }}
            className="z-30 bg-card/95 backdrop-blur-sm rounded-xl p-3 border border-border max-w-[180px] pointer-events-auto"
          >
            <button 
              onClick={() => setSelectedSatellite(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground text-xs"
            >
              ×
            </button>
            <h4 className="font-display font-semibold text-foreground text-sm leading-tight">
              {selectedSatellite.name}
            </h4>
            <p className="text-xs text-primary mt-0.5">{selectedSatellite.operator}</p>
            <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
              <p>ID: {selectedSatellite.noradId}</p>
              <p>{selectedSatellite.lat.toFixed(2)}°, {selectedSatellite.lng.toFixed(2)}°</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="impact-tag text-[10px] px-1.5 py-0.5">{selectedSatellite.type.replace('_', ' ')}</span>
              <span className="impact-tag text-[10px] px-1.5 py-0.5">{selectedSatellite.orbitClass}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobeVisualization;
