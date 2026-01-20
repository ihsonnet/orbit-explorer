// Hook for managing satellite position calculations via Web Worker
import { useState, useEffect, useCallback, useRef } from 'react';
import { TLEEntry, getAllTLEEntries, getTLECount } from '@/lib/satelliteDB';
import { classifySatellite } from '@/lib/tleCache';
import { SatelliteInfo } from '@/lib/satellites';

interface SatellitePosition {
  noradId: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
}

export interface SatelliteWithPosition extends SatellitePosition {
  operator: string;
  orbitClass: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  type: SatelliteInfo['type'];
  impactTags: string[];
}

interface WorkerResponse {
  type: 'positions' | 'batchComplete' | 'progress';
  positions?: SatellitePosition[];
  batchIndex?: number;
  totalBatches?: number;
  progress?: number;
}

export function useSatelliteWorker(updateInterval = 30000) {
  const [satellites, setSatellites] = useState<SatelliteWithPosition[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const entriesRef = useRef<TLEEntry[]>([]);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/satelliteWorker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { type, positions, progress: workerProgress } = event.data;

      if (type === 'progress') {
        setProgress(workerProgress || 0);
      } else if (type === 'positions' && positions) {
        // Classify satellites and set state
        const classified = positions.map(pos => {
          const classification = classifySatellite(pos.name);
          return {
            ...pos,
            ...classification,
          };
        });
        setSatellites(classified);
        setIsCalculating(false);
        setProgress(100);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Calculate positions using worker
  const calculatePositions = useCallback(async () => {
    if (!workerRef.current || isCalculating) return;

    setIsCalculating(true);
    setProgress(0);

    // Load entries from IndexedDB if not cached
    if (entriesRef.current.length === 0) {
      entriesRef.current = await getAllTLEEntries();
    }

    if (entriesRef.current.length === 0) {
      setIsCalculating(false);
      return;
    }

    // Send to worker for calculation
    workerRef.current.postMessage({
      type: 'calculatePositions',
      entries: entriesRef.current,
    });
  }, [isCalculating]);

  // Initial calculation and periodic updates
  useEffect(() => {
    const runCalculation = async () => {
      const count = await getTLECount();
      if (count > 0) {
        calculatePositions();
      }
    };

    runCalculation();

    // Periodic position updates (satellite positions change over time)
    const interval = setInterval(calculatePositions, updateInterval);
    return () => clearInterval(interval);
  }, [calculatePositions, updateInterval]);

  // Force refresh from IndexedDB
  const refreshFromDB = useCallback(async () => {
    entriesRef.current = await getAllTLEEntries();
    calculatePositions();
  }, [calculatePositions]);

  return {
    satellites,
    isCalculating,
    progress,
    refreshFromDB,
    calculatePositions,
  };
}

// Progressive loading hook - loads satellites in batches for smoother UX
export function useProgressiveSatellites(batchSize = 1000, delayBetweenBatches = 50) {
  const [satellites, setSatellites] = useState<SatelliteWithPosition[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/satelliteWorker.ts', import.meta.url),
      { type: 'module' }
    );

    let allSatellites: SatelliteWithPosition[] = [];
    let batchesReceived = 0;
    let expectedBatches = 0;

    workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { type, positions, batchIndex, totalBatches } = event.data;

      if (type === 'batchComplete' && positions) {
        batchesReceived++;
        expectedBatches = totalBatches || expectedBatches;

        const classified = positions.map(pos => {
          const classification = classifySatellite(pos.name);
          return { ...pos, ...classification };
        });

        allSatellites = [...allSatellites, ...classified];
        setSatellites([...allSatellites]);
        setLoadedCount(allSatellites.length);

        if (batchesReceived >= expectedBatches) {
          setIsLoading(false);
        }
      }
    };

    // Load and process in batches
    const loadProgressively = async () => {
      const entries = await getAllTLEEntries();
      const total = entries.length;
      setTotalCount(total);

      if (total === 0) {
        setIsLoading(false);
        return;
      }

      const numBatches = Math.ceil(total / batchSize);

      for (let i = 0; i < numBatches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, total);
        const batch = entries.slice(start, end);

        workerRef.current?.postMessage({
          type: 'calculateBatch',
          entries: batch,
          batchIndex: i,
          totalBatches: numBatches,
        });

        // Small delay between batches to keep UI responsive
        if (i < numBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }
    };

    loadProgressively();

    return () => {
      workerRef.current?.terminate();
    };
  }, [batchSize, delayBetweenBatches]);

  return {
    satellites,
    loadedCount,
    totalCount,
    isLoading,
    progress: totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0,
  };
}
