"use client"

import { useState, useEffect, useRef } from "react"
import {
  Flame, Percent, Clock, MapPin, Star, Users, ExternalLink, X, 
  ShoppingBag, Tag, Timer, TrendingUp, Heart, Share2, Eye,
  ChevronRight, ChevronLeft, RefreshCw, Zap, Gift, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"
import { DealCard } from "@/components/deals/deal-card"

interface Deal {
  id: string
  title: string
  business: string
  location: string
  discount: string
  originalPrice: number
  salePrice: number
  timeLeft: string
  category: string
  urgent: boolean
  image: string
  rating?: number
  reviews?: number
  featured?: boolean
  views?: number
  clicks?: number
  slug?: string
  description?: string
  businessWebsite?: string
  dealUrl?: string
}

interface StrapiDeal {
  id: number
  deal_title: string
  slug: string
  description: string
  original_price: number
  sale_price: number
  isActive: boolean
  featured: boolean
  views: number
  clicks: number
  conversions: number
  image_gallery?: any[]
  business?: {
    data: {
      id: number
      attributes: {
        name: string
        address: string
        rating: number
        reviewCount: number
        website?: string
        logo?: {
          data: {
            attributes: {
              url: string
            }
          }
        }
      }
    }
  }
  deal_category?: {
    data: {
      id: number
      attributes: {
        name: string
        slug: string
      }
    }
  }
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface SponsoredWidgetBanner {
  isSponsored: boolean
  sponsorName?: string
  sponsorLogo?: string
  sponsorMessage?: string
  sponsorWebsite?: string
  sponsorColor?: string
  bannerPosition: "top" | "bottom" | "overlay"
}

export function EnhancedHotDealsWidget({ className }: { className?: string }) {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sponsoredBanner, setSponsoredBanner] = useState<SponsoredWidgetBanner>({
    isSponsored: false,
    bannerPosition: "top"
  })
  const [logoLoadingStates, setLogoLoadingStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadDeals()
    loadSponsoredBanner()
  }, [])

  const loadDeals = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Try to fetch from Strapi first
      const response = await fetch(buildApiUrl("deals?populate=*"))
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          const activeDeals = data.data
            .filter((strapiDeal: StrapiDeal) => strapiDeal.isActive)
            .sort((a: StrapiDeal, b: StrapiDeal) => {
              if (a.featured && !b.featured) return -1
              if (!a.featured && b.featured) return 1
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            .map((strapiDeal: StrapiDeal) => ({
              id: strapiDeal.id.toString(),
              title: strapiDeal.deal_title || 'Untitled Deal',
              business: strapiDeal.business?.data?.attributes?.name || 'Business Name',
              location: strapiDeal.business?.data?.attributes?.address || 'Pattaya, Thailand',
              discount: calculateDiscount(strapiDeal.original_price, strapiDeal.sale_price),
              originalPrice: strapiDeal.original_price || 0,
              salePrice: strapiDeal.sale_price || 0,
              timeLeft: generateTimeLeft(),
              category: strapiDeal.deal_category?.data?.attributes?.name || 'Activity',
              urgent: strapiDeal.featured || false,
              image: strapiDeal.image_gallery?.[0]?.url ? buildStrapiUrl(strapiDeal.image_gallery[0].url) : "/placeholder.svg?height=120&width=200&text=Deal",
              rating: strapiDeal.business?.data?.attributes?.rating || 4.5,
              reviews: strapiDeal.business?.data?.attributes?.reviewCount || 0,
              featured: strapiDeal.featured || false,
              views: strapiDeal.views || 0,
              clicks: strapiDeal.clicks || 0,
              slug: strapiDeal.slug || '',
              description: strapiDeal.description || '',
              businessWebsite: strapiDeal.business?.data?.attributes?.website || '',
              dealUrl: `/deals/${strapiDeal.slug || strapiDeal.id}`
            }))
          
          setDeals(activeDeals)
        } else {
          // Fallback to sample data
          setDeals(getSampleDeals())
        }
      } else {
        // Fallback to sample data
        setDeals(getSampleDeals())
      }
    } catch (error) {
      console.error('Error loading deals:', error)
      setError('Failed to load deals')
      // Fallback to sample data
      setDeals(getSampleDeals())
    } finally {
      setIsLoading(false)
    }
  }

  const getSampleDeals = (): Deal[] => [
    {
      id: "1",
      title: "Thai Massage Special",
      business: "Luxury Spa Center",
      location: "Central Pattaya",
      discount: "50%",
      originalPrice: 1000,
      salePrice: 500,
      timeLeft: "2h 15m",
      category: "Wellness",
      urgent: true,
      image: "/placeholder.svg?height=120&width=200&text=Massage",
      rating: 4.8,
      reviews: 127,
      featured: true,
      views: 245,
      clicks: 89,
      slug: "thai-massage-special",
      description: "Relaxing Thai massage with professional therapists",
      businessWebsite: "https://luxuryspa.com",
      dealUrl: "/deals/thai-massage-special"
    },
    {
      id: "2",
      title: "Seafood Buffet",
      business: "Ocean View Restaurant",
      location: "Beach Road",
      discount: "30%",
      originalPrice: 899,
      salePrice: 629,
      timeLeft: "1 day",
      category: "Dining",
      urgent: false,
      image: "/placeholder.svg?height=120&width=200&text=Seafood",
      rating: 4.6,
      reviews: 203,
      featured: false,
      views: 189,
      clicks: 67,
      slug: "seafood-buffet",
      description: "Fresh seafood buffet with ocean view",
      businessWebsite: "https://oceanview.com",
      dealUrl: "/deals/seafood-buffet"
    },
    {
      id: "3",
      title: "Diving Course",
      business: "Adventure Dive Center",
      location: "Jomtien Beach",
      discount: "25%",
      originalPrice: 2400,
      salePrice: 1800,
      timeLeft: "3 days",
      category: "Adventure",
      urgent: false,
      image: "/placeholder.svg?height=120&width=200&text=Diving",
      rating: 4.9,
      reviews: 89,
      featured: true,
      views: 156,
      clicks: 45,
      slug: "diving-course",
      description: "Professional diving course with certified instructors",
      businessWebsite: "https://adventuredive.com",
      dealUrl: "/deals/diving-course"
    },
    {
      id: "4",
      title: "Sunset Cruise",
      business: "Pattaya Yacht Club",
      location: "Bali Hai Pier",
      discount: "40%",
      originalPrice: 1500,
      salePrice: 900,
      timeLeft: "6h 30m",
      category: "Tours",
      urgent: true,
      image: "/placeholder.svg?height=120&width=200&text=Cruise",
      rating: 4.7,
      reviews: 156,
      featured: false,
      views: 298,
      clicks: 112,
      slug: "sunset-cruise",
      description: "Romantic sunset cruise with dinner",
      businessWebsite: "https://pattayayacht.com",
      dealUrl: "/deals/sunset-cruise"
    }
  ]

  const calculateDiscount = (original: number, sale: number): string => {
    if (original <= 0 || sale <= 0) return "0%"
    const discount = Math.round(((original - sale) / original) * 100)
    return `${discount}%`
  }

  const generateTimeLeft = (): string => {
    const hours = Math.floor(Math.random() * 24)
    const minutes = Math.floor(Math.random() * 60)
    if (hours === 0) return `${minutes}m`
    if (hours < 24) return `${hours}h ${minutes}m`
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? 's' : ''}`
  }

  const loadSponsoredBanner = async () => {
    try {
      const response = await fetch('/api/homepage-configs/widget/hot-deals')
      if (response.ok) {
        const data = await response.json()
        if (data.data?.sponsoredWidgetBanner) {
          setSponsoredBanner(data.data.sponsoredWidgetBanner)
        }
      }
    } catch (error) {
      console.error('Error loading sponsorship:', error)
    }
  }

  const handleWidgetClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input') || target.closest('a') || target.closest('[role="button"]')) {
      return
    }
    setIsExpanded(true)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "wellness":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "dining":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "adventure":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "tours":
        return "bg-purple-500/10 text-purple-600 border-purple-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }


  const handleViewDeal = (deal: Deal) => {
    // Track the view action
    console.log('Viewing deal:', deal.title)
    
    // Open the deal page
    if (deal.dealUrl) {
      window.open(deal.dealUrl, '_blank')
    } else {
      // Fallback to business website if no deal URL
      if (deal.businessWebsite) {
        window.open(deal.businessWebsite, '_blank')
      }
    }
  }

  const handleBuyNow = (deal: Deal) => {
    // Track the buy now action
    console.log('Buy now clicked for deal:', deal.title)
    
    // Open the deal page for purchase
    if (deal.dealUrl) {
      window.open(deal.dealUrl, '_blank')
    } else {
      // Fallback to business website if no deal URL
      if (deal.businessWebsite) {
        window.open(deal.businessWebsite, '_blank')
      }
    }
  }

  const handleShareDeal = (deal: Deal) => {
    // Track the share action
    console.log('Sharing deal:', deal.title)
    
    // Use Web Share API if available, otherwise fallback to copying URL
    if (navigator.share) {
      navigator.share({
        title: deal.title,
        text: `Check out this amazing deal: ${deal.title} - ${deal.discount} OFF!`,
        url: deal.dealUrl || window.location.href
      }).catch(console.error)
    } else {
      // Fallback: copy to clipboard
      const shareText = `Check out this amazing deal: ${deal.title} - ${deal.discount} OFF! ${deal.dealUrl || window.location.href}`
      navigator.clipboard.writeText(shareText).then(() => {
        // You could show a toast notification here
        console.log('Deal link copied to clipboard!')
      }).catch(console.error)
    }
  }

  if (isLoading) {
    return (
      <Card className={`top-row-widget bg-gradient-to-br from-orange-400/90 via-red-400/85 to-pink-500/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-300 ${className || ""}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-3xl rounded-3xl"></div>
          <div className="absolute top-8 left-12 animate-bounce-gentle">
            <Flame className="w-8 h-8 text-orange-200/60" />
          </div>
          <div className="absolute top-12 right-16 animate-spin-gentle">
            <Percent className="w-7 h-7 text-red-200/60" />
          </div>
          <div className="absolute bottom-16 left-16 animate-pulse-gentle">
            <ShoppingBag className="w-6 h-6 text-pink-200/60" />
          </div>
        </div>
        <CardHeader className="pb-4 sm:pb-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-md opacity-60 animate-pulse"></div>
                <div className="relative p-2.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl shadow-lg">
                  <Flame className="w-5 h-5 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white via-orange-50 to-pink-50 bg-clip-text text-transparent drop-shadow-sm">
                  Hot Deals
                </h2>
                <p className="text-sm text-white/80">Loading amazing deals...</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 relative z-10">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/20 backdrop-blur-md rounded-2xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white/30 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/30 rounded-lg"></div>
                    <div className="h-3 bg-white/20 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (deals.length === 0) {
    return (
      <Card className={`top-row-widget bg-gradient-to-tr from-orange-400 via-red-300 to-pink-400 rounded-[28px] shadow-xl border-0 backdrop-blur-xl transition-all duration-300 ${className || ""}`}>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-2xl rounded-[28px]"></div>
          <div className="absolute top-6 left-8 animate-bounce-slow">
            <Flame className="w-10 h-10 text-orange-300 opacity-60" />
          </div>
          <div className="absolute top-8 right-8 animate-spin-slow">
            <Percent className="w-8 h-8 text-red-300 opacity-60" />
          </div>
          <div className="absolute bottom-10 left-10 animate-pulse">
            <ShoppingBag className="w-8 h-8 text-pink-300 opacity-60" />
          </div>
        </div>
        <CardHeader className="pb-4 sm:pb-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span className="text-[15px] font-medium text-gray-900">Hot Deals</span>
                </div>
              </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3 flex-1 overflow-y-auto">
          <div className="h-full flex items-center justify-center text-sm text-gray-500">
            No deals available right now.
          </div>
        </CardContent>
      </Card>
    )
  }


  return (
    <>
      <Card
        className={`top-row-widget overflow-hidden bg-gradient-to-br from-orange-400/90 via-red-400/85 to-pink-500/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-700 ease-out hover:shadow-3xl hover:scale-[1.02] hover:border-white/30 relative cursor-pointer group ${className || ""}`}
        onClick={handleWidgetClick}
        data-hot-deals-widget="true"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Glass morphism base */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-3xl rounded-3xl"></div>
          
          {/* Floating gradient orbs with enhanced animations */}
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-r from-yellow-300/20 to-orange-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '0s'}} />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-orange-300/15 to-yellow-300/15 rounded-full blur-xl animate-pulse-soft" />
          
          {/* Enhanced floating icons with micro-animations */}
          <div className="absolute top-8 left-12 group-hover:scale-110 transition-all duration-500">
            <Flame className="w-8 h-8 text-orange-200/60 animate-bounce-gentle" style={{animationDelay: '0s'}} />
          </div>
          <div className="absolute top-12 right-16 group-hover:rotate-12 transition-all duration-500">
            <Percent className="w-7 h-7 text-red-200/60 animate-spin-gentle" style={{animationDelay: '1s'}} />
          </div>
          <div className="absolute bottom-16 left-16 group-hover:scale-105 transition-all duration-500">
            <ShoppingBag className="w-6 h-6 text-pink-200/60 animate-pulse-gentle" style={{animationDelay: '2s'}} />
          </div>
          <div className="absolute bottom-12 right-12 group-hover:animate-bounce transition-all duration-500">
            <Sparkles className="w-5 h-5 text-yellow-200/60 animate-twinkle" style={{animationDelay: '1.5s'}} />
          </div>
          <div className="absolute top-1/3 right-8 group-hover:scale-110 transition-all duration-500">
            <Zap className="w-4 h-4 text-yellow-300/50 animate-flash" style={{animationDelay: '0.8s'}} />
          </div>
          <div className="absolute bottom-1/3 left-8 group-hover:rotate-6 transition-all duration-500">
            <Gift className="w-5 h-5 text-pink-300/50 animate-wiggle" style={{animationDelay: '2.2s'}} />
          </div>
        </div>

        <div className="relative z-50">
      <SponsorshipBanner widgetType="hot-deals" />
        </div>

        {sponsoredBanner.isSponsored && (
          <div className="w-full p-4 text-center text-white font-semibold shadow-lg absolute top-0 left-0 z-10 bg-gradient-to-r from-orange-700 via-red-700 to-pink-700 border-b-2 border-white/20 rounded-t-[18px]">
            <div className="flex items-center justify-center gap-3">
              {sponsoredBanner.sponsorLogo && (
                <img
                  src={sponsoredBanner.sponsorLogo}
                  alt={sponsoredBanner.sponsorName || "Sponsor"}
                  className="h-8 w-8 object-contain rounded-full bg-white/20 p-1 animate-badge-glow"
                />
              )}
              <span className="text-lg font-bold animate-gradient-x">
                {sponsoredBanner.sponsorMessage || `Brought to you by ${sponsoredBanner.sponsorName}`}
              </span>
              {sponsoredBanner.sponsorWebsite && (
                <a
                  href={sponsoredBanner.sponsorWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 underline px-3 py-1 rounded-full hover:bg-white/30 font-medium bg-white/20"
                >
                  Visit Site
                </a>
              )}
            </div>
          </div>
        )}

        <CardHeader className="pb-4 sm:pb-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Main icon with glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-md opacity-60"></div>
                <div className="relative p-2.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-500">
                  <Flame className="w-5 h-5 text-white group-hover:scale-110 group-hover:animate-pulse transition-all duration-300" />
            </div>
                {/* Status indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-md" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white via-orange-50 to-pink-50 bg-clip-text text-transparent drop-shadow-sm">
                  Hot Deals
                </h2>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-twinkle" />
                  Limited time offers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 backdrop-blur-md text-white px-3 py-1 text-sm font-medium border border-white/30 rounded-full animate-pulse-soft">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping" />
                {deals.length} Live
              </Badge>
            </div>
          </div>
      </CardHeader>

      <CardContent className="px-3 pb-3 flex-1 overflow-y-auto">
        {/* Scrolling Deals List */}
        <div className="space-y-2">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/95 group/card relative overflow-hidden"
            >
              {/* Card shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/card:translate-x-[200%] transition-transform duration-1000 ease-out" />
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <div className="relative flex-shrink-0 group/image">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-xl blur-sm opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-16 h-16 rounded-xl object-cover shadow-md relative z-10 group-hover/image:scale-105 transition-transform duration-300"
                    onLoad={() => setLogoLoadingStates(prev => ({ ...prev, [deal.id]: false }))}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=64&width=64&text=Deal"
                    }}
                  />
                  {deal.urgent && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping shadow-lg"></div>
                  )}
                  {deal.featured && (
                    <div className="absolute -top-1 -left-1">
                      <div className="p-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-md">
                        <Star className="w-3 h-3 text-white fill-current" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 truncate text-sm group-hover/card:text-orange-600 transition-colors duration-300">
                      {deal.title}
                    </h3>
                    {deal.featured && (
                      <div className="animate-bounce">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 truncate mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {deal.business} • {deal.location}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs px-2 py-1 ${getCategoryColor(deal.category)} border-none rounded-full font-medium`}>
                      {deal.category}
                    </Badge>
                    <Badge className="text-xs px-2 py-1 bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-white border-none rounded-full animate-pulse-soft font-bold shadow-md">
                      <Percent className="w-3 h-3 mr-1" />
                      {deal.discount} OFF
                    </Badge>
                    {deal.urgent && (
                      <Badge className="text-xs px-2 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white border-none rounded-full animate-bounce font-bold">
                        🔥 HOT
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        ฿{deal.salePrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through relative">
                        ฿{deal.originalPrice.toLocaleString()}
                        <div className="absolute inset-0 bg-red-500/20 rounded-sm"></div>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full">
                      <Timer className="w-3 h-3 animate-pulse text-red-500" />
                      <span className="font-medium">{deal.timeLeft}</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 border-gray-200/50 text-gray-700 hover:text-orange-600 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDeal(deal)
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white border-none shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 rounded-xl font-bold"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBuyNow(deal)
                      }}
                    >
                      <ShoppingBag className="w-3 h-3 mr-1" />
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 border-gray-200/50 text-gray-700 hover:text-pink-600 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShareDeal(deal)
                      }}
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {/* Rating and social proof */}
                  {deal.rating && (
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{deal.rating}</span>
                        <span>({deal.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{deal.views} views</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

      {/* Enhanced Expanded Modal */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-0 shadow-3xl backdrop-blur-xl [&>button]:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 backdrop-blur-2xl"></div>
          
          <DialogHeader className="relative pb-6 z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-4 text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-md opacity-60"></div>
                  <div className="relative p-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-xl">
                    <Flame className="h-8 w-8 text-white animate-bounce-gentle" />
              </div>
                </div>
                Premium Hot Deals Collection
            </DialogTitle>
            <Button 
              variant="ghost" 
                size="lg" 
              onClick={() => setIsExpanded(false)} 
                className="h-12 w-12 p-0 rounded-full hover:bg-red-100/80 hover:text-red-600 transition-all duration-300 hover:scale-110 backdrop-blur-md bg-white/20"
            >
                <X className="h-6 w-6" />
            </Button>
            </div>
            <p className="text-gray-600 mt-2 text-lg">Discover exclusive limited-time offers in Pattaya</p>
          </DialogHeader>
          
          <div className="relative z-10 space-y-8">
            {/* Enhanced stats bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 text-center border border-white/40 shadow-lg">
                <div className="text-2xl font-bold text-orange-600">{deals.length}</div>
                <div className="text-sm text-gray-600">Active Deals</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 text-center border border-white/40 shadow-lg">
                <div className="text-2xl font-bold text-red-600">{deals.filter(d => d.urgent).length}</div>
                <div className="text-sm text-gray-600">Hot Offers</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 text-center border border-white/40 shadow-lg">
                <div className="text-2xl font-bold text-pink-600">{deals.filter(d => d.featured).length}</div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 text-center border border-white/40 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(deals.reduce((acc, deal) => acc + (deal.originalPrice - deal.salePrice), 0) / deals.length)}
                </div>
                <div className="text-sm text-gray-600">Avg. Savings ฿</div>
              </div>
            </div>

            {/* Enhanced deals grid */}
          <div className="space-y-6">
              <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                All Premium Deals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {deals.map((deal, index) => (
                  <div
                    key={deal.id}
                    className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/40 hover:border-orange-300/50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group overflow-hidden relative"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=80&width=80&text=Deal"
                          }}
                        />
                        {deal.urgent && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                        )}
                        {deal.featured && (
                          <div className="absolute -top-1 -left-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-gray-900 truncate">{deal.title}</h5>
                          {deal.featured && (
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 truncate">
                          {deal.business} • {deal.location}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`text-xs px-2 py-0.5 ${getCategoryColor(deal.category)} border-none rounded-lg`}>
                            {deal.category}
                          </Badge>
                          <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white border-none rounded-lg">
                            {deal.discount} OFF
                          </Badge>
                          {deal.urgent && (
                            <Badge className="text-xs px-2 py-0.5 bg-red-600 text-white border-none rounded-lg animate-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-red-600">
                              ฿{deal.salePrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ฿{deal.originalPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{deal.timeLeft}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => handleViewDeal(deal)}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Deal
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-200"
                            onClick={() => handleBuyNow(deal)}
                          >
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            Buy Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleShareDeal(deal)}
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        /* Enhanced Animations */
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        @keyframes spin-gentle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-gentle {
          animation: spin-gentle 4s linear infinite;
        }

        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2.5s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-twinkle {
          animation: twinkle 1.5s ease-in-out infinite;
        }

        @keyframes flash {
          0%, 50%, 100% { opacity: 0.4; }
          25%, 75% { opacity: 1; }
        }
        .animate-flash {
          animation: flash 2s ease-in-out infinite;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Enhanced shadows */
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ef4444, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #dc2626, #db2777);
        }

        /* Glow effects */
        .glow-orange {
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
        }
        .glow-red {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }
        .glow-pink {
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
        }

        /* Legacy animations for compatibility */
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }

        @keyframes spin-slow {
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes badge-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
          }
        }
        .animate-badge-glow {
          animation: badge-glow 2s ease-in-out infinite;
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background: linear-gradient(-45deg, #fff, #f0f0f0, #fff, #f0f0f0);
          background-size: 400% 400%;
          animation: gradient-x 3s ease infinite;
        }

        @keyframes shine-once {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shine-once {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shine-once 2s ease-in-out;
        }
      `}</style>
    </>
  )
}