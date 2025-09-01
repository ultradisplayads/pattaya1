'use client';

import { useNews } from '@/hooks/use-news';
import { BreakingNewsCard } from './breaking-news-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Newspaper } from 'lucide-react';
import { useState } from 'react';

interface BreakingNewsFeedProps {
  showRefreshButton?: boolean;
  maxArticles?: number;
  className?: string;
}

export function BreakingNewsFeed({ 
  showRefreshButton = true, 
  maxArticles,
  className = '' 
}: BreakingNewsFeedProps) {
  const { articles, loading, error, fetchLiveNews, pinArticle, unpinArticle, voteArticle, fetchNews } = useNews();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const displayArticles = maxArticles ? articles.slice(0, maxArticles) : articles;
  const pinnedArticles = displayArticles.filter(article => article.isPinned);
  const regularArticles = displayArticles.filter(article => !article.isPinned);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchLiveNews();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFetchNews = async () => {
    setIsRefreshing(true);
    try {
      await fetchNews();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVote = async (id: string, type: 'upvote' | 'downvote') => {
    await voteArticle(id, type);
  };

  if (loading && articles.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading breaking news...
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
            <p className="text-destructive mb-2">Failed to load breaking news</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
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
          <h2 className="text-xl font-semibold">Breaking News</h2>
          {articles.length > 0 && (
            <Badge variant="secondary">{articles.length} articles</Badge>
          )}
        </div>
        
        {showRefreshButton && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFetchNews}
              disabled={isRefreshing}
            >
              Fetch New
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No breaking news available</h3>
            <p className="text-muted-foreground text-center mb-4">
              Check back later for the latest updates
            </p>
            <Button onClick={handleFetchNews} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Fetch News
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Pinned Articles */}
          {pinnedArticles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Pinned Articles
              </h3>
              {pinnedArticles.map((article) => (
                <BreakingNewsCard
                  key={article.id}
                  article={article}
                  onPin={pinArticle}
                  onUnpin={unpinArticle}
                  onUpvote={(id) => handleVote(id, 'upvote')}
                  onDownvote={(id) => handleVote(id, 'downvote')}
                  showActions={showRefreshButton}
                />
              ))}
            </div>
          )}

          {/* Regular Articles */}
          {regularArticles.length > 0 && (
            <div className="space-y-3">
              {pinnedArticles.length > 0 && (
                <h3 className="text-lg font-medium">Latest News</h3>
              )}
              {regularArticles.map((article) => (
                <BreakingNewsCard
                  key={article.id}
                  article={article}
                  onPin={pinArticle}
                  onUnpin={unpinArticle}
                  onUpvote={(id) => handleVote(id, 'upvote')}
                  onDownvote={(id) => handleVote(id, 'downvote')}
                  showActions={showRefreshButton}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
