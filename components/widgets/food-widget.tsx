"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useRestaurants, StrapiRestaurant } from "@/hooks/use-restaurants"
import { useBookings } from "@/hooks/use-bookings"
import { 
  Utensils, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChefHat, 
  Flame, 
  Heart, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  Eye,
  Coffee,
  Pizza,
  Cake,
  Apple,
  Sandwich,
  IceCream,
  Cookie,
  Wine,
  Beer,
  Grape
} from "lucide-react"

// Core types
export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  priceRange: string
  image: string
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  features: string[]
  discounts: {
    type: "fixed-price" | "time-based" | "all-you-can-eat"
    value: number
    originalPrice?: number
    timeSlots?: string[]
    packageName?: string
    maxBookings?: number
    currentBookings?: number
  }[]
  maxDailyBookings: number
  currentDailyBookings: number
  isAllYouCanEat: boolean
  topDiscount: number
  relevanceScore: number
  distance?: number
}

// Simple mock data with Pattaya coordinates
const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Seafood Paradise",
    cuisine: "Thai Seafood",
    rating: 4.8,
    priceRange: "moderate",
    image: "/seafood-restaurant-ocean-view.jpg",
    location: "Beach Road, Pattaya",
    coordinates: { lat: 12.9236, lng: 100.8825 },
    description:
      "Fresh seafood with stunning ocean views. Experience authentic Thai flavors with the freshest catch of the day. Our signature dishes include grilled sea bass and tom yum goong.",
    features: ["Ocean View", "Fresh Seafood", "Thai Cuisine", "Romantic Setting"],
    discounts: [
      { type: "time-based", value: 30, timeSlots: ["14:00-16:00", "21:00-22:00"], maxBookings: 20, currentBookings: 8 },
      { type: "fixed-price", value: 899, originalPrice: 1299, packageName: "Seafood Feast for 2", maxBookings: 15, currentBookings: 5 },
    ],
    maxDailyBookings: 50,
    currentDailyBookings: 23,
    isAllYouCanEat: false,
    topDiscount: 30,
    relevanceScore: 95,
  },
  {
    id: "2",
    name: "Thai Garden BBQ",
    cuisine: "Thai BBQ",
    rating: 4.6,
    priceRange: "budget",
    image: "/thai-garden-bbq-restaurant.jpg",
    location: "Central Pattaya",
    coordinates: { lat: 12.9276, lng: 100.8776 },
    description:
      "Traditional Thai BBQ in a beautiful garden setting. Perfect for groups and families. Unlimited grilled meats and fresh vegetables in our all-you-can-eat buffet.",
    features: ["Garden Setting", "BBQ Grill", "Family Friendly", "Group Dining"],
    discounts: [
      { type: "all-you-can-eat", value: 599, originalPrice: 899, packageName: "BBQ Buffet Unlimited", maxBookings: 30, currentBookings: 12 },
      { type: "time-based", value: 25, timeSlots: ["15:00-17:00"], maxBookings: 25, currentBookings: 8 },
    ],
    maxDailyBookings: 80,
    currentDailyBookings: 35,
    isAllYouCanEat: true,
    topDiscount: 33,
    relevanceScore: 88,
  },
  {
    id: "3",
    name: "Spice Route",
    cuisine: "Indian",
    rating: 4.7,
    priceRange: "moderate",
    image: "/indian-restaurant-spices.jpg",
    location: "Walking Street, Pattaya",
    coordinates: { lat: 12.9156, lng: 100.8706 },
    description:
      "Authentic Indian cuisine with aromatic spices and traditional recipes. Vegetarian and non-vegetarian options available.",
    features: ["Authentic Indian", "Vegetarian Options", "Spicy Food", "Traditional Recipes"],
    discounts: [{ type: "time-based", value: 20, timeSlots: ["12:00-14:00", "17:00-19:00"], maxBookings: 40, currentBookings: 15 }],
    maxDailyBookings: 60,
    currentDailyBookings: 28,
    isAllYouCanEat: false,
    topDiscount: 20,
    relevanceScore: 82,
  },
]

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Using Lucide icons directly - no need for custom components

