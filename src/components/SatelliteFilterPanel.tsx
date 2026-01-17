import { motion } from 'framer-motion';
import { Filter, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface SatelliteFilters {
  types: string[];
  orbitClasses: string[];
  operators: string[];
}

interface SatelliteFilterPanelProps {
  filters: SatelliteFilters;
  onFiltersChange: (filters: SatelliteFilters) => void;
  availableOperators: string[];
}

const SATELLITE_TYPES = [
  { id: 'COMMUNICATION', label: 'Communication', color: '#a855f7' },
  { id: 'GNSS', label: 'Navigation (GNSS)', color: '#eab308' },
  { id: 'WEATHER', label: 'Weather', color: '#3b82f6' },
  { id: 'EARTH_OBSERVATION', label: 'Earth Observation', color: '#22c55e' },
  { id: 'SCIENCE', label: 'Science', color: '#00d4ff' },
  { id: 'OTHER', label: 'Other', color: '#6b7280' },
];

const ORBIT_CLASSES = [
  { id: 'LEO', label: 'LEO', description: 'Low Earth Orbit', color: 'text-primary' },
  { id: 'MEO', label: 'MEO', description: 'Medium Earth Orbit', color: 'text-yellow-400' },
  { id: 'GEO', label: 'GEO', description: 'Geostationary', color: 'text-accent' },
  { id: 'HEO', label: 'HEO', description: 'Highly Elliptical', color: 'text-orange-400' },
];

const MAJOR_OPERATORS = [
  'SpaceX',
  'NASA',
  'NOAA',
  'ESA',
  'US Space Force',
  'Roscosmos',
  'Iridium',
];

const SatelliteFilterPanel = ({ filters, onFiltersChange, availableOperators }: SatelliteFilterPanelProps) => {
  const toggleType = (typeId: string) => {
    const newTypes = filters.types.includes(typeId)
      ? filters.types.filter(t => t !== typeId)
      : [...filters.types, typeId];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const toggleOrbitClass = (orbitId: string) => {
    const newOrbits = filters.orbitClasses.includes(orbitId)
      ? filters.orbitClasses.filter(o => o !== orbitId)
      : [...filters.orbitClasses, orbitId];
    onFiltersChange({ ...filters, orbitClasses: newOrbits });
  };

  const toggleOperator = (operator: string) => {
    const newOperators = filters.operators.includes(operator)
      ? filters.operators.filter(o => o !== operator)
      : [...filters.operators, operator];
    onFiltersChange({ ...filters, operators: newOperators });
  };

  const clearAllFilters = () => {
    onFiltersChange({ types: [], orbitClasses: [], operators: [] });
  };

  const hasActiveFilters = filters.types.length > 0 || filters.orbitClasses.length > 0 || filters.operators.length > 0;

  // Combine major operators with any unique operators from the data
  const displayOperators = [...new Set([...MAJOR_OPERATORS, ...availableOperators])].slice(0, 12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-glow rounded-2xl p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Filter Satellites</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Satellite Type Filters */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Satellite Type</p>
        <div className="flex flex-wrap gap-2">
          {SATELLITE_TYPES.map((type) => {
            const isActive = filters.types.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => toggleType(type.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-primary/20 border-primary text-foreground' 
                    : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }
                  border
                `}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                {type.label}
                {isActive && <Check className="w-3 h-3 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orbit Class Filters */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Orbit Class</p>
        <div className="flex flex-wrap gap-2">
          {ORBIT_CLASSES.map((orbit) => {
            const isActive = filters.orbitClasses.includes(orbit.id);
            return (
              <button
                key={orbit.id}
                onClick={() => toggleOrbitClass(orbit.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-primary/20 border-primary text-foreground' 
                    : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }
                  border
                `}
              >
                <span className={orbit.color}>{orbit.id}</span>
                <span className="hidden sm:inline text-muted-foreground">({orbit.description})</span>
                {isActive && <Check className="w-3 h-3 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator Filters */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium">Operator</p>
        <div className="flex flex-wrap gap-2">
          {displayOperators.map((operator) => {
            const isActive = filters.operators.includes(operator);
            return (
              <button
                key={operator}
                onClick={() => toggleOperator(operator)}
                className={`
                  flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-primary/20 border-primary text-foreground' 
                    : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }
                  border
                `}
              >
                {operator}
                {isActive && <Check className="w-3 h-3 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {filters.types.map(t => (
              <Badge key={t} variant="secondary" className="text-xs">
                {SATELLITE_TYPES.find(st => st.id === t)?.label || t}
                <button onClick={() => toggleType(t)} className="ml-1 hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.orbitClasses.map(o => (
              <Badge key={o} variant="secondary" className="text-xs">
                {o}
                <button onClick={() => toggleOrbitClass(o)} className="ml-1 hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.operators.map(op => (
              <Badge key={op} variant="secondary" className="text-xs">
                {op}
                <button onClick={() => toggleOperator(op)} className="ml-1 hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SatelliteFilterPanel;
