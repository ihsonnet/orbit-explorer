import * as satellite from 'satellite.js';

export interface SatelliteInfo {
  name: string;
  noradId: string;
  operator: string;
  orbitClass: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  type: 'COMMUNICATION' | 'GNSS' | 'EARTH_OBSERVATION' | 'WEATHER' | 'SCIENCE' | 'OTHER';
  impactTags: string[];
  description: string;
  tle?: { line1: string; line2: string };
}

// Sample satellite data with real TLE sources
export const sampleSatellites: SatelliteInfo[] = [
  {
    name: 'ISS (ZARYA)',
    noradId: '25544',
    operator: 'NASA/Roscosmos',
    orbitClass: 'LEO',
    type: 'SCIENCE',
    impactTags: ['science', 'research'],
    description: 'The International Space Station - humanitys outpost in space for scientific research.',
  },
  {
    name: 'STARLINK-1007',
    noradId: '44713',
    operator: 'SpaceX',
    orbitClass: 'LEO',
    type: 'COMMUNICATION',
    impactTags: ['internet', 'communication'],
    description: 'Part of SpaceX Starlink constellation providing global broadband internet.',
  },
  {
    name: 'GPS IIF-3',
    noradId: '40105',
    operator: 'US Space Force',
    orbitClass: 'MEO',
    type: 'GNSS',
    impactTags: ['navigation', 'timing'],
    description: 'Part of the GPS constellation enabling precise global positioning.',
  },
  {
    name: 'GOES-16',
    noradId: '41866',
    operator: 'NOAA',
    orbitClass: 'GEO',
    type: 'WEATHER',
    impactTags: ['weather', 'climate'],
    description: 'Advanced weather satellite monitoring North American weather patterns.',
  },
  {
    name: 'Sentinel-2A',
    noradId: '40697',
    operator: 'ESA',
    orbitClass: 'LEO',
    type: 'EARTH_OBSERVATION',
    impactTags: ['earth', 'environment'],
    description: 'Earth observation satellite for land monitoring and agriculture.',
  },
  {
    name: 'GALILEO 23',
    noradId: '43055',
    operator: 'ESA',
    orbitClass: 'MEO',
    type: 'GNSS',
    impactTags: ['navigation', 'timing'],
    description: 'European GNSS satellite providing independent navigation services.',
  },
  {
    name: 'Landsat 9',
    noradId: '49260',
    operator: 'NASA/USGS',
    orbitClass: 'LEO',
    type: 'EARTH_OBSERVATION',
    impactTags: ['earth', 'climate', 'agriculture'],
    description: 'Continues the Landsat program of Earth observation since 1972.',
  },
  {
    name: 'NOAA-20',
    noradId: '43013',
    operator: 'NOAA',
    orbitClass: 'LEO',
    type: 'WEATHER',
    impactTags: ['weather', 'climate'],
    description: 'Polar-orbiting weather satellite for global weather forecasting.',
  },
  {
    name: 'Iridium NEXT 101',
    noradId: '42803',
    operator: 'Iridium',
    orbitClass: 'LEO',
    type: 'COMMUNICATION',
    impactTags: ['communication', 'emergency'],
    description: 'Global satellite phone and data network for remote communications.',
  },
  {
    name: 'EUTELSAT HOTBIRD 13G',
    noradId: '52051',
    operator: 'Eutelsat',
    orbitClass: 'GEO',
    type: 'COMMUNICATION',
    impactTags: ['television', 'internet'],
    description: 'Broadcasting satellite serving Europe, Middle East, and North Africa.',
  },
];

// Calculate satellite position given TLE and time
export function calculateSatellitePosition(
  tleLine1: string,
  tleLine2: string,
  date: Date = new Date()
): { lat: number; lng: number; alt: number } | null {
  try {
    const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
    const positionAndVelocity = satellite.propagate(satrec, date);
    
    if (typeof positionAndVelocity.position === 'boolean') return null;
    
    const gmst = satellite.gstime(date);
    const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
    
    return {
      lat: satellite.degreesLat(position.latitude),
      lng: satellite.degreesLong(position.longitude),
      alt: position.height,
    };
  } catch {
    return null;
  }
}

