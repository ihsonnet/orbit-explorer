import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  Sun, Car, Laptop, Utensils, CloudSun, Navigation,
  Radio, Eye, Moon, Satellite, Clock, CircleAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DayAnalysisStep } from '@/lib/dayAnalysis';

const iconMap: Record<DayAnalysisStep['icon'], React.ElementType> = {
  weather: CloudSun,
  navigation: Navigation,
  communication: Radio,
  'earth-observation': Eye,
  timing: Clock,
  emergency: CircleAlert,
  entertainment: Moon,
  general: Satellite,
};

const timelineData: DayAnalysisStep[] = [
  {
    time: '6:30 AM',
    title: 'Check Morning Weather',
    description: 'You check your weather app to decide what to wear.',
    icon: 'weather',
    satelliteTypes: ['WEATHER', 'EARTH_OBSERVATION'],
    explanation: 'Weather forecasts rely on data from geostationary and polar-orbiting weather satellites that continuously monitor atmospheric conditions.',
    examples: ['GOES-16 (NOAA)', 'EUMETSAT Meteosat', 'Sentinel-3'],
  },
  {
    time: '7:00 AM',
    title: 'Morning Commute Navigation',
    description: 'Your GPS guides you through traffic to work.',
    icon: 'navigation',
    satelliteTypes: ['GNSS'],
    explanation: 'GPS satellites (and other GNSS constellations) provide precise positioning data that enables turn-by-turn navigation and traffic updates.',
    examples: ['GPS IIF-3', 'Galileo SAT-24', 'GLONASS-K'],
  },
  {
    time: '9:00 AM',
    title: 'Video Conference Call',
    description: 'You join a video call with colleagues across the globe.',
    icon: 'communication',
    satelliteTypes: ['COMMUNICATION'],
    explanation: 'Communication satellites relay data across continents, enabling real-time video calls and internet connectivity.',
    examples: ['Starlink satellites', 'ViaSat-3', 'SES Astra'],
  },
  {
    time: '12:00 PM',
    title: 'Food Delivery Order',
    description: 'You order lunch using a delivery app.',
    icon: 'navigation',
    satelliteTypes: ['GNSS', 'COMMUNICATION'],
    explanation: 'Delivery apps use GPS for driver tracking and satellites for real-time communication between you and the restaurant.',
    examples: ['GPS constellation', 'Iridium NEXT'],
  },
  {
    time: '3:00 PM',
    title: 'Check Storm Alerts',
    description: 'You receive a severe weather alert on your phone.',
    icon: 'weather',
    satelliteTypes: ['WEATHER', 'COMMUNICATION'],
    explanation: 'Storm tracking satellites detect severe weather patterns and communicate alerts through satellite-based messaging systems.',
    examples: ['GOES-18', 'NOAA-20', 'Himawari-9'],
  },
  {
    time: '9:00 PM',
    title: 'Stream a Movie',
    description: 'You relax by streaming your favorite show.',
    icon: 'entertainment',
    satelliteTypes: ['COMMUNICATION'],
    explanation: 'While most streaming uses fiber/cable, satellites provide backbone connectivity and serve millions in rural areas.',
    examples: ['Starlink', 'Hughes Jupiter', 'OneWeb'],
  },
];

interface DayTimelineProps {
  steps?: DayAnalysisStep[];
}

const DayTimeline = ({ steps = timelineData }: DayTimelineProps) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  useEffect(() => {
    setSelectedStep(null);
  }, [steps]);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30" />

      <div className="space-y-8">
        {steps.map((step, index) => {
          const isSelected = selectedStep === index;
          const isEven = index % 2 === 0;
          const StepIcon = iconMap[step.icon];

          return (
            <motion.div
              key={`${step.time}-${step.title}-${index}`}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative flex items-start gap-4',
                'md:gap-8',
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              )}
            >
              {/* Time indicator (mobile) */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 border-primary',
                  isSelected ? 'bg-primary' : 'bg-background'
                )} />
              </div>

              {/* Content card */}
              <div className={cn(
                'ml-16 md:ml-0 md:w-[calc(50%-3rem)]',
                isEven ? 'md:pr-8' : 'md:pl-8'
              )}>
                <motion.div
                  onClick={() => setSelectedStep(isSelected ? null : index)}
                  className={cn(
                    'card-glow rounded-2xl p-5 cursor-pointer transition-all',
                    isSelected && 'ring-2 ring-primary'
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <StepIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-primary font-medium">{step.time}</span>
                      <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                  {/* Satellite type tags */}
                  <div className="flex flex-wrap gap-2">
                    {step.satelliteTypes.map((type) => (
                      <span key={type} className="impact-tag text-xs">
                        <Satellite className="w-3 h-3 inline mr-1" />
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Expanded content */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <h4 className="font-display text-sm font-semibold mb-2 text-primary">
                        How Satellites Make This Possible
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.explanation}
                      </p>
                      <div>
                        <h5 className="text-xs font-semibold text-foreground mb-2">Example Satellites:</h5>
                        <div className="flex flex-wrap gap-1">
                          {step.examples.map((example) => (
                            <span key={example} className="text-xs bg-secondary px-2 py-1 rounded-md text-muted-foreground">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DayTimeline;
