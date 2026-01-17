import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SpaceBackground from '@/components/SpaceBackground';
import DayTimeline from '@/components/DayTimeline';
import { Calendar, Satellite, Info } from 'lucide-react';

const MyDay = () => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <SpaceBackground />
      <Navigation />

      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Interactive Timeline</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">My Day & Space</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover how your daily activities depend on satellite technology. 
              Click on any activity to learn more about the satellites that make it possible.
            </p>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-glow rounded-2xl p-5 mb-12 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">How to Use</h3>
              <p className="text-sm text-muted-foreground">
                Scroll through a typical day and see how satellites enable each activity. 
                Click on any card to expand and learn about the specific satellite types 
                and real examples that make these daily conveniences possible.
              </p>
            </div>
          </motion.div>

          {/* Timeline */}
          <DayTimeline />

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 card-glow rounded-2xl p-8 text-center"
          >
            <Satellite className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-4 text-foreground">
              Your Daily Space Dependency
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              In just one day, your life depends on dozens of satellites across multiple 
              constellations. From the moment you wake up to when you go to sleep, 
              space technology silently supports your modern lifestyle.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { type: 'GNSS', count: '~30', label: 'Navigation' },
                { type: 'COMM', count: '~4,000', label: 'Communication' },
                { type: 'WEATHER', count: '~50', label: 'Weather' },
                { type: 'EO', count: '~200', label: 'Earth Observation' },
              ].map((item, index) => (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-xl p-4"
                >
                  <div className="font-display text-2xl font-bold text-primary">{item.count}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyDay;
