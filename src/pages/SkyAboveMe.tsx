import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Locate, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import SpaceBackground from '@/components/SpaceBackground';
import SatelliteCard from '@/components/SatelliteCard';
import { useSatellitesAbove } from '@/hooks/useSatellites';

const SkyAboveMe = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cityInput, setCityInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [locationName, setLocationName] = useState('');

  const { data: satellites = [], isLoading, isError, refetch } = useSatellitesAbove(
    location?.lat ?? null,
    location?.lng ?? null
  );

  const handleGeolocation = () => {
    setIsSearching(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            setLocationName(data.display_name?.split(',').slice(0, 2).join(',') || 'Your Location');
          } catch {
            setLocationName('Your Location');
          }
          setIsSearching(false);
        },
        () => {
          setIsSearching(false);
          alert('Unable to get your location. Please enter a city name.');
        }
      );
    }
  };

  const handleCitySearch = async () => {
    if (!cityInput.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityInput)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setLocationName(display_name.split(',').slice(0, 2).join(','));
      } else {
        alert('City not found. Please try another name.');
      }
    } catch {
      alert('Error searching for city. Please try again.');
    }
    setIsSearching(false);
  };

  const leoCount = satellites.filter(s => s.orbit_class === 'LEO').length;
  const meoCount = satellites.filter(s => s.orbit_class === 'MEO').length;
  const geoCount = satellites.filter(s => s.orbit_class === 'GEO').length;

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Navigation />

      <main className="pt-28 pb-20 px-4">
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
                <Button onClick={handleCitySearch} disabled={isSearching}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">or</span>
                <Button variant="cosmic" onClick={handleGeolocation} disabled={isSearching}>
                  <Locate className="w-4 h-4 mr-2" />
                  Use My Location
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Error State */}
          {isError && location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glow rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-destructive/50"
            >
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Failed to load satellite data</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure your FastAPI backend is running at the configured URL.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </motion.div>
          )}

          {/* Results */}
          {location && !isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Location Info */}
              <div className="text-center mb-8">
                <p className="text-muted-foreground mb-2">Showing satellites above</p>
                <h3 className="font-display text-2xl font-bold text-primary">{locationName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
                </p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Satellites Visible', value: satellites.length },
                  { label: 'LEO Satellites', value: leoCount },
                  { label: 'MEO Satellites', value: meoCount },
                  { label: 'GEO Satellites', value: geoCount },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="card-glow rounded-xl p-4 text-center"
                  >
                    <div className="font-display text-3xl font-bold text-primary">
                      {isLoading ? '...' : stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Satellite List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-muted-foreground">Loading satellite data...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {satellites.map((sat, index) => (
                    <SatelliteCard
                      key={sat.norad_id}
                      satellite={{
                        name: sat.name,
                        noradId: sat.norad_id,
                        operator: sat.operator,
                        orbitClass: sat.orbit_class,
                        type: sat.type,
                        description: sat.description,
                        impactTags: sat.impact_tags,
                        elevation: sat.elevation,
                        azimuth: sat.azimuth,
                      }}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {/* Educational Note */}
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

          {/* Initial State */}
          {!location && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Enter your location to discover satellites above you
              </p>
            </motion.div>
          )}

          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-muted-foreground">Finding your location...</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SkyAboveMe;
