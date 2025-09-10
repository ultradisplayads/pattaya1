"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Clock, AlertTriangle, Newspaper, Zap, Radio, Signal, Activity, TrendingUp, Globe, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleVoteButton } from "@/components/ui/simple-vote-button"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { useStrapiArticles } from '@/hooks/use-strapi-articles'
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"

interface StrapiBreakingNews {
  id: number
  documentId?: string
  Title: string
  Summary: string
  Description: string
  URL: string
  ImageURL?: string
  image?: string
  imageAlt?: string
  imageCaption?: string
  PublishedAt: string
  PublishedTimestamp: string
  apiSource: string
  Source: string
  Category: string
  Severity: "low" | "medium" | "high" | "critical"
  IsBreaking: boolean
  upvotes: number
  downvotes: number
  userVote: string | null
  isPinned: boolean
  moderationStatus: 'pending' | 'approved' | 'rejected'
  isHidden: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface StrapiAdvertisement {
  id: number
  Tiltle: string
  Content: string
  URL: string
  Image?: {
    url: string
    alternativeText?: string
  }
  Sponsor: string
  Active: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface Advertisement {
  id: number
  title: string
  content: string
  url: string
  image?: {
    url: string
    alternativeText?: string
  }
  sponsor: string
  active: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function EnhancedBreakingNewsWidget() {
  const [regularNews, setRegularNews] = useState<StrapiBreakingNews[]>([])
  const [pinnedNews, setPinnedNews] = useState<StrapiBreakingNews[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [currentRegularIndex, setCurrentRegularIndex] = useState(0)
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAds, setShowAds] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date())
  const [hasNewData, setHasNewData] = useState(false)
  const [lastPinnedCount, setLastPinnedCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentModalIndex, setCurrentModalIndex] = useState(0)

  // Keyboard navigation for modal carousel
  useEffect(() => {
    if (!isModalOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCurrentModalIndex((idx) => idx - 1)
      if (e.key === 'ArrowRight') setCurrentModalIndex((idx) => idx + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isModalOpen])
  
  // Use Strapi articles as fallback
  const { articles: strapiArticles } = useStrapiArticles()

  const loadBreakingNews = async () => {
    try {
      setLoading(true)
      const apiUrl = "/api/breaking-news/live"
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`${apiUrl}?t=${Date.now()}`)
      if (response.ok) {
        const result = await response.json()
        const regularData = result.data || [] // Regular news (non-pinned)
        const pinnedData = result.pinnedNews || [] // Pinned news (separate)
        
        // Check for new pinned items
        const currentPinnedCount = pinnedData.length;
        if (currentPinnedCount > lastPinnedCount) {
          console.log(`🔥 NEW PINNED NEWS DETECTED! Count increased from ${lastPinnedCount} to ${currentPinnedCount}`);
          setHasNewData(true);
          setTimeout(() => setHasNewData(false), 5000);
        }
        setLastPinnedCount(currentPinnedCount);
        
        // Transform regular news
        const transformedRegularNews = regularData.map((item: any) => ({
          id: parseInt(item.id),
          Title: item.title,
          Summary: item.summary,
          Description: item.summary,
          URL: item.url,
          ImageURL: item.imageUrl,
          image: item.image,
          imageAlt: item.imageAlt,
          imageCaption: item.imageCaption,
          PublishedAt: item.timestamp,
          PublishedTimestamp: item.timestamp,
          apiSource: item.source,
          Source: item.source,
          Category: item.category,
          Severity: item.severity as "low" | "medium" | "high" | "critical",
          IsBreaking: item.isBreaking,
          upvotes: item.upvotes || 0,
          downvotes: item.downvotes || 0,
          userVote: item.userVote || null,
          isPinned: false, // Regular news is never pinned
          moderationStatus: 'approved' as const,
          isHidden: false,
          createdAt: item.timestamp,
          updatedAt: item.timestamp,
          publishedAt: item.timestamp,
          // Preserve sponsored post metadata
          ...(item.type === 'sponsored' && {
            type: item.type,
            sponsorName: item.sponsorName,
            sponsorLogo: item.sponsorLogo,
            displayPosition: item.displayPosition
          })
        }));
        
        // Transform pinned news
        const transformedPinnedNews = pinnedData.map((item: any) => ({
          id: parseInt(item.id),
          Title: item.title,
          Summary: item.summary,
          Description: item.summary,
          URL: item.url,
          ImageURL: item.imageUrl,
          image: item.image,
          imageAlt: item.imageAlt,
          imageCaption: item.imageCaption,
          PublishedAt: item.timestamp,
          PublishedTimestamp: item.timestamp,
          apiSource: item.source,
          Source: item.source,
          Category: item.category,
          Severity: item.severity as "low" | "medium" | "high" | "critical",
          IsBreaking: item.isBreaking,
          upvotes: item.upvotes || 0,
          downvotes: item.downvotes || 0,
          userVote: item.userVote || null,
          isPinned: true, // Pinned news is always pinned
          moderationStatus: 'approved' as const,
          isHidden: false,
          createdAt: item.timestamp,
          updatedAt: item.timestamp,
          publishedAt: item.timestamp
        }));
        
        // Check if we have new data - only update if content actually changed
        const hasNewRegularContent = regularNews.length === 0 || 
          transformedRegularNews.some((newItem: StrapiBreakingNews) => 
            !regularNews.find((existingItem: StrapiBreakingNews) => 
              existingItem.id === newItem.id && 
              existingItem.updatedAt === newItem.updatedAt
            )
          );
          
        const hasNewPinnedContent = pinnedNews.length === 0 || 
          transformedPinnedNews.some((newItem: StrapiBreakingNews) => 
            !pinnedNews.find((existingItem: StrapiBreakingNews) => 
              existingItem.id === newItem.id && 
              existingItem.updatedAt === newItem.updatedAt
            )
          );
        
        // Only update state if content actually changed
        if (hasNewRegularContent || hasNewPinnedContent) {
          setHasNewData(true)
          setLastFetchTime(new Date())
          setTimeout(() => setHasNewData(false), 3000)
          
          // Only update the arrays that actually changed
          if (hasNewRegularContent) {
            setRegularNews(transformedRegularNews);
          }
          if (hasNewPinnedContent) {
            setPinnedNews(transformedPinnedNews);
          }
        } else {
          // No changes detected, don't update state
          console.log('No content changes detected, skipping state update');
        }
        
        console.log('Regular news:', transformedRegularNews.length, 'items');
        console.log('Pinned news:', transformedPinnedNews.length, 'items');
      } else {
        // Fallback to Strapi articles if breaking news fails
        if (strapiArticles.length > 0) {
          const transformedArticles = strapiArticles.slice(0, 5).map(article => ({
            id: article.id,
            Title: article.title || 'Untitled Article',
            Summary: article.description || '',
            Description: article.description || '',
            URL: `/articles/${article.slug || article.id}`,
            ImageURL: article.cover?.url,
            PublishedAt: article.publishedAt || article.createdAt,
            PublishedTimestamp: article.publishedAt || article.createdAt,
            apiSource: article.author?.name || 'Pattaya1',
            Source: article.author?.name || 'Pattaya1',
            Category: article.category?.name || 'News',
            Severity: 'medium' as const,
            IsBreaking: false,
            upvotes: 0,
            downvotes: 0,
            userVote: null,
            isPinned: false,
            moderationStatus: 'approved' as const,
            isHidden: false,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            publishedAt: article.publishedAt
          }));
          setRegularNews(transformedArticles);
          setPinnedNews([]);
        } else {
          setRegularNews([{
            id: 1,
            Title: 'Breaking: Latest News from Pattaya',
            Summary: 'Stay updated with the latest breaking news and developments.',
            Description: 'Stay updated with the latest breaking news and developments.',
            URL: '#',
            ImageURL: undefined,
            PublishedAt: new Date().toISOString(),
            PublishedTimestamp: new Date().toISOString(),
            apiSource: 'Pattaya1 News',
            Source: 'Pattaya1 News',
            Category: 'Breaking News',
            Severity: 'medium' as const,
            IsBreaking: true,
            upvotes: 0,
            downvotes: 0,
            userVote: null,
            isPinned: false,
            moderationStatus: 'approved' as const,
            isHidden: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString()
          }]);
          setPinnedNews([]);
        }
      }
    } catch (error) {
      // Fallback to Strapi articles on error
      if (strapiArticles.length > 0) {
        const transformedArticles = strapiArticles.slice(0, 5).map(article => ({
          id: article.id,
          Title: article.title || 'Untitled Article',
          Summary: article.description || '',
          Description: article.description || '',
          URL: `/articles/${article.slug || article.id}`,
          ImageURL: article.cover?.url,
          PublishedAt: article.publishedAt || article.createdAt,
          PublishedTimestamp: article.publishedAt || article.createdAt,
          apiSource: article.author?.name || 'Pattaya1',
          Source: article.author?.name || 'Pattaya1',
          Category: article.category?.name || 'News',
          Severity: 'medium' as const,
          IsBreaking: false,
          upvotes: 0,
          downvotes: 0,
          userVote: null,
          isPinned: false,
          moderationStatus: 'approved' as const,
          isHidden: false,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          publishedAt: article.publishedAt
        }));
        setRegularNews(transformedArticles);
        setPinnedNews([]);
      } else {
        setRegularNews([{
          id: 1,
          Title: 'Breaking: Latest News from Pattaya',
          Summary: 'Stay updated with the latest breaking news and developments.',
          Description: 'Stay updated with the latest breaking news and developments.',
          URL: '#',
          ImageURL: undefined,
          PublishedAt: new Date().toISOString(),
          PublishedTimestamp: new Date().toISOString(),
          apiSource: 'Pattaya1 News',
          Source: 'Pattaya1 News',
          Category: 'Breaking News',
          Severity: 'medium' as const,
          IsBreaking: true,
          upvotes: 0,
          downvotes: 0,
          userVote: null,
          isPinned: false,
          moderationStatus: 'approved' as const,
          isHidden: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        }]);
        setPinnedNews([]);
      }
    } finally {
      setLoading(false)
    }
  }


  const loadAdvertisements = async () => {
    try {
      const response = await fetch(buildApiUrl("sponsored-posts?filters[Active][$eq]=true&sort=createdAt:desc"))
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          setAdvertisements(data.data)
        } else {
          setAdvertisements([])
        }
      } else {
        setAdvertisements([])
      }
    } catch (error) {
      setAdvertisements([])
    }
  }

  // Initial load
  useEffect(() => {
    loadBreakingNews()
    loadAdvertisements()
  }, [])

  // Auto-refresh data every 2 minutes (120 seconds) - much more reasonable
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      loadBreakingNews()
      loadAdvertisements()
    }, 2 * 60 * 1000) // 2 minutes in milliseconds

    return () => clearInterval(refreshInterval)
  }, [])

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Navigation functions for separate arrays
  const goToPreviousRegular = () => {
    setCurrentRegularIndex((prev) => (prev - 1 + Math.max(regularNews.length, 1)) % Math.max(regularNews.length, 1))
  }

  const goToNextRegular = () => {
    setCurrentRegularIndex((prev) => (prev + 1) % Math.max(regularNews.length, 1))
  }

  const goToPreviousPinned = () => {
    setCurrentPinnedIndex((prev) => (prev - 1 + Math.max(pinnedNews.length, 1)) % Math.max(pinnedNews.length, 1))
  }

  const goToNextPinned = () => {
    setCurrentPinnedIndex((prev) => (prev + 1) % Math.max(pinnedNews.length, 1))
  }

  // Memoized vote update callbacks to prevent unnecessary re-renders
  const handleRegularNewsVoteUpdate = useCallback((articleKey: string | number, voteData: {upvotes: number, downvotes: number, voteScore: number, userVote: string | null}) => {
    console.log(`Updating regular news item ${articleKey} with:`, voteData);
    setRegularNews(prevNews => 
      prevNews.map(item => 
        item.id === articleKey 
          ? { ...item, upvotes: voteData.upvotes, downvotes: voteData.downvotes, userVote: voteData.userVote }
          : item
      )
    );
  }, []);

  const handlePinnedNewsVoteUpdate = useCallback((articleKey: string | number, voteData: {upvotes: number, downvotes: number, voteScore: number, userVote: string | null}) => {
    console.log(`Updating pinned news item ${articleKey} with:`, voteData);
    setPinnedNews(prevNews => 
      prevNews.map(item => 
        item.id === articleKey 
          ? { ...item, upvotes: voteData.upvotes, downvotes: voteData.downvotes, userVote: voteData.userVote }
          : item
      )
    );
  }, []);

  // Get current items for each row using separate arrays and indices - memoized to prevent unnecessary re-renders
  const currentRegularItem = useMemo(() => {
    return regularNews[currentRegularIndex % Math.max(regularNews.length, 1)];
  }, [regularNews, currentRegularIndex]);
  
  const currentPinnedItem = useMemo(() => {
    return pinnedNews.length > 0 ? pinnedNews[currentPinnedIndex % pinnedNews.length] : null;
  }, [pinnedNews, currentPinnedIndex]);
  


  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
      case "low":
        return "bg-green-500/10 text-green-600 border-green-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }


  if (loading) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0_0_0_/0.1),0_1px_2px_-1px_rgb(0_0_0_/0.1)] rounded-2xl">
        <CardHeader className="pb-3 px-5 pt-5">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-900">Breaking News</span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-100 rounded-lg w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded-lg w-1/2"></div>
            <div className="h-3 bg-gray-100 rounded-lg w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {/* TV News Style Breaking News Ticker */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-1 px-3 rounded-t-lg overflow-hidden relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-red-800 px-2 py-0.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wider">BREAKING</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-scroll-left whitespace-nowrap">
              {regularNews.map((item, index) => (
                <span key={index} className="text-xs font-medium mr-6">
                  {item.Title} • 
                </span>
              ))}
              {regularNews.map((item, index) => (
                <span key={`duplicate-${index}`} className="text-xs font-medium mr-6">
                  {item.Title} • 
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Regular Breaking News */}
      <Card 
        className="h-full bg-white/95 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0_0_0_/0.1),0_1px_2px_-1px_rgb(0_0_0_/0.1)] rounded-2xl cursor-pointer hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/0.1),0_2px_4px_-2px_rgb(0_0_0_/0.1)] transition-all duration-300 relative overflow-hidden" 
        onClick={() => setIsModalOpen(true)}
      >
      <CardHeader className="pb-1.5 px-4 pt-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${hasNewData ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className={`absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping ${hasNewData ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></div>
            </div>
            <span className="text-xs font-semibold text-gray-900">
              Breaking News
            </span>
            <Badge className={`text-[10px] font-medium border rounded-full px-1.5 py-0.5 ${hasNewData ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
              {hasNewData ? 'LIVE' : 'ON AIR'}
            </Badge>
            {hasNewData && (
              <Badge className="bg-blue-100 text-blue-700 text-[10px] font-medium border border-blue-200 rounded-full px-1.5 py-0.5">
                FRESH
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Wifi className="w-2.5 h-2.5 text-green-500" />
              <span className="text-[10px] text-gray-500 font-medium">LIVE</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToPreviousRegular()
              }}
              className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-2.5 h-2.5 text-gray-500" />
            </Button>
            <div className="bg-gray-100 px-1.5 py-0.5 rounded-full">
              <span className="text-[10px] text-gray-600 font-medium">
                {currentRegularIndex + 1}/{regularNews.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToNextRegular()
              }}
              className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-2.5 h-2.5 text-gray-500" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-2.5 pt-0 relative z-10">
        {currentRegularItem && (currentRegularItem as any).type === 'sponsored' ? (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium rounded-full px-1.5 py-0.5">
                  {(currentRegularItem as any).sponsorName || 'Sponsored'}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open((currentRegularItem as any).URL, "_blank")
                }}
                className="h-4 w-4 p-0 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
              </Button>
            </div>

            <div className="space-y-2">
              {(currentRegularItem as any).ImageURL && (
                <div className="w-full">
                  <img
                    src={(currentRegularItem as any).ImageURL}
                    alt={(currentRegularItem as any).Title}
                    className="w-full h-20 rounded-lg object-cover shadow-sm"
                  />
                </div>
              )}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {(currentRegularItem as any).Title}
                </h4>
                <p className="text-[10px] text-gray-600 line-clamp-2 leading-relaxed">
                  {(currentRegularItem as any).Summary}
                </p>
                <div className="text-[10px] text-gray-500 font-medium">
                  by <span className="text-gray-700">{(currentRegularItem as any).sponsorName || 'Sponsor'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : currentRegularItem ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              {(currentRegularItem as StrapiBreakingNews).image && (
                <div className="flex-shrink-0">
                  <img 
                    src={(currentRegularItem as StrapiBreakingNews).image} 
                    alt={(currentRegularItem as StrapiBreakingNews).imageAlt || (currentRegularItem as StrapiBreakingNews).Title}
                    className="w-11 h-7 rounded object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 space-y-1">
                <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {(currentRegularItem as StrapiBreakingNews).Title}
                </h4>
                <p className="text-[10px] text-gray-600 line-clamp-2 leading-relaxed">
                  {(currentRegularItem as StrapiBreakingNews).Summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-gray-500 font-medium">
                    Source: <span className="text-gray-700">{(currentRegularItem as StrapiBreakingNews).Source}</span>
                  </div>
                  
                  {/* Vote Buttons */}
                  <SimpleVoteButton 
                    article={currentRegularItem}
                    onVoteUpdate={handleRegularNewsVoteUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto mb-3 animate-pulse"></div>
            <p className="text-sm text-gray-500 font-medium">No news available</p>
          </div>
        )}
      </CardContent>
      </Card>

      {/* Row 2: Pinned News with Rolling Ticker */}
      {pinnedNews.length > 0 && (
        <>
          {/* Pinned News Rolling Ticker */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-0.5 px-3 rounded-t-lg overflow-hidden relative">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-blue-800 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-wider">PINNED</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex animate-scroll-left whitespace-nowrap">
                  {pinnedNews.map((item, index) => (
                    <span key={index} className="text-xs font-medium mr-6">
                      {item.Title} • 
                    </span>
                  ))}
                  {pinnedNews.map((item, index) => (
                    <span key={`duplicate-${index}`} className="text-xs font-medium mr-6">
                      {item.Title} • 
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Card 
            className="h-full bg-white/95 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0_0_0_/0.1),0_1px_2px_-1px_rgb(0_0_0_/0.1)] rounded-2xl cursor-pointer hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/0.1),0_2px_4px_-2px_rgb(0_0_0_/0.1)] transition-all duration-300 relative overflow-hidden" 
            onClick={() => setIsModalOpen(true)}
          >
        <CardHeader className="pb-1.5 px-4 pt-2.5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${hasNewData ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <div className={`absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping ${hasNewData ? 'bg-green-400' : 'bg-blue-400'} opacity-75`}></div>
              </div>
              <span className="text-xs font-semibold text-gray-900">
                Pinned News
              </span>
              <Badge className="bg-blue-100 text-blue-700 text-[10px] font-medium border border-blue-200 rounded-full px-1.5 py-0.5">
                FEATURED
              </Badge>
              <div className="flex items-center gap-1">
                <Signal className="w-2.5 h-2.5 text-blue-500" />
                <span className="text-[10px] text-gray-500 font-medium">LIVE</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPreviousPinned()
                }}
                className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-2.5 h-2.5 text-gray-500" />
              </Button>
              <div className="bg-gray-100 px-1.5 py-0.5 rounded-full">
                <span className="text-[10px] text-gray-600 font-medium">
                  {currentPinnedIndex + 1}/{pinnedNews.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNextPinned()
                }}
                className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-2.5 h-2.5 text-gray-500" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-2.5 pt-0">
          {currentPinnedItem && (currentPinnedItem as any).type === 'sponsored' ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium rounded-full px-2 py-0.5">
                    {(currentPinnedItem as any).sponsorName || 'Sponsored'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open((currentPinnedItem as any).URL, "_blank")
                  }}
                  className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </Button>
              </div>

              <div className="space-y-3">
                {(currentPinnedItem as any).ImageURL && (
                  <div className="w-full">
                    <img
                      src={(currentPinnedItem as any).ImageURL}
                      alt={(currentPinnedItem as any).Title}
                      className="w-full h-32 rounded-xl object-cover shadow-sm"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {(currentPinnedItem as any).Title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {(currentPinnedItem as any).Summary}
                  </p>
                  <div className="text-xs text-gray-500 font-medium">
                    by <span className="text-gray-700">{(currentPinnedItem as any).sponsorName || 'Sponsor'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : currentPinnedItem ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                {(currentPinnedItem as StrapiBreakingNews).image && (
                  <div className="flex-shrink-0">
                    <img 
                      src={(currentPinnedItem as StrapiBreakingNews).image} 
                      alt={(currentPinnedItem as StrapiBreakingNews).imageAlt || (currentPinnedItem as StrapiBreakingNews).Title}
                      className="w-15 h-11 rounded object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {(currentPinnedItem as StrapiBreakingNews).Title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {(currentPinnedItem as StrapiBreakingNews).Summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-medium">
                      Source: <span className="text-gray-700">{(currentPinnedItem as StrapiBreakingNews).Source}</span>
                    </div>
                    
                    {/* Vote Buttons */}
                    <SimpleVoteButton 
                      article={currentPinnedItem}
                      onVoteUpdate={handlePinnedNewsVoteUpdate}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto mb-3 animate-pulse"></div>
              <p className="text-sm text-gray-500 font-medium">No pinned news available</p>
            </div>
          )}
        </CardContent>
        </Card>
        </>
      )}
      
      {/* Custom CSS for TV News Animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
        
        /* TV News ticker effect */
        .ticker-container {
          overflow: hidden;
          white-space: nowrap;
        }
        
        .ticker-text {
          display: inline-block;
          animation: scroll-left 30s linear infinite;
        }
        
        /* Enhanced pulse for breaking news */
        @keyframes breaking-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        
        .breaking-pulse {
          animation: breaking-pulse 2s ease-in-out infinite;
        }
        
        /* TV static effect */
        @keyframes tv-static {
          0% { opacity: 0.1; }
          50% { opacity: 0.05; }
          100% { opacity: 0.1; }
        }
        
        .tv-static {
          animation: tv-static 0.1s linear infinite;
        }
      `}</style>

      {/* Modal: All Breaking and Pinned News */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-4 pb-2 border-b bg-white/90 backdrop-blur-sm">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Newspaper className="w-4 h-4 text-red-600" />
              All News
              <span className="ml-2 text-[11px] font-medium text-gray-500">(Pinned & Breaking)</span>
            </DialogTitle>
          </DialogHeader>
          {(() => {
            const modalItems = [
              ...pinnedNews.map((i) => ({ ...i, __pinned: true })),
              ...regularNews.map((i) => ({ ...i, __pinned: false })),
            ]
            const safeIndex = modalItems.length > 0 ? (currentModalIndex % modalItems.length + modalItems.length) % modalItems.length : 0
            const item = modalItems[safeIndex]
            if (!item) {
              return <div className="p-5 text-xs text-gray-500">No news available.</div>
            }
            return (
              <div className="animate-fade-in">
                {/* Hero media with overlay and controls */}
                <div className="relative group">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.imageAlt || item.Title}
                      className="w-full h-72 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Overlay header */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.__pinned ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/90 text-white border border-white/20">Pinned</span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-600/90 text-white border border-white/20 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                        </span>
                      )}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${getSeverityColor((item as any).Severity || 'medium')}`}>{(item as any).Severity || 'medium'}</span>
                    </div>
                    <button
                      className="text-[11px] text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-md px-2 py-1 flex items-center gap-1"
                      onClick={() => window.open((item as any).URL, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3" /> Open
                    </button>
                  </div>

                  {/* Overlay title */}
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <h3 className="text-white text-base font-semibold drop-shadow-sm">{item.Title}</h3>
                    <div className="flex items-center gap-3 text-white/90 text-[11px]">
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {item.Source}</span>
                      <span className="opacity-80">•</span>
                      <span>Upvotes: {item.upvotes} · Downvotes: {item.downvotes}</span>
                    </div>
                  </div>

                  {/* Carousel controls */}
                  <button
                    aria-label="Previous"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-transform hover:scale-105"
                    onClick={() => setCurrentModalIndex((idx) => idx - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    aria-label="Next"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-transform hover:scale-105"
                    onClick={() => setCurrentModalIndex((idx) => idx + 1)}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Summary and actions */}
                <div className="p-5 space-y-3 bg-white">
                  <p className="text-sm text-gray-700 leading-relaxed">{item.Summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-gray-500">{safeIndex + 1} / {modalItems.length}</div>
                    <SimpleVoteButton 
                      article={item as any}
                      onVoteUpdate={item.__pinned ? handlePinnedNewsVoteUpdate : handleRegularNewsVoteUpdate}
                    />
                  </div>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
