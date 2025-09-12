"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Hash, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2,
  ExternalLink,
  Filter,
  Search,
  Globe,
  Clock,
  Verified,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  Eye,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { buildApiUrl } from '@/lib/strapi-config';
import { WidgetWrapper } from './WidgetWrapper';

interface SocialPost {
  id: number;
  source_platform: string;
  post_id: string;
  author_name: string;
  author_handle: string;
  author_avatar_url?: string;
  post_text: string;
  post_url: string;
  timestamp: string;
  status: 'Approved' | 'Pending Review' | 'Quarantined' | 'Rejected';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  category: 'Nightlife' | 'Food & Drink' | 'News & Events' | 'Activities & Tours' | 'General';
  mentioned_business?: {
    id: number;
    name: string;
    slug: string;
  };
  engagement_metrics?: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  hashtags: string[];
  location?: string;
  verified_author: boolean;
  featured: boolean;
  business_featured: boolean;
  ai_analysis?: {
    is_safe: boolean;
    is_english: boolean;
    is_relevant: boolean;
    confidence_score: number;
    model_version: string;
  };
}

interface SocialStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  platforms: Record<string, number>;
  categories: Record<string, number>;
  recentActivity: number;
  aiAnalysis: {
    totalAnalyzed: number;
    safeContent: number;
    englishContent: number;
    relevantContent: number;
  };
}

interface TrendingHashtag {
  hashtag: string;
  count: number;
}

interface EnhancedSocialFeedWidgetProps {
  theme?: 'primary' | 'nightlife';
  className?: string;
}

