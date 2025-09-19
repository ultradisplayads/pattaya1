"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
  Grape,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  X,
  CheckCircle,
  Loader2
} from "lucide-react"

// Core types (keeping original structure)
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

// Helper Functions
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

const getPriceRangeStyle = (priceRange: string) => {
  switch (priceRange) {
    case "budget": return "bg-emerald-500 text-white"
    case "moderate": return "bg-amber-500 text-white"
    case "expensive": return "bg-red-500 text-white"
    case "luxury": return "bg-purple-600 text-white"
    default: return "bg-gray-500 text-white"
  }
}

const getPriceRangeDisplay = (priceRange: string) => {
  switch (priceRange) {
    case "budget": return "$"
    case "moderate": return "$$"
    case "expensive": return "$$$"
    case "luxury": return "$$$$"
    default: return "$$"
  }
}

// Redesigned Restaurant Card Component
function ModernRestaurantCard({ restaurant, onBook }: { restaurant: Restaurant; onBook: (restaurant: Restaurant) => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const available = restaurant.maxDailyBookings - restaurant.currentDailyBookings

  return (
    <Card 
      className="group overflow-hidden bg-white/95 backdrop-blur-xl border border-purple-100/50 shadow-xl hover:shadow-2xl transition-all duration-700 relative rounded-2xl hover:border-purple-200/70 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/8 group-hover:via-pink-500/8 group-hover:to-blue-500/8 transition-all duration-700 rounded-2xl" />
      
      {/* Modern Hero Image Section */}
      <div className="relative overflow-hidden h-32 rounded-t-2xl">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 animate-pulse">
            <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
          </div>
        )}
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Top badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={cn("text-xs font-semibold shadow-lg px-2 py-1 rounded-full border border-white/20", getPriceRangeStyle(restaurant.priceRange))}>
            {getPriceRangeDisplay(restaurant.priceRange)}
          </Badge>
          {available <= 5 && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold shadow-lg animate-pulse px-2 py-1 rounded-full border border-white/20">
              {available} left
            </Badge>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-white/30">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-bold text-gray-800">{restaurant.rating}</span>
          </div>
        </div>

        {/* Discount badge */}
        {restaurant.topDiscount > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-xs font-bold shadow-lg animate-bounce px-2 py-1 rounded-full border border-white/20">
              <Flame className="w-3 h-3 mr-1" />
              {restaurant.topDiscount}% OFF
            </Badge>
          </div>
        )}

        {/* Location */}
        <div className="absolute bottom-2 right-2">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs border border-white/20">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-20 font-medium">{restaurant.location.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {/* Modern Content Section */}
      <CardContent className="p-4 relative">
        <div className="space-y-3">
          {/* Title and cuisine */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-1">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-purple-500" />
              {restaurant.cuisine}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5">
            {restaurant.features.slice(0, 2).map((feature, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="text-xs px-2 py-1 bg-purple-50/80 border-purple-200/50 hover:bg-purple-100 hover:border-purple-300 transition-colors duration-300 rounded-full"
              >
                {feature}
              </Badge>
            ))}
            {restaurant.features.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50/80 border-gray-200/50 rounded-full">
                +{restaurant.features.length - 2} more
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-9 text-sm group/btn border-purple-200/50 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-purple-500" />
                    {restaurant.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-56 object-cover rounded-xl" />
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className={getPriceRangeStyle(restaurant.priceRange)}>
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
                        {discount.type === "time-based" ? `${discount.value}% OFF` : 
                         discount.type === "fixed-price" ? `฿${discount.value}` : "All You Can Eat"}
                      </Badge>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              size="sm" 
              className="flex-1 h-9 text-sm bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group/btn rounded-xl"
              onClick={(e) => {
                e.stopPropagation()
                onBook(restaurant)
              }}
            >
              <Heart className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
              Book Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Booking Form Component
function BookingForm({ restaurant, onSubmit, onCancel }: { 
  restaurant: Restaurant; 
  onSubmit: (data: any) => void; 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dateTime = `${formData.date}T${formData.time}:00.000Z`
    onSubmit({
      ...formData,
      dateTime,
      guests: parseInt(formData.guests)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        <h3 className="font-semibold text-lg">{restaurant.name}</h3>
        <p className="text-sm text-gray-600">{restaurant.cuisine} • {restaurant.location}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="font-medium">{restaurant.rating}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Full Name
          </label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Your name"
            className="bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email
          </label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="your@email.com"
            className="bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone
          </label>
          <Input
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+66 123 456 789"
            className="bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Guests
          </label>
          <Select value={formData.guests} onValueChange={(value) => setFormData({...formData, guests: value})}>
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8].map(num => (
                <SelectItem key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date
          </label>
          <Input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            className="bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Time
          </label>
          <Input
            type="time"
            required
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            className="bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <MessageSquare className="w-4 h-4 inline mr-1" />
          Special Requests (Optional)
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
          placeholder="Any dietary restrictions or special occasions..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-purple-300 focus:outline-none resize-none"
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Confirm Booking
        </Button>
      </div>
    </form>
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
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Use Pattaya center for distance
  const userLocation = { lat: 12.9236, lng: 100.8825 }

  const restaurants: Restaurant[] = useMemo(() => {
    return (strapiRestaurants || []).map((strapiRestaurant: StrapiRestaurant) => ({
      id: strapiRestaurant.id.toString(),
      name: strapiRestaurant.name,
      cuisine: strapiRestaurant.cuisine,
      rating: strapiRestaurant.rating,
      priceRange: strapiRestaurant.priceRange,
      // Using Unsplash for better aesthetics, fallback to Strapi URL
      image:  strapiRestaurant.image?.data?.attributes?.url || "/placeholder.svg",
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
  }, [strapiRestaurants])

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
      
      setBookingSuccess(true)
      setTimeout(() => {
        setShowBookingModal(false)
        setSelectedRestaurant(null)
        setBookingSuccess(false)
      }, 2000)
    } catch (bookingError) {
      console.error("Booking failed:", bookingError)
      // You could set an error state here to show in the UI
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
  }, [restaurants, search, price, userLocation.lat, userLocation.lng])

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-xl border-0 shadow-2xl h-full flex items-center justify-center rounded-3xl">
        <CardContent className="p-8 text-center flex flex-col justify-center items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-purple-300 border-t-transparent opacity-20"></div>
          </div>
          <p className="text-gray-600 font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading delicious options...
          </p>
          <div className="mt-2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-xl border-0 shadow-2xl h-full flex items-center justify-center rounded-3xl">
        <CardContent className="p-8 text-center flex flex-col justify-center items-center">
          <div className="relative mb-4">
            <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
              <Utensils className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-md opacity-30 animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 font-medium mb-4">Unable to load restaurant data</p>
          <p className="text-sm text-gray-500 mb-4">{error.toString()}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl px-6 py-2"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Main Widget */}
      <div 
        className={`
          h-full flex flex-col
          bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30
          backdrop-blur-xl rounded-3xl overflow-hidden
          shadow-2xl border border-white/40 cursor-pointer group
          transition-all duration-700 ease-out
          hover:shadow-3xl hover:scale-[1.02] hover:border-purple-200/60
          relative
        `}
        onClick={() => setShowExpandedModal(true)}
      >
        {/* Enhanced Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/10 via-pink-200/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-200/10 via-purple-200/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-pink-200/5 to-purple-200/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}} />
          
          {/* Floating icons with enhanced animations */}
          <div className="absolute top-4 left-8 w-6 h-6 text-purple-200/30 animate-float" style={{animationDelay: '0s'}}>
            <Sparkles className="w-full h-full animate-pulse" />
          </div>
          <div className="absolute bottom-8 right-12 w-5 h-5 text-pink-200/30 animate-float" style={{animationDelay: '1s'}}>
            <Heart className="w-full h-full animate-pulse" />
          </div>
          <div className="absolute top-1/3 right-8 w-4 h-4 text-purple-300/30 animate-float" style={{animationDelay: '2s'}}>
            <Star className="w-full h-full animate-pulse" />
          </div>
        </div>

        {/* Enhanced Header */}
        <div className="relative p-4 border-b border-white/20 bg-gradient-to-r from-white/60 via-purple-50/40 to-pink-50/40 backdrop-blur-md overflow-hidden">
          {/* Floating gradient orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}} />
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                  <Utensils className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-500" />
                </div>
                {/* Status indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-md" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
                  Pattaya Dining
                </h2>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                  Discover culinary experiences
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-white px-3 py-1 text-sm font-medium shadow-lg animate-pulse border border-white/30 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
              Live
            </Badge>
          </div>
        </div>

        {/* Combined Controls and Tabs */}
        <div className="p-3 border-b border-white/20 bg-gradient-to-r from-white/40 to-purple-50/30 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-2 items-center mb-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-purple-400 group-hover:text-purple-600 transition-colors duration-300" />
              <Input 
                placeholder="Search restaurants..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-7 h-7 text-xs bg-white/80 backdrop-blur-sm border-purple-200/50 focus:bg-white focus:border-purple-400 focus:ring-1 focus:ring-purple-200/50 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger 
                className="w-20 h-7 text-xs bg-white/80 backdrop-blur-sm border-purple-200/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-200/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-purple-200/50 rounded-lg shadow-lg">
                <SelectItem value="all" className="hover:bg-purple-50 text-xs">All</SelectItem>
                <SelectItem value="budget" className="hover:bg-purple-50 text-xs">$</SelectItem>
                <SelectItem value="moderate" className="hover:bg-purple-50 text-xs">$$</SelectItem>
                <SelectItem value="expensive" className="hover:bg-purple-50 text-xs">$$$</SelectItem>
                <SelectItem value="luxury" className="hover:bg-purple-50 text-xs">$$$$</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-1">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  setViewMode("grid")
                }}
                className={cn(
                  "h-7 w-7 p-0 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md",
                  viewMode === "grid" 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md" 
                    : "hover:bg-purple-50 hover:border-purple-300"
                )}
              >
                <Grid3X3 className={cn("w-3 h-3", viewMode === "grid" && "animate-pulse")} />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  setViewMode("list")
                }}
                className={cn(
                  "h-7 w-7 p-0 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md",
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md" 
                    : "hover:bg-purple-50 hover:border-purple-300"
                )}
              >
                <List className={cn("w-3 h-3", viewMode === "list" && "animate-pulse")} />
              </Button>
            </div>
          </div>
          
        </div>

        {/* Enhanced Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-white/30 to-purple-50/20 backdrop-blur-sm min-h-0">
          <div className="p-3 pb-16" onClick={(e) => e.stopPropagation()}>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-md mb-4 rounded-lg border border-purple-200/50 shadow-sm p-0.5">
                <TabsTrigger 
                  value="all" 
                  className="text-xs font-medium rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 data-[state=active]:scale-105 hover:bg-purple-50"
                >
                  <Utensils className="w-3 h-3 mr-1" />
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="time" 
                  className="text-xs font-medium rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 data-[state=active]:scale-105 hover:bg-purple-50"
                >
                  <Clock className="w-3 h-3 mr-1 animate-pulse" />
                  Deals
                </TabsTrigger>
                <TabsTrigger 
                  value="ayce" 
                  className="text-xs font-medium rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 data-[state=active]:scale-105 hover:bg-purple-50"
                >
                  <TrendingUp className="w-3 h-3 mr-1 animate-bounce" />
                  Buffet
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-0">
                <div className={cn(
                  "gap-3", 
                  viewMode === "grid" 
                    ? "grid grid-cols-2" 
                    : "space-y-3"
                )}> 
                  {filtered.slice(0, 6).map((r, index) => (
                    <div 
                      key={r.id} 
                      className="opacity-0 animate-fade-in-up transform hover:scale-105 transition-all duration-300"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <ModernRestaurantCard restaurant={r} onBook={handleBook} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="time" className="mt-0">
                <div className={cn(
                  "gap-3", 
                  viewMode === "grid" 
                    ? "grid grid-cols-2" 
                    : "space-y-3"
                )}>
                  {filtered
                    .filter((r) => r.discounts.some((d) => d.type === "time-based"))
                    .slice(0, 6)
                    .map((r, index) => (
                      <div 
                        key={r.id} 
                        className="opacity-0 animate-fade-in-up transform hover:scale-105 transition-all duration-300"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <ModernRestaurantCard restaurant={r} onBook={handleBook} />
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="ayce" className="mt-0">
                <div className={cn(
                  "gap-3", 
                  viewMode === "grid" 
                    ? "grid grid-cols-2" 
                    : "space-y-3"
                )}>
                  {filtered
                    .filter((r) => r.isAllYouCanEat)
                    .slice(0, 6)
                    .map((r, index) => (
                      <div 
                        key={r.id} 
                        className="opacity-0 animate-fade-in-up transform hover:scale-105 transition-all duration-300"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <ModernRestaurantCard restaurant={r} onBook={handleBook} />
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
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 backdrop-blur-xl border-0 shadow-2xl">
            <div className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-sm">
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Pattaya Dining - Full Experience
                </span>
              </DialogTitle>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6" style={{ maxHeight: 'calc(95vh - 80px)' }}>
              {/* Enhanced Controls for Expanded View */}
              <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Search restaurants..." 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-white/80 backdrop-blur-sm border focus:bg-white focus:border-purple-300 rounded-xl"
                    />
                  </div>
                  
                  <Select value={price} onValueChange={setPrice}>
                    <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-black/40 focus:border-purple-300 rounded-xl">
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
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === "grid" ? "default" : "outline"} 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        setViewMode("grid")
                      }}
                      className="rounded-xl"
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Grid
                    </Button>
                    <Button 
                      variant={viewMode === "list" ? "default" : "outline"} 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        setViewMode("list")
                      }}
                      className="rounded-xl"
                    >
                      <List className="w-4 h-4 mr-2" />
                      List
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Tabs for Expanded View */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm mb-6 rounded-xl border border-white/40">
                  <TabsTrigger 
                    value="all" 
                    className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <Utensils className="w-4 h-4 mr-2" />
                    All Restaurants
                  </TabsTrigger>
                  <TabsTrigger 
                    value="time" 
                    className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Time-Based Deals
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ayce" 
                    className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    All You Can Eat
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className={cn(
                    "gap-6", 
                    viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                      : "space-y-6"
                  )}>
                    {filtered.map((r, index) => (
                      <div 
                        key={r.id} 
                        className="opacity-0 animate-fade-in-up transform hover:scale-105 transition-all duration-300"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <ModernRestaurantCard restaurant={r} onBook={handleBook} />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="time" className="mt-0">
                  <div className={cn(
                    "gap-6", 
                    viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                      : "space-y-6"
                  )}>
                    {filtered
                      .filter((r) => r.discounts.some(d => d.type === "time-based"))
                      .map((r, index) => (
                        <div 
                          key={r.id} 
                          className="opacity-0 animate-fade-in-up"
                          style={{ 
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: 'forwards'
                          }}
                        >
                          <ModernRestaurantCard restaurant={r} onBook={handleBook} />
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="ayce" className="mt-0">
                  <div className={cn(
                    "gap-6", 
                    viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                      : "space-y-6"
                  )}>
                    {filtered
                      .filter((r) => r.isAllYouCanEat)
                      .map((r, index) => (
                        <div 
                          key={r.id} 
                          className="opacity-0 animate-fade-in-up"
                          style={{ 
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: 'forwards'
                          }}
                        >
                          <ModernRestaurantCard restaurant={r} onBook={handleBook} />
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Enhanced Booking Modal */}
      {showBookingModal && selectedRestaurant && (
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-w-md bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-xl border-0 shadow-2xl">
            {bookingSuccess ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your table has been reserved at {selectedRestaurant.name}</p>
              </div>
            ) : (
              <>
                <DialogHeader className="text-center pb-4">
                  <DialogTitle className="text-xl flex items-center justify-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    Reserve Your Table
                  </DialogTitle>
                </DialogHeader>
                <BookingForm 
                  restaurant={selectedRestaurant}
                  onSubmit={handleBookingSubmit}
                  onCancel={() => setShowBookingModal(false)}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.6); }
        }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        .glass-morphism {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-border {
          position: relative;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(45deg, #8b5cf6, #ec4899, #8b5cf6) border-box;
          border: 2px solid transparent;
        }
        
        /* Smooth scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </>
  )
}

export default FoodWidget;

// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { cn } from "@/lib/utils"
// import { useRestaurants, StrapiRestaurant } from "@/hooks/use-restaurants"
// import { useBookings } from "@/hooks/use-bookings"
// import { 
//   Utensils, 
//   Star, 
//   MapPin, 
//   Clock, 
//   Users, 
//   Search, 
//   Filter, 
//   Grid3X3, 
//   List, 
//   ChefHat, 
//   Flame, 
//   Heart, 
//   TrendingUp,
//   ArrowRight,
//   Sparkles,
//   Zap,
//   Crown,
//   Eye,
//   Coffee,
//   Pizza,
//   Cake,
//   Apple,
//   Sandwich,
//   IceCream,
//   Cookie,
//   Wine,
//   Beer,
//   Grape
// } from "lucide-react"

// // Core types
// export interface Restaurant {
//   id: string
//   name: string
//   cuisine: string
//   rating: number
//   priceRange: string
//   image: string
//   location: string
//   coordinates: { lat: number; lng: number }
//   description: string
//   features: string[]
//   discounts: {
//     type: "fixed-price" | "time-based" | "all-you-can-eat"
//     value: number
//     originalPrice?: number
//     timeSlots?: string[]
//     packageName?: string
//     maxBookings?: number
//     currentBookings?: number
//   }[]
//   maxDailyBookings: number
//   currentDailyBookings: number
//   isAllYouCanEat: boolean
//   topDiscount: number
//   relevanceScore: number
//   distance?: number
// }

// // Simple mock data with Pattaya coordinates
// const mockRestaurants: Restaurant[] = [
//   {
//     id: "1",
//     name: "Seafood Paradise",
//     cuisine: "Thai Seafood",
//     rating: 4.8,
//     priceRange: "moderate",
//     image: "/seafood-restaurant-ocean-view.jpg",
//     location: "Beach Road, Pattaya",
//     coordinates: { lat: 12.9236, lng: 100.8825 },
//     description:
//       "Fresh seafood with stunning ocean views. Experience authentic Thai flavors with the freshest catch of the day. Our signature dishes include grilled sea bass and tom yum goong.",
//     features: ["Ocean View", "Fresh Seafood", "Thai Cuisine", "Romantic Setting"],
//     discounts: [
//       { type: "time-based", value: 30, timeSlots: ["14:00-16:00", "21:00-22:00"], maxBookings: 20, currentBookings: 8 },
//       { type: "fixed-price", value: 899, originalPrice: 1299, packageName: "Seafood Feast for 2", maxBookings: 15, currentBookings: 5 },
//     ],
//     maxDailyBookings: 50,
//     currentDailyBookings: 23,
//     isAllYouCanEat: false,
//     topDiscount: 30,
//     relevanceScore: 95,
//   },
//   {
//     id: "2",
//     name: "Thai Garden BBQ",
//     cuisine: "Thai BBQ",
//     rating: 4.6,
//     priceRange: "budget",
//     image: "/thai-garden-bbq-restaurant.jpg",
//     location: "Central Pattaya",
//     coordinates: { lat: 12.9276, lng: 100.8776 },
//     description:
//       "Traditional Thai BBQ in a beautiful garden setting. Perfect for groups and families. Unlimited grilled meats and fresh vegetables in our all-you-can-eat buffet.",
//     features: ["Garden Setting", "BBQ Grill", "Family Friendly", "Group Dining"],
//     discounts: [
//       { type: "all-you-can-eat", value: 599, originalPrice: 899, packageName: "BBQ Buffet Unlimited", maxBookings: 30, currentBookings: 12 },
//       { type: "time-based", value: 25, timeSlots: ["15:00-17:00"], maxBookings: 25, currentBookings: 8 },
//     ],
//     maxDailyBookings: 80,
//     currentDailyBookings: 35,
//     isAllYouCanEat: true,
//     topDiscount: 33,
//     relevanceScore: 88,
//   },
//   {
//     id: "3",
//     name: "Spice Route",
//     cuisine: "Indian",
//     rating: 4.7,
//     priceRange: "moderate",
//     image: "/indian-restaurant-spices.jpg",
//     location: "Walking Street, Pattaya",
//     coordinates: { lat: 12.9156, lng: 100.8706 },
//     description:
//       "Authentic Indian cuisine with aromatic spices and traditional recipes. Vegetarian and non-vegetarian options available.",
//     features: ["Authentic Indian", "Vegetarian Options", "Spicy Food", "Traditional Recipes"],
//     discounts: [{ type: "time-based", value: 20, timeSlots: ["12:00-14:00", "17:00-19:00"], maxBookings: 40, currentBookings: 15 }],
//     maxDailyBookings: 60,
//     currentDailyBookings: 28,
//     isAllYouCanEat: false,
//     topDiscount: 20,
//     relevanceScore: 82,
//   },
// ]

// const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
//   const R = 6371
//   const dLat = ((lat2 - lat1) * Math.PI) / 180
//   const dLng = ((lng2 - lng1) * Math.PI) / 180
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//   return R * c
// }

// // Using Lucide icons directly - no need for custom components

// const getCuisineFlag = (cuisine: string) => {
//   const flags: { [key: string]: string } = {
//     Japanese: "🇯🇵",
//     Italian: "🇮🇹",
//     Thai: "🇹🇭",
//     Chinese: "🇨🇳",
//     French: "🇫🇷",
//     Indian: "🇮🇳",
//     Mexican: "🇲🇽",
//     Korean: "🇰🇷",
//     Vietnamese: "🇻🇳",
//     American: "🇺🇸",
//     Mediterranean: "🇬🇷",
//   }
//   // Heuristic
//   if (cuisine.toLowerCase().includes("thai")) return "🇹🇭"
//   if (cuisine.toLowerCase().includes("indian")) return "🇮🇳"
//   return flags[cuisine] || "🍽️"
// }

// const getPriceRangeStyle = (priceRange: string) => {
//   switch (priceRange) {
//     case "budget":
//       return { backgroundColor: "#10b981", color: "white" }
//     case "moderate":
//       return { backgroundColor: "#f59e0b", color: "white" }
//     case "expensive":
//       return { backgroundColor: "#ef4444", color: "white" }
//     case "luxury":
//       return { backgroundColor: "#8b5cf6", color: "white" }
//     default:
//       return { backgroundColor: "#6b7280", color: "white" }
//   }
// }

// const getPriceRangeDisplay = (priceRange: string) => {
//   switch (priceRange) {
//     case "budget":
//       return "$"
//     case "moderate":
//       return "$$"
//     case "expensive":
//       return "$$$"
//     case "luxury":
//       return "$$$$"
//     default:
//       return "$$"
//   }
// }

// function RestaurantCard({ restaurant, onBook }: { restaurant: Restaurant; onBook: (restaurant: Restaurant) => void }) {
//   const available = restaurant.maxDailyBookings - restaurant.currentDailyBookings

//   return (
//     <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative">
//       <div className="relative overflow-hidden rounded-t-lg">
//         <img 
//           src={restaurant.image || "/placeholder.svg"} 
//           alt={restaurant.name} 
//           className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
//         />

//         {/* Price Range Badge */}
//         <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white" style={getPriceRangeStyle(restaurant.priceRange)}>
//           {getPriceRangeDisplay(restaurant.priceRange)}
//         </div>

//         {/* Rating Badge */}
//         <div className="absolute top-2 right-2 px-2 py-1 rounded bg-white shadow-sm">
//           <div className="flex items-center gap-1">
//             <Star className="h-3 w-3 text-yellow-500 fill-current animate-pulse" />
//             <span className="text-xs font-medium text-gray-700">{restaurant.rating}</span>
//           </div>
//         </div>

//         {/* Discount Badge - Only color accent */}
//         {restaurant.topDiscount > 0 && (
//           <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
//             {restaurant.topDiscount}% OFF
//           </div>
//         )}
//       </div>

//       <CardContent className="p-3 relative">
//         {/* Restaurant Name & Cuisine */}
//         <div className="mb-2">
//           <h3 className="font-semibold text-sm text-gray-900 truncate">{restaurant.name}</h3>
//           <p className="text-xs text-gray-500 truncate">{restaurant.cuisine}</p>
//           </div>

//         {/* Location */}
//         <div className="flex items-center gap-1 mb-2">
//           <MapPin className="h-3 w-3 text-gray-400" />
//           <span className="text-xs text-gray-500 truncate flex-1">{restaurant.location}</span>
//           {available <= 5 && (
//             <Badge variant="destructive" className="text-xs px-1 py-0">
//               {available} left
//             </Badge>
//           )}
//         </div>

//         {/* Features */}
//         <div className="flex flex-wrap gap-1 mb-3">
//           {restaurant.features.slice(0, 2).map((feature, i) => (
//             <Badge key={i} variant="outline" className="text-xs px-1 py-0">
//               {feature}
//             </Badge>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-2">
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="outline" size="sm" className="flex-1 text-xs">
//                 <Eye className="w-3 h-3 mr-1 animate-pulse" />
//                 Details
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[100]">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Utensils className="w-5 h-5 text-purple-500" />
//                   {restaurant.name}
//                 </DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="w-full h-56 object-cover rounded-xl" />
//                 <div className="flex items-center gap-2 text-sm">
//                   <Badge style={getPriceRangeStyle(restaurant.priceRange)} className="text-white">
//                     {getPriceRangeDisplay(restaurant.priceRange)}
//                   </Badge>
//                   <Badge variant="secondary">{restaurant.cuisine}</Badge>
//                   <Badge variant="outline">⭐ {restaurant.rating}</Badge>
//                 </div>
//                 <div className="text-sm text-gray-600">{restaurant.description}</div>
//                 <div className="flex flex-wrap gap-2">
//                   {restaurant.features.map((feature, i) => (
//                     <Badge key={i} variant="outline" className="text-xs">
//                       {feature}
//                     </Badge>
//                   ))}
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {restaurant.discounts.map((discount, i) => (
//                     <Badge key={i} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//                       {discount.type === "time-based" ? `${discount.value}% OFF` : discount.type === "fixed-price" ? `฿${discount.value}` : "All You Can Eat"}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//           <Button 
//             size="sm" 
//             className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs shadow-lg hover:shadow-xl transition-all duration-300" 
//             onClick={(e) => {
//               e.stopPropagation()
//               onBook(restaurant)
//             }}
//           >
//             <Heart className="w-3 h-3 mr-1 animate-bounce" />
//             Book Now
//             <ArrowRight className="w-3 h-3 ml-1 animate-pulse" />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// interface FoodWidgetProps {
//   theme?: "primary" | "nightlife"
// }

// export function FoodWidget({ theme = "primary" }: FoodWidgetProps) {
//   const { restaurants: strapiRestaurants, loading, error } = useRestaurants()
//   const { createBooking } = useBookings()
//   const [search, setSearch] = useState("")
//   const [price, setPrice] = useState("all")
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
//   const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
//   const [showBookingModal, setShowBookingModal] = useState(false)
//   const [showExpandedModal, setShowExpandedModal] = useState(false)

//   // Use Pattaya center for distance
//   const userLocation = { lat: 12.9236, lng: 100.8825 }

//   // Transform Strapi data to our Restaurant interface
//   const restaurants: Restaurant[] = strapiRestaurants.map((strapiRestaurant) => ({
//     id: strapiRestaurant.id.toString(),
//     name: strapiRestaurant.name,
//     cuisine: strapiRestaurant.cuisine,
//     rating: strapiRestaurant.rating,
//     priceRange: strapiRestaurant.priceRange,
//     image: strapiRestaurant.image?.data?.attributes?.url || "/placeholder.svg",
//     location: strapiRestaurant.location,
//     coordinates: {
//       lat: strapiRestaurant.latitude,
//       lng: strapiRestaurant.longitude,
//     },
//     description: strapiRestaurant.description,
//     features: strapiRestaurant.features || [],
//     discounts: strapiRestaurant.discounts || [],
//     maxDailyBookings: strapiRestaurant.maxDailyBookings,
//     currentDailyBookings: strapiRestaurant.currentDailyBookings,
//     isAllYouCanEat: strapiRestaurant.isAllYouCanEat,
//     topDiscount: strapiRestaurant.topDiscount,
//     relevanceScore: strapiRestaurant.relevanceScore,
//   }))

//   const handleBook = (restaurant: Restaurant) => {
//     setSelectedRestaurant(restaurant)
//     setShowBookingModal(true)
//   }

//   const handleBookingSubmit = async (bookingData: any) => {
//     try {
//       await createBooking({
//         restaurant: parseInt(selectedRestaurant?.id || "1"),
//         customer_name: bookingData.name,
//         customer_email: bookingData.email,
//         customer_phone: bookingData.phone,
//         booking_date_time: bookingData.dateTime,
//         quantity: bookingData.guests,
//         notes: bookingData.specialRequests,
//       })
//       setShowBookingModal(false)
//       setSelectedRestaurant(null)
//     } catch (error) {
//       console.error("Booking failed:", error)
//     }
//   }

//   const filtered = useMemo(() => {
//     const withDistance = restaurants.map((r) => ({
//       ...r,
//       distance: calculateDistance(userLocation.lat, userLocation.lng, r.coordinates.lat, r.coordinates.lng),
//     }))

//     return withDistance
//       .filter((r) =>
//         search
//           ? r.name.toLowerCase().includes(search.toLowerCase()) ||
//             r.cuisine.toLowerCase().includes(search.toLowerCase()) ||
//             r.location.toLowerCase().includes(search.toLowerCase())
//           : true,
//       )
//       .filter((r) => (price === "all" ? true : r.priceRange === price))
//       .sort((a, b) => a.distance! - b.distance!)
//   }, [restaurants, search, price])

//   useEffect(() => {
//     console.log("[FoodWidget] mounted; theme:", theme)
//   }, [theme])

//   if (loading) {
//     return (
//       <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-sm">
//         <CardContent className="p-8 text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading restaurants...</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (error) {
//     return (
//       <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-sm">
//         <CardContent className="p-8 text-center">
//           <p className="text-red-600 mb-2">Failed to load restaurants</p>
//           <p className="text-sm text-gray-500">Using offline data</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <>
//       {/* Main Widget - Clickable to expand */}
//       <div 
//         className="h-full flex flex-col bg-white rounded-xl overflow-hidden relative shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-300"
//         onClick={() => setShowExpandedModal(true)}
//       >
//       {/* Animated Background Icons */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {/* Animated Lucide icons with various effects */}
//         <Utensils className="absolute top-4 left-4 w-8 h-8 text-gray-100 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
//         <ChefHat className="absolute bottom-8 right-8 w-6 h-6 text-gray-100 animate-pulse" style={{ animationDelay: '1s', animationDuration: '2s' }} />
//         <Star className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-gray-100 animate-ping" style={{ animationDelay: '2s', animationDuration: '4s' }} />
//         <Heart className="absolute top-8 right-4 w-6 h-6 text-gray-100 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
//         <Sparkles className="absolute bottom-4 left-8 w-5 h-5 text-gray-100 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
//         <Flame className="absolute top-1/4 right-1/4 w-4 h-4 text-gray-100 animate-ping" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }} />
//       </div>

//       {/* Enhanced Header with Food Icons Background */}
//       <div className="relative p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
//         {/* Animated Food Icons Background */}
//         <div className="absolute inset-0 pointer-events-none">
//           <Pizza className="absolute top-2 left-8 w-5 h-5 text-purple-200 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
//           <Coffee className="absolute top-1 right-12 w-4 h-4 text-purple-300 animate-pulse" style={{ animationDelay: '1s', animationDuration: '2.5s' }} />
//           <Cake className="absolute bottom-2 left-4 w-6 h-6 text-pink-200 animate-ping" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
//           <Apple className="absolute top-4 right-4 w-4 h-4 text-red-200 animate-bounce" style={{ animationDelay: '2s', animationDuration: '2.8s' }} />
//           <Sandwich className="absolute bottom-3 right-8 w-5 h-5 text-orange-200 animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '3.2s' }} />
//           <IceCream className="absolute top-3 left-12 w-4 h-4 text-blue-200 animate-ping" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }} />
//           <Cookie className="absolute bottom-4 left-16 w-3 h-3 text-yellow-200 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2.2s' }} />
//           <Wine className="absolute top-2 right-20 w-4 h-4 text-purple-300 animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '3.5s' }} />
//           <Beer className="absolute bottom-2 right-16 w-4 h-4 text-amber-200 animate-ping" style={{ animationDelay: '0.3s', animationDuration: '2.8s' }} />
//           <Grape className="absolute top-5 left-20 w-3 h-3 text-green-200 animate-bounce" style={{ animationDelay: '2.2s', animationDuration: '3.1s' }} />
//           <ChefHat className="absolute bottom-1 left-24 w-5 h-5 text-gray-300 animate-pulse" style={{ animationDelay: '1.7s', animationDuration: '4.2s' }} />
//           <Utensils className="absolute top-1 left-28 w-4 h-4 text-purple-200 animate-ping" style={{ animationDelay: '0.7s', animationDuration: '3.3s' }} />
//         </div>
        
//         <div className="relative flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {/* Main Accent Icon with Enhanced Animation */}
//             <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md relative z-10">
//               <Utensils className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '8s' }} />
//             </div>
//             <div className="relative z-10">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Dining
//               </h2>
//               <p className="text-xs text-gray-500">Discover restaurants</p>
//             </div>
//           </div>
//           <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 relative z-10">
//             Live
//           </Badge>
//         </div>
//       </div>

//       {/* Unified Controls in One Line */}
//       <div className="p-4 border-b border-gray-100 bg-white" onClick={(e) => e.stopPropagation()}>
//         <div className="flex gap-2 items-center">
//           {/* Search Input */}
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-pulse" />
//             <Input 
//               placeholder="Search restaurants..." 
//               value={search} 
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-300"
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
          
//           {/* Price Filter */}
//           <Select value={price} onValueChange={setPrice}>
//             <SelectTrigger 
//               className="w-32 bg-gray-50 border-gray-200 focus:border-gray-300"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <SelectValue placeholder="Price" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Prices</SelectItem>
//               <SelectItem value="budget">$ Budget</SelectItem>
//               <SelectItem value="moderate">$$ Moderate</SelectItem>
//               <SelectItem value="expensive">$$$ Expensive</SelectItem>
//               <SelectItem value="luxury">$$$$ Luxury</SelectItem>
//             </SelectContent>
//           </Select>
          
//           {/* View Mode Buttons */}
//           <Button 
//             variant={viewMode === "grid" ? "default" : "outline"} 
//             size="sm" 
//             onClick={(e) => {
//               e.stopPropagation()
//               setViewMode("grid")
//             }}
//             className="px-3"
//           >
//             <Grid3X3 className="w-4 h-4 animate-pulse" />
//           </Button>
//           <Button 
//             variant={viewMode === "list" ? "default" : "outline"} 
//             size="sm" 
//             onClick={(e) => {
//               e.stopPropagation()
//               setViewMode("list")
//             }}
//             className="px-3"
//           >
//             <List className="w-4 h-4 animate-bounce" />
//           </Button>
//         </div>
//       </div>

//       {/* Scrollable Content - Properly Fixed */}
//       <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//         <div className="p-4 pb-6" onClick={(e) => e.stopPropagation()}>
//           <Tabs defaultValue="all" className="w-full">
//             <TabsList className="grid w-full grid-cols-3 bg-gray-100 mb-4 border border-gray-200">
//               <TabsTrigger value="all" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
//                 <Utensils className="w-3 h-3 mr-1 animate-spin" style={{ animationDuration: '6s' }} />
//                 All
//               </TabsTrigger>
//               <TabsTrigger value="time" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
//                 <Clock className="w-3 h-3 mr-1 animate-pulse" />
//                 Deals
//               </TabsTrigger>
//               <TabsTrigger value="ayce" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
//                 <TrendingUp className="w-3 h-3 mr-1 animate-bounce" />
//                 Buffet
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="all" className="mt-0">
//               <div className={cn(
//                 "gap-3", 
//                 viewMode === "grid" 
//                   ? "grid grid-cols-1 sm:grid-cols-2" 
//                   : "space-y-3"
//               )}> 
//                 {filtered.map((r, index) => (
//                   <div 
//                     key={r.id} 
//                     className="animate-fade-in-up"
//                     style={{ animationDelay: `${index * 50}ms` }}
//                   >
//                     <RestaurantCard restaurant={r} onBook={handleBook} />
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>

//             <TabsContent value="time" className="mt-0">
//               <div className={cn(
//                 "gap-3", 
//                 viewMode === "grid" 
//                   ? "grid grid-cols-1 sm:grid-cols-2" 
//                   : "space-y-3"
//               )}>
//                 {filtered
//                   .filter((r) => r.discounts.some((d) => d.type === "time-based"))
//                   .map((r, index) => (
//                     <div 
//                       key={r.id} 
//                       className="animate-fade-in-up"
//                       style={{ animationDelay: `${index * 50}ms` }}
//                     >
//                       <RestaurantCard restaurant={r} onBook={handleBook} />
//                     </div>
//                   ))}
//               </div>
//             </TabsContent>

//             <TabsContent value="ayce" className="mt-0">
//               <div className={cn(
//                 "gap-3", 
//                 viewMode === "grid" 
//                   ? "grid grid-cols-1 sm:grid-cols-2" 
//                   : "space-y-3"
//               )}>
//                 {filtered
//                   .filter((r) => r.isAllYouCanEat)
//                   .map((r, index) => (
//                     <div 
//                       key={r.id} 
//                       className="animate-fade-in-up"
//                       style={{ animationDelay: `${index * 50}ms` }}
//                     >
//                       <RestaurantCard restaurant={r} onBook={handleBook} />
//                     </div>
//                   ))}
//           </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//       </div>

//       {/* Expanded Modal */}
//       {showExpandedModal && (
//         <Dialog open={showExpandedModal} onOpenChange={setShowExpandedModal}>
//           <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden z-[100]">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Utensils className="w-6 h-6 text-purple-500 animate-spin" style={{ animationDuration: '4s' }} />
//                 Pattaya Dining - Full View
//               </DialogTitle>
//             </DialogHeader>
//             <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
//               {/* Expanded widget content */}
//               <div className="space-y-4">
//                 {/* Unified Controls */}
//                 <div className="flex gap-2 items-center p-4 bg-gray-50 rounded-lg" onClick={(e) => e.stopPropagation()}>
//                   <div className="relative flex-1">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-pulse" />
//                     <Input 
//                       placeholder="Search restaurants..." 
//                       value={search} 
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="pl-10"
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                   </div>
//                   <Select value={price} onValueChange={setPrice}>
//                     <SelectTrigger 
//                       className="w-40"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <SelectValue placeholder="Price Range" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Prices</SelectItem>
//                       <SelectItem value="budget">$ Budget</SelectItem>
//                       <SelectItem value="moderate">$$ Moderate</SelectItem>
//                       <SelectItem value="expensive">$$$ Expensive</SelectItem>
//                       <SelectItem value="luxury">$$$$ Luxury</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Button 
//                     variant={viewMode === "grid" ? "default" : "outline"} 
//                     size="sm" 
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       setViewMode("grid")
//                     }}
//                   >
//                     <Grid3X3 className="w-4 h-4 animate-pulse" />
//                   </Button>
//                   <Button 
//                     variant={viewMode === "list" ? "default" : "outline"} 
//                     size="sm" 
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       setViewMode("list")
//                     }}
//                   >
//                     <List className="w-4 h-4 animate-bounce" />
//                   </Button>
//         </div>

//         {/* Tabs */}
//         <Tabs defaultValue="all" className="w-full" onClick={(e) => e.stopPropagation()}>
//           <TabsList className="grid w-full grid-cols-3">
//                     <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
//                       <Utensils className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '6s' }} />
//                       All Restaurants
//                     </TabsTrigger>
//                     <TabsTrigger value="time" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
//                       <Clock className="w-4 h-4 mr-2 animate-pulse" />
//                       Time-Based Deals
//                     </TabsTrigger>
//                     <TabsTrigger value="ayce" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
//                       <TrendingUp className="w-4 h-4 mr-2 animate-bounce" />
//                       All You Can Eat
//                     </TabsTrigger>
//           </TabsList>

//           <TabsContent value="all" className="mt-4">
//                     <div className={cn(
//                       "gap-4", 
//                       viewMode === "grid" 
//                         ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
//                         : "space-y-4"
//                     )}>
//                       {filtered.map((r, index) => (
//                         <div 
//                           key={r.id} 
//                           className="animate-fade-in-up"
//                           style={{ animationDelay: `${index * 50}ms` }}
//                         >
//                           <RestaurantCard restaurant={r} onBook={handleBook} />
//                         </div>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="time" className="mt-4">
//                     <div className={cn(
//                       "gap-4", 
//                       viewMode === "grid" 
//                         ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
//                         : "space-y-4"
//                     )}>
//               {filtered
//                         .filter((r) => r.discounts.some(d => d.type === "time-based"))
//                         .map((r, index) => (
//                           <div 
//                             key={r.id} 
//                             className="animate-fade-in-up"
//                             style={{ animationDelay: `${index * 50}ms` }}
//                           >
//                             <RestaurantCard restaurant={r} onBook={handleBook} />
//                           </div>
//                 ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="ayce" className="mt-4">
//                     <div className={cn(
//                       "gap-4", 
//                       viewMode === "grid" 
//                         ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
//                         : "space-y-4"
//                     )}>
//               {filtered
//                 .filter((r) => r.isAllYouCanEat)
//                         .map((r, index) => (
//                           <div 
//                             key={r.id} 
//                             className="animate-fade-in-up"
//                             style={{ animationDelay: `${index * 50}ms` }}
//                           >
//                             <RestaurantCard restaurant={r} onBook={handleBook} />
//                           </div>
//                 ))}
//             </div>
//           </TabsContent>
//         </Tabs>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Simple Booking Modal */}
//       {showBookingModal && selectedRestaurant && (
//         <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
//           <DialogContent className="max-w-md z-[100]">
//             <DialogHeader>
//               <DialogTitle>Book a Table at {selectedRestaurant.name}</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="text-sm text-gray-600">
//                 <p><strong>Cuisine:</strong> {selectedRestaurant.cuisine}</p>
//                 <p><strong>Location:</strong> {selectedRestaurant.location}</p>
//                 <p><strong>Rating:</strong> ⭐ {selectedRestaurant.rating}</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-sm text-gray-500 mb-4">
//                   Booking functionality is connected to Strapi backend.
//                   <br />
//                   Complete booking form would be implemented here.
//                 </p>
//                 <div className="flex gap-2">
//                   <Button variant="outline" onClick={() => setShowBookingModal(false)}>
//                     Cancel
//                   </Button>
//                   <Button onClick={() => {
//                     // Simulate booking submission
//                     handleBookingSubmit({
//                       name: "Demo User",
//                       email: "demo@example.com",
//                       phone: "+66 123 456 789",
//                       dateTime: new Date().toISOString(),
//                       guests: 2,
//                       specialRequests: "Demo booking"
//                     })
//                   }}>
//                     Confirm Booking
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   )
// }

// export default FoodWidget

