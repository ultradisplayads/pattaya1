'use client';

import { useNews } from '@/hooks/use-news';
import { BreakingNewsCard } from './breaking-news-card';
import { SponsoredPost } from './sponsored-post';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Clock, AlertTriangle, Pin, Newspaper } from "lucide-react";
import { useState, useEffect } from 'react';

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
  const [feedData, setFeedData] = useState<any[]>([]);

  // Fetch mixed content from /api/breaking-news/live
  useEffect(() => {
    const fetchMixedFeed = async () => {
      try {
        const response = await fetch('/api/breaking-news/live');
        const result = await response.json();
        // Handle new API structure with data and meta fields
        setFeedData(result.data || result || []);
      } catch (error) {
        console.error('Failed to fetch mixed feed:', error);
        setFeedData(articles); // Fallback to regular articles
      }
    };

    fetchMixedFeed();
  }, [articles]);

  const displayArticles = maxArticles ? feedData.slice(0, maxArticles) : feedData;
  const pinnedArticles = displayArticles.filter(item => item.isPinned);
  const regularArticles = displayArticles.filter(item => !item.isPinned);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/breaking-news/live');
      const result = await response.json();
      setFeedData(result.data || result || []);
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

  if (loading && feedData.length === 0) {
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

  if (error && feedData.length === 0) {
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
          {feedData.length > 0 && (
            <Badge variant="secondary">{feedData.length} articles</Badge>
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

      {feedData.length === 0 ? (
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
              {pinnedArticles.map((item) => (
                <div key={item.id}>
                  {item.type === 'sponsored' ? (
                    <SponsoredPost post={{
                      id: item.id,
                      type: 'sponsored',
                      title: item.title,
                      summary: item.summary,
                      url: item.url,
                      sponsorName: item.sponsorName || 'Sponsored',
                      publishedAt: item.timestamp,
                      category: item.category
                    }} />
                  ) : (
                    <BreakingNewsCard
                      article={item}
                      onPin={pinArticle}
                      onUnpin={unpinArticle}
                      onUpvote={(id) => handleVote(id, 'upvote')}
                      onDownvote={(id) => handleVote(id, 'downvote')}
                      showActions={showRefreshButton}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Regular Articles */}
          {regularArticles.length > 0 && (
            <div className="space-y-3">
              {pinnedArticles.length > 0 && (
                <h3 className="text-lg font-medium">Latest News</h3>
              )}
              {regularArticles.map((item) => (
                <div key={item.id}>
                  {item.type === 'sponsored' ? (
                    <SponsoredPost post={{
                      id: item.id,
                      type: 'sponsored',
                      title: item.title,
                      summary: item.summary,
                      url: item.url,
                      sponsorName: item.sponsorName || 'Sponsored',
                      publishedAt: item.timestamp,
                      category: item.category
                    }} />
                  ) : (
                    <BreakingNewsCard
                      article={item}
                      onPin={pinArticle}
                      onUnpin={unpinArticle}
                      onUpvote={(id) => handleVote(id, 'upvote')}
                      onDownvote={(id) => handleVote(id, 'downvote')}
                      showActions={showRefreshButton}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
