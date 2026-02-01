import { createClient } from '@supabase/supabase-js';

// Manual Supabase client
const supabaseUrl = 'https://lozglxntaxlhbwvkaame.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvemdseG50YXhsaGJ3dmthYW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDEyMDgsImV4cCI6MjA4MzM3NzIwOH0.xqLwL5cv3JoWrvoNNS5qcQAdn6biedupu2ZQqc0h8FU';

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
