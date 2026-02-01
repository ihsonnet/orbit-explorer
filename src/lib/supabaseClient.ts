import { createClient } from '@supabase/supabase-js';

// Manual Supabase client using custom secrets
const supabaseUrl = import.meta.env.VITE_DB_URL || '';
const supabaseAnonKey = import.meta.env.VITE_DB_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Database features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PostSubmission {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_email: string;
  author_name: string;
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface CommentSubmission {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
}
