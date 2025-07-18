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
          description:
            "Experience paradise at our 5-star beachfront resort with all-inclusive dining, spa access, and private beach.",
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
          image: "/placeholder.svg?height=300&width=400",
          location: "Jomtien Beach",
          validUntil: "2024-01-20T23:59:59Z",
          soldCount: 89,
          maxQuantity: 150,
          highlights: ["Private Beach Access", "Spa Included", "All Meals", "Airport Transfer"],
          tags: ["luxury", "beachfront", "spa", "all-inclusive"],
          isFlashDeal: true,
          timeLeft: { hours: 23, minutes: 45, seconds: 30 },
        },
        {
          id: "2",
          title: "Authentic Thai Cooking Class + Market Tour",
          description:
            "Learn to cook traditional Thai dishes with a local chef, including market tour and recipe book.",
          originalPrice: 2500,
          discountedPrice: 1499,
          discountPercentage: 40,
          category: "activity",
          vendor: {
            name: "Thai Culinary Academy",
            rating: 4.9,
            reviewCount: 892,
            image: "/placeholder.svg?height=40&width=40",
          },
          image: "/placeholder.svg?height=300&width=400",
          location: "Central Pattaya",
          validUntil: "2024-01-25T23:59:59Z",
          soldCount: 156,
          maxQuantity: 200,
          highlights: ["Market Tour", "5 Dishes", "Recipe Book", "Certificate"],
          tags: ["cooking", "cultural", "authentic", "hands-on"],
          isFlashDeal: false,
        },
        {
          id: "3",
          title: "Premium Seafood Buffet at Ocean View",
          description:
            "All-you-can-eat premium seafood buffet with fresh lobster, crab, prawns, and international cuisine.",
          originalPrice: 1800,
          discountedPrice: 999,
          discountPercentage: 44,
          category: "restaurant",
          vendor: {
            name: "Ocean View Restaurant",
            rating: 4.6,
            reviewCount: 2341,
            image: "/placeholder.svg?height=40&width=40",
          },
          image: "/placeholder.svg?height=300&width=400",
          location: "Pattaya Beach Road",
          validUntil: "2024-01-18T23:59:59Z",
          soldCount: 234,
          maxQuantity: 300,
          highlights: ["Fresh Lobster", "Ocean View", "International Buffet", "Live Cooking"],
          tags: ["seafood", "buffet", "ocean-view", "premium"],
          isFlashDeal: true,
          timeLeft: { hours: 5, minutes: 23, seconds: 15 },
        },
        {
          id: "4",
          title: "Traditional Thai Massage & Spa Package",
          description: "2-hour relaxation package including traditional Thai massage, aromatherapy, and herbal steam.",
          originalPrice: 3200,
          discountedPrice: 1899,
          discountPercentage: 41,
          category: "spa",
          vendor: {
            name: "Serenity Spa Pattaya",
            rating: 4.7,
            reviewCount: 1567,
            image: "/placeholder.svg?height=40&width=40",
          },
          image: "/placeholder.svg?height=300&width=400",
          location: "Naklua",
          validUntil: "2024-01-22T23:59:59Z",
          soldCount: 78,
          maxQuantity: 120,
          highlights: ["2 Hours", "Thai Massage", "Aromatherapy", "Herbal Steam"],
          tags: ["spa", "massage", "relaxation", "traditional"],
          isFlashDeal: false,
        },
        {
          id: "5",
          title: "Sunset Catamaran Cruise with Dinner",
          description: "Romantic sunset cruise with live music, international buffet dinner, and unlimited drinks.",
          originalPrice: 2800,
          discountedPrice: 1699,
          discountPercentage: 39,
          category: "tour",
          vendor: {
            name: "Pattaya Cruise Co.",
            rating: 4.5,
            reviewCount: 934,
            image: "/placeholder.svg?height=40&width=40",
          },
          image: "/placeholder.svg?height=300&width=400",
          location: "Bali Hai Pier",
          validUntil: "2024-01-30T23:59:59Z",
          soldCount: 67,
          maxQuantity: 100,
          highlights: ["Sunset Views", "Live Music", "Buffet Dinner", "Unlimited Drinks"],
          tags: ["cruise", "sunset", "romantic", "dinner"],
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
          return { ...deal, timeLeft: undefined, isFlashDeal: false }
        }

        return {
          ...deal,
          timeLeft: { hours: newHours, minutes: newMinutes, seconds: newSeconds },
        }
      }),
    )
  }

  const categories = [
    { id: "all", label: "All Deals", icon: Zap },
    { id: "restaurant", label: "Dining", icon: DollarSign },
    { id: "hotel", label: "Hotels", icon: MapPin },
    { id: "activity", label: "Activities", icon: Calendar },
    { id: "spa", label: "Spa & Wellness", icon: Heart },
    { id: "tour", label: "Tours", icon: ExternalLink },
    { id: "nightlife", label: "Nightlife", icon: Users },
  ]

  const filteredDeals = activeCategory === "all" ? deals : deals.filter((deal) => deal.category === activeCategory)

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

  const formatTimeLeft = (timeLeft: { hours: number; minutes: number; seconds: number }) => {
    return `${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes.toString().padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.id === category)
    return categoryData?.icon || Zap
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-500" />
            Hot Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-500" />
            Hot Deals
            <Badge variant="destructive" className="ml-2 animate-pulse">
              Limited Time
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-4">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  <Icon className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4">
            {filteredDeals.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No deals available in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDeals.map((deal) => {
                  const Icon = getCategoryIcon(deal.category)
                  const soldPercentage = (deal.soldCount / deal.maxQuantity) * 100

                  return (
                    <Card
                      key={deal.id}
                      className={`relative overflow-hidden ${deal.isFlashDeal ? "ring-2 ring-red-500" : ""}`}
                    >
                      {deal.isFlashDeal && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge variant="destructive" className="animate-pulse">
                            <Timer className="w-3 h-3 mr-1" />
                            Flash Deal
                          </Badge>
                        </div>
                      )}

                      <div className="absolute top-2 right-2 z-10 flex space-x-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleFavorite(deal.id)}
                        >
                          <Heart className={`w-4 h-4 ${favorites.has(deal.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="relative h-48">
                        <Image src={deal.image || "/placeholder.svg"} alt={deal.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 text-white">
                          <div className="flex items-center space-x-1 text-sm">
                            <Icon className="w-4 h-4" />
                            <span className="capitalize">{deal.category}</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{deal.title}</h3>
                            <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-tight">{deal.description}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0">
                              <Image
                                src={deal.vendor.image || "/placeholder.svg"}
                                alt={deal.vendor.name}
                                width={24}
                                height={24}
                                className="rounded-full flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{deal.vendor.name}</p>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                  <span className="text-xs">{deal.vendor.rating}</span>
                                  <span className="text-xs text-gray-500">({deal.vendor.reviewCount})</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{deal.location}</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-green-600">
                                  ฿{deal.discountedPrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  ฿{deal.originalPrice.toLocaleString()}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                <Percent className="w-3 h-3 mr-1" />
                                {deal.discountPercentage}% OFF
                              </Badge>
                            </div>

                            {deal.timeLeft && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-red-600 font-medium">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  Ends in: {formatTimeLeft(deal.timeLeft)}
                                </span>
                              </div>
                            )}

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  {deal.soldCount} sold / {deal.maxQuantity} available
                                </span>
                                <span className="text-gray-600">{Math.round(soldPercentage)}%</span>
                              </div>
                              <Progress value={soldPercentage} className="h-2" />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {deal.highlights.slice(0, 3).map((highlight, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                          </div>

                          <Button className="w-full" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default EnhancedHotDealsWidget
