import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite } from 'lucide-react';

interface GPSLocatingAnimationProps {
  onComplete: () => void;
  duration?: number;
}

const SATELLITES = [
  { id: 1, name: 'GPS', angle: 0 },
  { id: 2, name: 'GALILEO', angle: 90 },
  { id: 3, name: 'GLONASS', angle: 180 },
  { id: 4, name: 'BEIDOU', angle: 270 },
];

const GPSLocatingAnimation = ({ onComplete, duration = 5000 }: GPSLocatingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [activeSatellites, setActiveSatellites] = useState<number[]>([]);
  const [showLocation, setShowLocation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Searching for satellites...');

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      const elapsedSeconds = elapsed / 1000;
      
      if (elapsedSeconds >= 0.8 && !activeSatellites.includes(1)) {
        setActiveSatellites(prev => [...prev, 1]);
        setStatusMessage('GPS signal acquired');
      }
      if (elapsedSeconds >= 1.6 && !activeSatellites.includes(2)) {
        setActiveSatellites(prev => [...prev, 2]);
        setStatusMessage('GALILEO signal acquired');
      }
      if (elapsedSeconds >= 2.4 && !activeSatellites.includes(3)) {
        setActiveSatellites(prev => [...prev, 3]);
        setStatusMessage('GLONASS signal acquired');
      }
      if (elapsedSeconds >= 3.2 && !activeSatellites.includes(4)) {
        setActiveSatellites(prev => [...prev, 4]);
        setStatusMessage('BEIDOU signal acquired');
      }
      if (elapsedSeconds >= 4) {
        setStatusMessage('Computing position...');
      }
      if (elapsedSeconds >= 4.5) {
        setShowLocation(true);
        setStatusMessage('Location found');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete, activeSatellites]);

  const orbitRadius = 42;
  const earthRadius = 12;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-10 flex flex-col items-center"
    >
      {/* Main Visualization */}
      <div className="relative w-72 h-72 mb-8">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 100 100"
          style={{ overflow: 'visible' }}
        >
          {/* Orbit path */}
          <circle
            cx="50"
            cy="50"
            r={orbitRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="2 2"
            className="text-muted-foreground/30"
          />

          {/* Earth */}
          <circle
            cx="50"
            cy="50"
            r={earthRadius}
            className="fill-primary/20"
            stroke="currentColor"
            strokeWidth="0.5"
            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.3))' }}
          />
          
          {/* Earth inner glow */}
          <circle
            cx="50"
            cy="50"
            r={earthRadius - 2}
            className="fill-primary/10"
          />

          {/* Satellites orbiting with their distance circles */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
          >
            {SATELLITES.map((sat) => {
              const isActive = activeSatellites.includes(sat.id);
              const satX = 50 + orbitRadius * Math.cos((sat.angle * Math.PI) / 180);
              const satY = 50 + orbitRadius * Math.sin((sat.angle * Math.PI) / 180);
              const distance = orbitRadius;
              
              return (
                <g key={`sat-${sat.id}`}>
                  {/* Distance circle - moves with satellite */}
                  {isActive && (
                    <>
                      <motion.circle
                        cx={satX}
                        cy={satY}
                        fill="none"
                        className="stroke-muted-foreground/30"
                        strokeWidth="0.3"
                        strokeDasharray="1.5 1"
                        initial={{ r: 0, opacity: 0 }}
                        animate={{ r: distance, opacity: 0.6 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                      
                      {/* Subtle pulse on circle */}
                      <motion.circle
                        cx={satX}
                        cy={satY}
                        fill="none"
                        className="stroke-primary/30"
                        strokeWidth="0.2"
                        initial={{ r: distance - 2 }}
                        animate={{ r: distance + 3, opacity: [0.4, 0] }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: 'easeOut'
                        }}
                      />
                    </>
                  )}

                  {/* Connection line to Earth center when location found */}
                  {showLocation && isActive && (
                    <motion.line
                      x1={satX}
                      y1={satY}
                      x2="50"
                      y2="50"
                      className="stroke-primary/40"
                      strokeWidth="0.3"
                      strokeDasharray="1 1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  {/* Satellite glow */}
                  {isActive && (
                    <motion.circle
                      cx={satX}
                      cy={satY}
                      r="3"
                      className="fill-primary/15"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Satellite dot */}
                  <circle
                    cx={satX}
                    cy={satY}
                    r="1.5"
                    className={isActive ? 'fill-primary' : 'fill-muted-foreground/40'}
                  />
                  
                  {/* Label - counter-rotate to keep text readable */}
                  <motion.g
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: `${satX}px ${satY}px` }}
                  >
                    <text
                      x={satX}
                      y={satY - 4}
                      textAnchor="middle"
                      className={`text-[2.5px] font-medium ${isActive ? 'fill-foreground' : 'fill-muted-foreground/40'}`}
                    >
                      {sat.name}
                    </text>
                  </motion.g>
                </g>
              );
            })}
          </motion.g>

          {/* Location point on Earth */}
          <AnimatePresence>
            {showLocation && (
              <g>
                {/* Pulse rings */}
                <motion.circle
                  cx="50"
                  cy="50"
                  fill="none"
                  className="stroke-destructive"
                  strokeWidth="0.5"
                  initial={{ r: 0, opacity: 1 }}
                  animate={{ r: 6, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                
                {/* Location dot */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="2"
                  className="fill-destructive"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                />
              </g>
            )}
          </AnimatePresence>

        </svg>
      </div>

      {/* Status */}
      <div className="text-center space-y-4 w-full max-w-xs">
        {/* Satellite indicators */}
        <div className="flex justify-center gap-2">
          {SATELLITES.map((sat) => {
            const isActive = activeSatellites.includes(sat.id);
            return (
              <div
                key={sat.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            );
          })}
        </div>

        {/* Status text */}
        <motion.p
          key={statusMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-foreground"
        >
          {statusMessage}
        </motion.p>

        {/* Progress */}
        <div className="px-4">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {activeSatellites.length}/4 satellites connected
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GPSLocatingAnimation;
