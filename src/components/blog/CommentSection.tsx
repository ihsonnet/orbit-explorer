import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getGravatarUrl } from '@/data/posts/types';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  comments?: Comment[];
}

const CommentSection = ({ postId, comments = [] }: CommentSectionProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.content) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    // Generate comment JSON and open mailto
    const comment = {
      postId,
      name: formData.name,
      email: formData.email,
      content: formData.content,
      createdAt: new Date().toISOString(),
    };

    const subject = encodeURIComponent(`[S.P.A.C.E. Comment] on post ${postId}`);
    const body = encodeURIComponent(`New comment submission:\\n\\n${JSON.stringify(comment, null, 2)}`);
    window.location.href = `mailto:ihsonnet@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setFormData({ name: '', email: '', content: '' });
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
        {!showForm && !submitted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            Add Comment
          </Button>
        )}
      </div>

      {/* Existing Comments */}
      {comments.length > 0 && (
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
      {comments.length === 0 && !showForm && !submitted && (
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="comment-name" className="text-xs text-muted-foreground">
                    Name *
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
                <div className="space-y-1">
                  <Label htmlFor="comment-email" className="text-xs text-muted-foreground">
                    Email *
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
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  className="gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submitted Message */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-accent/10 text-center"
        >
          <p className="text-sm text-foreground font-medium">Comment submitted!</p>
          <p className="text-xs text-muted-foreground mt-1">
            It will appear after approval (within 2-3 days).
          </p>
          <Button
            variant="link"
            size="sm"
            className="mt-2"
            onClick={() => {
              setSubmitted(false);
              setShowForm(true);
            }}
          >
            Add another comment
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CommentSection;
