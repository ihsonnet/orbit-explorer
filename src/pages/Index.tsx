import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Satellite, ArrowRight, Sparkles, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImpactSection from '@/components/ImpactSection';
import SpaceBackground from '@/components/SpaceBackground';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Explore the Space We Already Live In</span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text">S.P.A.C.E</span>
                <br />
                <span className="text-foreground">for Everyone</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                We already live in a space-enabled world. Satellites silently power your 
                internet, navigation, weather forecasts, and disaster response. 
                <strong className="text-foreground"> Space isn't just for scientists — it's for everyone.</strong>
              </p>

              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/sky-above-me">
                    Explore the Sky Above You
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="cosmic" size="xl" asChild>
                  <Link to="/my-day">
                    See Your Day in Space
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border"
              >
                <div>
                  <div className="font-display text-3xl font-bold text-primary">9,000+</div>
                  <div className="text-sm text-muted-foreground">Active Satellites</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-primary">80+</div>
                  <div className="text-sm text-muted-foreground">Countries in Space</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-primary">8B</div>
                  <div className="text-sm text-muted-foreground">People Served Daily</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                {/* Orbit rings */}
                <div className="absolute inset-8 border border-orbit rounded-full animate-spin" style={{ animationDuration: '30s' }} />
                <div className="absolute inset-16 border border-orbit rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
                <div className="absolute inset-24 border border-orbit rounded-full animate-spin" style={{ animationDuration: '25s' }} />
                
                {/* Central Earth */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-green-400 to-blue-600 shadow-2xl shadow-blue-500/30" />
                </div>

                {/* Satellites */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-8"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-primary rounded-full satellite-pulse" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-16"
                >
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="w-3 h-3 bg-accent rounded-full satellite-pulse" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-24"
                >
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full satellite-pulse" />
                  </div>
                </motion.div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <ImpactSection />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-glow rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <Satellite className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Ready to Explore?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Discover the satellites above your location, see how your daily life connects to space, 
                and explore the global satellite infrastructure.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/sky-above-me">
                    <Satellite className="w-5 h-5" />
                    Sky Above Me
                  </Link>
                </Button>
                <Button variant="nebula" size="lg" asChild>
                  <Link to="/my-day">
                    <Calendar className="w-5 h-5" />
                    My Day & Space
                  </Link>
                </Button>
                <Button variant="cosmic" size="lg" asChild>
                  <Link to="/global">
                    <Globe className="w-5 h-5" />
                    Global View
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            S.P.A.C.E for Everyone — Making space accessible to all. 
            Data from NASA, ESA, SpaceX, and open satellite databases.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
