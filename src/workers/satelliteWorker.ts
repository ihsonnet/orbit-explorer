// Web Worker for heavy satellite position calculations
// This runs SGP4 propagation off the main thread

import * as satellite from 'satellite.js';

interface TLEEntry {
  noradId: string;
  name: string;
  line1: string;
  line2: string;
}

interface SatellitePosition {
  noradId: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
}

interface WorkerMessage {
  type: 'calculatePositions' | 'calculateBatch';
  entries: TLEEntry[];
  batchIndex?: number;
  totalBatches?: number;
}

interface WorkerResponse {
  type: 'positions' | 'batchComplete' | 'progress';
  positions?: SatellitePosition[];
  batchIndex?: number;
  totalBatches?: number;
  progress?: number;
}

// Calculate position for a single satellite
function calculatePosition(entry: TLEEntry, date: Date): SatellitePosition | null {
  try {
    const satrec = satellite.twoline2satrec(entry.line1, entry.line2);
    const positionAndVelocity = satellite.propagate(satrec, date);
    
    if (typeof positionAndVelocity.position === 'boolean') return null;
    
    const gmst = satellite.gstime(date);
    const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
    
    return {
      noradId: entry.noradId,
      name: entry.name,
      lat: satellite.degreesLat(position.latitude),
      lng: satellite.degreesLong(position.longitude),
      alt: position.height,
    };
  } catch {
    return null;
  }
}

// Process messages from main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, entries, batchIndex, totalBatches } = event.data;
  const now = new Date();
  
  if (type === 'calculatePositions') {
    // Calculate all positions at once
    const positions: SatellitePosition[] = [];
    const total = entries.length;
    
    for (let i = 0; i < total; i++) {
      const pos = calculatePosition(entries[i], now);
      if (pos) positions.push(pos);
      
      // Report progress every 500 satellites
      if (i % 500 === 0) {
        self.postMessage({
          type: 'progress',
          progress: Math.round((i / total) * 100),
        } as WorkerResponse);
      }
    }
    
    self.postMessage({
      type: 'positions',
      positions,
    } as WorkerResponse);
  } else if (type === 'calculateBatch') {
    // Calculate positions for a batch
    const positions: SatellitePosition[] = [];
    
    for (const entry of entries) {
      const pos = calculatePosition(entry, now);
      if (pos) positions.push(pos);
    }
    
    self.postMessage({
      type: 'batchComplete',
      positions,
      batchIndex,
      totalBatches,
    } as WorkerResponse);
  }
};

export {}; // Make this a module
