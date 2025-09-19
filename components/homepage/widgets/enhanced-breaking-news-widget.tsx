"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Clock, AlertTriangle, Newspaper, Zap, Radio, Signal, Activity, TrendingUp, Globe, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleVoteButton } from "@/components/ui/simple-vote-button"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"
import { useStrapiArticles } from '@/hooks/use-strapi-articles'

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
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAds, setShowAds] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date())
  const [hasNewData, setHasNewData] = useState(false)
  const [lastPinnedCount, setLastPinnedCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentModalIndex, setCurrentModalIndex] = useState(0)
  
  // Use Strapi articles as fallback
  const { articles: strapiArticles } = useStrapiArticles()

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
  

  const loadBreakingNews = async () => {
    try {
      setLoading(true)
      const apiUrl = " https://api.pattaya1.com/api/breaking-news/live"
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`${apiUrl}?t=${Date.now()}`)
      if (response.ok) {
        const result = await response.json()
        console.log('🔍 Breaking News API Response:', result)
        const regularData = result.data || [] // Regular news (non-pinned)
        const pinnedData = result.pinnedNews || [] // Pinned news (separate)
        console.log('📰 Regular News Data:', regularData)
        console.log('📌 Pinned News Data:', pinnedData)
        
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
        
        console.log('📊 Transformed Regular News:', transformedRegularNews.length, 'items', transformedRegularNews);
        console.log('📊 Transformed Pinned News:', transformedPinnedNews.length, 'items', transformedPinnedNews);
      } else {
        console.log('❌ Breaking News API failed, status:', response.status);
        // Fallback to Strapi articles if breaking news fails
        if (strapiArticles.length > 0) {
          console.log('🔄 Using Strapi articles as fallback:', strapiArticles.length, 'articles');
          const transformedArticles = strapiArticles.slice(0, 5).map(article => ({
            id: article.id,
            Title: article.attributes.title || 'Untitled Article',
            Summary: article.attributes.description || '',
            Description: article.attributes.description || '',
            URL: `/articles/${article.attributes.slug || article.id}`,
            ImageURL: article.attributes.featuredImage?.data?.attributes.url,
            PublishedAt: article.attributes.publishedAt || article.attributes.createdAt,
            PublishedTimestamp: article.attributes.publishedAt || article.attributes.createdAt,
            apiSource: article.attributes.author?.data?.attributes.name || 'Pattaya1',
            Source: article.attributes.author?.data?.attributes.name || 'Pattaya1',
            Category: article.attributes.category?.data?.attributes.name || 'News',
            Severity: 'medium' as const,
            IsBreaking: false,
            upvotes: 0,
            downvotes: 0,
            userVote: null,
            isPinned: false,
            moderationStatus: 'approved' as const,
            isHidden: false,
            createdAt: article.attributes.createdAt,
            updatedAt: article.attributes.updatedAt,
            publishedAt: article.attributes.publishedAt
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
      console.log('❌ Breaking News API error:', error);
      // Fallback to Strapi articles on error
      if (strapiArticles.length > 0) {
        console.log('🔄 Using Strapi articles as fallback after error:', strapiArticles.length, 'articles');
        const transformedArticles = strapiArticles.slice(0, 5).map(article => ({
          id: article.id,
          Title: article.attributes.title || 'Untitled Article',
          Summary: article.attributes.description || '',
          Description: article.attributes.description || '',
          URL: `/articles/${article.attributes.slug || article.id}`,
          ImageURL: article.attributes.featuredImage?.data?.attributes.url,
          PublishedAt: article.attributes.publishedAt || article.attributes.createdAt,
          PublishedTimestamp: article.attributes.publishedAt || article.attributes.createdAt,
          apiSource: article.attributes.author?.data?.attributes.name || 'Pattaya1',
          Source: article.attributes.author?.data?.attributes.name || 'Pattaya1',
          Category: article.attributes.category?.data?.attributes.name || 'News',
          Severity: 'medium' as const,
          IsBreaking: false,
          upvotes: 0,
          downvotes: 0,
          userVote: null,
          isPinned: false,
          moderationStatus: 'approved' as const,
          isHidden: false,
          createdAt: article.attributes.createdAt,
          updatedAt: article.attributes.updatedAt,
          publishedAt: article.attributes.publishedAt
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

  // Initial load with reduced refresh rate
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
    if (!timestamp) return "Just now"
    
    try {
      const now = new Date()
      const time = new Date(timestamp)
      
      // Check if the date is valid
      if (isNaN(time.getTime())) {
        console.warn('Invalid timestamp:', timestamp)
        return "Just now"
      }
      
      const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) return "Just now"
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    } catch (error) {
      console.warn('Error formatting time:', error, 'timestamp:', timestamp)
      return "Just now"
    }
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
  
  // Combined carousel items for the image carousel
  const carouselItems = useMemo(() => {
    return [...pinnedNews, ...regularNews];
  }, [pinnedNews, regularNews]);
  
  const currentCarouselItem = useMemo(() => {
    return carouselItems[currentCarouselIndex % Math.max(carouselItems.length, 1)];
  }, [carouselItems, currentCarouselIndex]);

  // Auto-rotate carousel every 8 seconds
  useEffect(() => {
    if (carouselItems.length <= 1) return
    
    const carouselInterval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % carouselItems.length)
    }, 8000) // 8 seconds

    return () => clearInterval(carouselInterval)
  }, [carouselItems.length]);
  


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
    <div className="breaking-news-widget h-full flex flex-col">
      {/* TV News Style Breaking News Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-2 px-0 rounded-t-2xl overflow-hidden relative shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex items-center gap-2 bg-red-900/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white">LIVE BREAKING</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-scroll-left-smooth whitespace-nowrap">
              {regularNews.map((item, index) => (
                <span key={index} className="text-sm font-medium mr-8 flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                  {item.Title}
                </span>
              ))}
              {regularNews.map((item, index) => (
                <span key={`duplicate-${index}`} className="text-sm font-medium mr-8 flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                  {item.Title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Two-column layout: 2:3 ratio */}
        <Card className="flex-1 bg-white/95 backdrop-blur-lg border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden main-container transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)]">
          <div className="flex h-full min-h-[280px]">
            {/* Left: Scrollable List (2/5) */}
            <div className="w-2/5 border-r border-gray-100 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/80 to-white/90 backdrop-blur-sm flex-shrink-0" style={{ height: '70px' }}>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse transition-colors duration-300 ${hasNewData ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping transition-colors duration-300 ${hasNewData ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 tracking-tight">Breaking News</span>
                  <Badge className={`text-xs font-semibold border rounded-full px-3 py-1.5 transition-all duration-300 ${hasNewData ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100/50' : 'bg-red-50 text-red-700 border-red-200 shadow-red-100/50'} shadow-lg`}>
                    {hasNewData ? 'LIVE' : 'ON AIR'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200/60 rounded-full transition-all duration-200 hover:scale-110" onClick={(e) => { e.stopPropagation(); goToPreviousRegular(); }}>
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </Button>
                  <div className="bg-white px-3 py-1.5 rounded-full border border-gray-200/60 shadow-sm backdrop-blur-sm">
                    <span className="text-xs text-gray-700 font-semibold">{currentRegularIndex + 1}/{regularNews.length}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200/60 rounded-full transition-all duration-200 hover:scale-110" onClick={(e) => { e.stopPropagation(); goToNextRegular(); }}>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>
              
              {/* Scrollable News List */}
              <div className="flex-1 overflow-y-auto p-1 space-y-1">
              {regularNews.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`news-item group relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-100/20 transition-all duration-300 cursor-pointer animate-fade-in-up hover:scale-[1.02] ${
                    index === currentRegularIndex ? 'ring-2 ring-blue-500/50 ring-opacity-60 border-blue-300/80 shadow-lg shadow-blue-100/30' : ''
                  }`}
                  onClick={() => setIsModalOpen(true)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-3">
                    <div className="flex gap-3 items-start">
                      {/* Enhanced Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <div className="relative overflow-hidden rounded-lg">
                            <img 
                              src={item.image} 
                              alt={item.imageAlt || item.Title} 
                              className="w-16 h-12 rounded-lg object-cover border border-gray-200/60 transition-transform duration-300 group-hover:scale-105" 
                              onError={(e) => { 
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.jpg';
                                target.alt = 'News placeholder';
                              }} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200/60 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                            <Newspaper className="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors duration-300" />
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300 max-h-10 overflow-hidden">
                            {item.Title}
                          </h4>
                          {item.IsBreaking && (
                            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 shadow-lg animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium bg-gray-100/80 px-2 py-1 rounded-md">{item.Source}</span>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(item.PublishedAt)}
                            </span>
                          </div>
                          
                          {/* Enhanced Vote Buttons */}
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                            <SimpleVoteButton 
                              article={item}
                              onVoteUpdate={handleRegularNewsVoteUpdate}
                              compact={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-400/3 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                </div>
              ))}
              
              {regularNews.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Newspaper className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No news available</p>
                  <p className="text-xs text-gray-400 mt-1">Check back later for updates</p>
                </div>
              )}
            </div>
          </div>

            {/* Right: Modern Clean Carousel (3/5) */}
            <div className="w-3/5 relative bg-gradient-to-br from-slate-50/80 via-white/90 to-gray-50/80 backdrop-blur-sm flex-shrink-0 h-full carousel-container overflow-hidden">
              <div className="absolute inset-0">
                {currentCarouselItem ? (
                  <>
                    {/* Enhanced Image Container */}
                    <div className="relative w-full h-full overflow-hidden rounded-r-2xl">
                      {currentCarouselItem.image || currentCarouselItem.ImageURL ? (
                        <>
                          <img
                            src={currentCarouselItem.image || currentCarouselItem.ImageURL || ''}
                            alt={currentCarouselItem.imageAlt || currentCarouselItem.Title}
                            className="w-full h-full object-cover carousel-image transition-all duration-700 hover:scale-105"
                            onError={(e) => { 
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.jpg';
                              target.alt = 'News placeholder';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100/80 via-gray-50/90 to-slate-200/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 shadow-2xl border border-white/40">
                              <Newspaper className="w-12 h-12 text-slate-400" />
                            </div>
                            <p className="text-slate-600 text-base font-semibold">Featured Story</p>
                            <p className="text-slate-400 text-sm mt-1">No image available</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced status badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {currentCarouselItem.isPinned && (
                          <div className="bg-gradient-to-r from-blue-600/95 to-blue-700/95 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/40 shadow-2xl font-semibold">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              PINNED
                            </span>
                          </div>
                        )}
                        {currentCarouselItem.IsBreaking && (
                          <div className="bg-gradient-to-r from-red-600/95 to-red-700/95 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/40 shadow-2xl font-semibold">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              BREAKING
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="bg-black/50 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/30 shadow-2xl font-medium">
                        {formatTimeAgo(currentCarouselItem.PublishedAt)}
                      </div>
                    </div>
                    
                    {/* Enhanced bottom content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
                        <h3 className="text-white text-lg font-bold mb-3 line-clamp-2 leading-tight drop-shadow-lg">
                          {currentCarouselItem.Title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-white text-sm">
                            <span className="font-semibold bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white border border-white/20">
                              {currentCarouselItem.Source}
                            </span>
                            <span className="text-white/70">•</span>
                            <span className="text-white/90 font-medium flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {currentCarouselItem.Category}
                            </span>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1">
                            <SimpleVoteButton 
                              article={currentCarouselItem}
                              onVoteUpdate={currentCarouselItem.isPinned ? handlePinnedNewsVoteUpdate : handleRegularNewsVoteUpdate}
                              compact={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Newspaper className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-sm font-medium">No news available</p>
                    <p className="text-slate-400 text-xs mt-1">Check back later for updates</p>
                  </div>
                )}
              </div>
            
            {/* Enhanced Controls */}
            {carouselItems.length > 1 && (
              <>
                <button 
                  aria-label="Previous" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-md rounded-full p-2.5 shadow-2xl transition-all duration-300 hover:scale-110 border border-white/40" 
                  onClick={() => setCurrentCarouselIndex((i)=> (i-1 + carouselItems.length)%carouselItems.length)}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button 
                  aria-label="Next" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-md rounded-full p-2.5 shadow-2xl transition-all duration-300 hover:scale-110 border border-white/40" 
                  onClick={() => setCurrentCarouselIndex((i)=> (i+1)%carouselItems.length)}
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
                
                {/* Enhanced carousel indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {carouselItems.slice(0, Math.min(carouselItems.length, 5)).map((_, index) => (
                    <button
                      key={index}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentCarouselIndex % carouselItems.length
                          ? 'w-8 h-2.5 bg-white shadow-2xl' 
                          : 'w-2.5 h-2.5 bg-white/60 hover:bg-white/80 shadow-lg'
                      }`}
                      onClick={() => setCurrentCarouselIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
      
      {/* Custom CSS for Enhanced UI */}
      <style jsx>{`
  /* Enhanced smooth scrolling animation */
  @keyframes scroll-left-smooth {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  
  .animate-scroll-left-smooth {
    animation: scroll-left-smooth 40s linear infinite;
  }
  
  .animate-scroll-left-smooth:hover {
    animation-play-state: paused;
  }
  
  /* Modern glassmorphism effects */
  .glass-effect {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }
  
  /* Enhanced breaking news pulse */
  @keyframes breaking-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
  }
  
  /* Smooth scrollbar styling with modern design */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%);
    border-radius: 10px;
    border: 1px solid rgba(226, 232, 240, 0.5);
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(148, 163, 184, 0.6) 0%, rgba(100, 116, 139, 0.6) 100%);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
    transition: all 0.3s ease;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(100, 116, 139, 0.8) 0%, rgba(71, 85, 105, 0.8) 100%);
    transform: scale(1.1);
  }
  
  /* Enhanced hover effects with micro-animations */
  .news-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }
  
  .news-item:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 
                0 4px 6px -2px rgba(0, 0, 0, 0.05),
                0 0 0 1px rgba(59, 130, 246, 0.1);
  }
  
  .news-item:active {
    transform: translateY(-1px) scale(1.01);
    transition-duration: 0.1s;
  }
  
  /* Advanced fade in animation */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  /* Modern loading shimmer effect */
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      background-position: calc(200px + 100%) 0;
      opacity: 0.6;
    }
  }
  
  .shimmer {
    background: linear-gradient(90deg, #f8fafc 25%, #e2e8f0 50%, #f8fafc 75%);
    background-size: 200px 100%;
    animation: shimmer 2s infinite;
    border-radius: 8px;
  }
  
  /* Enhanced line clamp with better typography */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    hyphens: auto;
    line-height: 1.4;
  }
  
  /* Modern image placeholder with gradient */
  .placeholder-image {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
    border: 1px solid rgba(203, 213, 225, 0.6);
    position: relative;
    overflow: hidden;
  }
  
  .placeholder-image::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
  }
  
  /* Enhanced carousel container with depth */
  .breaking-news-widget {
    height: 100%;
    min-height: 320px;
    max-height: 100vh;
    padding: 0;
    margin: 0;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
    position: relative;
  }
  
  .breaking-news-widget::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  
  /* Modern carousel with smooth transitions */
  .carousel-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  
  .carousel-image {
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
    filter: brightness(1) contrast(1.1) saturate(1.1);
  }
  
  .carousel-image:hover {
    transform: scale(1.05);
    filter: brightness(1.1) contrast(1.2) saturate(1.2);
  }
  
  /* Main container with enhanced backdrop */
  .main-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;
  }
  
  /* Advanced button animations */
  button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  button:hover {
    transform: translateY(-1px);
  }
  
  button:active {
    transform: translateY(0);
    transition-duration: 0.1s;
  }
  
  /* Enhanced badge animations */
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
  
  /* Responsive design improvements */
  @media (max-height: 600px) {
    .breaking-news-widget {
      min-height: 280px;
    }
  }
  
  @media (max-height: 500px) {
    .breaking-news-widget {
      min-height: 240px;
    }
  }
  
  @media (max-width: 768px) {
    .news-item {
      margin: 0.25rem 0;
    }
    
    .carousel-image {
      object-fit: cover;
    }
  }
  
  /* Advanced hover states for interactive elements */
  .interactive-element {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .interactive-element:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
  }
  
  /* Smooth focus states for accessibility */
  button:focus-visible,
  .news-item:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 8px;
  }
  
  /* Enhanced modal animations */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Modern text selection styling */
  ::selection {
    background-color: rgba(59, 130, 246, 0.2);
    color: inherit;
  }
  
  ::-moz-selection {
    background-color: rgba(59, 130, 246, 0.2);
    color: inherit;
  }
  
  /* Enhanced loading states */
  .loading-skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: loading-wave 1.5s infinite;
  }
  
  @keyframes loading-wave {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  /* Advanced shadow system */
  .shadow-modern {
    box-shadow: 
      0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  
  .shadow-modern-lg {
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .shadow-modern-xl {
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`}</style>

      {/* Modal: All Breaking and Pinned News */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-3 pt-3 pb-2 border-b bg-white/90 backdrop-blur-sm">
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
                      onError={(e) => { 
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                        target.alt = 'News placeholder';
                      }}
                    />
                  ) : (
                    <div className="w-full h-72 placeholder-image flex items-center justify-center">
                      <div className="text-center">
                        <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm font-medium">News Image</p>
                      </div>
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
                    <h3 className="text-white text-base font-semibold drop-shadow-sm line-clamp-2 max-h-12 overflow-hidden leading-tight">{item.Title}</h3>
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

// Pinned News Carousel Component
function PinnedNewsCarousel({ pinnedNews, onVoteUpdate }: { 
  pinnedNews: StrapiBreakingNews[], 
  onVoteUpdate: (articleKey: string | number, voteData: {upvotes: number, downvotes: number, voteScore: number}) => void 
}) {
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);

  const goToPreviousPinned = () => {
    setCurrentPinnedIndex((prev) => (prev - 1 + pinnedNews.length) % pinnedNews.length);
  };

  const goToNextPinned = () => {
    setCurrentPinnedIndex((prev) => (prev + 1) % pinnedNews.length);
  };

  const currentPinnedItem = pinnedNews[currentPinnedIndex];

  if (!currentPinnedItem) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center space-x-2 mb-3">
        <Badge className="bg-blue-500/10 text-blue-600 text-xs font-medium border border-blue-200 rounded-full px-2 py-0.5">
          📌 PINNED NEWS
        </Badge>
        <span className="text-xs text-gray-500">
          {pinnedNews.length} pinned item(s)
        </span>
      </div>
      
      <Card className="bg-blue-50/30 border border-blue-200/50 rounded-xl hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
            onClick={() => window.open(currentPinnedItem.URL, '_blank')}>
        <CardHeader className="pb-2 px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
                📌 PINNED
              </Badge>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-900">Breaking News</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousPinned();
                }}
                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <span className="text-xs text-blue-600 px-1 font-medium">
                {currentPinnedIndex + 1}/{pinnedNews.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextPinned();
                }}
                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {currentPinnedItem.image ? (
                <img 
                  src={currentPinnedItem.image} 
                  alt={currentPinnedItem.imageAlt || currentPinnedItem.Title}
                  className="w-16 h-12 rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                    target.alt = 'News placeholder';
                  }}
                />
              ) : (
                <div className="w-16 h-12 rounded placeholder-image flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-blue-900 line-clamp-2 mb-1 max-h-10 overflow-hidden leading-tight">
                {currentPinnedItem.Title}
              </h5>
              <p className="text-xs text-blue-700 line-clamp-2 mb-2">
                {currentPinnedItem.Summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-blue-600">
                  Source: <span className="text-blue-800 font-medium">{currentPinnedItem.Source}</span>
                </div>
                
                <SimpleVoteButton 
                  article={currentPinnedItem}
                  onVoteUpdate={onVoteUpdate}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}






