import { motion } from 'framer-motion';
import { Wifi, Navigation, Cloud, Shield, Leaf, LucideIcon } from 'lucide-react';

interface ImpactItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const impacts: ImpactItem[] = [
  {
    icon: Wifi,
    title: 'Internet & Communication',
    description: 'Satellites enable global internet, TV broadcasts, and instant communication across continents.',
    color: 'from-accent to-primary',
  },
  {
    icon: Navigation,
    title: 'Navigation & Maps',
    description: 'GPS and GNSS satellites guide billions of devices, from smartphones to aircraft.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Cloud,
    title: 'Weather & Climate',
    description: 'Weather satellites provide forecasts, track storms, and monitor climate change.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Disasters & Safety',
    description: 'Earth observation satellites detect wildfires, floods, and support disaster response.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Leaf,
    title: 'Agriculture & Environment',
    description: 'Satellites monitor crop health, deforestation, and help optimize farming.',
    color: 'from-green-500 to-emerald-500',
  },
];

const ImpactSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Space Powers Your <span className="gradient-text">Daily Life</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every day, thousands of satellites work silently above us, enabling the technology we depend on.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impacts.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-glow rounded-2xl p-6 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
