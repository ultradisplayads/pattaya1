"use client";

import { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink, 
  Star, 
  Calendar,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { buildApiUrl } from '@/lib/strapi-config';

interface LiveBuzzPost {
  id: number;
  source_platform: string;
  author_name: string;
  author_handle: string;
  author_avatar_url?: string;
  post_text: string;
  post_url: string;
  timestamp: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  category: string;
  engagement_metrics: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  hashtags: string[];
  location?: string;
  verified_author: boolean;
  business_featured: boolean;
  ai_analysis: {
    is_safe: boolean;
    is_english: boolean;
    is_relevant: boolean;
    confidence_score: number;
  };
}

interface LiveBuzzSectionProps {
  businessId: number;
  businessName: string;
  className?: string;
}

export function LiveBuzzSection({ 
  businessId, 
  businessName, 
  className 
}: LiveBuzzSectionProps) {
  const [posts, setPosts] = useState<LiveBuzzPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalMentions: 0,
    positiveMentions: 0,
    totalEngagement: 0,
    averageSentiment: 0
  });

  const fetchLiveBuzz = async () => {
    try {
      setRefreshing(true);
      
      const response = await fetch(`${buildApiUrl(`api/social-feed/business/${businessId}`)}?featured=true&limit=10`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPosts(data.data || []);
      
      // Calculate stats
      const totalMentions = data.data?.length || 0;
      const positiveMentions = data.data?.filter((p: LiveBuzzPost) => p.sentiment === 'Positive').length || 0;
      const totalEngagement = data.data?.reduce((sum: number, p: LiveBuzzPost) => 
        sum + (p.engagement_metrics?.likes || 0) + (p.engagement_metrics?.comments || 0) + (p.engagement_metrics?.shares || 0), 0) || 0;
      const averageSentiment = totalMentions > 0 ? (positiveMentions / totalMentions) * 100 : 0;
      
      setStats({
        totalMentions,
        positiveMentions,
        totalEngagement,
        averageSentiment
      });
      
    } catch (error) {
      console.error('Failed to fetch live buzz:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveBuzz();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchLiveBuzz, 300000);
    return () => clearInterval(interval);
  }, [businessId]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'x':
      case 'twitter':
        return '𝕏';
      case 'instagram':
        return '📷';
      case 'facebook':
        return '📘';
      case 'tiktok':
        return '🎵';
      case 'bluesky':
        return '🦋';
      default:
        return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'x':
      case 'twitter':
        return 'text-gray-800';
      case 'instagram':
        return 'text-pink-600';
      case 'facebook':
        return 'text-blue-600';
      case 'tiktok':
        return 'text-black';
      case 'bluesky':
        return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-green-600 bg-green-100';
      case 'Negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (posts.length === 0 && !loading) {
    return null; // Don't show section if no posts
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>Live Buzz</span>
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
          <Button
            onClick={fetchLiveBuzz}
            disabled={refreshing}
            variant="ghost"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time social media mentions and testimonials about {businessName}
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalMentions}</div>
            <div className="text-xs text-muted-foreground">Total Mentions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.positiveMentions}</div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalEngagement.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(stats.averageSentiment)}%</div>
            <div className="text-xs text-muted-foreground">Positive Rate</div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading live buzz...</span>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-all bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-sm">{post.author_name}</span>
                        <span className="text-xs text-muted-foreground">{post.author_handle}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(post.timestamp)}</span>
                        <Badge className={`text-xs ${getSentimentColor(post.sentiment)}`}>
                          {post.sentiment}
                        </Badge>
                        {post.business_featured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm mb-3">{post.post_text}</p>
                      
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.hashtags.slice(0, 5).map((hashtag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{hashtag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{post.engagement_metrics?.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.engagement_metrics?.comments || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="h-3 w-3" />
                            <span>{post.engagement_metrics?.shares || 0}</span>
                          </div>
                          {post.engagement_metrics?.views && (
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>{post.engagement_metrics.views}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${getPlatformColor(post.source_platform)}`}>
                            {getPlatformIcon(post.source_platform)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(post.post_url, '_blank')}
                            className="h-6 px-2 text-xs"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* AI Analysis Indicator */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3" />
              <span>AI-Powered Content Curation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-3 w-3" />
              <span>Powered by Pattaya1 Social Intelligence</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
