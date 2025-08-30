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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockDeals: Deal[] = [
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

      setDeals(mockDeals)
    } catch (error) {
      console.error("Failed to fetch deals:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
        return <MapPin className="w-4 h-4" />
      case "restaurant":
        return <DollarSign className="w-4 h-4" />
      case "activity":
        return <Zap className="w-4 h-4" />
      case "spa":
        return <Heart className="w-4 h-4" />
      case "tour":
        return <Calendar className="w-4 h-4" />
      case "nightlife":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const filteredDeals = activeCategory === "all" 
    ? deals 
    : deals.filter(deal => deal.category === activeCategory)

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Hot Deals</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span>Hot Deals</span>
          </div>
          <Badge variant="destructive" className="text-xs">
            {deals.filter(d => d.isFlashDeal).length} Flash Deals
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4 flex-1 overflow-y-auto widget-content">
        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full flex-shrink-0">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="hotel" className="text-xs">Hotels</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activities</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Deals List */}
        <div className="space-y-4 pt-2 flex-1 overflow-y-auto">
          {filteredDeals.slice(0, 3).map((deal) => (
            <div key={deal.id} className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
                {/* Deal Image */}
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Flash Deal Badge */}
                  {deal.isFlashDeal && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white text-xs animate-pulse">
                        <Timer className="w-3 h-3 mr-1" />
                        Flash Deal
                      </Badge>
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white text-xs">
                      <Percent className="w-3 h-3 mr-1" />
                      {deal.discountPercentage}% OFF
                    </Badge>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(deal.id)
                    }}
                    className="absolute top-2 right-12 p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.has(deal.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                    />
                  </button>

                  {/* Time Left for Flash Deals */}
                  {deal.isFlashDeal && deal.timeLeft && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded text-center">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Ends in: {formatTimeLeft(deal.timeLeft)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Deal Content */}
                <div className="p-3 space-y-3">
                  {/* Title and Category */}
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                      {deal.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {getCategoryIcon(deal.category)}
                      <span className="capitalize">{deal.category}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span>{deal.location}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(deal.discountedPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(deal.originalPrice)}
                    </span>
                  </div>

                  {/* Vendor Info */}
                  <div className="flex items-center gap-2">
                    <img
                      src={deal.vendor.image}
                      alt={deal.vendor.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {deal.vendor.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">
                          {deal.vendor.rating} ({deal.vendor.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1">
                    {deal.highlights.slice(0, 2).map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{deal.soldCount} sold</span>
                      <span>{deal.maxQuantity - deal.soldCount} left</span>
                    </div>
                    <Progress 
                      value={(deal.soldCount / deal.maxQuantity) * 100} 
                      className="h-1"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Deal
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
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
          className="w-full text-xs"
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
