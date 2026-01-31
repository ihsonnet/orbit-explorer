import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GPSLocatingAnimationProps {
  onComplete: () => void;
  duration?: number;
}

const SATELLITES = [
  { id: 1, name: 'GPS', angle: 45 },
  { id: 2, name: 'GALILEO', angle: 135 },
  { id: 3, name: 'GLONASS', angle: 225 },
  { id: 4, name: 'BEIDOU', angle: 315 },
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

  const orbitRadius = 38;
  const earthRadius = 14;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-8 flex flex-col items-center"
    >
      {/* Main Visualization */}
      <div className="relative w-64 h-64 mb-6">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 100 100"
        >
          {/* Orbit path - GEO orbit ring */}
          <circle
            cx="50"
            cy="50"
            r={orbitRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeDasharray="2 1.5"
            className="text-muted-foreground/20"
          />

          {/* Earth with gradient */}
          <defs>
            <radialGradient id="earthGradient" cx="40%" cy="40%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
            </radialGradient>
          </defs>
          
          <circle
            cx="50"
            cy="50"
            r={earthRadius}
            fill="url(#earthGradient)"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="0.5"
          />

          {/* Static satellites on orbit */}
          {SATELLITES.map((sat) => {
            const isActive = activeSatellites.includes(sat.id);
            const satX = 50 + orbitRadius * Math.cos((sat.angle * Math.PI) / 180);
            const satY = 50 + orbitRadius * Math.sin((sat.angle * Math.PI) / 180);
            
            return (
              <g key={`sat-${sat.id}`}>
                {/* Communication signal - traveling dots from satellite to Earth */}
                {isActive && (
                  <>
                    {/* Signal beam path (subtle) */}
                    <line
                      x1={satX}
                      y1={satY}
                      x2="50"
                      y2="50"
                      stroke="hsl(var(--primary) / 0.15)"
                      strokeWidth="0.3"
                    />
                    
                    {/* Animated signal pulse traveling to Earth */}
                    <motion.circle
                      r="1"
                      fill="hsl(var(--primary))"
                      initial={{ 
                        cx: satX, 
                        cy: satY,
                        opacity: 0.8
                      }}
                      animate={{ 
                        cx: 50, 
                        cy: 50,
                        opacity: [0.8, 0.4, 0]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: 'linear',
                        delay: sat.id * 0.2
                      }}
                    />
                    
                    {/* Second pulse offset */}
                    <motion.circle
                      r="0.8"
                      fill="hsl(var(--primary))"
                      initial={{ 
                        cx: satX, 
                        cy: satY,
                        opacity: 0.6
                      }}
                      animate={{ 
                        cx: 50, 
                        cy: 50,
                        opacity: [0.6, 0.3, 0]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: 'linear',
                        delay: sat.id * 0.2 + 0.75
                      }}
                    />
                  </>
                )}

                {/* Satellite glow when active */}
                {isActive && (
                  <motion.circle
                    cx={satX}
                    cy={satY}
                    r="3"
                    fill="hsl(var(--primary) / 0.2)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                {/* Satellite dot */}
                <circle
                  cx={satX}
                  cy={satY}
                  r="2"
                  fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)'}
                />
                
                {/* Satellite label */}
                <text
                  x={satX}
                  y={satY - 5}
                  textAnchor="middle"
                  fontSize="3"
                  fontWeight="500"
                  fill={isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground) / 0.4)'}
                >
                  {sat.name}
                </text>
              </g>
            );
          })}

          {/* Location point on Earth */}
          <AnimatePresence>
            {showLocation && (
              <g>
                {/* Pulse ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="0.6"
                  initial={{ r: 1, opacity: 1 }}
                  animate={{ r: 8, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
                
                {/* Location dot */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="2.5"
                  fill="hsl(var(--destructive))"
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
      <div className="text-center space-y-3 w-full max-w-xs">
        {/* Satellite indicators */}
        <div className="flex justify-center gap-3">
          {SATELLITES.map((sat) => {
            const isActive = activeSatellites.includes(sat.id);
            return (
              <div key={sat.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isActive ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]' : 'bg-muted-foreground/30'
                  }`}
                />
                <span className={`text-[10px] ${isActive ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {sat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status text */}
        <motion.p
          key={statusMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-foreground font-medium"
        >
          {statusMessage}
        </motion.p>

        {/* Progress bar */}
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
