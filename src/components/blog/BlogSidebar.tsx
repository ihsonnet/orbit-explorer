import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { categoryGroups, categoryLabels, PostCategory } from '@/data/posts/types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

interface BlogSidebarProps {
  selectedCategories: PostCategory[];
  onCategoryChange: (category: PostCategory) => void;
  onClearFilters: () => void;
}

const BlogSidebar = ({ selectedCategories, onCategoryChange, onClearFilters }: BlogSidebarProps) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Orbit Types': true,
    'Applications': true,
    'Space News': true,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full lg:w-64 shrink-0"
    >
      <div className="card-glow rounded-2xl p-4 sticky top-24">
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
        </div>

        {selectedCategories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {selectedCategories.length} filter{selectedCategories.length > 1 ? 's' : ''} active
            </p>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default BlogSidebar;
