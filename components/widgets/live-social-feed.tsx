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
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { buildApiUrl } from '@/lib/strapi-config';
import { WidgetWrapper } from './WidgetWrapper';

interface SocialPost {
  id: number;
  Platform: string;
  Author: string;
  Handle: string;
  Avatar?: { url: string };
  Content: string;
  Timestamp: string;
  Likes: number;
  Comments: number;
  Shares: number;
  Location?: string;
  Verified: boolean;
  Hashtags: string[];
  Image?: { url: string };
  URL: string;
  Category: string;
  Featured: boolean;
}

interface SocialStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  platforms: Record<string, number>;
  categories: Record<string, number>;
  recentActivity: number;
}

interface LiveSocialFeedProps {
  theme?: 'primary' | 'nightlife';
  className?: string;
}

export function LiveSocialFeed({ theme = 'primary', className }: LiveSocialFeedProps) {
  const isPrimary = theme === 'primary';
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stats, setStats] = useState<SocialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeatured, setShowFeatured] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSocialFeed = useCallback(async (forceRefresh = false) => {
    try {
      setRefreshing(true);
      
      if (forceRefresh) {
        // Call the fetch-new endpoint to get fresh Twitter data
        const refreshResponse = await fetch(buildApiUrl('api/social-feed/fetch-new'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keywords: ['Pattaya'],
            forceRefresh: true
          })
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          console.log('Fresh Twitter data fetched:', refreshData.data.message);
        }
      }
      
      const params = new URLSearchParams({
        keywords: 'Pattaya,Thailand,Beach,Nightlife,Food,Tourism',
        limit: '20',
        platform: selectedPlatform,
        category: selectedCategory,
        featured: showFeatured.toString()
      });

      if (searchQuery) {
        params.append('q', searchQuery);
      }

      const response = await fetch(`${buildApiUrl('api/social-feed/live')}?${params}`);
      
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
      console.error('Failed to fetch social feed:', error);
      // Use fallback data
      setPosts(getFallbackPosts());
      setStats(getFallbackStats());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPlatform, selectedCategory, showFeatured, searchQuery]);

  useEffect(() => {
    fetchSocialFeed(); // Initial load without force refresh
    
    // Set up auto-refresh every 5 minutes (using cache)
    const interval = setInterval(() => fetchSocialFeed(false), 300000);
    
    return () => clearInterval(interval);
  }, [fetchSocialFeed]);

  const getFallbackPosts = (): SocialPost[] => [
    {
      id: 1,
      Platform: 'twitter',
      Author: 'Pattaya Explorer',
      Handle: '@pattaya_explorer',
      Content: 'Just discovered an amazing hidden beach in Pattaya! The water is crystal clear and perfect for snorkeling 🏖️ #Pattaya #Thailand #Beach',
      Timestamp: new Date().toISOString(),
      Likes: 45,
      Comments: 12,
      Shares: 8,
      Location: 'Pattaya, Thailand',
      Verified: true,
      Hashtags: ['Pattaya', 'Thailand', 'Beach', 'Snorkeling'],
      URL: 'https://twitter.com/pattaya_explorer/status/1234567890',
      Category: 'Tourism',
      Featured: true
    },
    {
      id: 2,
      Platform: 'instagram',
      Author: 'Foodie in Pattaya',
      Handle: '@pattaya_foodie',
      Content: 'The best pad thai I\'ve ever had! This local restaurant in Pattaya serves authentic Thai cuisine that will blow your mind 🍜 #Pattaya #Food #ThaiCuisine',
      Timestamp: new Date(Date.now() - 3600000).toISOString(),
      Likes: 89,
      Comments: 23,
      Shares: 15,
      Location: 'Pattaya, Thailand',
      Verified: false,
      Hashtags: ['Pattaya', 'Food', 'ThaiCuisine', 'PadThai'],
      URL: 'https://instagram.com/p/abc123',
      Category: 'Food',
      Featured: false
    },
    {
      id: 3,
      Platform: 'twitter',
      Author: 'Pattaya Nightlife',
      Handle: '@pattaya_nightlife',
      Content: 'The nightlife scene in Pattaya is absolutely incredible! From rooftop bars to beach clubs, there\'s something for everyone 🌃 #Pattaya #Nightlife #Thailand',
      Timestamp: new Date(Date.now() - 7200000).toISOString(),
      Likes: 156,
      Comments: 34,
      Shares: 28,
      Location: 'Pattaya, Thailand',
      Verified: true,
      Hashtags: ['Pattaya', 'Nightlife', 'Thailand', 'BeachClubs'],
      URL: 'https://twitter.com/pattaya_nightlife/status/1234567892',
      Category: 'Nightlife',
      Featured: true
    }
  ];

  const getFallbackStats = (): SocialStats => ({
    totalPosts: 1250,
    totalLikes: 15680,
    totalComments: 3240,
    totalShares: 1890,
    platforms: {
      twitter: 650,
      instagram: 420,
      facebook: 180
    },
    categories: {
      Tourism: 450,
      Food: 320,
      Nightlife: 280,
      Culture: 200
    },
    recentActivity: 45
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
      case 'twitter':
        return '𝕏';
      case 'instagram':
        return '📷';
      case 'facebook':
        return '📘';
      case 'tiktok':
        return '🎵';
      default:
        return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 'text-gray-800';
      case 'instagram':
        return 'text-pink-600';
      case 'facebook':
        return 'text-blue-600';
      case 'tiktok':
        return 'text-black';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <WidgetWrapper widgetId="social-feed" className={className}>
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
              <span>Live Social Feed</span>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse"
              >
                Live
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fetchSocialFeed(true)}
                disabled={refreshing}
                className={`h-6 w-6 ${isPrimary ? "hover:bg-blue-200" : "hover:bg-blue-700"}`}
                title="Refresh Twitter feed"
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
          
          {/* Stats Bar */}
          {stats && (
            <div className="flex items-center justify-between text-sm">
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
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{stats.recentActivity} recent</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeatured(!showFeatured)}
                className={showFeatured ? "bg-blue-100" : ""}
              >
                <Filter className="h-4 w-4 mr-1" />
                Featured
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Tourism">Tourism</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Nightlife">Nightlife</SelectItem>
                  <SelectItem value="Culture">Culture</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Posts Feed */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
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
                  } ${post.Featured ? "ring-2 ring-yellow-400" : ""}`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.Avatar?.url} />
                      <AvatarFallback>
                        {post.Author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{post.Author}</span>
                        {post.Verified && <Verified className="h-3 w-3 text-blue-500" />}
                        <span className="text-xs text-muted-foreground">{post.Handle}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(post.Timestamp)}</span>
                        {post.Featured && (
                          <Badge variant="secondary" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm mb-2">{post.Content}</p>
                      
                      {post.Location && (
                        <div className="flex items-center space-x-1 mb-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{post.Location}</span>
                        </div>
                      )}
                      
                      {post.Hashtags && post.Hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.Hashtags.slice(0, 3).map((hashtag, index) => (
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
                            <span>{post.Likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.Comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="h-3 w-3" />
                            <span>{post.Shares}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${getPlatformColor(post.Platform)}`}>
                            {getPlatformIcon(post.Platform)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(post.URL, '_blank')}
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

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
    </WidgetWrapper>
  );
}
