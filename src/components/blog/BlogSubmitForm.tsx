import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, User, FileText, Tag, CheckCircle, Bold, Italic, List, Heading, ChevronDown } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorEmail: '',
    authorName: '',
    category: '' as PostCategory | '',
    tags: '',
  });

  const generatePostId = () => {
    return `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateExcerpt = (content: string) => {
    const trimmed = content.trim();
    if (trimmed.length <= 150) return trimmed;
    const excerpt = trimmed.substring(0, 150);
    const lastSpace = excerpt.lastIndexOf(' ');
    return (lastSpace > 100 ? excerpt.substring(0, lastSpace) : excerpt) + '...';
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
      excerpt: generateExcerpt(formData.content),
      authorEmail: formData.authorEmail,
      authorName: formData.authorName,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    return JSON.stringify(post, null, 2);
  };

  const handleSubmit = () => {
    const json = generateJSON();
    if (json) {
      const subject = encodeURIComponent(`[S.P.A.C.E. Post Submission] ${formData.title}`);
      const body = encodeURIComponent(`New post submission:\n\n${json}`);
      window.location.href = `mailto:ihsonnet@gmail.com?subject=${subject}&body=${body}`;
      
      setSubmitted(true);
      setIsExpanded(false);
    }
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let newText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'heading':
        newText = `## ${selectedText || 'Heading'}`;
        cursorOffset = selectedText ? 0 : 3;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'List item'}`;
        cursorOffset = selectedText ? 0 : 3;
        break;
      default:
        return;
    }

    const newContent = formData.content.substring(0, start) + newText + formData.content.substring(end);
    setFormData({ ...formData, content: newContent });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length - cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-glow rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>
        <h3 className="font-display font-semibold text-xl text-foreground mb-2">
          Submission Received!
        </h3>
        <p className="text-muted-foreground mb-4">
          Your post is waiting for approval. If approved, it will be published within 2-3 days.
        </p>
        <p className="text-sm text-muted-foreground">
          We'll use your email to display your Gravatar profile photo.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              title: '',
              content: '',
              authorEmail: '',
              authorName: '',
              category: '' as PostCategory | '',
              tags: '',
            });
          }}
        >
          Submit Another Post
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glow rounded-2xl overflow-hidden"
    >
      {/* Collapsible Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground">Share Your Space Story</h3>
            <p className="text-sm text-muted-foreground">Submit a post for our community</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expandable Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-border/30">
              {/* Author Info Row */}
              <div className="grid md:grid-cols-2 gap-4 pt-4">
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
                    Your Email * <span className="text-xs opacity-70">(for Gravatar photo)</span>
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
                  <div>
                    <p className="text-sm font-medium text-foreground">{formData.authorName || 'Your Name'}</p>
                    <p className="text-xs text-muted-foreground">Your profile preview (via Gravatar)</p>
                  </div>
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

              {/* Content with Editor Toolbar */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm text-muted-foreground">
                  Content * <span className="text-xs opacity-70">(Markdown supported)</span>
                </Label>
                
                <div className="flex items-center gap-1 p-1 rounded-t-lg bg-secondary/30 border border-b-0 border-border/50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => insertFormatting('bold')}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => insertFormatting('italic')}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => insertFormatting('heading')}
                    title="Heading"
                  >
                    <Heading className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => insertFormatting('list')}
                    title="List"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px] bg-secondary/30 border-border/50 rounded-t-none font-mono text-sm"
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

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  variant="hero"
                  className="w-full gap-2"
                  size="lg"
                >
                  <Send className="w-4 h-4" />
                  Submit Post
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Your post will be reviewed before publishing. We'll use your email to fetch your Gravatar profile.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BlogSubmitForm;
