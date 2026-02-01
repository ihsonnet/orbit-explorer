import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, LogOut, Loader2, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase, PostSubmission } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { categoryLabels, PostCategory } from '@/data/posts/types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin, filter]);

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
      toast({
        title: `Post ${status}`,
        description: `The post has been ${status}.`,
      });
      fetchPosts();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statusCounts = {
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
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

        {/* Posts List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No {filter !== 'all' ? filter : ''} posts found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glow rounded-xl p-6"
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
                    <h3 className="font-display font-semibold text-lg text-foreground mb-1 truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {post.author_name} ({post.author_email})
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {post.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updatePostStatus(post.id, 'approved')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updatePostStatus(post.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
