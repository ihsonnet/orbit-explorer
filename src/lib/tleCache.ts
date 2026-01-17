// TLE Cache with localStorage persistence and automatic updates from Celestrak
import { SatelliteInfo, calculateSatellitePosition } from './satellites';

const TLE_CACHE_KEY = 'space_tle_cache';
const TLE_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface TLECacheEntry {
  noradId: string;
  name: string;
  line1: string;
  line2: string;
  fetchedAt: number;
}

interface TLECache {
  entries: Record<string, TLECacheEntry>;
  lastFullUpdate: number;
}

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

// Load cache from localStorage
export function loadTLECache(): TLECache {
  try {
    const cached = localStorage.getItem(TLE_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to load TLE cache:', error);
  }
  return { entries: {}, lastFullUpdate: 0 };
}

// Save cache to localStorage
export function saveTLECache(cache: TLECache): void {
  try {
    localStorage.setItem(TLE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save TLE cache:', error);
  }
}

// Parse TLE text response from Celestrak
export function parseTLEText(text: string): TLECacheEntry[] {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const entries: TLECacheEntry[] = [];
  
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
export async function fetchCategoryTLE(category: keyof typeof CELESTRAK_ENDPOINTS): Promise<TLECacheEntry[]> {
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
export async function fetchSingleTLE(noradId: string): Promise<TLECacheEntry | null> {
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

// Update TLE cache with fresh data from Celestrak
export async function updateTLECache(forceUpdate = false): Promise<TLECache> {
  const cache = loadTLECache();
  const now = Date.now();
  
  // Skip if cache is fresh (within 24 hours) and not forcing
  if (!forceUpdate && now - cache.lastFullUpdate < TLE_CACHE_EXPIRY) {
    console.log('TLE cache is fresh, skipping update');
    return cache;
  }
  
  console.log('Updating TLE cache from Celestrak...');
  
  // Fetch from multiple categories
  const categories: Array<keyof typeof CELESTRAK_ENDPOINTS> = [
    'stations',
    'gps',
    'galileo',
    'weather',
    'noaa',
    'goes',
    'iridium',
  ];
  
  // Fetch Starlink separately (it's large)
  const starlinkPromise = fetchCategoryTLE('starlink').then(entries => entries.slice(0, 100)); // Limit Starlink
  
  const results = await Promise.all([
    ...categories.map(cat => fetchCategoryTLE(cat)),
    starlinkPromise,
  ]);
  
  // Merge all entries into cache
  for (const entries of results) {
    for (const entry of entries) {
      cache.entries[entry.noradId] = entry;
    }
  }
  
  cache.lastFullUpdate = now;
  saveTLECache(cache);
  
  console.log(`TLE cache updated with ${Object.keys(cache.entries).length} satellites`);
  return cache;
}

// Get TLE for a satellite, fetching if not in cache
export async function getTLE(noradId: string): Promise<TLECacheEntry | null> {
  const cache = loadTLECache();
  
  // Check if in cache and not expired
  const cached = cache.entries[noradId];
  if (cached && Date.now() - cached.fetchedAt < TLE_CACHE_EXPIRY) {
    return cached;
  }
  
  // Fetch single satellite
  const entry = await fetchSingleTLE(noradId);
  if (entry) {
    cache.entries[noradId] = entry;
    saveTLECache(cache);
  }
  
  return entry;
}

// Get all cached satellites with their current positions
export function getCachedSatellitesWithPositions(): Array<{
  noradId: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
}> {
  const cache = loadTLECache();
  const satellites: Array<{
    noradId: string;
    name: string;
    lat: number;
    lng: number;
    alt: number;
  }> = [];
  
  const now = new Date();
  
  for (const entry of Object.values(cache.entries)) {
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

// Classify satellite by name/operator
export function classifySatellite(name: string): {
  operator: string;
  orbitClass: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  type: SatelliteInfo['type'];
  impactTags: string[];
} {
  const nameUpper = name.toUpperCase();
  
  // Determine operator
  let operator = 'Unknown';
  if (nameUpper.includes('STARLINK')) operator = 'SpaceX';
  else if (nameUpper.includes('GPS')) operator = 'US Space Force';
  else if (nameUpper.includes('GALILEO')) operator = 'ESA';
  else if (nameUpper.includes('GLONASS')) operator = 'Roscosmos';
  else if (nameUpper.includes('GOES')) operator = 'NOAA';
  else if (nameUpper.includes('NOAA')) operator = 'NOAA';
  else if (nameUpper.includes('SENTINEL')) operator = 'ESA';
  else if (nameUpper.includes('LANDSAT')) operator = 'NASA/USGS';
  else if (nameUpper.includes('ISS') || nameUpper.includes('ZARYA')) operator = 'NASA/Roscosmos';
  else if (nameUpper.includes('IRIDIUM')) operator = 'Iridium';
  else if (nameUpper.includes('EUTELSAT')) operator = 'Eutelsat';
  else if (nameUpper.includes('INTELSAT')) operator = 'Intelsat';
  else if (nameUpper.includes('TERRA') || nameUpper.includes('AQUA')) operator = 'NASA';
  
  // Determine type and orbit
  let type: SatelliteInfo['type'] = 'OTHER';
  let orbitClass: 'LEO' | 'MEO' | 'GEO' | 'HEO' = 'LEO';
  let impactTags: string[] = [];
  
  if (nameUpper.includes('GPS') || nameUpper.includes('GALILEO') || nameUpper.includes('GLONASS') || nameUpper.includes('BEIDOU')) {
    type = 'GNSS';
    orbitClass = 'MEO';
    impactTags = ['navigation', 'timing'];
  } else if (nameUpper.includes('GOES') || nameUpper.includes('METEOSAT') || nameUpper.includes('HIMAWARI')) {
    type = 'WEATHER';
    orbitClass = 'GEO';
    impactTags = ['weather', 'climate'];
  } else if (nameUpper.includes('NOAA') || nameUpper.includes('JPSS')) {
    type = 'WEATHER';
    orbitClass = 'LEO';
    impactTags = ['weather', 'climate'];
  } else if (nameUpper.includes('STARLINK') || nameUpper.includes('ONEWEB') || nameUpper.includes('IRIDIUM')) {
    type = 'COMMUNICATION';
    orbitClass = 'LEO';
    impactTags = ['internet', 'communication'];
  } else if (nameUpper.includes('EUTELSAT') || nameUpper.includes('INTELSAT') || nameUpper.includes('SES')) {
    type = 'COMMUNICATION';
    orbitClass = 'GEO';
    impactTags = ['television', 'internet'];
  } else if (nameUpper.includes('SENTINEL') || nameUpper.includes('LANDSAT') || nameUpper.includes('TERRA') || nameUpper.includes('AQUA')) {
    type = 'EARTH_OBSERVATION';
    orbitClass = 'LEO';
    impactTags = ['earth', 'environment', 'climate'];
  } else if (nameUpper.includes('ISS') || nameUpper.includes('ZARYA') || nameUpper.includes('HUBBLE') || nameUpper.includes('JWST')) {
    type = 'SCIENCE';
    orbitClass = 'LEO';
    impactTags = ['science', 'research'];
  }
  
  return { operator, orbitClass, type, impactTags };
}

// Get enriched satellite info from cache
export function getEnrichedSatelliteInfo(noradId: string): SatelliteInfo | null {
  const cache = loadTLECache();
  const entry = cache.entries[noradId];
  
  if (!entry) return null;
  
  const classification = classifySatellite(entry.name);
  
  return {
    name: entry.name,
    noradId,
    operator: classification.operator,
    orbitClass: classification.orbitClass,
    type: classification.type,
    impactTags: classification.impactTags,
    description: `${entry.name} - ${classification.type.replace('_', ' ')} satellite operated by ${classification.operator}.`,
    tle: { line1: entry.line1, line2: entry.line2 },
  };
}
