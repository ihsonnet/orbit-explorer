import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, BookOpen, Loader2, ChevronDown, Users, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { SpacePost, categoryGroups } from '@/data/posts/types';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogPostModal from '@/components/blog/BlogPostModal';
import BlogSubmitForm from '@/components/blog/BlogSubmitForm';
import TopContributors from '@/components/blog/TopContributors';

type SortOption = 'newest' | 'oldest' | 'alphabetical';
const POSTS_PER_PAGE = 12;

const Learn = () => {
  const { posts, loading, error } = usePosts();
  const { categories } = useCategories();
  const [selectedPost, setSelectedPost] = useState<SpacePost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.authorName.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [posts, searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset page when filters change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? null : value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Featured post (most recent)
  const featuredPost = !searchQuery && !selectedCategory ? filteredPosts[0] : null;
  const displayPosts = featuredPost ? paginatedPosts.filter(p => p.id !== featuredPost.id) : paginatedPosts;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Community Knowledge
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Your S.P.A.C.E.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore community insights on satellites, orbits, and space technology.
              Share your knowledge with fellow enthusiasts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-y border-border/50 bg-card/30 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, authors, or tags..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="md:hidden w-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3">
              <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48 bg-background/50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryGroups).map(([group, cats]) => (
                    <div key={group}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group}</div>
                      {cats.map((cat) => {
                        const category = categories.find(c => c.slug === cat);
                        return (
                          <SelectItem key={cat} value={cat}>
                            {category?.name || cat}
                          </SelectItem>
                        );
                      })}
                    </div>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => handleSortChange(v as SortOption)}>
                <SelectTrigger className="w-36 bg-background/50">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 flex flex-col gap-3">
                  <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(v) => handleSortChange(v as SortOption)}>
                    <SelectTrigger className="bg-background/50">
                      <SortAsc className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="alphabetical">A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Active Filters */}
      {(selectedCategory || searchQuery) && (
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Showing:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                "{searchQuery}"
                <button onClick={() => handleSearchChange('')} className="ml-1 hover:text-foreground">×</button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-foreground">×</button>
              </Badge>
            )}
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); setCurrentPage(1); }}
              className="text-sm text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Submit Form - Before Posts */}
              <div className="mb-8">
                <BlogSubmitForm />
              </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">{error}</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || selectedCategory
                    ? 'Try adjusting your filters or search query.'
                    : 'Be the first to contribute!'}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Post */}
                {featuredPost && currentPage === 1 && (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-br from-primary/5 via-card to-card border border-border/50 rounded-2xl p-6 md:p-8 cursor-pointer group"
                    onClick={() => setSelectedPost(featuredPost)}
                  >
                    <Badge className="mb-4">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2 max-w-2xl">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{featuredPost.authorName}</span>
                      <span>•</span>
                      <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.article>
                )}

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {displayPosts.map((post, index) => (
                    <BlogPostCard
                      key={post.id}
                      post={post}
                      index={index}
                      onReadMore={setSelectedPost}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "ghost"}
                            size="sm"
                            className="w-9 h-9"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Results Count */}
                <p className="text-center text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1}-{Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
                </p>
              </div>
            )}
          </div>

            {/* Sidebar */}
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-32 space-y-6">
                <TopContributors />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Post Modal */}
      <BlogPostModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <Footer />
    </div>
  );
};

export default Learn;
