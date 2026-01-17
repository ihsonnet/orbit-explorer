import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SpaceBackground from '@/components/SpaceBackground';
import GlobeVisualization from '@/components/GlobeVisualization';
import { Globe as GlobeIcon, Satellite, Radio, Navigation as NavIcon, Cloud, Eye } from 'lucide-react';

const Global = () => {
  const stats = [
    { icon: Satellite, label: 'Total Active', value: '9,000+', color: 'text-primary' },
    { icon: Radio, label: 'Communication', value: '4,200+', color: 'text-accent' },
    { icon: NavIcon, label: 'Navigation', value: '140+', color: 'text-yellow-400' },
    { icon: Cloud, label: 'Weather', value: '50+', color: 'text-blue-400' },
    { icon: Eye, label: 'Earth Observation', value: '200+', color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen relative flex flex-col">
      <SpaceBackground />
      <Navigation />

      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
              <GlobeIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Interactive 3D Globe</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Global Satellite View</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore Earth's satellite infrastructure. Over 9,000 active satellites orbit our planet, 
              forming an invisible network that powers modern civilization.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="card-glow rounded-xl p-4 text-center"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="font-display text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-glow rounded-2xl overflow-hidden"
          >
            <GlobeVisualization />
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            <div className="card-glow rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold mb-3 text-primary">
                LEO - Low Earth Orbit
              </h3>
              <p className="text-sm text-muted-foreground">
                160-2,000 km altitude. Home to the ISS, Starlink constellation, and most 
                Earth observation satellites. Quick orbital periods of ~90 minutes allow 
                for frequent coverage.
              </p>
            </div>
            <div className="card-glow rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold mb-3 text-yellow-400">
                MEO - Medium Earth Orbit
              </h3>
              <p className="text-sm text-muted-foreground">
                2,000-35,786 km altitude. The sweet spot for navigation satellites. 
                GPS, Galileo, and GLONASS constellations operate here, providing precise 
                positioning to billions.
              </p>
            </div>
            <div className="card-glow rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold mb-3 text-accent">
                GEO - Geostationary Orbit
              </h3>
              <p className="text-sm text-muted-foreground">
                35,786 km altitude. Satellites here match Earth's rotation, appearing 
                stationary. Perfect for weather monitoring and telecommunications 
                broadcasting.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Global;
