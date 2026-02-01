import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { categoryLabels, PostCategory } from '@/data/posts/types';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
}

// Merge hardcoded defaults with dynamic categories
export function useCategories() {
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (fetchError) {
      // If table doesn't exist yet, just use defaults
      if (fetchError.code === '42P01') {
        setDynamicCategories([]);
      } else {
        setError(fetchError.message);
      }
    } else {
      setDynamicCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Convert hardcoded categories to Category format
  const defaultCategories: Category[] = Object.entries(categoryLabels).map(([slug, name]) => ({
    id: slug,
    name,
    slug: slug as PostCategory,
    description: null,
    is_default: true,
    created_at: new Date().toISOString(),
  }));

  // Merge: dynamic categories override defaults with same slug
  const allCategories = [
    ...defaultCategories.filter(d => !dynamicCategories.some(c => c.slug === d.slug)),
    ...dynamicCategories,
  ].sort((a, b) => a.name.localeCompare(b.name));

  const addCategory = async (category: Omit<Category, 'id' | 'created_at' | 'is_default'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, is_default: false })
      .select()
      .single();
    
    if (!error && data) {
      setDynamicCategories(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id);
    
    if (!error) {
      fetchCategories();
    }
    return { error };
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setDynamicCategories(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  return {
    categories: allCategories,
    dynamicCategories,
    defaultCategories,
    loading,
    error,
    refetch: fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
