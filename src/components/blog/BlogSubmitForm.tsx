import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, FileText, Tag, Copy, Check } from 'lucide-react';
import { PostCategory, categoryLabels, categoryGroups, getGravatarUrl } from '@/data/posts/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const BlogSubmitForm = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    authorEmail: '',
    authorName: '',
    category: '' as PostCategory | '',
    tags: '',
  });

  const generatePostId = () => {
    return `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateJSON = () => {
    if (!formData.title || !formData.content || !formData.authorEmail || !formData.authorName || !formData.category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return null;
    }

    const post = {
      id: generatePostId(),
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
      authorEmail: formData.authorEmail,
      authorName: formData.authorName,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    return JSON.stringify(post, null, 2);
  };

  const handleCopyJSON = () => {
    const json = generateJSON();
    if (json) {
      navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'JSON Copied!',
        description: 'Post data copied to clipboard.',
      });
    }
  };

  const handleSubmitEmail = () => {
    const json = generateJSON();
    if (json) {
      const subject = encodeURIComponent(`[S.P.A.C.E. Post Submission] ${formData.title}`);
      const body = encodeURIComponent(`New post submission:\n\n${json}`);
      window.location.href = `mailto:ihsonnet@gmail.com?subject=${subject}&body=${body}`;
      
      toast({
        title: 'Email client opened',
        description: 'Send the email to submit your post for review.',
      });
    }
  };

  const allCategories = Object.values(categoryGroups).flat();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glow rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Share Your Space Story</h3>
          <p className="text-sm text-muted-foreground">Submit a post for our community</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Author Info Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="authorName" className="text-sm text-muted-foreground">
              Your Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="authorName"
                placeholder="John Doe"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="pl-10 bg-secondary/30 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorEmail" className="text-sm text-muted-foreground">
              Your Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="authorEmail"
                type="email"
                placeholder="you@example.com"
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                className="pl-10 bg-secondary/30 border-border/50"
              />
            </div>
          </div>
        </div>

        {/* Preview Avatar */}
        {formData.authorEmail && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
            <Avatar className="w-10 h-10">
              <AvatarImage src={getGravatarUrl(formData.authorEmail)} alt="Preview" />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {formData.authorName ? formData.authorName.split(' ').map(n => n[0]).join('') : '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">Your avatar preview (from Gravatar)</span>
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm text-muted-foreground">
            Post Title *
          </Label>
          <Input
            id="title"
            placeholder="An interesting title about space..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-secondary/30 border-border/50"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as PostCategory })}
          >
            <SelectTrigger className="bg-secondary/30 border-border/50">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryGroups).map(([groupName, categories]) => (
                <div key={groupName}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {groupName}
                  </div>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt" className="text-sm text-muted-foreground">
            Short Excerpt (optional)
          </Label>
          <Input
            id="excerpt"
            placeholder="A brief summary of your post..."
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="bg-secondary/30 border-border/50"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm text-muted-foreground">
            Content * (Markdown supported)
          </Label>
          <Textarea
            id="content"
            placeholder="Write your post content here. You can use **bold** for headers and - for bullet points..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="min-h-[150px] bg-secondary/30 border-border/50"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm text-muted-foreground">
            Tags (comma-separated)
          </Label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="tags"
              placeholder="satellite, space, technology"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="pl-10 bg-secondary/30 border-border/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleCopyJSON}
            variant="outline"
            className="flex-1 gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </Button>
          <Button
            onClick={handleSubmitEmail}
            variant="hero"
            className="flex-1 gap-2"
          >
            <Send className="w-4 h-4" />
            Submit via Email
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Your post will be reviewed before publishing. We'll notify you once approved.
        </p>
      </div>
    </motion.div>
  );
};

export default BlogSubmitForm;
