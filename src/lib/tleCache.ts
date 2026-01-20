// TLE Cache with IndexedDB persistence and automatic updates from Celestrak
import { SatelliteInfo, calculateSatellitePosition } from './satellites';
import { 
  TLEEntry, 
  getAllTLEEntries, 
  storeTLEEntries, 
  getLastUpdate, 
  setLastUpdate,
  getTLECount,
  migrateFromLocalStorage 
} from './satelliteDB';

const TLE_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Re-export TLEEntry as TLECacheEntry for backwards compatibility
export type TLECacheEntry = TLEEntry;

// Celestrak endpoints for different satellite categories
const CELESTRAK_ENDPOINTS = {
  stations: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle',
  starlink: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle',
  gps: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle',
  galileo: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=galileo&FORMAT=tle',
  weather: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle',
  active: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle',
  noaa: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=noaa&FORMAT=tle',
  goes: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=goes&FORMAT=tle',
  earthObservation: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=resource&FORMAT=tle',
  iridium: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-NEXT&FORMAT=tle',
};

// Parse TLE text response from Celestrak
export function parseTLEText(text: string): TLEEntry[] {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const entries: TLEEntry[] = [];
  
  // TLE format: name on line 1, line1 on line 2, line2 on line 3
  for (let i = 0; i < lines.length - 2; i += 3) {
    const name = lines[i];
    const line1 = lines[i + 1];
    const line2 = lines[i + 2];
    
    // Validate TLE format
    if (line1.startsWith('1 ') && line2.startsWith('2 ')) {
      // Extract NORAD ID from line 1 (characters 3-7)
      const noradId = line1.substring(2, 7).trim();
      
      entries.push({
        noradId,
        name: name.trim(),
        line1,
        line2,
        fetchedAt: Date.now(),
      });
    }
  }
  
  return entries;
}

// Fetch TLE data for a specific satellite category
export async function fetchCategoryTLE(category: keyof typeof CELESTRAK_ENDPOINTS): Promise<TLEEntry[]> {
  try {
    const response = await fetch(CELESTRAK_ENDPOINTS[category]);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
    return parseTLEText(text);
  } catch (error) {
    console.warn(`Failed to fetch ${category} TLEs:`, error);
    return [];
  }
}

