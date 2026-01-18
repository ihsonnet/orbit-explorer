import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import { useSatellitePositions } from '@/hooks/useTLEData';
import { SatelliteFilters } from './SatelliteFilterPanel';

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

interface GlobeVisualizationProps {
  filters?: SatelliteFilters;
  onOperatorsLoaded?: (operators: string[]) => void;
}

const GlobeVisualization = ({ filters, onOperatorsLoaded }: GlobeVisualizationProps) => {
  const globeRef = useRef<any>();
  const satellites = useSatellitePositions(30000);
  const [allPoints, setAllPoints] = useState<SatellitePoint[]>([]);
  const [selectedSatellite, setSelectedSatellite] = useState<SatellitePoint | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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

    // Extract unique operators and notify parent
    if (onOperatorsLoaded && satPoints.length > 0) {
      const operators = [...new Set(satPoints.map(p => p.operator))].filter(Boolean);
      onOperatorsLoaded(operators);
    }
  }, [satellites, onOperatorsLoaded]);

  // Apply filters to points
  const filteredPoints = useMemo(() => {
    if (!filters) return allPoints;

    const hasTypeFilter = filters.types.length > 0;
    const hasOrbitFilter = filters.orbitClasses.length > 0;
    const hasOperatorFilter = filters.operators.length > 0;

    if (!hasTypeFilter && !hasOrbitFilter && !hasOperatorFilter) {
      return allPoints;
    }

    return allPoints.filter(point => {
      const matchesType = !hasTypeFilter || filters.types.includes(point.type);
      const matchesOrbit = !hasOrbitFilter || filters.orbitClasses.includes(point.orbitClass);
      const matchesOperator = !hasOperatorFilter || filters.operators.includes(point.operator);
      
      return matchesType && matchesOrbit && matchesOperator;
    });
  }, [allPoints, filters]);

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

  return (
    <div ref={containerRef} className="relative w-full h-[600px] rounded-2xl overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      {allPoints.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading satellite positions...</p>
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

      {/* Stats overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-20 bg-card/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-border"
      >
        <div className="text-2xl font-display font-bold text-primary">{filteredPoints.length}</div>
        <div className="text-xs text-muted-foreground">
          {filteredPoints.length === allPoints.length ? 'Live Satellites' : `of ${allPoints.length} satellites`}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 left-6 z-20 bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border"
      >
        <h4 className="font-display text-sm font-semibold mb-3 text-foreground">Satellite Types</h4>
        <div className="space-y-2">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground capitalize">
                {type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Selected satellite info */}
      {selectedSatellite && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 right-6 z-20 bg-card/90 backdrop-blur-sm rounded-xl p-4 border border-border max-w-xs"
        >
          <button 
            onClick={() => setSelectedSatellite(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-xl"
          >
            ×
          </button>
          <h4 className="font-display font-semibold text-foreground pr-6">
            {selectedSatellite.name}
          </h4>
          <p className="text-xs text-primary mt-1">{selectedSatellite.operator}</p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>NORAD ID: {selectedSatellite.noradId}</p>
            <p>Orbit: {selectedSatellite.orbitClass}</p>
            <p>Position: {selectedSatellite.lat.toFixed(2)}°, {selectedSatellite.lng.toFixed(2)}°</p>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            <span className="impact-tag text-xs">{selectedSatellite.type.replace('_', ' ')}</span>
            <span className="impact-tag text-xs">{selectedSatellite.orbitClass}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GlobeVisualization;