const getCuisineFlag = (cuisine: string) => {
  const flags: { [key: string]: string } = {
    Japanese: "🇯🇵",
    Italian: "🇮🇹",
    Thai: "🇹🇭",
    Chinese: "🇨🇳",
    French: "🇫🇷",
    Indian: "🇮🇳",
    Mexican: "🇲🇽",
    Korean: "🇰🇷",
    Vietnamese: "🇻🇳",
    American: "🇺🇸",
    Mediterranean: "🇬🇷",
  }
  // Heuristic
  if (cuisine.toLowerCase().includes("thai")) return "🇹🇭"
  if (cuisine.toLowerCase().includes("indian")) return "🇮🇳"
  return flags[cuisine] || "🍽️"
}

const getPriceRangeStyle = (priceRange: string) => {
  switch (priceRange) {
    case "budget":
      return { backgroundColor: "#10b981", color: "white" }
    case "moderate":
      return { backgroundColor: "#f59e0b", color: "white" }
    case "expensive":
      return { backgroundColor: "#ef4444", color: "white" }
    case "luxury":
      return { backgroundColor: "#8b5cf6", color: "white" }
    default:
      return { backgroundColor: "#6b7280", color: "white" }
  }
}

const getPriceRangeDisplay = (priceRange: string) => {
  switch (priceRange) {
    case "budget":
      return "$"
    case "moderate":
      return "$$"
    case "expensive":
      return "$$$"
    case "luxury":
      return "$$$$"
    default:
      return "$$"
  }
}

