import { motion } from 'framer-motion';
import { Trophy, MessageSquare, FileText } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopContributors, Contributor } from '@/hooks/useTopContributors';

const ContributorItem = ({ contributor, rank }: { contributor: Contributor; rank: number }) => {
  const initials = contributor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <span className="text-sm font-medium text-muted-foreground w-5 text-center">
        {rank <= 3 ? (
          <Trophy className={`w-4 h-4 ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : 'text-amber-600'}`} />
        ) : (
          rank
        )}
      </span>
      <Avatar className="h-8 w-8">
        <AvatarImage src={contributor.avatarUrl} alt={contributor.name} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{contributor.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {contributor.postCount > 0 && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {contributor.postCount}
            </span>
          )}
          {contributor.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {contributor.commentCount}
            </span>
          )}
        </div>
      </div>
      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
        {contributor.totalContributions}
      </span>
    </motion.div>
  );
};

const TopContributors = () => {
  const { contributors, loading } = useTopContributors(10);

  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Top Contributors</h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (contributors.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Top Contributors</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          No contributors yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Top Contributors</h3>
      </div>
      <div className="space-y-1">
        {contributors.map((contributor, index) => (
          <ContributorItem key={index} contributor={contributor} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default TopContributors;