// Check if satellite is visible from a location using proper look angles
export function isSatelliteVisible(
  observerLat: number,
  observerLng: number,
  satLat: number,
  satLng: number,
  satAlt: number
): { visible: boolean; elevation: number; azimuth: number } {
  const earthRadius = 6371; // km
  
  // Convert to radians
  const obsLatRad = observerLat * (Math.PI / 180);
  const obsLngRad = observerLng * (Math.PI / 180);
  const satLatRad = satLat * (Math.PI / 180);
  const satLngRad = satLng * (Math.PI / 180);
  
  // Observer position vector (ECI approximation)
  const obsR = earthRadius;
  const obsX = obsR * Math.cos(obsLatRad) * Math.cos(obsLngRad);
  const obsY = obsR * Math.cos(obsLatRad) * Math.sin(obsLngRad);
  const obsZ = obsR * Math.sin(obsLatRad);
  
  // Satellite position vector
  const satR = earthRadius + satAlt;
  const satX = satR * Math.cos(satLatRad) * Math.cos(satLngRad);
  const satY = satR * Math.cos(satLatRad) * Math.sin(satLngRad);
  const satZ = satR * Math.sin(satLatRad);
  
  // Range vector (satellite - observer)
  const rangeX = satX - obsX;
  const rangeY = satY - obsY;
  const rangeZ = satZ - obsZ;
  const range = Math.sqrt(rangeX * rangeX + rangeY * rangeY + rangeZ * rangeZ);
  
  // Transform to topocentric (SEZ) coordinates
  // South unit vector
  const sX = Math.sin(obsLatRad) * Math.cos(obsLngRad);
  const sY = Math.sin(obsLatRad) * Math.sin(obsLngRad);
  const sZ = -Math.cos(obsLatRad);
  
  // East unit vector
  const eX = -Math.sin(obsLngRad);
  const eY = Math.cos(obsLngRad);
  const eZ = 0;
  
  // Zenith unit vector
  const zX = Math.cos(obsLatRad) * Math.cos(obsLngRad);
  const zY = Math.cos(obsLatRad) * Math.sin(obsLngRad);
  const zZ = Math.sin(obsLatRad);
  
  // Project range onto SEZ
  const rangeS = sX * rangeX + sY * rangeY + sZ * rangeZ;
  const rangeE = eX * rangeX + eY * rangeY + eZ * rangeZ;
  const rangeZen = zX * rangeX + zY * rangeY + zZ * rangeZ;
  
  // Calculate elevation (angle above horizon)
  const elevation = Math.asin(rangeZen / range) * (180 / Math.PI);
  
  // Calculate azimuth (angle from north, clockwise)
  let azimuth = Math.atan2(rangeE, -rangeS) * (180 / Math.PI);
  if (azimuth < 0) azimuth += 360;
  
  return {
    visible: elevation > 0,
    elevation: Math.round(elevation * 10) / 10, // Round to 1 decimal
    azimuth: Math.round(azimuth * 10) / 10,
  };
}

// Fetch TLE data from Celestrak
export async function fetchTLEData(noradId: string): Promise<{ line1: string; line2: string } | null> {
  try {
    const response = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=TLE`
    );
    const text = await response.text();
    const lines = text.trim().split('\n');
    
    if (lines.length >= 3) {
      return {
        line1: lines[1],
        line2: lines[2],
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Get satellites visible from a location
export function getSatellitesNearLocation(
  lat: number,
  lng: number,
  satellites: SatelliteInfo[]
): Array<SatelliteInfo & { elevation: number; azimuth: number }> {
  // For demo purposes, return satellites with simulated positions
  return satellites.map((sat, index) => {
    // Simulate position based on orbit class
    const baseElevation = sat.orbitClass === 'GEO' ? 30 + Math.random() * 20 : 
                          sat.orbitClass === 'MEO' ? 40 + Math.random() * 30 :
                          20 + Math.random() * 50;
    
    return {
      ...sat,
      elevation: baseElevation + (index * 5) % 30,
      azimuth: (index * 45) % 360,
    };
  }).filter(sat => sat.elevation > 10);
}
