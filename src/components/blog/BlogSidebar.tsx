import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { categoryGroups, categoryLabels, PostCategory } from '@/data/posts/types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface BlogSidebarProps {
  selectedCategories: PostCategory[];
  onCategoryChange: (category: PostCategory) => void;
  onClearFilters: () => void;
}

const BlogSidebar = ({ selectedCategories, onCategoryChange, onClearFilters }: BlogSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Orbit Types': true,
    'Applications': true,
    'Space News': true,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const filterContent = (
    <div className="space-y-3">
      {Object.entries(categoryGroups).map(([groupName, categories]) => (
        <Collapsible
          key={groupName}
          open={openGroups[groupName]}
          onOpenChange={() => toggleGroup(groupName)}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {groupName}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                openGroups[groupName] ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pl-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 py-1 cursor-pointer group"
              >
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => onCategoryChange(category)}
                  className="border-muted-foreground/50"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {categoryLabels[category]}
                </span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}

      {selectedCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {selectedCategories.length} filter{selectedCategories.length > 1 ? 's' : ''} active
          </p>
        </div>
      )}
    </div>
  );

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full lg:w-64 shrink-0"
    >
      <div className="card-glow rounded-2xl p-4 sticky top-24">
        {/* Mobile: Collapsible Header */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-display font-semibold text-foreground">Filters</span>
              {selectedCategories.length > 0 && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-border/30">
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={onClearFilters}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors mb-3"
                    >
                      Clear all filters
                    </button>
                  )}
                  {filterContent}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: Always Visible */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-display font-semibold text-foreground">Filters</span>
            </div>
            {selectedCategories.length > 0 && (
              <button
                onClick={onClearFilters}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          {filterContent}
        </div>
      </div>
    </motion.aside>
  );
};

export default BlogSidebar;
