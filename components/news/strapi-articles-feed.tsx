'use client';

import { useStrapiArticles, useStrapiCategories } from '@/hooks/use-strapi-articles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Newspaper, Search, RefreshCw, User, Calendar, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { transformStrapiArticle } from '@/lib/strapi-articles-api';

interface StrapiArticlesFeedProps {
  maxArticles?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
}

export function StrapiArticlesFeed({ 
  maxArticles = 10, 
  showSearch = true,
  showFilters = true,
  className = '' 
}: StrapiArticlesFeedProps) {
  const router = useRouter();
  const { articles, loading, error, fetchArticles, searchArticles, pagination } = useStrapiArticles();
  const { categories } = useStrapiCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      searchArticles(query);
    } else {
      fetchArticles();
    }
  };

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    if (categorySlug === 'all') {
      fetchArticles();
    } else {
      // Filter by category - you can extend this with API call
      fetchArticles();
    }
  };

  const displayArticles = articles.slice(0, maxArticles);
  
  console.log('StrapiArticlesFeed render:', { 
    articlesLength: articles.length, 
    loading, 
    error, 
    displayArticlesLength: displayArticles.length 
  });

  if (loading && articles.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading articles...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && articles.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="text-center">
            <p className="text-gray-600 mb-3">Failed to load articles</p>
            <span className="text-sm text-gray-500">{error}</span>
          </div>
          <Button onClick={() => fetchArticles()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Articles</h2>
          {pagination.total > 0 && (
            <Badge variant="secondary">{pagination.total} articles</Badge>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchArticles()}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="space-y-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {showFilters && categories.length > 0 && (
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Articles List */}
      {displayArticles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Articles Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'No articles have been published yet'}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} size="sm" variant="outline">
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayArticles.map((strapiArticle) => {
            const article = transformStrapiArticle(strapiArticle);
            return (
              <Card key={article.id} className="transition-all duration-200 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                      {article.title}
                    </CardTitle>
                    {article.category && (
                      <Badge variant="outline">
                        {article.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {article.featuredImage && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:1337${article.featuredImage}`}
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <p className="text-muted-foreground line-clamp-3">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {article.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.author}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`/articles/${article.id}`}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Read More
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {pagination.pageCount > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
                {pagination.total} articles
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchArticles({ page: pagination.page - 1 })}
                  disabled={pagination.page <= 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchArticles({ page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.pageCount || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
