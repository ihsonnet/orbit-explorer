import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Pencil, Trash2, Plus, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase, PostSubmission } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { categoryLabels, PostCategory } from '@/data/posts/types';
import AdminPostEditor from './AdminPostEditor';

const AdminPostList = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [editingPost, setEditingPost] = useState<PostSubmission | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase.from('post_submissions').select('*').order('created_at', { ascending: false });
    
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: 'Error fetching posts',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const updatePostStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('post_submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error updating post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: `Post ${status}` });
      fetchPosts();
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('post_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Post deleted' });
      fetchPosts();
    }
  };

  const handleEdit = (post: PostSubmission) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const statusCounts = {
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
              {status === 'approved' && <CheckCircle className="w-4 h-4 mr-1" />}
              {status === 'rejected' && <XCircle className="w-4 h-4 mr-1" />}
              {status}
              {status !== 'all' && (
                <Badge variant="secondary" className="ml-2">
                  {statusCounts[status]}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No {filter !== 'all' ? filter : ''} posts found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant={
                      post.status === 'pending' ? 'secondary' :
                      post.status === 'approved' ? 'default' : 'destructive'
                    }>
                      {post.status}
                    </Badge>
                    <Badge variant="outline">
                      {categoryLabels[post.category as PostCategory] || post.category}
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1 truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-1 shrink-0">
                  {post.status === 'pending' && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updatePostStatus(post.id, 'approved')}
                        className="text-primary hover:text-primary/80"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updatePostStatus(post.id, 'rejected')}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(post)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deletePost(post.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <AdminPostEditor
          post={editingPost}
          onClose={() => setShowEditor(false)}
          onSaved={() => {
            setShowEditor(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
};

export default AdminPostList;
