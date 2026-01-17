import { useState, useEffect, useCallback } from 'react';
import { 
  updateTLECache, 
  loadTLECache, 
  getCachedSatellitesWithPositions,
  classifySatellite,
  TLECacheEntry 
} from '@/lib/tleCache';
import { SatelliteInfo, isSatelliteVisible } from '@/lib/satellites';

// Need to add TLECacheEntry export to tleCache.ts
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

  // Initialize and update cache on mount
  useEffect(() => {
    const initCache = async () => {
      setIsLoading(true);
      try {
        const cache = await updateTLECache();
        setSatelliteCount(Object.keys(cache.entries).length);
        setLastUpdate(new Date(cache.lastFullUpdate));
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
      const cache = await updateTLECache(true);
      setSatelliteCount(Object.keys(cache.entries).length);
      setLastUpdate(new Date(cache.lastFullUpdate));
      setError(null);
    } catch (err) {
      setError('Failed to refresh satellite data');
      console.error('TLE refresh error:', err);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Get all satellites with current positions
  const getAllSatellites = useCallback((): SatelliteWithPosition[] => {
    const satellites = getCachedSatellitesWithPositions();
    return satellites.map(sat => {
      const classification = classifySatellite(sat.name);
      return {
        ...sat,
        ...classification,
      };
    });
  }, []);

  // Get satellites visible from a location
  const getSatellitesAbove = useCallback((
    lat: number, 
    lng: number, 
    minElevation = 10
  ): Array<SatelliteWithPosition & { elevation: number; azimuth: number }> => {
    const satellites = getAllSatellites();
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

    // Sort by elevation (highest first)
    return visibleSatellites.sort((a, b) => b.elevation - a.elevation);
  }, [getAllSatellites]);

  return {
    isLoading,
    isUpdating,
    error,
    satelliteCount,
    lastUpdate,
    refreshCache,
    getAllSatellites,
    getSatellitesAbove,
  };
}

export function useSatellitePositions(updateInterval = 10000) {
  const [satellites, setSatellites] = useState<SatelliteWithPosition[]>([]);
  
  useEffect(() => {
    // Initial load
    const loadPositions = () => {
      const sats = getCachedSatellitesWithPositions().map(sat => ({
        ...sat,
        ...classifySatellite(sat.name),
      }));
      setSatellites(sats);
    };

    loadPositions();

    // Update positions periodically
    const interval = setInterval(loadPositions, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  return satellites;
}
