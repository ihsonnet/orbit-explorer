import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, User, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getGravatarUrl } from '@/data/posts/types';
import { useToast } from '@/hooks/use-toast';
import { useComments } from '@/hooks/useComments';

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { toast } = useToast();
  const { comments, loading, addComment } = useComments(postId);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.content) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await addComment(formData.name, formData.email, formData.content);
      toast({
        title: 'Comment added!',
        description: 'Your comment has been posted.',
      });
      setFormData({ name: '', email: '', content: '' });
      setShowForm(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add comment',
        variant: 'destructive',
      });
    }
    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Comments {comments.length > 0 && `(${comments.length})`}
        </h4>
        {!showForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            Add Comment
          </Button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Existing Comments */}
      {!loading && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3 rounded-lg bg-secondary/20">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={getGravatarUrl(comment.email, 40)} alt={comment.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {comment.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{comment.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No comments message */}
      {!loading && comments.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}

      {/* Comment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg bg-secondary/20 space-y-3">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="comment-email" className="text-xs text-muted-foreground">
                    Email * <span className="opacity-70">(for your Gravatar photo)</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="comment-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-8 h-9 text-sm bg-background/50 border-border/50"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="comment-name" className="text-xs text-muted-foreground">
                    Display Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="comment-name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-8 h-9 text-sm bg-background/50 border-border/50"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Preview */}
              {formData.email && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={getGravatarUrl(formData.email, 30)} alt="Preview" />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                      {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span>Your Gravatar preview</span>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="comment-content" className="text-xs text-muted-foreground">
                  Comment *
                </Label>
                <Textarea
                  id="comment-content"
                  placeholder="Share your thoughts..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[80px] text-sm bg-background/50 border-border/50"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  className="gap-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {submitting ? 'Posting...' : 'Submit'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentSection;