// Fetch single satellite TLE by NORAD ID
export async function fetchSingleTLE(noradId: string): Promise<TLEEntry | null> {
  try {
    const response = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=tle`
    );
    if (!response.ok) return null;
    
    const text = await response.text();
    const entries = parseTLEText(text);
    return entries[0] || null;
  } catch {
    return null;
  }
}

// Progress callback type
type ProgressCallback = (loaded: number, total: number, phase: string) => void;

// Update TLE cache with fresh data from Celestrak
export async function updateTLECache(
  forceUpdate = false, 
  onProgress?: ProgressCallback
): Promise<{ count: number; lastUpdate: number }> {
  // Try to migrate from localStorage first
  await migrateFromLocalStorage();
  
  const lastUpdate = await getLastUpdate();
  const now = Date.now();
  
  // Skip if cache is fresh (within 24 hours) and not forcing
  if (!forceUpdate && now - lastUpdate < TLE_CACHE_EXPIRY) {
    const count = await getTLECount();
    console.log('TLE cache is fresh, skipping update');
    return { count, lastUpdate };
  }
  
  console.log('Updating TLE cache from Celestrak (fetching all active satellites)...');
  onProgress?.(0, 100, 'Fetching from Celestrak...');
  
  // Fetch ALL active satellites in one call
  const entries = await fetchCategoryTLE('active');
  
  if (entries.length > 0) {
    onProgress?.(50, 100, 'Storing in database...');
    
    // Store in IndexedDB in chunks to avoid blocking
    const chunkSize = 2000;
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      await storeTLEEntries(chunk);
      onProgress?.(
        50 + Math.round((i / entries.length) * 50), 
        100, 
        `Storing satellites (${Math.min(i + chunkSize, entries.length)}/${entries.length})...`
      );
    }
    
    await setLastUpdate(now);
    console.log(`TLE cache updated with ${entries.length} satellites`);
  }
  
  onProgress?.(100, 100, 'Complete');
  return { count: entries.length, lastUpdate: now };
}

// Get all cached TLE entries
export async function loadTLECache(): Promise<TLEEntry[]> {
  return getAllTLEEntries();
}

// Get TLE count
export async function getCachedTLECount(): Promise<number> {
  return getTLECount();
}

// Get all cached satellites with their current positions
// NOTE: This is the OLD synchronous method - prefer useSatelliteWorker hook for performance
export function getCachedSatellitesWithPositions(): Array<{
  noradId: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
}> {
  // This function is kept for backwards compatibility
  // For large datasets, use the useSatelliteWorker hook instead
  console.warn('getCachedSatellitesWithPositions is synchronous and may block UI. Consider using useSatelliteWorker hook.');
  return [];
}

// Async version that uses IndexedDB
export async function getCachedSatellitesWithPositionsAsync(): Promise<Array<{
  noradId: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
}>> {
  const entries = await getAllTLEEntries();
  const satellites: Array<{
    noradId: string;
    name: string;
    lat: number;
    lng: number;
    alt: number;
  }> = [];
  
  const now = new Date();
  
  for (const entry of entries) {
    const position = calculateSatellitePosition(entry.line1, entry.line2, now);
    if (position) {
      satellites.push({
        noradId: entry.noradId,
        name: entry.name,
        ...position,
      });
    }
  }
  
  return satellites;
}

// Classify a satellite by its name
export function classifySatellite(name: string): {
  operator: string;
  orbitClass: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  type: SatelliteInfo['type'];
  impactTags: string[];
} {
  const upperName = name.toUpperCase();
  
  // Determine operator
  let operator = 'Unknown';
  if (upperName.includes('STARLINK')) operator = 'SpaceX';
  else if (upperName.includes('ONEWEB')) operator = 'OneWeb';
  else if (upperName.includes('IRIDIUM')) operator = 'Iridium';
  else if (upperName.includes('GLOBALSTAR')) operator = 'Globalstar';
  else if (upperName.includes('GPS')) operator = 'US Space Force';
  else if (upperName.includes('GALILEO')) operator = 'ESA';
  else if (upperName.includes('GLONASS')) operator = 'Roscosmos';
  else if (upperName.includes('BEIDOU')) operator = 'CNSA';
  else if (upperName.includes('GOES') || upperName.includes('NOAA')) operator = 'NOAA';
  else if (upperName.includes('METEOSAT')) operator = 'EUMETSAT';
  else if (upperName.includes('HIMAWARI')) operator = 'JMA';
  else if (upperName.includes('LANDSAT') || upperName.includes('TERRA') || upperName.includes('AQUA')) operator = 'NASA';
  else if (upperName.includes('SENTINEL')) operator = 'ESA';
  else if (upperName.includes('ISS') || upperName.includes('ZARYA')) operator = 'International';
  else if (upperName.includes('TIANGONG') || upperName.includes('TIANHE')) operator = 'CNSA';
  
  // Determine satellite type
  let type: SatelliteInfo['type'] = 'OTHER';
  if (upperName.includes('GPS') || upperName.includes('GALILEO') || upperName.includes('GLONASS') || upperName.includes('BEIDOU') || upperName.includes('NAVSTAR')) {
    type = 'GNSS';
  } else if (upperName.includes('STARLINK') || upperName.includes('ONEWEB') || upperName.includes('IRIDIUM') || upperName.includes('GLOBALSTAR') || upperName.includes('SES') || upperName.includes('INTELSAT')) {
    type = 'COMMUNICATION';
  } else if (upperName.includes('GOES') || upperName.includes('NOAA') || upperName.includes('METEOSAT') || upperName.includes('HIMAWARI') || upperName.includes('METOP')) {
    type = 'WEATHER';
  } else if (upperName.includes('LANDSAT') || upperName.includes('SENTINEL') || upperName.includes('TERRA') || upperName.includes('AQUA') || upperName.includes('WORLDVIEW')) {
    type = 'EARTH_OBSERVATION';
  } else if (upperName.includes('ISS') || upperName.includes('TIANGONG') || upperName.includes('TIANHE') || upperName.includes('ZARYA')) {
    type = 'SCIENCE';
  } else if (upperName.includes('HUBBLE') || upperName.includes('JAMES WEBB') || upperName.includes('CHANDRA')) {
    type = 'SCIENCE';
  }
  
  // Determine orbit class based on typical satellite characteristics
  let orbitClass: 'LEO' | 'MEO' | 'GEO' | 'HEO' = 'LEO';
  if (upperName.includes('GPS') || upperName.includes('GALILEO') || upperName.includes('GLONASS') || upperName.includes('BEIDOU')) {
    orbitClass = 'MEO';
  } else if (upperName.includes('GOES') || upperName.includes('METEOSAT') || upperName.includes('HIMAWARI') || upperName.includes('SES') || upperName.includes('INTELSAT')) {
    orbitClass = 'GEO';
  } else if (upperName.includes('MOLNIYA') || upperName.includes('TUNDRA')) {
    orbitClass = 'HEO';
  }
  
  // Determine impact tags
  const impactTags: string[] = [];
  if (type === 'GNSS') impactTags.push('Navigation', 'Timing', 'Location Services');
  else if (type === 'COMMUNICATION') impactTags.push('Internet', 'Communications', 'Broadcasting');
  else if (type === 'WEATHER') impactTags.push('Weather Forecasting', 'Climate Monitoring', 'Disaster Warning');
  else if (type === 'EARTH_OBSERVATION') impactTags.push('Environmental Monitoring', 'Agriculture', 'Urban Planning');
  else if (type === 'SCIENCE') impactTags.push('Research', 'Space Science', 'Discovery');
  
  return { operator, orbitClass, type, impactTags };
}

// Get enriched satellite info
export async function getEnrichedSatelliteInfo(noradId: string): Promise<SatelliteInfo | null> {
  const entries = await getAllTLEEntries();
  const entry = entries.find(e => e.noradId === noradId);
  
  if (!entry) return null;
  
  const classification = classifySatellite(entry.name);
  
  return {
    noradId: entry.noradId,
    name: entry.name,
    ...classification,
    description: `${classification.type} satellite operated by ${classification.operator}`,
  };
}
