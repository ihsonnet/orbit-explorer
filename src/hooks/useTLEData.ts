import { useState, useEffect, useCallback } from 'react';
import { 
  updateTLECache, 
  getCachedTLECount,
  classifySatellite,
  classifyOrbitByAltitude,
  TLECacheEntry,
  getCachedSatellitesWithPositionsAsync
} from '@/lib/tleCache';
import { SatelliteInfo, isSatelliteVisible } from '@/lib/satellites';

interface SatelliteWithPosition {
  noradId: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
  operator: string;
  orbitClass: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  type: SatelliteInfo['type'];
  impactTags: string[];
}

export function useTLEData() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [satelliteCount, setSatelliteCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 100, phase: '' });
  const [satellites, setSatellites] = useState<SatelliteWithPosition[]>([]);

  // Initialize and update cache on mount
  useEffect(() => {
    const initCache = async () => {
      setIsLoading(true);
      try {
        const result = await updateTLECache(false, (loaded, total, phase) => {
          setLoadProgress({ loaded, total, phase });
        });
        setSatelliteCount(result.count);
        setLastUpdate(new Date(result.lastUpdate));
        
        // Load satellite positions
        const sats = await getCachedSatellitesWithPositionsAsync();
        const classified = sats.map(sat => {
          const nameClassification = classifySatellite(sat.name);
          // Use actual altitude for orbit classification (more accurate)
          const orbitClass = classifyOrbitByAltitude(sat.alt);
          return {
            ...sat,
            ...nameClassification,
            orbitClass, // Override with altitude-based classification
          };
        });
        setSatellites(classified);
      } catch (err) {
        setError('Failed to fetch satellite data');
        console.error('TLE update error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initCache();
  }, []);

  // Force refresh cache
  const refreshCache = useCallback(async () => {
    setIsUpdating(true);
    try {
      const result = await updateTLECache(true, (loaded, total, phase) => {
        setLoadProgress({ loaded, total, phase });
      });
      setSatelliteCount(result.count);
      setLastUpdate(new Date(result.lastUpdate));
      setError(null);
      
      // Reload positions
      const sats = await getCachedSatellitesWithPositionsAsync();
      const classified = sats.map(sat => {
        const nameClassification = classifySatellite(sat.name);
        const orbitClass = classifyOrbitByAltitude(sat.alt);
        return {
          ...sat,
          ...nameClassification,
          orbitClass,
        };
      });
      setSatellites(classified);
    } catch (err) {
      setError('Failed to refresh satellite data');
      console.error('TLE refresh error:', err);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Get satellites visible from a location
  const getSatellitesAbove = useCallback((
    lat: number, 
    lng: number, 
    minElevation = 10
  ): Array<SatelliteWithPosition & { elevation: number; azimuth: number }> => {
    const visibleSatellites: Array<SatelliteWithPosition & { elevation: number; azimuth: number }> = [];

    for (const sat of satellites) {
      const visibility = isSatelliteVisible(lat, lng, sat.lat, sat.lng, sat.alt);
      if (visibility.visible && visibility.elevation >= minElevation) {
        visibleSatellites.push({
          ...sat,
          elevation: visibility.elevation,
          azimuth: visibility.azimuth,
        });
      }
    }

    return visibleSatellites.sort((a, b) => b.elevation - a.elevation);
  }, [satellites]);

  return {
    isLoading,
    isUpdating,
    error,
    satelliteCount,
    lastUpdate,
    loadProgress,
    refreshCache,
    getSatellitesAbove,
  };
}

// Hook for satellite positions with periodic updates
export function useSatellitePositions(updateInterval = 30000) {
  const [satellites, setSatellites] = useState<SatelliteWithPosition[]>([]);
  
  useEffect(() => {
    const loadPositions = async () => {
      const sats = await getCachedSatellitesWithPositionsAsync();
      const classified = sats.map(sat => {
        const nameClassification = classifySatellite(sat.name);
        const orbitClass = classifyOrbitByAltitude(sat.alt);
        return {
          ...sat,
          ...nameClassification,
          orbitClass,
        };
      });
      setSatellites(classified);
    };

    loadPositions();
    const interval = setInterval(loadPositions, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  return satellites;
}
