import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SpaceBackground from '@/components/SpaceBackground';
import DayTimeline from '@/components/DayTimeline';
import DayAnalysisDialog from '@/components/DayAnalysisDialog';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import type { DayAnalysis } from '@/lib/dayAnalysis';
import { Calendar, Satellite, Info, Sparkles, RotateCcw } from 'lucide-react';

const MyDay = () => {
  const [analysis, setAnalysis] = useState<DayAnalysis | null>(null);

  const myDayJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How Satellites Power Your Daily Life',
    description: 'Interactive timeline showing how space technology enables everyday activities from morning alarms to evening entertainment.',
    author: {
      '@type': 'Organization',
      name: 'S.P.A.C.E. for Everyone',
    },
    articleSection: 'Space Education',
  };
  return (
    <div className="min-h-screen relative flex flex-col">
      <SEO
        title="My Day & Space - How Satellites Power Your Life"
        description="Discover how your daily activities depend on satellite technology. From GPS navigation to weather forecasts, explore the invisible space infrastructure that powers modern life."
        keywords="satellite daily life, GPS navigation, weather satellites, communication satellites, space technology everyday, how satellites work, GNSS, satellite internet"
        canonicalUrl="https://spaceforeveryone.com/my-day-and-space"
        jsonLd={myDayJsonLd}
      />
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
            className="card-glow rounded-2xl p-5 mb-12 flex flex-col gap-5 md:flex-row md:items-center"
          >
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">How to Use</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the sample day below, or describe your own day and let AI reveal its connections to satellites and space technology. Click any timeline card to learn more.
                </p>
              </div>
            </div>
            <DayAnalysisDialog onAnalysis={setAnalysis} />
          </motion.div>

          {analysis && (
            <motion.section
              id="your-day-analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 scroll-mt-32 rounded-2xl border border-primary/30 bg-primary/5 p-6"
              aria-live="polite"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Your AI-powered timeline
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Your Day &amp; Space</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {analysis.summary}
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setAnalysis(null)}>
                  <RotateCcw aria-hidden="true" />
                  Show Sample Day
                </Button>
              </div>
            </motion.section>
          )}

          {/* Timeline */}
          <DayTimeline steps={analysis?.steps} />

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
