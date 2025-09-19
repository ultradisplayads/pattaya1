"use client"

import { useState, useEffect } from "react"
import { Star, ExternalLink, RefreshCw, MapPin, Heart, ThumbsUp, MessageCircle, TrendingUp, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SponsorshipBanner } from "./sponsorship-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buildApiUrl } from "@/lib/strapi-config"
import { ReviewCard } from "./review-card"
import { motion, AnimatePresence } from "framer-motion"

interface Review {
  id: number
  source_platform: string
  author_name: string
  rating: number
  review_text: string
  review_timestamp: string
  author_profile_url?: string
  author_profile_photo_url?: string
  business_name: string
  business_address?: string
  verified: boolean
  business?: {
    name: string
    slug: string
    rating: number
    reviewCount: number
  }
}

interface ReviewsData {
  data: Review[]
  meta: {
    total: number
    limit: number
    platform: string
    timestamp: string
  }
}

interface ReviewsStats {
  data: {
    total_reviews: number
    platforms: Record<string, number>
    average_rating: number
    rating_distribution: Record<number, number>
    recent_reviews_24h: number
  }
  meta: {
    business_id: string
    timestamp: string
  }
}

export function GoogleReviewsWidget() {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [statsData, setStatsData] = useState<ReviewsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [hoveredReview, setHoveredReview] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'recent' | 'top-rated'>('recent')
  const [isRefreshing, setIsRefreshing] = useState(false)

  /* ------------------------------------------------------------------ */
  /*                             EFFECTS                                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    loadReviews()
    loadStats()
    const liveInterval = setInterval(() => {
      if (isLive) loadReviews()
    }, 30000)
    return () => clearInterval(liveInterval)
  }, [isLive])

  /* ------------------------------------------------------------------ */
  /*                        DATA FETCH / FALLBACK                       */
  /* ------------------------------------------------------------------ */
  const loadReviews = async (showRefresh = false) => {
    try {
      setError(null)
      if (showRefresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      console.log('Fetching latest reviews from Strapi...')
      
      const sortParam = viewMode === 'top-rated' ? 'rating' : 'timestamp'
      const response = await fetch(buildApiUrl(`google-reviews/latest?limit=10&sort=${sortParam}`))
      
      if (response.ok) {
        const data: ReviewsData = await response.json()
        setReviewsData(data)
      } else {
        console.error("Failed to load reviews from Strapi:", response.status)
        setReviewsData(getFallbackReviewsData())
      }
    } catch (err) {
      console.error("Reviews loading error:", err)
      setError("Unable to load reviews")
      setReviewsData(getFallbackReviewsData())
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch(buildApiUrl("google-reviews/stats"))
      
      if (response.ok) {
        const data: ReviewsStats = await response.json()
        setStatsData(data)
      }
    } catch (err) {
      console.error("Stats loading error:", err)
    }
  }

  const getFallbackReviewsData = (): ReviewsData => ({
    data: sampleReviews,
    meta: {
      total: sampleReviews.length,
      limit: 10,
      platform: 'all',
      timestamp: new Date().toISOString()
    }
  })

  const toggleLive = () => {
    setIsLive(!isLive)
  }

  const handleRefresh = () => {
    loadReviews(true)
  }

  const handleViewModeChange = (mode: 'recent' | 'top-rated') => {
    setViewMode(mode)
    loadReviews()
  }

  // Remove carousel helpers for scrolling list UI

  /* ------------------------------------------------------------------ */
  /*                            HELPERS                                 */
  /* ------------------------------------------------------------------ */
  const getPlatformStats = () => {
    if (!statsData?.data?.platforms) return null
    
    const platforms = Object.entries(statsData.data.platforms)
    if (platforms.length === 0) return null
    
    return platforms.map(([platform, count]) => (
      <span key={platform} className="text-xs text-gray-600">
        {platform}: {count}
      </span>
    )).reduce((prev, curr, index) => [
      prev,
      <span key={`sep-${index}`} className="text-gray-400">•</span>,
      curr
    ] as any)
  }

  /* ------------------------------------------------------------------ */
  /*                          RENDER STATES                             */
  /* ------------------------------------------------------------------ */
  if (loading) return <SkeletonCard />

  if (!reviewsData || (reviewsData.data?.length ?? 0) === 0) return <EmptyCard />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="reviews-widget bg-gradient-to-br from-blue-50 via-cyan-50/60 to-teal-50/40 border-0 h-full flex flex-col overflow-hidden shadow-2xl hover:shadow-cyan-200/40 transition-all duration-700 hover:scale-[1.03] rounded-3xl backdrop-blur-sm">
        <SponsorshipBanner widgetType="google-reviews" />
        
        <CardHeader className="pb-1 flex-shrink-0 bg-gradient-to-r from-cyan-500/90 via-blue-500/90 to-teal-500/90 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/15 via-transparent to-teal-400/15 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 bg-white/5 rounded-full translate-y-4 -translate-x-4 animate-float" style={{ animationDelay: '1s' }}></div>
          
          <motion.div 
            className="flex items-center justify-between relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CardTitle className="text-xs flex items-center space-x-1 text-white font-bold drop-shadow-lg">
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="p-1 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/30"
              >
                <Sparkles className="w-2.5 h-2.5 text-yellow-200 drop-shadow-sm" />
              </motion.div>
              <div>
                <span className="text-white drop-shadow-lg text-xs">🌴 Reviews</span>
                <div className="flex items-center mt-0.5 gap-0.5">
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-2 h-2 text-cyan-200" />
                  </motion.div>
                  <span className="text-[9px] text-cyan-100 font-medium">Live</span>
                </div>
              </div>
            </CardTitle>
            
            <div className="flex items-center space-x-1.5">
              {/* Enhanced View Mode Toggle */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-md p-0.5 shadow-lg border border-white/30">
                <Button
                  variant={viewMode === 'recent' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewModeChange('recent')}
                  className={`h-4 px-1 text-[9px] font-semibold transition-all duration-300 rounded-sm ${
                    viewMode === 'recent' 
                      ? 'bg-white text-cyan-600 shadow-lg transform scale-105' 
                      : 'text-white hover:bg-white/20 hover:text-cyan-100'
                  }`}
                >
                  ⚡
                </Button>
                <Button
                  variant={viewMode === 'top-rated' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewModeChange('top-rated')}
                  className={`h-4 px-1 text-[9px] font-semibold transition-all duration-300 rounded-sm ${
                    viewMode === 'top-rated' 
                      ? 'bg-white text-cyan-600 shadow-lg transform scale-105' 
                      : 'text-white hover:bg-white/20 hover:text-cyan-100'
                  }`}
                >
                  ⭐
                </Button>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  className="h-4 w-4 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-md border border-white/30 shadow-lg"
                  disabled={isRefreshing}
                  aria-label="Refresh"
                >
                  <RefreshCw className={`w-2 h-2 ${isRefreshing ? "animate-spin text-cyan-200" : "text-white"}`} />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col p-1.5 overflow-hidden bg-gradient-to-b from-transparent via-white/50 to-white/70">
          {/* Enhanced Scroll List Container */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-0.5 space-y-1.5 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-transparent hover:scrollbar-thumb-cyan-400">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="space-y-1.5"
              >
                {reviewsData.data.map((rev, index) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, x: -40, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.15,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 80
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.3, type: "spring", stiffness: 300 }
                    }}
                    onHoverStart={() => setHoveredReview(rev.id)}
                    onHoverEnd={() => setHoveredReview(null)}
                    className="relative group"
                  >
                    <div                     className={`transition-all duration-400 transform ${
                      hoveredReview === rev.id 
                        ? 'bg-white/95 shadow-xl border-cyan-300/60 shadow-cyan-200/30' 
                        : 'bg-white/70 hover:bg-white/80 border-cyan-200/40'
                    } rounded-lg p-2 border backdrop-blur-sm hover:shadow-lg`}>
                      
                      {/* Tropical accent bar */}
                      <div className={`absolute top-0 left-0 h-full w-1 rounded-l-xl transition-all duration-300 ${
                        hoveredReview === rev.id 
                          ? 'bg-gradient-to-b from-cyan-400 via-teal-400 to-blue-400' 
                          : 'bg-gradient-to-b from-cyan-300 via-teal-300 to-blue-300'
                      }`}></div>
                      
                      <div className="ml-1.5">
                        <ReviewCard review={rev} />
                      </div>
                      
                      {/* Enhanced Interactive Overlay */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: hoveredReview === rev.id ? 1 : 0,
                          scale: hoveredReview === rev.id ? 1 : 0.8
                        }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="absolute top-2 right-2 flex space-x-1"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.8 }}
                          className="p-1 bg-gradient-to-br from-red-400 to-pink-500 rounded-md cursor-pointer shadow-lg border border-white/50"
                        >
                          <Heart className="w-2.5 h-2.5 text-white drop-shadow-sm" />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          whileTap={{ scale: 0.8 }}
                          className="p-1 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-md cursor-pointer shadow-lg border border-white/50"
                        >
                          <ThumbsUp className="w-2.5 h-2.5 text-white drop-shadow-sm" />
                        </motion.div>
                      </motion.div>
                      
                      {/* Floating tropical elements */}
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                        className={`absolute -top-2 -right-2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        {index % 3 === 0 ? '🌺' : index % 3 === 1 ? '🌴' : '🏖️'}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Stats and Info */}
          <motion.div 
            className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-cyan-200/60 bg-gradient-to-r from-white/60 via-cyan-50/80 to-white/60 rounded-xl px-3 py-2 backdrop-blur-sm shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="p-1.5 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg shadow-md"
              >
                <MapPin className="w-3 h-3 text-white drop-shadow-sm" />
              </motion.div>
              <div>
                <span className="font-bold text-gray-800 text-xs">🏝️ Pattaya Reviews</span>
                {statsData?.data?.average_rating && (
                  <motion.span 
                    className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full font-bold shadow-md text-xs"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: ['0 2px 4px rgba(245,158,11,0.3)', '0 4px 12px rgba(245,158,11,0.4)', '0 2px 4px rgba(245,158,11,0.3)']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    ⭐ {statsData.data.average_rating.toFixed(1)}
                  </motion.span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.div
                className="font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-2 py-1 rounded-full shadow-lg border border-cyan-400/50 text-xs"
                animate={{ 
                  background: [
                    'linear-gradient(to right, #06b6d4, #14b8a6)',
                    'linear-gradient(to right, #0891b2, #0d9488)',
                    'linear-gradient(to right, #06b6d4, #14b8a6)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🎯 {reviewsData.data.length}
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.15, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all duration-300 rounded-lg shadow-lg border border-blue-400/50"
                  onClick={() => window.open("https://www.google.com/maps/search/pattaya+reviews", "_blank")}
                  aria-label="Open in Google Maps"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Platform Stats */}
          {getPlatformStats() && (
            <motion.div 
              className="flex items-center justify-center space-x-2 text-xs text-gray-700 mt-2 bg-gradient-to-r from-white/70 via-cyan-50/60 to-white/70 rounded-lg px-3 py-1.5 backdrop-blur-sm shadow-sm border border-cyan-200/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <MessageCircle className="w-3 h-3 text-cyan-600" />
              </motion.div>
              <div className="flex items-center space-x-1.5 font-semibold">
                {getPlatformStats()}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="text-xs text-red-700 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-2 rounded-lg text-center mt-2 border border-red-200/60 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </CardContent>
      </Card>
      
      {/* Enhanced Custom CSS Styles */}
      <style jsx>{`
        .reviews-widget {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .reviews-widget::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.03) 0%, rgba(20, 184, 166, 0.03) 50%, rgba(59, 130, 246, 0.03) 100%);
          pointer-events: none;
          z-index: 0;
        }
        
        .reviews-widget:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 25px 50px rgba(6, 182, 212, 0.15),
            0 10px 30px rgba(20, 184, 166, 0.1),
            0 0 0 1px rgba(59, 130, 246, 0.1);
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #67e8f9 transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #67e8f9, #06b6d4);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #22d3ee, #0891b2);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes tropical-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-tropical-shimmer {
          background: linear-gradient(90deg, transparent 25%, rgba(6, 182, 212, 0.1) 50%, transparent 75%);
          background-size: 200% 100%;
          animation: tropical-shimmer 3s infinite;
        }
        
        @keyframes wave {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(2px) translateY(-2px); }
          50% { transform: translateX(0px) translateY(-4px); }
          75% { transform: translateX(-2px) translateY(-2px); }
        }
        
        .animate-wave {
          animation: wave 4s ease-in-out infinite;
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(6, 182, 212, 0.3);
            filter: brightness(1);
          }
          50% { 
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.6), 0 0 35px rgba(20, 184, 166, 0.4);
            filter: brightness(1.1);
          }
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*               SMALL SUB-COMPONENTS & SAMPLE DATA                    */
/* ------------------------------------------------------------------ */
function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="reviews-widget bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/60 h-full flex flex-col overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-yellow-100/50 to-orange-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-200 rounded animate-pulse" />
              <div className="h-4 bg-yellow-200 rounded w-24 animate-pulse" />
            </div>
            <div className="flex space-x-2">
              <div className="h-6 w-16 bg-yellow-200 rounded animate-pulse" />
              <div className="h-6 w-6 bg-yellow-200 rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-3 space-y-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="bg-white/60 rounded-xl p-3 border border-yellow-200/50"
            >
              <div className="animate-pulse space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex justify-between items-center mt-4 pt-3 border-t border-yellow-200/60"
          >
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function EmptyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="reviews-widget bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/60 h-full flex flex-col overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-yellow-100/50 to-orange-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">Latest Reviews</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            className="text-center text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Star className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            </motion.div>
            <motion.p 
              className="text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              No reviews available
            </motion.p>
            <motion.p 
              className="text-xs text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Check back soon for new reviews
            </motion.p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* Demo fallback reviews shown if API fails */
const sampleReviews: Review[] = [
  {
    id: 1,
    source_platform: "Google",
    author_name: "Sarah Johnson",
    rating: 5,
    review_text: "Amazing atmosphere and great live music! The food was delicious and the staff was very friendly. Highly recommend for a night out in Pattaya.",
    review_timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author_profile_photo_url: "",
    business_name: "Hard Rock Cafe Pattaya",
    business_address: "Beach Road, Pattaya",
    verified: true,
  },
  {
    id: 2,
    source_platform: "Yelp",
    author_name: "Mike Chen",
    rating: 4,
    review_text: "Great location right on the beach. Service was good and the drinks were reasonably priced. Will definitely come back!",
    review_timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author_profile_photo_url: "",
    business_name: "Beachside Bar & Grill",
    business_address: "Jomtien Beach, Pattaya",
    verified: true,
  },
  {
    id: 3,
    source_platform: "Facebook",
    author_name: "Emma Wilson",
    rating: 5,
    review_text: "Perfect family restaurant with amazing Thai food. The kids loved it and the service was excellent. Will be back soon!",
    review_timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    author_profile_photo_url: "",
    business_name: "Thai Garden Restaurant",
    business_address: "Central Pattaya",
    verified: false,
  },
]
