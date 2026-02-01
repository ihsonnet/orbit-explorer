import { useState, useEffect } from 'react';
import { supabase, CommentSubmission } from '@/lib/supabaseClient';
import { Comment } from '@/data/posts/types';

// Convert database format to app format
function toComment(comment: CommentSubmission): Comment {
  return {
    id: comment.id,
    name: comment.name,
    email: comment.email,
    content: comment.content,
    createdAt: comment.created_at,
  };
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!postId) return;
    
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setComments((data || []).map(toComment));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const addComment = async (name: string, email: string, content: string) => {
    const { error: insertError } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        name,
        email,
        content,
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Refresh comments
    await fetchComments();
  };

  return { comments, loading, error, addComment, refetch: fetchComments };
}
