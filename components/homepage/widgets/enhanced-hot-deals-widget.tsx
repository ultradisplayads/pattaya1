"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  MapPin,
  Star,
  Users,
  Zap,
  ExternalLink,
  Heart,
  Share2,
  Calendar,
  DollarSign,
  Percent,
  Timer,
  TrendingUp,
  CheckCircle,
  Flame,
} from "lucide-react"
import Image from "next/image"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"

interface Deal {
  id: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  category: "restaurant" | "hotel" | "activity" | "spa" | "tour" | "nightlife"
  vendor: {
    name: string
    rating: number
    reviewCount: number
    image: string
  }
  image: string
  location: string
  validUntil: string
  soldCount: number
  maxQuantity: number
  highlights: string[]
  tags: string[]
  isFlashDeal: boolean
  timeLeft?: {
    hours: number
    minutes: number
    seconds: number
  }
}

interface StrapiDeal {
  id: number
  title: string
  slug: string
  description: string
  originalPrice: number
  salePrice: number
  discountPercent: number
  currency: string
  startDate: string
  endDate: string
  maxQuantity: number
  soldQuantity: number
  isActive: boolean
  featured: boolean
  views: number
  clicks: number
  conversions: number
  images?: {
    data: Array<{
      id: number
      attributes: {
        name: string
        url: string
        formats?: {
          thumbnail?: { url: string }
          small?: { url: string }
          medium?: { url: string }
          large?: { url: string }
        }
      }
    }>
  }
  business?: {
    data: {
      id: number
      attributes: {
        name: string
        rating: number
        reviewCount: number
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
  category?: {
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

export function EnhancedHotDealsWidget() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchDeals()
    const interval = setInterval(updateTimers, 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchDeals = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching deals from Strapi...')
      
      // Call Strapi API to get deals with populated relations
      const response = await fetch(buildApiUrl("deals?populate=*"))
      
      if (response.ok) {
        const data = await response.json()
        console.log('Strapi deals response:', data)
        
        if (data.data && data.data.length > 0) {
          // Transform Strapi data to match component interface
          const transformedDeals: Deal[] = data.data
            .filter((strapiDeal: StrapiDeal) => strapiDeal.isActive) // Filter active deals
            .sort((a: StrapiDeal, b: StrapiDeal) => {
              // Sort by featured first, then by end date
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
            })
            .map((strapiDeal: StrapiDeal) => {
            // Get image URL with fallback
            let imageUrl = "/placeholder.svg?height=200&width=300&text=Deal"
            if (strapiDeal.images?.data && strapiDeal.images.data.length > 0) {
              imageUrl = buildStrapiUrl(strapiDeal.images.data[0].attributes.url)
            }

            // Get vendor info with fallback
            const vendor = strapiDeal.business?.data?.attributes || {
              name: "Pattaya Business",
              rating: 4.5,
              reviewCount: 100,
              image: "/placeholder.svg?height=40&width=40"
            }

            // Get vendor logo
            let vendorImage = "/placeholder.svg?height=40&width=40"
            if (strapiDeal.business?.data?.attributes?.logo?.data?.attributes?.url) {
              vendorImage = buildStrapiUrl(strapiDeal.business.data.attributes.logo.data.attributes.url)
            }

            // Determine category from business or use default
            const category = strapiDeal.category?.data?.attributes?.name?.toLowerCase() || "activity"

            // Calculate if it's a flash deal (ending within 24 hours)
            const endDate = new Date(strapiDeal.endDate)
            const now = new Date()
            const timeDiff = endDate.getTime() - now.getTime()
            const hoursLeft = timeDiff / (1000 * 60 * 60)
            const isFlashDeal = hoursLeft <= 24

            // Calculate time left for flash deals
            let timeLeft = undefined
            if (isFlashDeal && timeDiff > 0) {
              const hours = Math.floor(hoursLeft)
              const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
              const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
              timeLeft = { hours, minutes, seconds }
            }

            return {
              id: strapiDeal.id.toString(),
              title: strapiDeal.title,
              description: strapiDeal.description,
              originalPrice: strapiDeal.originalPrice,
              discountedPrice: strapiDeal.salePrice,
              discountPercentage: strapiDeal.discountPercent,
              category: category as any,
              vendor: {
                name: vendor.name,
                rating: vendor.rating || 4.5,
                reviewCount: vendor.reviewCount || 100,
                image: vendorImage,
              },
              image: imageUrl,
              location: "Pattaya, Thailand", // Default location
              validUntil: strapiDeal.endDate,
              soldCount: strapiDeal.soldQuantity,
              maxQuantity: strapiDeal.maxQuantity,
              highlights: ["Great Value", "Limited Time"], // Default highlights
              tags: ["deal", "discount"], // Default tags
              isFlashDeal: isFlashDeal,
              timeLeft: timeLeft,
            }
          })
          
          console.log('Transformed deals:', transformedDeals)
          setDeals(transformedDeals)
        } else {
          console.log('No active deals found, using fallback data')
          // Use fallback data if no deals found
          const fallbackDeals = getFallbackDeals()
          setDeals(fallbackDeals)
        }
      } else {
        console.error("Failed to fetch deals from Strapi:", response.status)
        // Use fallback data on error
        const fallbackDeals = getFallbackDeals()
        setDeals(fallbackDeals)
      }
    } catch (error) {
      console.error("Failed to fetch deals:", error)
      // Use fallback data on error
      const fallbackDeals = getFallbackDeals()
      setDeals(fallbackDeals)
    } finally {
      setIsLoading(false)
    }
  }

  const getFallbackDeals = (): Deal[] => [
    {
      id: "1",
      title: "Luxury Beachfront Resort - 3 Days 2 Nights",
      description: "Experience paradise at our 5-star beachfront resort with all-inclusive dining and spa access.",
      originalPrice: 15000,
      discountedPrice: 8999,
      discountPercentage: 40,
      category: "hotel",
      vendor: {
        name: "Paradise Resort Pattaya",
        rating: 4.8,
        reviewCount: 1247,
        image: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=200&width=300&text=Luxury+Resort",
      location: "Jomtien Beach",
      validUntil: "2024-01-20T23:59:59Z",
      soldCount: 89,
      maxQuantity: 150,
      highlights: ["Private Beach Access", "Spa Included", "All Meals"],
      tags: ["luxury", "beachfront", "spa"],
      isFlashDeal: true,
      timeLeft: { hours: 23, minutes: 45, seconds: 30 },
    },
    {
      id: "2",
      title: "Authentic Thai Cooking Class + Market Tour",
      description: "Learn to cook authentic Thai dishes with a professional chef and visit local markets.",
      originalPrice: 2500,
      discountedPrice: 1499,
      discountPercentage: 40,
      category: "activity",
      vendor: {
        name: "Thai Cooking Academy",
        rating: 4.9,
        reviewCount: 856,
        image: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=200&width=300&text=Cooking+Class",
      location: "Central Pattaya",
      validUntil: "2024-01-18T23:59:59Z",
      soldCount: 156,
      maxQuantity: 200,
      highlights: ["Professional Chef", "Market Tour", "Recipe Book"],
      tags: ["cooking", "culture", "food"],
      isFlashDeal: false,
    },
    {
      id: "3",
      title: "Sunset Dinner Cruise with Live Music",
      description: "Enjoy a romantic sunset cruise with gourmet dinner and live entertainment.",
      originalPrice: 3500,
      discountedPrice: 2199,
      discountPercentage: 37,
      category: "restaurant",
      vendor: {
        name: "Ocean Cruises Pattaya",
        rating: 4.7,
        reviewCount: 634,
        image: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=200&width=300&text=Sunset+Cruise",
      location: "Pattaya Bay",
      validUntil: "2024-01-22T23:59:59Z",
      soldCount: 67,
      maxQuantity: 100,
      highlights: ["Sunset Views", "Live Music", "Gourmet Dinner"],
      tags: ["romantic", "cruise", "dinner"],
      isFlashDeal: true,
      timeLeft: { hours: 12, minutes: 30, seconds: 15 },
    },
    {
      id: "4",
      title: "Traditional Thai Massage & Spa Package",
      description: "Relax with a traditional Thai massage and spa treatment in a luxury setting.",
      originalPrice: 1800,
      discountedPrice: 999,
      discountPercentage: 44,
      category: "spa",
      vendor: {
        name: "Serenity Spa & Wellness",
        rating: 4.8,
        reviewCount: 445,
        image: "/placeholder.svg?height=40&width=40",
      },
      image: "/placeholder.svg?height=200&width=300&text=Spa+Package",
      location: "North Pattaya",
      validUntil: "2024-01-25T23:59:59Z",
      soldCount: 234,
      maxQuantity: 300,
      highlights: ["Traditional Massage", "Spa Treatment", "Relaxation"],
      tags: ["spa", "wellness", "relaxation"],
      isFlashDeal: false,
    },
  ]

  const updateTimers = () => {
    setDeals((prevDeals) =>
      prevDeals.map((deal) => {
        if (!deal.timeLeft) return deal

        const { hours, minutes, seconds } = deal.timeLeft
        let newSeconds = seconds - 1
        let newMinutes = minutes
        let newHours = hours

        if (newSeconds < 0) {
          newSeconds = 59
          newMinutes -= 1
        }

        if (newMinutes < 0) {
          newMinutes = 59
          newHours -= 1
        }

        if (newHours < 0) {
          return { ...deal, timeLeft: undefined }
        }

        return {
          ...deal,
          timeLeft: { hours: newHours, minutes: newMinutes, seconds: newSeconds },
        }
      }),
    )
  }

  const toggleFavorite = (dealId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(dealId)) {
        newFavorites.delete(dealId)
      } else {
        newFavorites.add(dealId)
      }
      return newFavorites
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTimeLeft = (timeLeft?: { hours: number; minutes: number; seconds: number }) => {
    if (!timeLeft) return null
    return `${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
      .toString()
      .padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hotel":
        return <MapPin className="w-3.5 h-3.5" />
      case "restaurant":
        return <DollarSign className="w-3.5 h-3.5" />
      case "activity":
        return <Zap className="w-3.5 h-3.5" />
      case "spa":
        return <Heart className="w-3.5 h-3.5" />
      case "tour":
        return <Calendar className="w-3.5 h-3.5" />
      case "nightlife":
        return <TrendingUp className="w-3.5 h-3.5" />
      default:
        return <Star className="w-3.5 h-3.5" />
    }
  }

  const filteredDeals = activeCategory === "all" 
    ? deals 
    : deals.filter(deal => deal.category === activeCategory)

  if (isLoading) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <CardHeader className="pb-3 px-5 pt-5">
          <CardTitle className="text-[15px] font-semibold text-gray-900 tracking-tight">Hot Deals</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-100 rounded-2xl mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out flex flex-col">
      <CardHeader className="pb-3 px-5 pt-5 flex-shrink-0">
        <CardTitle className="text-[15px] font-semibold text-gray-900 flex items-center justify-between tracking-tight">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Hot Deals</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-red-500/90 backdrop-blur-sm">
            <span className="text-[10px] font-semibold text-white tracking-wide">
              {deals.filter(d => d.isFlashDeal).length} Flash
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-4 flex-1 overflow-y-auto">
        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full flex-shrink-0">
          <TabsList className="grid w-full grid-cols-3 h-8 bg-gray-50/50 backdrop-blur-sm border-0">
            <TabsTrigger value="all" className="text-[11px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 rounded-lg transition-all duration-200">All</TabsTrigger>
            <TabsTrigger value="hotel" className="text-[11px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 rounded-lg transition-all duration-200">Hotels</TabsTrigger>
            <TabsTrigger value="activity" className="text-[11px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 rounded-lg transition-all duration-200">Activities</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Deals List */}
        <div className="space-y-4 pt-2 flex-1 overflow-y-auto">
          {filteredDeals.slice(0, 3).map((deal) => (
            <div key={deal.id} className="group cursor-pointer">
              <div className="bg-gray-50/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-50/50 transition-all duration-300 ease-out border border-gray-100/50">
                {/* Deal Image */}
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  
                  {/* Flash Deal Badge */}
                  {deal.isFlashDeal && (
                    <div className="absolute top-3 left-3">
                      <div className="px-2.5 py-1 rounded-full bg-red-500/90 backdrop-blur-sm">
                        <span className="text-[10px] font-semibold text-white tracking-wide flex items-center">
                          <Timer className="w-3 h-3 mr-1" />
                          Flash
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="px-2.5 py-1 rounded-full bg-green-500/90 backdrop-blur-sm">
                      <span className="text-[10px] font-semibold text-white tracking-wide flex items-center">
                        <Percent className="w-3 h-3 mr-1" />
                        {deal.discountPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(deal.id)
                    }}
                    className="absolute top-3 right-16 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm"
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 ${favorites.has(deal.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                    />
                  </button>

                  {/* Time Left for Flash Deals */}
                  {deal.isFlashDeal && deal.timeLeft && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-full text-center">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Ends: {formatTimeLeft(deal.timeLeft)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Deal Content */}
                <div className="p-4 space-y-3">
                  {/* Title and Category */}
                  <div>
                    <h3 className="font-semibold text-[13px] text-gray-900 line-clamp-2 mb-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                      {deal.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      {getCategoryIcon(deal.category)}
                      <span className="capitalize font-medium">{deal.category}</span>
                      <span className="text-gray-300">•</span>
                      <MapPin className="w-3 h-3" />
                      <span className="font-medium">{deal.location}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-bold text-green-600 tracking-tight">
                      {formatPrice(deal.discountedPrice)}
                    </span>
                    <span className="text-[12px] text-gray-400 line-through font-medium">
                      {formatPrice(deal.originalPrice)}
                    </span>
                  </div>

                  {/* Vendor Info */}
                  <div className="flex items-center gap-2">
                    <img
                      src={deal.vendor.image}
                      alt={deal.vendor.name}
                      className="w-6 h-6 rounded-full ring-1 ring-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-900 truncate">
                        {deal.vendor.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-[10px] text-gray-500 font-medium">
                          {deal.vendor.rating} ({deal.vendor.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5">
                    {deal.highlights.slice(0, 2).map((highlight, index) => (
                      <div key={index} className="px-2 py-1 rounded-full bg-blue-50/80 backdrop-blur-sm">
                        <span className="text-[10px] font-medium text-blue-700 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                      <span>{deal.soldCount} sold</span>
                      <span>{deal.maxQuantity - deal.soldCount} left</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${(deal.soldCount / deal.maxQuantity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="flex-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 border-0 h-8 rounded-xl transition-all duration-200">
                      <ExternalLink className="w-3 h-3 mr-1.5" />
                      View Deal
                    </Button>
                    <Button size="sm" variant="outline" className="text-[11px] font-semibold h-8 w-8 p-0 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-[11px] font-semibold h-8 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
          onClick={() => window.open('/deals', '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-2" />
          View All Deals
        </Button>
      </CardContent>
    </Card>
  )
}

export default EnhancedHotDealsWidget