function RestaurantCard({ restaurant, onBook }: { restaurant: Restaurant; onBook: (restaurant: Restaurant) => void }) {
  const available = restaurant.maxDailyBookings - restaurant.currentDailyBookings

  return (
    <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={restaurant.image || "/placeholder.svg"} 
          alt={restaurant.name} 
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
        />

        {/* Price Range Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white" style={getPriceRangeStyle(restaurant.priceRange)}>
          {getPriceRangeDisplay(restaurant.priceRange)}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-white shadow-sm">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current animate-pulse" />
            <span className="text-xs font-medium text-gray-700">{restaurant.rating}</span>
          </div>
        </div>

        {/* Discount Badge - Only color accent */}
        {restaurant.topDiscount > 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
            {restaurant.topDiscount}% OFF
          </div>
        )}
      </div>

      <CardContent className="p-3 relative">
        {/* Restaurant Name & Cuisine */}
        <div className="mb-2">
          <h3 className="font-semibold text-sm text-gray-900 truncate">{restaurant.name}</h3>
          <p className="text-xs text-gray-500 truncate">{restaurant.cuisine}</p>
          </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500 truncate flex-1">{restaurant.location}</span>
          {available <= 5 && (
            <Badge variant="destructive" className="text-xs px-1 py-0">
              {available} left
            </Badge>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.features.slice(0, 2).map((feature, i) => (
            <Badge key={i} variant="outline" className="text-xs px-1 py-0">
              {feature}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Eye className="w-3 h-3 mr-1 animate-pulse" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[100]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-purple-500" />
                  {restaurant.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="w-full h-56 object-cover rounded-xl" />
                <div className="flex items-center gap-2 text-sm">
                  <Badge style={getPriceRangeStyle(restaurant.priceRange)} className="text-white">
                    {getPriceRangeDisplay(restaurant.priceRange)}
                  </Badge>
                  <Badge variant="secondary">{restaurant.cuisine}</Badge>
                  <Badge variant="outline">⭐ {restaurant.rating}</Badge>
                </div>
                <div className="text-sm text-gray-600">{restaurant.description}</div>
                <div className="flex flex-wrap gap-2">
                  {restaurant.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {restaurant.discounts.map((discount, i) => (
                    <Badge key={i} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {discount.type === "time-based" ? `${discount.value}% OFF` : discount.type === "fixed-price" ? `฿${discount.value}` : "All You Can Eat"}
                    </Badge>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs shadow-lg hover:shadow-xl transition-all duration-300" 
            onClick={(e) => {
              e.stopPropagation()
              onBook(restaurant)
            }}
          >
            <Heart className="w-3 h-3 mr-1 animate-bounce" />
            Book Now
            <ArrowRight className="w-3 h-3 ml-1 animate-pulse" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface FoodWidgetProps {
  theme?: "primary" | "nightlife"
}

export function FoodWidget({ theme = "primary" }: FoodWidgetProps) {
  const { restaurants: strapiRestaurants, loading, error } = useRestaurants()
  const { createBooking } = useBookings()
  const [search, setSearch] = useState("")
  const [price, setPrice] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showExpandedModal, setShowExpandedModal] = useState(false)

  // Use Pattaya center for distance
  const userLocation = { lat: 12.9236, lng: 100.8825 }

  // Transform Strapi data to our Restaurant interface
  const restaurants: Restaurant[] = strapiRestaurants.map((strapiRestaurant) => ({
    id: strapiRestaurant.id.toString(),
    name: strapiRestaurant.name,
    cuisine: strapiRestaurant.cuisine,
    rating: strapiRestaurant.rating,
    priceRange: strapiRestaurant.priceRange,
    image: strapiRestaurant.image?.data?.attributes?.url || "/placeholder.svg",
    location: strapiRestaurant.location,
    coordinates: {
      lat: strapiRestaurant.latitude,
      lng: strapiRestaurant.longitude,
    },
    description: strapiRestaurant.description,
    features: strapiRestaurant.features || [],
    discounts: strapiRestaurant.discounts || [],
    maxDailyBookings: strapiRestaurant.maxDailyBookings,
    currentDailyBookings: strapiRestaurant.currentDailyBookings,
    isAllYouCanEat: strapiRestaurant.isAllYouCanEat,
    topDiscount: strapiRestaurant.topDiscount,
    relevanceScore: strapiRestaurant.relevanceScore,
  }))

  const handleBook = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setShowBookingModal(true)
  }

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      await createBooking({
        restaurant: parseInt(selectedRestaurant?.id || "1"),
        customer_name: bookingData.name,
        customer_email: bookingData.email,
        customer_phone: bookingData.phone,
        booking_date_time: bookingData.dateTime,
        quantity: bookingData.guests,
        notes: bookingData.specialRequests,
      })
      setShowBookingModal(false)
      setSelectedRestaurant(null)
    } catch (error) {
      console.error("Booking failed:", error)
    }
  }

  const filtered = useMemo(() => {
    const withDistance = restaurants.map((r) => ({
      ...r,
      distance: calculateDistance(userLocation.lat, userLocation.lng, r.coordinates.lat, r.coordinates.lng),
    }))

    return withDistance
      .filter((r) =>
        search
          ? r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(search.toLowerCase()) ||
            r.location.toLowerCase().includes(search.toLowerCase())
          : true,
      )
      .filter((r) => (price === "all" ? true : r.priceRange === price))
      .sort((a, b) => a.distance! - b.distance!)
  }, [restaurants, search, price])

  useEffect(() => {
    console.log("[FoodWidget] mounted; theme:", theme)
  }, [theme])

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-2">Failed to load restaurants</p>
          <p className="text-sm text-gray-500">Using offline data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Main Widget - Clickable to expand */}
      <div 
        className="h-full flex flex-col bg-white rounded-xl overflow-hidden relative shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-300"
        onClick={() => setShowExpandedModal(true)}
      >
      {/* Animated Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Lucide icons with various effects */}
        <Utensils className="absolute top-4 left-4 w-8 h-8 text-gray-100 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <ChefHat className="absolute bottom-8 right-8 w-6 h-6 text-gray-100 animate-pulse" style={{ animationDelay: '1s', animationDuration: '2s' }} />
        <Star className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-gray-100 animate-ping" style={{ animationDelay: '2s', animationDuration: '4s' }} />
        <Heart className="absolute top-8 right-4 w-6 h-6 text-gray-100 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
        <Sparkles className="absolute bottom-4 left-8 w-5 h-5 text-gray-100 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
        <Flame className="absolute top-1/4 right-1/4 w-4 h-4 text-gray-100 animate-ping" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }} />
      </div>

      {/* Enhanced Header with Food Icons Background */}
      <div className="relative p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
        {/* Animated Food Icons Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Pizza className="absolute top-2 left-8 w-5 h-5 text-purple-200 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
          <Coffee className="absolute top-1 right-12 w-4 h-4 text-purple-300 animate-pulse" style={{ animationDelay: '1s', animationDuration: '2.5s' }} />
          <Cake className="absolute bottom-2 left-4 w-6 h-6 text-pink-200 animate-ping" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
          <Apple className="absolute top-4 right-4 w-4 h-4 text-red-200 animate-bounce" style={{ animationDelay: '2s', animationDuration: '2.8s' }} />
          <Sandwich className="absolute bottom-3 right-8 w-5 h-5 text-orange-200 animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '3.2s' }} />
          <IceCream className="absolute top-3 left-12 w-4 h-4 text-blue-200 animate-ping" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }} />
          <Cookie className="absolute bottom-4 left-16 w-3 h-3 text-yellow-200 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2.2s' }} />
          <Wine className="absolute top-2 right-20 w-4 h-4 text-purple-300 animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '3.5s' }} />
          <Beer className="absolute bottom-2 right-16 w-4 h-4 text-amber-200 animate-ping" style={{ animationDelay: '0.3s', animationDuration: '2.8s' }} />
          <Grape className="absolute top-5 left-20 w-3 h-3 text-green-200 animate-bounce" style={{ animationDelay: '2.2s', animationDuration: '3.1s' }} />
          <ChefHat className="absolute bottom-1 left-24 w-5 h-5 text-gray-300 animate-pulse" style={{ animationDelay: '1.7s', animationDuration: '4.2s' }} />
          <Utensils className="absolute top-1 left-28 w-4 h-4 text-purple-200 animate-ping" style={{ animationDelay: '0.7s', animationDuration: '3.3s' }} />
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Main Accent Icon with Enhanced Animation */}
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md relative z-10">
              <Utensils className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="relative z-10">
              <h2 className="text-lg font-semibold text-gray-900">
                Dining
              </h2>
              <p className="text-xs text-gray-500">Discover restaurants</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 relative z-10">
            Live
          </Badge>
        </div>
      </div>

      {/* Unified Controls in One Line */}
      <div className="p-4 border-b border-gray-100 bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-pulse" />
            <Input 
              placeholder="Search restaurants..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Price Filter */}
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger 
              className="w-32 bg-gray-50 border-gray-200 focus:border-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="budget">$ Budget</SelectItem>
              <SelectItem value="moderate">$$ Moderate</SelectItem>
              <SelectItem value="expensive">$$$ Expensive</SelectItem>
              <SelectItem value="luxury">$$$$ Luxury</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Mode Buttons */}
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation()
              setViewMode("grid")
            }}
            className="px-3"
          >
            <Grid3X3 className="w-4 h-4 animate-pulse" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation()
              setViewMode("list")
            }}
            className="px-3"
          >
            <List className="w-4 h-4 animate-bounce" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content - Properly Fixed */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="p-4 pb-6" onClick={(e) => e.stopPropagation()}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 mb-4 border border-gray-200">
              <TabsTrigger value="all" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Utensils className="w-3 h-3 mr-1 animate-spin" style={{ animationDuration: '6s' }} />
                All
              </TabsTrigger>
              <TabsTrigger value="time" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Clock className="w-3 h-3 mr-1 animate-pulse" />
                Deals
              </TabsTrigger>
              <TabsTrigger value="ayce" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <TrendingUp className="w-3 h-3 mr-1 animate-bounce" />
                Buffet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className={cn(
                "gap-3", 
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2" 
                  : "space-y-3"
              )}> 
                {filtered.map((r, index) => (
                  <div 
                    key={r.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <RestaurantCard restaurant={r} onBook={handleBook} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="time" className="mt-0">
              <div className={cn(
                "gap-3", 
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2" 
                  : "space-y-3"
              )}>
                {filtered
                  .filter((r) => r.discounts.some((d) => d.type === "time-based"))
                  .map((r, index) => (
                    <div 
                      key={r.id} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <RestaurantCard restaurant={r} onBook={handleBook} />
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="ayce" className="mt-0">
              <div className={cn(
                "gap-3", 
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2" 
                  : "space-y-3"
              )}>
                {filtered
                  .filter((r) => r.isAllYouCanEat)
                  .map((r, index) => (
                    <div 
                      key={r.id} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <RestaurantCard restaurant={r} onBook={handleBook} />
                    </div>
                  ))}
          </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>

      {/* Expanded Modal */}
      {showExpandedModal && (
        <Dialog open={showExpandedModal} onOpenChange={setShowExpandedModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden z-[100]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Utensils className="w-6 h-6 text-purple-500 animate-spin" style={{ animationDuration: '4s' }} />
                Pattaya Dining - Full View
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Expanded widget content */}
              <div className="space-y-4">
                {/* Unified Controls */}
                <div className="flex gap-2 items-center p-4 bg-gray-50 rounded-lg" onClick={(e) => e.stopPropagation()}>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-pulse" />
                    <Input 
                      placeholder="Search restaurants..." 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <Select value={price} onValueChange={setPrice}>
                    <SelectTrigger 
                      className="w-40"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="budget">$ Budget</SelectItem>
                      <SelectItem value="moderate">$$ Moderate</SelectItem>
                      <SelectItem value="expensive">$$$ Expensive</SelectItem>
                      <SelectItem value="luxury">$$$$ Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant={viewMode === "grid" ? "default" : "outline"} 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setViewMode("grid")
                    }}
                  >
                    <Grid3X3 className="w-4 h-4 animate-pulse" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "default" : "outline"} 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setViewMode("list")
                    }}
                  >
                    <List className="w-4 h-4 animate-bounce" />
                  </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full" onClick={(e) => e.stopPropagation()}>
          <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                      <Utensils className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '6s' }} />
                      All Restaurants
                    </TabsTrigger>
                    <TabsTrigger value="time" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                      <Clock className="w-4 h-4 mr-2 animate-pulse" />
                      Time-Based Deals
                    </TabsTrigger>
                    <TabsTrigger value="ayce" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                      <TrendingUp className="w-4 h-4 mr-2 animate-bounce" />
                      All You Can Eat
                    </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
                    <div className={cn(
                      "gap-4", 
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                        : "space-y-4"
                    )}>
                      {filtered.map((r, index) => (
                        <div 
                          key={r.id} 
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <RestaurantCard restaurant={r} onBook={handleBook} />
                        </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="time" className="mt-4">
                    <div className={cn(
                      "gap-4", 
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                        : "space-y-4"
                    )}>
              {filtered
                        .filter((r) => r.discounts.some(d => d.type === "time-based"))
                        .map((r, index) => (
                          <div 
                            key={r.id} 
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <RestaurantCard restaurant={r} onBook={handleBook} />
                          </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="ayce" className="mt-4">
                    <div className={cn(
                      "gap-4", 
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                        : "space-y-4"
                    )}>
              {filtered
                .filter((r) => r.isAllYouCanEat)
                        .map((r, index) => (
                          <div 
                            key={r.id} 
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <RestaurantCard restaurant={r} onBook={handleBook} />
                          </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Simple Booking Modal */}
      {showBookingModal && selectedRestaurant && (
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-w-md z-[100]">
            <DialogHeader>
              <DialogTitle>Book a Table at {selectedRestaurant.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>Cuisine:</strong> {selectedRestaurant.cuisine}</p>
                <p><strong>Location:</strong> {selectedRestaurant.location}</p>
                <p><strong>Rating:</strong> ⭐ {selectedRestaurant.rating}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Booking functionality is connected to Strapi backend.
                  <br />
                  Complete booking form would be implemented here.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowBookingModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // Simulate booking submission
                    handleBookingSubmit({
                      name: "Demo User",
                      email: "demo@example.com",
                      phone: "+66 123 456 789",
                      dateTime: new Date().toISOString(),
                      guests: 2,
                      specialRequests: "Demo booking"
                    })
                  }}>
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default FoodWidget
