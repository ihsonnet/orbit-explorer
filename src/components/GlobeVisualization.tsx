import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import { sampleSatellites, type SatelliteInfo } from '@/lib/satellites';

interface SatellitePoint {
  lat: number;
  lng: number;
  alt: number;
  name: string;
  type: string;
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

const GlobeVisualization = () => {
  const globeRef = useRef<any>();
  const [satellites, setSatellites] = useState<SatellitePoint[]>([]);
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteInfo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Generate satellite positions around the globe
    const satPoints: SatellitePoint[] = sampleSatellites.map((sat, index) => {
      // Distribute satellites around the globe based on their orbit type
      const lat = (Math.random() - 0.5) * 160;
      const lng = (index * 36) % 360 - 180;
      const alt = sat.orbitClass === 'GEO' ? 0.5 : 
                  sat.orbitClass === 'MEO' ? 0.3 : 0.1;

      return {
        lat,
        lng,
        alt,
        name: sat.name,
        type: sat.type,
        color: typeColors[sat.type] || typeColors.OTHER,
      };
    });

    setSatellites(satPoints);
  }, []);

  useEffect(() => {
    // Auto-rotate the globe
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
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-transparent to-background" />
      
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#00d4ff"
        atmosphereAltitude={0.15}
        pointsData={satellites}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="alt"
        pointColor="color"
        pointRadius={0.5}
        pointLabel={(d: any) => `
          <div class="bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
            <div class="font-semibold text-foreground">${d.name}</div>
            <div class="text-xs text-muted-foreground">${d.type}</div>
          </div>
        `}
        onPointClick={(point: any) => {
          const sat = sampleSatellites.find(s => s.name === point.name);
          if (sat) setSelectedSatellite(sat);
        }}
      />

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
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
          <h4 className="font-display font-semibold text-foreground pr-6">
            {selectedSatellite.name}
          </h4>
          <p className="text-xs text-primary mt-1">{selectedSatellite.operator}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {selectedSatellite.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-3">
            {selectedSatellite.impactTags.map(tag => (
              <span key={tag} className="impact-tag text-xs">{tag}</span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GlobeVisualization;
