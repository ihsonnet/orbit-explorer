import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getGravatarUrl } from '@/data/posts/types';

export interface Contributor {
  name: string;
  avatarUrl: string;
  postCount: number;
  commentCount: number;
  totalContributions: number;
}

export function useTopContributors(limit: number = 10) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      setLoading(true);

      // Fetch approved posts grouped by email
      const { data: posts } = await supabase
        .from('post_submissions')
        .select('author_email, author_name')
        .eq('status', 'approved');

      // Fetch comments grouped by email
      const { data: comments } = await supabase
        .from('comments')
        .select('email, name');

      // Aggregate contributions by email
      const contributorMap = new Map<string, { name: string; posts: number; comments: number }>();

      (posts || []).forEach((post) => {
        const email = post.author_email.toLowerCase();
        const existing = contributorMap.get(email);
        if (existing) {
          existing.posts += 1;
          // Keep the most recent name
          existing.name = post.author_name;
        } else {
          contributorMap.set(email, { name: post.author_name, posts: 1, comments: 0 });
        }
      });

      (comments || []).forEach((comment) => {
        const email = comment.email.toLowerCase();
        const existing = contributorMap.get(email);
        if (existing) {
          existing.comments += 1;
        } else {
          contributorMap.set(email, { name: comment.name, posts: 0, comments: 1 });
        }
      });

      // Convert to array, sort by total, take top N
      const sorted = Array.from(contributorMap.entries())
        .map(([email, data]) => ({
          name: data.name,
          avatarUrl: getGravatarUrl(email, 64),
          postCount: data.posts,
          commentCount: data.comments,
          totalContributions: data.posts + data.comments,
        }))
        .sort((a, b) => b.totalContributions - a.totalContributions)
        .slice(0, limit);

      setContributors(sorted);
      setLoading(false);
    };

    fetchContributors();
  }, [limit]);

  return { contributors, loading };
}
