import { motion } from 'framer-motion';
import { BookOpen, Rocket, Satellite, Globe, Shield, HelpCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SpaceBackground from '@/components/SpaceBackground';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Learn = () => {
  const topics = [
    {
      icon: Satellite,
      title: 'What is an Orbit?',
      content: `An orbit is the curved path an object takes around another object due to gravity. Satellites orbit Earth at different altitudes and speeds depending on their purpose.

**Key Orbit Types:**
- **LEO (Low Earth Orbit)**: 160-2,000 km - Fast orbits (~90 min), used for imaging and internet
- **MEO (Medium Earth Orbit)**: 2,000-35,786 km - Navigation satellites like GPS
- **GEO (Geostationary)**: 35,786 km - Stays above one point, used for TV and weather
- **HEO (Highly Elliptical)**: Varies - Long coverage periods over specific regions`,
    },
    {
      icon: Globe,
      title: 'How Does GPS Work?',
      content: `GPS (Global Positioning System) uses a constellation of at least 24 satellites orbiting at about 20,200 km altitude.

**The Process:**
1. Each GPS satellite continuously broadcasts its position and precise time
2. Your device receives signals from at least 4 satellites
3. By measuring the time each signal took to arrive, your device calculates distances
4. Using trilateration, it determines your exact position

**Fun Fact:** GPS satellites carry atomic clocks accurate to nanoseconds. Without Einstein's relativity corrections, GPS would drift by ~10 km per day!`,
    },
    {
      icon: Rocket,
      title: 'How Do Satellites Get to Space?',
      content: `Satellites reach orbit using powerful rockets that accelerate them to orbital velocity (~7.8 km/s for LEO).

**Launch Process:**
1. **Vertical Launch**: Rocket lifts off and climbs through the atmosphere
2. **Gravity Turn**: Vehicle pitches over to gain horizontal speed
3. **Stage Separation**: Spent stages are dropped to reduce weight
4. **Orbital Insertion**: Final burn places satellite in target orbit
5. **Deployment**: Solar panels unfold, instruments activate

**Major Launch Providers:** SpaceX (Falcon 9), ULA (Atlas V), Arianespace (Ariane 6), ISRO (PSLV)`,
    },
    {
      icon: Shield,
      title: 'Space Debris & Sustainability',
      content: `Over 36,000 tracked objects larger than 10cm orbit Earth, including defunct satellites and rocket stages.

**The Challenge:**
- Debris travels at ~7.5 km/s - even a paint fleck can damage spacecraft
- Collisions create more debris (Kessler Syndrome risk)
- ISS regularly maneuvers to avoid debris

**Solutions Being Developed:**
- Active debris removal missions
- Satellite deorbit requirements
- Debris tracking improvements
- "Design for demise" - satellites that burn up completely`,
    },
  ];

  const faqs = [
    {
      q: 'Can I see satellites from Earth?',
      a: 'Yes! Many satellites are visible to the naked eye, especially during dawn and dusk when they catch sunlight against the dark sky. The ISS is one of the brightest objects and makes regular passes over most locations.',
    },
    {
      q: 'How many satellites does SpaceX have?',
      a: 'SpaceX operates the Starlink constellation with over 5,000 satellites as of 2024, making it the largest satellite constellation ever. They aim to deploy up to 42,000 satellites for global internet coverage.',
    },
    {
      q: 'Do satellites ever collide?',
      a: 'Yes, though rarely. The most notable collision was in 2009 between Iridium 33 and Cosmos 2251, creating over 2,000 debris pieces. Space agencies now carefully track objects and plan avoidance maneuvers.',
    },
    {
      q: 'How long do satellites last?',
      a: 'Typical operational lifetimes range from 5-15 years depending on the orbit and mission. LEO satellites face more atmospheric drag and degrade faster than GEO satellites.',
    },
    {
      q: 'Who regulates space?',
      a: 'The UN Outer Space Treaty (1967) provides the framework, but nations regulate their own launches. The ITU coordinates radio frequencies, and various agencies track debris.',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Navigation />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
              <BookOpen className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Educational Content</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Learn About Space</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Understanding the fundamentals of satellites, orbits, and space technology. 
              Knowledge that helps you appreciate the invisible infrastructure above.
            </p>
          </motion.div>

          {/* Topics */}
          <div className="space-y-6 mb-16">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-glow rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <topic.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-3 text-foreground">
                      {topic.title}
                    </h2>
                    <div className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                      {topic.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-accent" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="card-glow rounded-xl border-none"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline text-left font-display font-medium text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4 text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 card-glow rounded-2xl p-6"
          >
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground">
              Explore Further
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { name: 'NASA Open Data', url: 'https://data.nasa.gov' },
                { name: 'SpaceX Launches', url: 'https://www.spacex.com/launches' },
                { name: 'ESA Earth Observation', url: 'https://www.esa.int/Applications/Observing_the_Earth' },
                { name: 'Celestrak Satellite Catalog', url: 'https://celestrak.org' },
              ].map((resource) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">{resource.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
