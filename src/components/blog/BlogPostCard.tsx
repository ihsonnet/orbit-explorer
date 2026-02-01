import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { SpacePost, categoryLabels, getGravatarUrl } from '@/data/posts/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface BlogPostCardProps {
  post: SpacePost;
  index: number;
  onReadMore: (post: SpacePost) => void;
}

const BlogPostCard = ({ post, index, onReadMore }: BlogPostCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-glow rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
      onClick={() => onReadMore(post)}
    >
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10 shrink-0">
          <AvatarImage src={getGravatarUrl(post.authorEmail)} alt={post.authorName} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {post.authorName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              {categoryLabels[post.category]}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
          </div>

          <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{post.authorName}</span>
            </div>

            <span className="text-xs text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Read more <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {categoryLabels[post.category]}
            </Badge>
            {post.tags.length > 0 && (
              <>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogPostCard;
