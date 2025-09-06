"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Clock, AlertTriangle, Newspaper, Zap } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IsolatedVoteButton } from "@/components/ui/isolated-vote-button"
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
  const [news, setNews] = useState<StrapiBreakingNews[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAds, setShowAds] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date())
  const [hasNewData, setHasNewData] = useState(false)
  const [lastPinnedCount, setLastPinnedCount] = useState(0)
  
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
        const regularData = result.data || [] // Regular news
        const pinnedData = result.pinnedNews || [] // Pinned news
        
        if (regularData && regularData.length > 0) {
          // Check for new pinned items
          const currentPinnedCount = regularData.filter((item: any) => item.isPinned).length;
          if (currentPinnedCount > lastPinnedCount) {
            console.log(`🔥 NEW PINNED NEWS DETECTED! Count increased from ${lastPinnedCount} to ${currentPinnedCount}`);
            setHasNewData(true);
            setTimeout(() => setHasNewData(false), 5000);
          }
          setLastPinnedCount(currentPinnedCount);
          
          // Transform the regular news API response to match our interface
          const transformedNews = regularData.map((item: any) => {
            const baseItem = {
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
              isPinned: item.isPinned || false,
              moderationStatus: 'approved' as const,
              isHidden: false,
              createdAt: item.timestamp,
              updatedAt: item.timestamp,
              publishedAt: item.timestamp
            };

            // Preserve sponsored post metadata
            if (item.type === 'sponsored') {
              return {
                ...baseItem,
                type: item.type,
                sponsorName: item.sponsorName,
                sponsorLogo: item.sponsorLogo,
                displayPosition: item.displayPosition
              };
            }

            return baseItem;
          });
          
          // Check if we have new data by comparing with existing news
          const hasNewContent = news.length === 0 || 
            transformedNews.some((newItem: StrapiBreakingNews) => 
              !news.find((existingItem: StrapiBreakingNews) => 
                existingItem.id === newItem.id && 
                existingItem.updatedAt === newItem.updatedAt
              )
            );
          
          if (hasNewContent) {
            setHasNewData(true)
            setLastFetchTime(new Date())
            // Reset hasNewData flag after 3 seconds
            setTimeout(() => setHasNewData(false), 3000)
          }
          // Since API now merges pinned news into main data array, just set the news directly
          console.log('Transformed news with isPinned flags:', transformedNews.map((item: StrapiBreakingNews) => ({ id: item.id, title: item.Title, isPinned: item.isPinned })));
          console.log('Total items received from API:', regularData.length);
          console.log('Pinned items in data:', transformedNews.filter((item: StrapiBreakingNews) => item.isPinned).length);
          
          // Auto-scroll to first pinned item when new pinned news is detected
          if (hasNewData && currentPinnedCount > 0) {
            const firstPinnedIndex = transformedNews.findIndex((item: StrapiBreakingNews) => item.isPinned);
            if (firstPinnedIndex !== -1) {
              setCurrentIndex(firstPinnedIndex);
              console.log(`🎯 Auto-scrolled to first pinned news at index ${firstPinnedIndex}`);
            }
          }
          
          setNews(transformedNews);
        } else {
          setNews([]);
        }
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
            isPinned: false,
            moderationStatus: 'approved' as const,
            isHidden: false,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            publishedAt: article.publishedAt
          }));
          setNews(transformedArticles);
        } else {
          setNews([{
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
            isPinned: false,
            moderationStatus: 'approved' as const,
            isHidden: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString()
          }])
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
          isPinned: false,
          moderationStatus: 'approved' as const,
          isHidden: false,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          publishedAt: article.publishedAt
        }));
        setNews(transformedArticles);
      } else {
        setNews([{
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
        isPinned: false,
        moderationStatus: 'approved' as const,
        isHidden: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
        }])
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
    
    // Set up interval to refresh data every 2 seconds for instant real-time updates
    const interval = setInterval(() => {
      loadBreakingNews()
      loadAdvertisements()
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate disabled - manual navigation only
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prev) => {
  //       const totalItems = news.length + (showAds ? advertisements.length : 0)
  //       return totalItems > 0 ? (prev + 1) % totalItems : 0
  //     })
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [news.length, advertisements.length, showAds])

  // Auto-refresh data every 30 seconds to catch fresh news immediately
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      loadBreakingNews()
      loadAdvertisements()
    }, 30 * 1000) // 30 seconds in milliseconds

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

  const allItems = useMemo(() => {
    // Use the unified news array that now contains both news and sponsored content
    return news
  }, [news])

  const currentItem = allItems[currentIndex]
  const isAdvertisement = currentItem && ((currentItem as any).type === 'sponsored' || 'Sponsor' in currentItem)
  

  if (!currentItem) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0_0_0_/0.1),0_1px_2px_-1px_rgb(0_0_0_/0.1)] rounded-2xl">
        <CardContent className="p-4">
          <div className="text-center text-gray-400 py-8">
            <Newspaper className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No news available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + allItems.length) % allItems.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allItems.length)
  }

  const handleItemClick = () => {
    if (currentItem) {
      const url = (currentItem as any).URL
      window.open(url, "_blank")
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
    <div className="space-y-4">
      {/* Regular Breaking News */}
      <Card 
        className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0_0_0_/0.1),0_1px_2px_-1px_rgb(0_0_0_/0.1)] rounded-2xl cursor-pointer hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/0.1),0_2px_4px_-2px_rgb(0_0_0_/0.1)] transition-all duration-300" 
        onClick={handleItemClick}
      >
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentItem?.isPinned && (
              <Badge className="bg-blue-500/10 text-blue-600 text-xs font-medium border border-blue-200 rounded-full px-2 py-0.5">
                📌 PINNED
              </Badge>
            )}
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${hasNewData ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-semibold text-gray-900">Breaking News</span>
            <Badge className={`text-xs font-medium border rounded-full px-2 py-0.5 ${hasNewData ? 'bg-green-500/10 text-green-600 border-green-200' : 'bg-red-500/10 text-red-600 border-red-200'}`}>
              {hasNewData ? 'NEW' : 'LIVE'}
            </Badge>
            {hasNewData && (
              <Badge className="bg-blue-500/10 text-blue-600 text-xs font-medium border border-blue-200 rounded-full px-2 py-0.5 animate-bounce">
                FRESH DATA
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-3 h-3 text-gray-500" />
            </Button>
            <span className="text-xs text-gray-400 px-1 font-medium">
              {currentIndex + 1}/{allItems.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-3 h-3 text-gray-500" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {isAdvertisement ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium rounded-full px-2 py-0.5">
                  {(currentItem as any).sponsorName || 'Sponsored'}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open((currentItem as any).URL, "_blank")
                }}
                className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </Button>
            </div>

            <div className="space-y-3">
              {(currentItem as any).ImageURL && (
                <div className="w-full">
                  <img
                    src={(currentItem as any).ImageURL}
                    alt={(currentItem as any).Title}
                    className="w-full h-32 rounded-xl object-cover shadow-sm"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {(currentItem as any).Title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {(currentItem as any).Summary}
                </p>
                <div className="text-xs text-gray-500 font-medium">
                  by <span className="text-gray-700">{(currentItem as any).sponsorName || 'Sponsor'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-3">
              {(currentItem as StrapiBreakingNews).image && (
                <div className="flex-shrink-0">
                  <img 
                    src={(currentItem as StrapiBreakingNews).image} 
                    alt={(currentItem as StrapiBreakingNews).imageAlt || (currentItem as StrapiBreakingNews).Title}
                    className="w-16 h-12 rounded object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {(currentItem as StrapiBreakingNews).Title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {(currentItem as StrapiBreakingNews).Summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 font-medium">
                    Source: <span className="text-gray-700">{(currentItem as StrapiBreakingNews).Source}</span>
                  </div>
                  
                  {/* Vote Buttons */}
                  <IsolatedVoteButton 
                    article={currentItem}
                    onVoteUpdate={(articleKey: string | number, voteData: {upvotes: number, downvotes: number, voteScore: number}) => {
                      console.log(`Updating news item ${articleKey} with:`, voteData);
                      setNews(prevNews => 
                        prevNews.map(item => 
                          item.id === articleKey 
                            ? { ...item, upvotes: voteData.upvotes, downvotes: voteData.downvotes }
                            : item
                        )
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      </Card>
    </div>
  )
}
