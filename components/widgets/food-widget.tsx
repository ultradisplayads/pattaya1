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

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

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
    <Card className="bg-card border-border hover:shadow-md transition-shadow group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="w-full h-40 object-cover" />

        <div className="absolute top-2 left-2 rounded-full px-3 py-1 font-bold text-sm shadow-lg" style={getPriceRangeStyle(restaurant.priceRange)}>
          {getPriceRangeDisplay(restaurant.priceRange)}
        </div>

        <div className="absolute top-2 right-2 px-2 py-1 rounded shadow-lg flex items-center gap-1" style={{ backgroundColor: "#1e40af", color: "white" }}>
          <StarIcon className="h-3 w-3 text-yellow-300" />
          <span className="text-xs font-medium">{restaurant.rating}</span>
        </div>

        <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg shadow-lg max-w-[65%]" style={{ backgroundColor: "#2563eb", color: "white" }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCuisineFlag(restaurant.cuisine)}</span>
            <h3 className="font-bold text-sm truncate">{restaurant.name}</h3>
          </div>
        </div>

        {restaurant.distance !== undefined && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded shadow-lg" style={{ backgroundColor: "#059669", color: "white" }}>
            <span className="text-xs font-medium">{restaurant.distance.toFixed(1)}km</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="h-3 w-3" />
            <span className="truncate max-w-[180px]">{restaurant.location}</span>
          </div>
          {available <= 5 && (
            <Badge variant="destructive" className="text-xs">
              {available} left
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>

        <div className="flex flex-wrap gap-1 mt-3">
          {restaurant.features.slice(0, 3).map((f, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {f}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">{restaurant.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="w-full h-56 object-cover rounded" />
                <div className="flex items-center gap-2 text-sm">
                  <Badge style={getPriceRangeStyle(restaurant.priceRange)} className="text-white">
                    {getPriceRangeDisplay(restaurant.priceRange)}
                  </Badge>
                  <Badge variant="secondary">{restaurant.cuisine}</Badge>
                  <Badge variant="outline">⭐ {restaurant.rating}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{restaurant.description}</div>
                <div className="flex flex-wrap gap-1">
                  {restaurant.features.map((f, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {restaurant.discounts.map((d, i) => (
                    <Badge key={i} className="bg-blue-600 text-white">
                      {d.type === "time-based" ? `${d.value}% OFF` : d.type === "fixed-price" ? `฿${d.value}` : "All You Can Eat"}
                    </Badge>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="flex-1 btn-book-now" onClick={() => onBook(restaurant)}>
            Book Now
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
    <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="text-[15px] font-medium text-gray-900">Pattaya Dining</span>
          </div>
          <Badge className="bg-blue-500/10 text-blue-600 text-[11px] px-2 py-0.5 font-medium border border-blue-200 rounded-full">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Search restaurants or cuisines..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="budget">$</SelectItem>
              <SelectItem value="moderate">$$</SelectItem>
              <SelectItem value="expensive">$$$</SelectItem>
              <SelectItem value="luxury">$$$$</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>Grid</Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>List</Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="time">Time Deals</TabsTrigger>
            <TabsTrigger value="ayce">All You Can Eat</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className={cn("gap-4", viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-4")}> 
              {filtered.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} onBook={handleBook} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="time" className="mt-4">
            <div className={cn("gap-4", viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-4")}>
              {filtered
                .filter((r) => r.discounts.some((d) => d.type === "time-based"))
                .map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} onBook={handleBook} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="ayce" className="mt-4">
            <div className={cn("gap-4", viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-4")}>
              {filtered
                .filter((r) => r.isAllYouCanEat)
                .map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} onBook={handleBook} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Simple Booking Modal */}
      {showBookingModal && selectedRestaurant && (
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-w-md">
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
    </Card>
  )
}

export default FoodWidget
