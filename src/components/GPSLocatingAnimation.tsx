import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite } from 'lucide-react';
import { ORBIT_COLORS } from '@/lib/orbitColors';

interface GPSLocatingAnimationProps {
  onComplete: () => void;
  duration?: number;
}

const SATELLITES = [
  { id: 1, name: 'GPS-IIF', x: 15, y: 20, delay: 0 },
  { id: 2, name: 'GALILEO', x: 85, y: 25, delay: 0.8 },
  { id: 3, name: 'GLONASS', x: 20, y: 80, delay: 1.6 },
  { id: 4, name: 'GPS-III', x: 80, y: 75, delay: 2.4 },
];

// Location point (center where circles intersect)
const LOCATION = { x: 50, y: 50 };

const GPSLocatingAnimation = ({ onComplete, duration = 10000 }: GPSLocatingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [activeSatellites, setActiveSatellites] = useState<number[]>([]);
  const [showLocation, setShowLocation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Contacting GNSS satellites...');

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      // Activate satellites progressively
      const elapsedSeconds = elapsed / 1000;
      
      if (elapsedSeconds >= 1 && !activeSatellites.includes(1)) {
        setActiveSatellites(prev => [...prev, 1]);
        setStatusMessage('GPS-IIF signal acquired...');
      }
      if (elapsedSeconds >= 2.5 && !activeSatellites.includes(2)) {
        setActiveSatellites(prev => [...prev, 2]);
        setStatusMessage('GALILEO signal acquired...');
      }
      if (elapsedSeconds >= 4 && !activeSatellites.includes(3)) {
        setActiveSatellites(prev => [...prev, 3]);
        setStatusMessage('GLONASS signal acquired...');
      }
      if (elapsedSeconds >= 5.5 && !activeSatellites.includes(4)) {
        setActiveSatellites(prev => [...prev, 4]);
        setStatusMessage('GPS-III signal acquired...');
      }
      if (elapsedSeconds >= 7) {
        setStatusMessage('Calculating intersection point...');
      }
      if (elapsedSeconds >= 8) {
        setShowLocation(true);
        setStatusMessage('Location locked!');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete, activeSatellites]);

  // Calculate distance from satellite to location for circle radius
  const getDistance = (sat: typeof SATELLITES[0]) => {
    const dx = sat.x - LOCATION.x;
    const dy = sat.y - LOCATION.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-8 flex flex-col items-center"
    >
      {/* Main Visualization */}
      <div className="relative w-80 h-80 mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background grid for context */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-border" />
            </pattern>
            
            {/* Glow filter for location */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100" height="100" fill="url(#grid)" opacity="0.3" />

          {/* Expanding circles from each satellite */}
          {SATELLITES.map((sat) => {
            const isActive = activeSatellites.includes(sat.id);
            const distance = getDistance(sat);
            
            return (
              <g key={sat.id}>
                {/* Signal circles expanding to reach the location point */}
                {isActive && (
                  <>
                    {/* Main distance circle (fixed at intersection) */}
                    <motion.circle
                      cx={sat.x}
                      cy={sat.y}
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: distance, opacity: 0.6 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      fill="none"
                      stroke={ORBIT_COLORS.MEO.hex}
                      strokeWidth="0.5"
                      strokeDasharray="2 1"
                    />
                    
                    {/* Pulsing expanding circles (signal waves) */}
                    <motion.circle
                      cx={sat.x}
                      cy={sat.y}
                      fill="none"
                      stroke={ORBIT_COLORS.LEO.hex}
                      strokeWidth="0.3"
                      initial={{ r: 0, opacity: 0.8 }}
                      animate={{ r: [0, distance + 10], opacity: [0.8, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: sat.delay,
                        ease: 'easeOut'
                      }}
                    />
                    <motion.circle
                      cx={sat.x}
                      cy={sat.y}
                      fill="none"
                      stroke={ORBIT_COLORS.LEO.hex}
                      strokeWidth="0.2"
                      initial={{ r: 0, opacity: 0.5 }}
                      animate={{ r: [0, distance + 15], opacity: [0.5, 0] }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        delay: sat.delay + 0.5,
                        ease: 'easeOut'
                      }}
                    />

                    {/* Line from satellite to location (when showing location) */}
                    {showLocation && (
                      <motion.line
                        x1={sat.x}
                        y1={sat.y}
                        x2={LOCATION.x}
                        y2={LOCATION.y}
                        stroke={ORBIT_COLORS.MEO.hex}
                        strokeWidth="0.3"
                        strokeDasharray="1 1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </>
                )}
              </g>
            );
          })}

          {/* Location point (intersection) */}
          <AnimatePresence>
            {showLocation && (
              <g filter="url(#glow)">
                {/* Pulsing rings at location */}
                <motion.circle
                  cx={LOCATION.x}
                  cy={LOCATION.y}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="0.5"
                  initial={{ r: 0, opacity: 1 }}
                  animate={{ r: [0, 8], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.circle
                  cx={LOCATION.x}
                  cy={LOCATION.y}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="0.3"
                  initial={{ r: 0, opacity: 0.7 }}
                  animate={{ r: [0, 12], opacity: [0.7, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                
                {/* Center dot */}
                <motion.circle
                  cx={LOCATION.x}
                  cy={LOCATION.y}
                  r="2"
                  fill="#ef4444"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                
                {/* "You" label */}
                <motion.text
                  x={LOCATION.x}
                  y={LOCATION.y + 7}
                  textAnchor="middle"
                  className="text-[3px] fill-foreground font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  YOUR LOCATION
                </motion.text>
              </g>
            )}
          </AnimatePresence>

          {/* Satellites */}
          {SATELLITES.map((sat) => {
            const isActive = activeSatellites.includes(sat.id);
            
            return (
              <g key={`sat-${sat.id}`}>
                {/* Satellite glow when active */}
                {isActive && (
                  <motion.circle
                    cx={sat.x}
                    cy={sat.y}
                    r="3"
                    fill={ORBIT_COLORS.MEO.hex}
                    opacity="0.3"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                {/* Satellite icon representation */}
                <motion.circle
                  cx={sat.x}
                  cy={sat.y}
                  r="2"
                  fill={isActive ? ORBIT_COLORS.MEO.hex : 'currentColor'}
                  className={isActive ? '' : 'text-muted-foreground'}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: isActive ? 1 : 0.5 }}
                />
                
                {/* Satellite label */}
                <text
                  x={sat.x}
                  y={sat.y - 4}
                  textAnchor="middle"
                  className={`text-[2.5px] font-medium ${isActive ? 'fill-foreground' : 'fill-muted-foreground'}`}
                >
                  {sat.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Satellite icons overlay */}
        {SATELLITES.map((sat) => {
          const isActive = activeSatellites.includes(sat.id);
          return (
            <motion.div
              key={`icon-${sat.id}`}
              className="absolute"
              style={{
                left: `${sat.x}%`,
                top: `${sat.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Satellite 
                className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-muted-foreground'}`}
                style={isActive ? { filter: `drop-shadow(0 0 4px ${ORBIT_COLORS.MEO.hex})` } : {}}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Status Section */}
      <div className="text-center space-y-3 max-w-sm">
        {/* Satellite status indicators */}
        <div className="flex justify-center gap-2 flex-wrap">
          {SATELLITES.map((sat) => {
            const isActive = activeSatellites.includes(sat.id);
            return (
              <motion.div
                key={sat.id}
                className={`px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                  isActive 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-secondary/50 border-border text-muted-foreground'
                }`}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {sat.name} {isActive && '✓'}
              </motion.div>
            );
          })}
        </div>

        {/* Status message */}
        <motion.p
          key={statusMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-foreground font-medium"
        >
          {statusMessage}
        </motion.p>

        {/* Progress bar */}
        <div className="w-56 mx-auto">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${ORBIT_COLORS.LEO.hex}, ${ORBIT_COLORS.MEO.hex})`,
                width: `${progress}%`
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Trilateration: {activeSatellites.length}/4 satellites
          </p>
        </div>

        {/* Educational note */}
        <p className="text-xs text-muted-foreground mt-2">
          GPS calculates your position by finding where distance circles from multiple satellites intersect.
        </p>
      </div>
    </motion.div>
  );
};

export default GPSLocatingAnimation;
