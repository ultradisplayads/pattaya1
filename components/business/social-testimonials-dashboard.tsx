"use client";

import { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink, 
  Star, 
  Filter, 
  Search, 
  ToggleLeft, 
  ToggleRight,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { buildApiUrl } from '@/lib/strapi-config';

interface SocialTestimonial {
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

interface SocialTestimonialsDashboardProps {
  businessId: number;
  businessName: string;
  className?: string;
}

export function SocialTestimonialsDashboard({ 
  businessId, 
  businessName, 
  className 
}: SocialTestimonialsDashboardProps) {
  const [testimonials, setTestimonials] = useState<SocialTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [stats, setStats] = useState({
    totalMentions: 0,
    positiveMentions: 0,
    totalEngagement: 0,
    averageSentiment: 0
  });

  const fetchTestimonials = async () => {
    try {
      setRefreshing(true);
      
      const params = new URLSearchParams({
        limit: '50'
      });

      if (searchQuery) {
        params.append('q', searchQuery);
      }
      if (selectedPlatform !== 'all') {
        params.append('platform', selectedPlatform);
      }
      if (selectedSentiment !== 'all') {
        params.append('sentiment', selectedSentiment);
      }
      if (showOnlyFeatured) {
        params.append('featured', 'true');
      }

      const response = await fetch(`${buildApiUrl(`api/social-feed/business/${businessId}`)}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTestimonials(data.data || []);
      
      // Calculate stats
      const totalMentions = data.data?.length || 0;
      const positiveMentions = data.data?.filter((t: SocialTestimonial) => t.sentiment === 'Positive').length || 0;
      const totalEngagement = data.data?.reduce((sum: number, t: SocialTestimonial) => 
        sum + (t.engagement_metrics?.likes || 0) + (t.engagement_metrics?.comments || 0) + (t.engagement_metrics?.shares || 0), 0) || 0;
      const averageSentiment = totalMentions > 0 ? (positiveMentions / totalMentions) * 100 : 0;
      
      setStats({
        totalMentions,
        positiveMentions,
        totalEngagement,
        averageSentiment
      });
      
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleFeatured = async (testimonialId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(buildApiUrl(`api/social-posts/social-post/${testimonialId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_featured: !currentStatus
        })
      });

      if (response.ok) {
        // Update local state
        setTestimonials(prev => 
          prev.map(t => 
            t.id === testimonialId 
              ? { ...t, business_featured: !currentStatus }
              : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [businessId, searchQuery, selectedPlatform, selectedSentiment, showOnlyFeatured]);

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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Testimonials</h2>
          <p className="text-muted-foreground">Manage mentions of {businessName} on social media</p>
        </div>
        <Button
          onClick={fetchTestimonials}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Mentions</p>
                <p className="text-2xl font-bold">{stats.totalMentions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Positive</p>
                <p className="text-2xl font-bold">{stats.positiveMentions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold">{stats.totalEngagement.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Positive Rate</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageSentiment)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-full md:w-48">
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
            
            <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="Positive">Positive</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Negative">Negative</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant={showOnlyFeatured ? "default" : "outline"}
              onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
              className="w-full md:w-auto"
            >
              {showOnlyFeatured ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              Featured Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading testimonials...</span>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No testimonials found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-4 rounded-lg border hover:shadow-md transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">{testimonial.author_name}</span>
                          <span className="text-xs text-muted-foreground">{testimonial.author_handle}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(testimonial.timestamp)}</span>
                          <Badge className={`text-xs ${getSentimentColor(testimonial.sentiment)}`}>
                            {testimonial.sentiment}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-3">{testimonial.post_text}</p>
                        
                        {testimonial.hashtags && testimonial.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {testimonial.hashtags.slice(0, 5).map((hashtag, index) => (
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
                              <span>{testimonial.engagement_metrics?.likes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{testimonial.engagement_metrics?.comments || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Share2 className="h-3 w-3" />
                              <span>{testimonial.engagement_metrics?.shares || 0}</span>
                            </div>
                            {testimonial.engagement_metrics?.views && (
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{testimonial.engagement_metrics.views}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs ${getPlatformColor(testimonial.source_platform)}`}>
                              {getPlatformIcon(testimonial.source_platform)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(testimonial.post_url, '_blank')}
                              className="h-6 px-2 text-xs"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeatured(testimonial.id, testimonial.business_featured)}
                          className={`h-8 px-3 ${
                            testimonial.business_featured 
                              ? 'text-yellow-600 hover:text-yellow-700' 
                              : 'text-gray-400 hover:text-yellow-600'
                          }`}
                        >
                          {testimonial.business_featured ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        {testimonial.business_featured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
