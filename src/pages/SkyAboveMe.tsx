import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Locate, Search, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SpaceBackground from '@/components/SpaceBackground';
import SatelliteCard from '@/components/SatelliteCard';
import GPSLocatingAnimation from '@/components/GPSLocatingAnimation';
import SEO from '@/components/SEO';
import { useTLEData } from '@/hooks/useTLEData';
import { SatelliteInfo } from '@/lib/satellites';

interface VisibleSatellite extends SatelliteInfo {
  elevation: number;
  azimuth: number;
  lat: number;
  lng: number;
  alt: number;
}

const SkyAboveMe = () => {
  const { isLoading: isTLELoading, satelliteCount, getSatellitesAbove, refreshCache, isUpdating, lastUpdate } = useTLEData();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cityInput, setCityInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [satellites, setSatellites] = useState<VisibleSatellite[]>([]);
  const [locationName, setLocationName] = useState('');
  
  // Store pending location data during animation
  const pendingLocationRef = useRef<{
    lat: number;
    lng: number;
    name: string;
    satellites: VisibleSatellite[];
  } | null>(null);
  
  // Ref for scrolling to animation
  const animationRef = useRef<HTMLDivElement>(null);

  const handleGPSAnimationComplete = useCallback(() => {
    if (pendingLocationRef.current) {
      setLocation({ lat: pendingLocationRef.current.lat, lng: pendingLocationRef.current.lng });
      setLocationName(pendingLocationRef.current.name);
      setSatellites(pendingLocationRef.current.satellites);
      pendingLocationRef.current = null;
    }
    setIsLocatingGPS(false);
  }, []);

  const handleGeolocation = () => {
    setIsLocatingGPS(true);
    
    // Scroll to animation after it renders
    setTimeout(() => {
      animationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Fetch location name first
          let name = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            if (data.display_name) {
              name = data.display_name.split(',').slice(0, 2).join(',').trim();
            }
          } catch {
            // Keep coordinates as fallback
          }

          const visibleSats = getSatellitesAbove(latitude, longitude, 5);
          const mappedSats: VisibleSatellite[] = visibleSats.map(sat => ({
            name: sat.name,
            noradId: sat.noradId,
            operator: sat.operator,
            orbitClass: sat.orbitClass,
            type: sat.type,
            impactTags: sat.impactTags,
            description: `${sat.type.replace('_', ' ')} satellite at ${sat.alt.toFixed(0)}km altitude.`,
            elevation: sat.elevation,
            azimuth: sat.azimuth,
            lat: sat.lat,
            lng: sat.lng,
            alt: sat.alt,
          }));
          
          // Store data to show after animation completes
          pendingLocationRef.current = {
            lat: latitude,
            lng: longitude,
            name,
            satellites: mappedSats.slice(0, 50),
          };
        },
        () => {
          setIsLocatingGPS(false);
          alert('Unable to get your location. Please enter a city name.');
        }
      );
    }
  };

  const handleCitySearch = async () => {
    if (!cityInput.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityInput)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        setLocation({ lat: latitude, lng: longitude });
        setLocationName(display_name.split(',').slice(0, 2).join(','));
        
        const visibleSats = getSatellitesAbove(latitude, longitude, 5);
        const mappedSats: VisibleSatellite[] = visibleSats.map(sat => ({
          name: sat.name,
          noradId: sat.noradId,
          operator: sat.operator,
          orbitClass: sat.orbitClass,
          type: sat.type,
          impactTags: sat.impactTags,
          description: `${sat.type.replace('_', ' ')} satellite at ${sat.alt.toFixed(0)}km altitude.`,
          elevation: sat.elevation,
          azimuth: sat.azimuth,
          lat: sat.lat,
          lng: sat.lng,
          alt: sat.alt,
        }));
        setSatellites(mappedSats.slice(0, 50));
      } else {
        alert('City not found. Please try another name.');
      }
    } catch {
      alert('Error searching for city. Please try again.');
    }
    setIsLoading(false);
  };

  const skyAboveJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Sky Above Me - Satellite Tracker',
    description: 'Real-time satellite tracking tool. Enter your location to discover satellites orbiting above you.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    featureList: ['Real-time satellite tracking', 'GPS location detection', 'Satellite filtering by orbit type', 'Live TLE data from Celestrak'],
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <SEO
        title="Sky Above Me - Real-Time Satellite Tracker"
        description="Discover satellites orbiting above your location right now. Track LEO, MEO, and GEO satellites in real-time with our interactive satellite tracker powered by live TLE data."
        keywords="satellite tracker, satellites above me, real-time satellite tracking, LEO satellites, GPS tracking, Starlink tracker, ISS tracker, satellite finder"
        canonicalUrl="https://spaceforeveryone.com/sky-above-me"
        jsonLd={skyAboveJsonLd}
      />
      <SpaceBackground />
      <Navigation />

      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Sky Above Me</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the satellites orbiting above your location right now. 
              Space isn't far — it's literally above you.
            </p>
          </motion.div>

          {/* TLE Data Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-glow rounded-xl p-4 mb-6 max-w-2xl mx-auto flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isTLELoading ? 'Loading satellite data...' : `${satelliteCount} satellites in database`}
                </p>
                {lastUpdate && (
                  <p className="text-xs text-muted-foreground">
                    Last updated: {lastUpdate.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshCache}
              disabled={isUpdating}
            >
              <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            </Button>
          </motion.div>

          {/* Location Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-glow rounded-2xl p-6 mb-8 max-w-2xl mx-auto"
          >
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Enter Your Location
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Enter city name (e.g., New York, London, Tokyo)"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                  className="bg-secondary/50 border-border"
                />
                <Button onClick={handleCitySearch} disabled={isLoading || isTLELoading || isLocatingGPS}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">or</span>
                <Button variant="cosmic" onClick={handleGeolocation} disabled={isLoading || isTLELoading || isLocatingGPS}>
                  <Locate className="w-4 h-4 mr-2" />
                  Use My Location
                </Button>
              </div>
            </div>
          </motion.div>

          {/* GPS Locating Animation - Above Results */}
          <AnimatePresence>
            {isLocatingGPS && (
              <div ref={animationRef}>
                <GPSLocatingAnimation 
                  onComplete={handleGPSAnimationComplete}
                  duration={5000}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Results */}
          {location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center mb-8">
                <p className="text-muted-foreground mb-2">Showing satellites above</p>
                <h3 className="font-display text-2xl font-bold text-primary">{locationName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Satellites Visible', value: satellites.length },
                  { label: 'LEO Satellites', value: satellites.filter(s => s.orbitClass === 'LEO').length },
                  { label: 'MEO Satellites', value: satellites.filter(s => s.orbitClass === 'MEO').length },
                  { label: 'GEO Satellites', value: satellites.filter(s => s.orbitClass === 'GEO').length },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="card-glow rounded-xl p-4 text-center"
                  >
                    <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {satellites.map((sat, index) => (
                  <SatelliteCard
                    key={sat.noradId}
                    satellite={sat}
                    index={index}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 card-glow rounded-2xl p-6"
              >
                <h3 className="font-display text-lg font-semibold mb-3 text-primary">
                  Did You Know?
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground">LEO (Low Earth Orbit)</strong>
                    <p>160-2,000 km altitude. Includes ISS, Starlink, and Earth observation satellites. Orbital period: ~90 minutes.</p>
                  </div>
                  <div>
                    <strong className="text-foreground">MEO (Medium Earth Orbit)</strong>
                    <p>2,000-35,786 km altitude. Home to GPS, Galileo, and GLONASS navigation satellites.</p>
                  </div>
                  <div>
                    <strong className="text-foreground">GEO (Geostationary Orbit)</strong>
                    <p>35,786 km altitude. Stays fixed above one point. Used for weather and communications.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {!location && !isLoading && !isLocatingGPS && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {isTLELoading ? 'Loading satellite database...' : 'Enter your location to discover satellites above you'}
              </p>
            </motion.div>
          )}

          {isLoading && !isLocatingGPS && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-muted-foreground">Scanning the sky...</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkyAboveMe;