export function EnhancedSocialFeedWidget({ theme = 'primary', className }: EnhancedSocialFeedWidgetProps) {
  const isPrimary = theme === 'primary';
  const [activeTab, setActiveTab] = useState<'trending' | 'social'>('trending');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<SocialPost[]>([]);
  const [stats, setStats] = useState<SocialStats | null>(null);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchEnhancedFeed = useCallback(async (forceRefresh = false) => {
    try {
      setRefreshing(true);
      
      if (forceRefresh) {
        // Trigger enhanced aggregation
        await fetch(buildApiUrl('api/social-feed/aggregate'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keywords: ['Pattaya', 'Thailand', 'Beach', 'Nightlife', 'Food', 'Tourism'],
            forceRefresh: true
          })
        });
      }
      
      const params = new URLSearchParams({
        keywords: 'Pattaya,Thailand,Beach,Nightlife,Food,Tourism',
        limit: '20',
        platform: selectedPlatform,
        category: selectedCategory,
        status: 'Approved'
      });

      if (searchQuery) {
        params.append('q', searchQuery);
      }

      const response = await fetch(`${buildApiUrl('api/social-feed/enhanced')}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data) {
        setPosts(data.data.posts || []);
        setStats(data.data.stats || null);
        setLastUpdated(new Date(data.data.lastUpdated));
      }
    } catch (error) {
      console.error('Failed to fetch enhanced social feed:', error);
      setPosts(getFallbackPosts());
      setStats(getFallbackStats());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPlatform, selectedCategory, searchQuery]);

  const fetchTrendingData = useCallback(async () => {
    try {
      // Fetch trending hashtags
      const hashtagsResponse = await fetch(buildApiUrl('api/social-feed/trending-hashtags?limit=10'));
      if (hashtagsResponse.ok) {
        const hashtagsData = await hashtagsResponse.json();
        setTrendingHashtags(hashtagsData.data || []);
      }

      // Fetch trending posts (featured posts)
      const trendingResponse = await fetch(`${buildApiUrl('api/social-feed/enhanced')}?featured=true&limit=10`);
      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json();
        setTrendingPosts(trendingData.data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch trending data:', error);
    }
  }, []);

  useEffect(() => {
    fetchEnhancedFeed();
    fetchTrendingData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => fetchEnhancedFeed(false), 300000);
    
    return () => clearInterval(interval);
  }, [fetchEnhancedFeed, fetchTrendingData]);

  const getFallbackPosts = (): SocialPost[] => [
    {
      id: 1,
      source_platform: 'X',
      post_id: 'twitter_fallback_1',
      author_name: 'Pattaya Explorer',
      author_handle: '@pattaya_explorer',
      post_text: 'Just discovered an amazing hidden beach in Pattaya! The water is crystal clear and perfect for snorkeling 🏖️ #Pattaya #Thailand #Beach',
      post_url: 'https://twitter.com/pattaya_explorer/status/1234567890',
      timestamp: new Date().toISOString(),
      status: 'Approved',
      sentiment: 'Positive',
      category: 'Activities & Tours',
      hashtags: ['Pattaya', 'Thailand', 'Beach', 'Snorkeling'],
      location: 'Pattaya, Thailand',
      verified_author: true,
      featured: true,
      business_featured: false,
      engagement_metrics: {
        likes: 45,
        comments: 12,
        shares: 8,
        views: 1200
      },
      ai_analysis: {
        is_safe: true,
        is_english: true,
        is_relevant: true,
        confidence_score: 0.95,
        model_version: 'gemini-1.5-flash'
      }
    }
  ];

  const getFallbackStats = (): SocialStats => ({
    totalPosts: 1250,
    totalLikes: 15680,
    totalComments: 3240,
    totalShares: 1890,
    platforms: {
      'X': 650,
      'Instagram': 420,
      'Facebook': 180
    },
    categories: {
      'Activities & Tours': 450,
      'Food & Drink': 320,
      'Nightlife': 280,
      'News & Events': 200
    },
    recentActivity: 45,
    aiAnalysis: {
      totalAnalyzed: 1200,
      safeContent: 1150,
      englishContent: 1180,
      relevantContent: 1100
    }
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'Pending Review':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'Quarantined':
        return <AlertCircle className="h-3 w-3 text-orange-500" />;
      case 'Rejected':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <WidgetWrapper widgetId="enhanced-social-feed" className={className}>
      <Card
        className={`h-full transition-all duration-500 hover:scale-105 widget-card glow-border ${
          isPrimary
            ? "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-blue-200 hover:shadow-xl hover:shadow-blue-200/50"
            : "bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/30"
        }`}
      >
        <CardHeader className="pb-3">
          <CardTitle
            className={`flex items-center justify-between text-lg ${isPrimary ? "text-blue-800" : "text-white"}`}
          >
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 animate-pulse" />
              <span>Social Intelligence</span>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fetchEnhancedFeed(true)}
                disabled={refreshing}
                className={`h-6 w-6 ${isPrimary ? "hover:bg-blue-200" : "hover:bg-blue-700"}`}
                title="Refresh with AI analysis"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open("/social", "_blank")}
                className={`h-6 w-6 ${isPrimary ? "hover:bg-blue-200" : "hover:bg-blue-700"}`}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
          
          {/* AI Analysis Status */}
          {stats?.aiAnalysis && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span>{stats.aiAnalysis.safeContent}/{stats.aiAnalysis.totalAnalyzed} Safe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3 text-blue-500" />
                  <span>{stats.aiAnalysis.englishContent}/{stats.aiAnalysis.totalAnalyzed} English</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-purple-500" />
                  <span>{stats.aiAnalysis.relevantContent}/{stats.aiAnalysis.totalAnalyzed} Relevant</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{stats.recentActivity} recent</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Two-Tab Interface */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'trending' | 'social')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trending" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trending on Pattaya1</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Buzz on Social</span>
              </TabsTrigger>
            </TabsList>

            {/* Trending Tab */}
            <TabsContent value="trending" className="space-y-4">
              {/* Trending Hashtags */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center space-x-2">
                  <Hash className="h-4 w-4" />
                  <span>Trending Hashtags</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {trendingHashtags.slice(0, 8).map((hashtag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      #{hashtag.hashtag} ({hashtag.count})
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Trending Posts */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Featured Content</span>
                </h4>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {trendingPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                          isPrimary
                            ? "bg-white border-gray-200 hover:border-blue-300"
                            : "bg-gray-800 border-gray-700 hover:border-blue-500"
                        } ${post.featured ? "ring-2 ring-yellow-400" : ""}`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author_avatar_url} />
                            <AvatarFallback>
                              {post.author_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{post.author_name}</span>
                              {post.verified_author && <Verified className="h-3 w-3 text-blue-500" />}
                              <span className="text-xs text-muted-foreground">{post.author_handle}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{formatTimeAgo(post.timestamp)}</span>
                              {post.featured && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm mb-2">{post.post_text}</p>
                            
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
              </div>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-4">
              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="X">X/Twitter</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="Bluesky">Bluesky</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Nightlife">Nightlife</SelectItem>
                      <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                      <SelectItem value="News & Events">News & Events</SelectItem>
                      <SelectItem value="Activities & Tours">Activities & Tours</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Social Feed Posts */}
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading posts...</span>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Globe className="h-8 w-8 mx-auto mb-2" />
                      <p>No posts found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div
                        key={post.id}
                        className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                          isPrimary
                            ? "bg-white border-gray-200 hover:border-blue-300"
                            : "bg-gray-800 border-gray-700 hover:border-blue-500"
                        } ${post.featured ? "ring-2 ring-yellow-400" : ""}`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author_avatar_url} />
                            <AvatarFallback>
                              {post.author_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{post.author_name}</span>
                              {post.verified_author && <Verified className="h-3 w-3 text-blue-500" />}
                              <span className="text-xs text-muted-foreground">{post.author_handle}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{formatTimeAgo(post.timestamp)}</span>
                              {getStatusIcon(post.status)}
                            </div>
                            
                            <p className="text-sm mb-2">{post.post_text}</p>
                            
                            {post.location && (
                              <div className="flex items-center space-x-1 mb-2">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{post.location}</span>
                              </div>
                            )}
                            
                            {post.hashtags && post.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {post.hashtags.slice(0, 3).map((hashtag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    #{hashtag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* AI Analysis Indicators */}
                            {post.ai_analysis && (
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={`text-xs ${getSentimentColor(post.sentiment)}`}>
                                  {post.sentiment}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {post.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {Math.round(post.ai_analysis.confidence_score * 100)}%
                                </Badge>
                              </div>
                            )}

                            {/* Business Mention */}
                            {post.mentioned_business && (
                              <div className="flex items-center space-x-1 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {post.mentioned_business.name}
                                </Badge>
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
                                    <Eye className="h-3 w-3" />
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
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Stats Bar */}
          {stats && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{stats.totalPosts.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{stats.totalLikes.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{stats.totalComments.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="h-3 w-3" />
                  <span>{stats.totalShares.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
            </div>
          )}

          {/* Powered by Branding */}
          <div className="text-xs text-center text-muted-foreground pt-2 border-t">
            Powered by <span className="font-semibold">Pattaya1 Social Intelligence</span> • AI-Powered Content Curation
          </div>
        </CardContent>
      </Card>
    </WidgetWrapper>
  );
}
