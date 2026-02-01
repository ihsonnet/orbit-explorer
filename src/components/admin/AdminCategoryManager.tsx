import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCategories, Category } from '@/hooks/useCategories';

const AdminCategoryManager = () => {
  const { toast } = useToast();
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    if (category.is_default) return;
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
    
    let result;
    if (editingId) {
      result = await updateCategory(editingId, {
        name: formData.name,
        slug,
        description: formData.description || null,
      });
    } else {
      result = await addCategory({
        name: formData.name,
        slug,
        description: formData.description || null,
      });
    }

    if (result.error) {
      toast({
        title: 'Error saving category',
        description: result.error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: editingId ? 'Category updated' : 'Category created' });
      resetForm();
    }
    setSaving(false);
  };

  const handleDelete = async (category: Category) => {
    if (category.is_default) return;
    
    const { error } = await deleteCategory(category.id);
    if (error) {
      toast({
        title: 'Error deleting category',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Category deleted' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-foreground">Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage post categories. Default categories cannot be modified.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="bg-muted/50 rounded-xl p-4 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Category name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              placeholder="Slug (auto-generated if empty)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>
          <Textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Update' : 'Add'}
            </Button>
          </div>
        </motion.form>
      )}

      {/* Categories List */}
      <div className="grid gap-2">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
          >
            <div className="flex items-center gap-3">
              {category.is_default && (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{category.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {category.slug}
                  </Badge>
                  {category.is_default && (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  )}
                </div>
                {category.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {!category.is_default && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(category)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(category)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoryManager;
