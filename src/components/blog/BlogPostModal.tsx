import { Calendar, Tag } from 'lucide-react';
import { SpacePost, categoryLabels, getGravatarUrl } from '@/data/posts/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import CommentSection from './CommentSection';

interface BlogPostModalProps {
  post: SpacePost | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogPostModal = ({ post, isOpen, onClose }: BlogPostModalProps) => {
  if (!post) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Enhanced markdown-like rendering with image support
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => {
      // Handle HTML img tags
      if (paragraph.includes('<img')) {
        const imgMatch = paragraph.match(/<img[^>]+>/);
        if (imgMatch) {
          const srcMatch = imgMatch[0].match(/src="([^"]+)"/);
          const altMatch = imgMatch[0].match(/alt="([^"]+)"/);
          const widthMatch = imgMatch[0].match(/width="([^"]+)"/);
          if (srcMatch) {
            return (
              <div key={i} className="my-4">
                <img
                  src={srcMatch[1]}
                  alt={altMatch?.[1] || 'image'}
                  style={{ width: widthMatch?.[1] || 'auto', maxWidth: '100%' }}
                  className="rounded-lg"
                />
              </div>
            );
          }
        }
      }

      // Handle markdown images ![alt](url)
      if (paragraph.match(/!\[.*?\]\(.*?\)/)) {
        const matches = paragraph.matchAll(/!\[(.*?)\]\((.*?)\)/g);
        const elements: JSX.Element[] = [];
        for (const match of matches) {
          elements.push(
            <div key={`${i}-${match[2]}`} className="my-4">
              <img
                src={match[2]}
                alt={match[1] || 'image'}
                className="rounded-lg max-w-full"
              />
            </div>
          );
        }
        return <div key={i}>{elements}</div>;
      }

      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h4 key={i} className="font-display font-semibold text-foreground mt-4 mb-2">
            {paragraph.replace(/\*\*/g, '')}
          </h4>
        );
      }
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(line => line.startsWith('- '));
        return (
          <ul key={i} className="list-disc list-inside space-y-1 my-2">
            {items.map((item, j) => (
              <li key={j} className="text-muted-foreground">
                {item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
              </li>
            ))}
          </ul>
        );
      }
      if (paragraph.match(/^\d\./)) {
        const items = paragraph.split('\n').filter(line => line.match(/^\d\./));
        return (
          <ol key={i} className="list-decimal list-inside space-y-1 my-2">
            {items.map((item, j) => (
              <li key={j} className="text-muted-foreground">
                {item.replace(/^\d\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <p key={i} className="text-muted-foreground mb-3">
          {paragraph.replace(/\*\*(.*?)\*\*/g, (_, text) => text)}
        </p>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-background/95 backdrop-blur-xl border-border/50 flex flex-col">
        <ScrollArea className="flex-1 max-h-[90vh]">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs mb-3">
                  {categoryLabels[post.category]}
                </Badge>
                <DialogTitle className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight">
                  {post.title}
                </DialogTitle>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={getGravatarUrl(post.authorEmail)} alt={post.authorName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.authorName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.authorName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4">
            {renderContent(post.content)}
          </div>

          <div className="p-6 pt-4 border-t border-border/30 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Comments Section */}
            <CommentSection postId={post.id} comments={post.comments} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
