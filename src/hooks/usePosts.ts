import { useState, useEffect } from 'react';
import { supabase, PostSubmission } from '@/lib/supabaseClient';
import { SpacePost, PostCategory } from '@/data/posts/types';

// Convert database format to app format
function toSpacePost(post: PostSubmission): SpacePost {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorEmail: post.author_email,
    authorName: post.author_name,
    category: post.category as PostCategory,
    tags: post.tags || [],
    status: post.status,
    createdAt: post.created_at,
    publishedAt: post.created_at,
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<SpacePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('post_submissions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setPosts([]);
    } else {
      setPosts((data || []).map(toSpacePost));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refetch: fetchPosts };
}
