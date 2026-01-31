import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, MapPin } from 'lucide-react';
import { ORBIT_COLORS } from '@/lib/orbitColors';

interface GPSLocatingAnimationProps {
  onComplete: () => void;
  duration?: number; // in milliseconds
}

const SATELLITES = [
  { id: 1, name: 'GPS-IIF-12', delay: 0 },
  { id: 2, name: 'GALILEO-23', delay: 0.5 },
  { id: 3, name: 'GLONASS-K1', delay: 1 },
  { id: 4, name: 'GPS-III-06', delay: 1.5 },
];

const STATUS_MESSAGES = [
  { time: 0, message: 'Contacting GNSS satellites...' },
  { time: 3, message: 'Acquiring satellite signals...' },
  { time: 6, message: 'GPS-IIF-12 signal acquired ✓' },
  { time: 9, message: 'GALILEO-23 signal acquired ✓' },
  { time: 12, message: 'GLONASS-K1 signal acquired ✓' },
  { time: 15, message: 'Computing triangulation...' },
  { time: 18, message: 'GPS-III-06 signal acquired ✓' },
  { time: 21, message: 'Refining position accuracy...' },
  { time: 24, message: 'Verifying coordinates...' },
  { time: 27, message: 'Location locked!' },
];

const GPSLocatingAnimation = ({ onComplete, duration = 30000 }: GPSLocatingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(STATUS_MESSAGES[0].message);
  const [lockedSatellites, setLockedSatellites] = useState<number[]>([]);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      // Update status messages
      const elapsedSeconds = elapsed / 1000;
      const currentMessage = [...STATUS_MESSAGES]
        .reverse()
        .find(s => elapsedSeconds >= s.time);
      if (currentMessage) {
        setCurrentStatus(currentMessage.message);
      }

      // Lock satellites progressively
      if (elapsedSeconds >= 6 && !lockedSatellites.includes(1)) {
        setLockedSatellites(prev => [...prev, 1]);
      }
      if (elapsedSeconds >= 9 && !lockedSatellites.includes(2)) {
        setLockedSatellites(prev => [...prev, 2]);
      }
      if (elapsedSeconds >= 12 && !lockedSatellites.includes(3)) {
        setLockedSatellites(prev => [...prev, 3]);
      }
      if (elapsedSeconds >= 18 && !lockedSatellites.includes(4)) {
        setLockedSatellites(prev => [...prev, 4]);
      }

      // Show pulse near the end
      if (elapsedSeconds >= 24) {
        setShowPulse(true);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onComplete, lockedSatellites]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 flex flex-col items-center"
    >
      {/* Main Animation Container */}
      <div className="relative w-80 h-80 mb-8">
        {/* Outer orbit ring */}
        <motion.div
          className="absolute inset-0 border border-dashed rounded-full"
          style={{ borderColor: ORBIT_COLORS.MEO.hex }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Middle orbit ring */}
        <motion.div
          className="absolute inset-8 border border-dashed rounded-full"
          style={{ borderColor: ORBIT_COLORS.MEO.hex, opacity: 0.6 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner orbit ring */}
        <motion.div
          className="absolute inset-16 border border-dashed rounded-full"
          style={{ borderColor: ORBIT_COLORS.LEO.hex, opacity: 0.4 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Earth */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-green-400 to-blue-600 shadow-2xl"
            style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Earth glow */}
            <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl" />
            
            {/* Location pin on Earth */}
            <AnimatePresence>
              {showPulse && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 rounded-full bg-red-500"
                    style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Orbiting Satellites */}
        {SATELLITES.map((sat, index) => {
          const isLocked = lockedSatellites.includes(sat.id);
          const orbitSize = index % 2 === 0 ? 'inset-0' : 'inset-8';
          const duration = 8 + index * 2;
          const direction = index % 2 === 0 ? 360 : -360;
          
          return (
            <motion.div
              key={sat.id}
              className={`absolute ${orbitSize}`}
              animate={{ rotate: direction }}
              transition={{ 
                duration, 
                repeat: Infinity, 
                ease: 'linear',
                delay: sat.delay 
              }}
            >
              {/* Satellite position */}
              <motion.div 
                className="absolute"
                style={{
                  top: index === 0 ? '0%' : index === 1 ? '50%' : index === 2 ? '100%' : '50%',
                  left: index === 0 ? '50%' : index === 1 ? '100%' : index === 2 ? '50%' : '0%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Signal beam to Earth when locked */}
                <AnimatePresence>
                  {isLocked && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3], scaleY: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-20 origin-top"
                      style={{
                        background: `linear-gradient(to bottom, ${ORBIT_COLORS.MEO.hex}, transparent)`,
                      }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Satellite icon */}
                <motion.div
                  animate={isLocked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Satellite 
                    className={`w-5 h-5 ${isLocked ? 'text-green-400' : 'text-yellow-400'}`}
                    style={{ 
                      filter: `drop-shadow(0 0 6px ${isLocked ? '#4ade80' : ORBIT_COLORS.MEO.hex})`,
                    }}
                  />
                </motion.div>
                
                {/* Lock indicator */}
                <AnimatePresence>
                  {isLocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Triangulation lines when satellites are locked */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="signalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ORBIT_COLORS.MEO.hex} stopOpacity="0.6" />
              <stop offset="100%" stopColor={ORBIT_COLORS.LEO.hex} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {lockedSatellites.length >= 3 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Triangulation effect - pulsing circles */}
              <motion.circle
                cx="50%"
                cy="50%"
                r="20"
                fill="none"
                stroke={ORBIT_COLORS.LEO.hex}
                strokeWidth="1"
                animate={{ r: [20, 40, 20], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="30"
                fill="none"
                stroke={ORBIT_COLORS.MEO.hex}
                strokeWidth="1"
                animate={{ r: [30, 50, 30], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
              />
            </motion.g>
          )}
        </svg>
      </div>

      {/* Status Section */}
      <div className="text-center space-y-4 max-w-md">
        {/* Satellite lock status */}
        <div className="flex justify-center gap-3 mb-4">
          {SATELLITES.map((sat) => {
            const isLocked = lockedSatellites.includes(sat.id);
            return (
              <motion.div
                key={sat.id}
                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  isLocked 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-secondary/50 border-border text-muted-foreground'
                }`}
                animate={isLocked ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {sat.name.split('-')[0]}
              </motion.div>
            );
          })}
        </div>

        {/* Status message */}
        <motion.p
          key={currentStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-foreground font-medium"
        >
          {currentStatus}
        </motion.p>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${ORBIT_COLORS.LEO.hex}, ${ORBIT_COLORS.MEO.hex})`,
                width: `${progress}%`
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(progress)}% — Triangulating position using {lockedSatellites.length}/4 satellites
          </p>
        </div>

        {/* Educational note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-xs text-muted-foreground mt-4 max-w-sm mx-auto"
        >
          Your GPS needs signals from at least 4 satellites to calculate your precise 3D position through trilateration.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default GPSLocatingAnimation;
