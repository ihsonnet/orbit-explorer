import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, PostSubmission } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';

interface AdminPostEditorProps {
  post?: PostSubmission | null;
  onClose: () => void;
  onSaved: () => void;
}

const AdminPostEditor = ({ post, onClose, onSaved }: AdminPostEditorProps) => {
  const { toast } = useToast();
  const { categories } = useCategories();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    author_name: post?.author_name || 'Admin',
    author_email: post?.author_email || 'admin@space.com',
    category: post?.category || 'discoveries',
    tags: post?.tags?.join(', ') || '',
    status: post?.status || 'approved',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || formData.content.slice(0, 150) + '...',
      author_name: formData.author_name,
      author_email: formData.author_email,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: formData.status as PostSubmission['status'],
    };

    let error;
    if (post) {
      const result = await supabase
        .from('post_submissions')
        .update(postData)
        .eq('id', post.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('post_submissions')
        .insert(postData);
      error = result.error;
    }

    if (error) {
      toast({
        title: 'Error saving post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: post ? 'Post updated' : 'Post created',
        description: 'Your changes have been saved.',
      });
      onSaved();
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author_name">Author Name</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_email">Author Email</Label>
              <Input
                id="author_email"
                type="email"
                value={formData.author_email}
                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: string) => setFormData({ ...formData, status: value as 'pending' | 'approved' | 'rejected' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary (auto-generated if empty)..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your post content here..."
              rows={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="space, satellites, exploration"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {post ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminPostEditor;
