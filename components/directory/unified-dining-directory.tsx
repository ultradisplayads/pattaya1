"use client"

import { useState, useEffect } from "react"
import {
  Star,
  MapPin,
  Clock,
  Users,
  ChefHat,
  Utensils,
  Wine,
  Coffee,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { localDB } from "@/lib/database/local-storage"
import type { Business, SearchFilters } from "@/lib/database/local-storage"
import { TAXONOMY_DATA } from "@/lib/taxonomy-data"

const PROMOTIONAL_BANNERS = [
  {
    id: 1,
    text: "Up to 50% off dinner slots",
    icon: "🔥",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    link: "/premium-listings/dinner-deals",
    restaurantId: "copper-beyond",
  },
  {
    id: 2,
    text: "Omakase Week — limited seats", 
    icon: "🍣",
    color: "bg-red-100 text-red-800 border-red-200",
    link: "/premium-listings/omakase-week",
    restaurantId: "koko-omakase",
  },
  {
    id: 3,
    text: "Thai Cooking Masterclass",
    icon: "👨‍🍳",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    link: "/premium-listings/cooking-classes",
    restaurantId: "blue-elephant",
  },
]

const CUISINE_CATEGORIES_ROW_1 = [
  { id: "thai", label: "Thai", icon: "🍜", gradient: "from-red-500 to-yellow-500" },
  { id: "seafood", label: "Seafood", icon: "🦞", gradient: "from-blue-500 to-cyan-500" },
  { id: "chinese", label: "Chinese", icon: "🥟", gradient: "from-red-600 to-orange-500" },
  { id: "japanese", label: "Japanese", icon: "🍱", gradient: "from-pink-500 to-red-500" },
  { id: "korean", label: "Korean", icon: "🍲", gradient: "from-purple-500 to-pink-500" },
  { id: "indian", label: "Indian", icon: "🍛", gradient: "from-orange-500 to-red-500" },
]

const FEATURED_RESTAURANTS = [
  {
    id: "copper-beyond",
    name: "Copper Beyond Buffet",
    location: "Pathum Wan",
    cuisine: "Buffet, International",
    rating: 4.2,
    features: ["Family-friendly", "Seafood", "Parking"],
    timeSlots: [
      { time: "17:00-18:00", seats: 8, price: 1599 },
      { time: "18:00-19:00", seats: 3, price: 1599 },
    ],
    discount: "30% off",
    image: "/copper-beyond-buffet.jpg",
  },
]

const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"]
const MEAL_TYPES = ["Breakfast", "Brunch", "Lunch", "Dinner"]
const RATINGS = ["3.0+", "4.0+", "4.5+"]

const CUISINE_TYPES = [
  { id: "all", name: "All Cuisines", icon: Utensils, count: 247 },
  { id: "thai", name: "Thai", icon: ChefHat, count: 89 },
  { id: "international", name: "International", icon: Wine, count: 76 },
  { id: "street-food", name: "Street Food", icon: Coffee, count: 45 },
  { id: "seafood", name: "Seafood", icon: Users, count: 37 },
]

const BUSINESS_CATEGORIES = [
  { id: "restaurants-dining", name: "Restaurants & Dining", icon: Utensils, color: "bg-orange-500", active: true },
  { id: "bars-nightlife", name: "Bars & Nightlife", icon: Wine, color: "bg-purple-500" },
  { id: "home-living", name: "Home & Living", icon: Users, color: "bg-green-500" },
  { id: "health-beauty", name: "Health, Beauty & Wellness", icon: Heart, color: "bg-pink-500" },
]

export function UnifiedDiningDirectory() {
  const [restaurants, setRestaurants] = useState<Business[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Business[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("19:00")
  const [partySize, setPartySize] = useState(2)
  const [location, setLocation] = useState("")
  const [cuisine, setCuisine] = useState("")
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([])
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("Recommended")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [savedCount, setSavedCount] = useState(16)
  const [showBusinessDirectory, setShowBusinessDirectory] = useState(false)

  useEffect(() => {
    const initializeData = async () => {
      localDB.init()
      const data = await localDB.getBusinesses()
      const diningBusinesses = data.filter(b => b.category === "Restaurants & Dining")
      setRestaurants(diningBusinesses)
      setFilteredRestaurants(diningBusinesses)
      setLoading(false)
    }
    initializeData()
  }, [])

  useEffect(() => {
    const applyFilters = async () => {
      const filters: SearchFilters = {
        category: "restaurants & dining",
      }

      let results = await localDB.searchBusinesses(searchQuery, filters)
      
      if (selectedPrices.length > 0) {
        results = results.filter((business) => selectedPrices.includes(business.priceRange || "$"))
      }

      setFilteredRestaurants(results)
    }

    applyFilters()
  }, [searchQuery, selectedPrices, selectedRatings, sortBy])

  const handlePriceChange = (price: string, checked: boolean) => {
    setSelectedPrices((prev) => (checked ? [...prev, price] : prev.filter((p) => p !== price)))
  }

  const handleMealTypeChange = (mealType: string, checked: boolean) => {
    setSelectedMealTypes((prev) => (checked ? [...prev, mealType] : prev.filter((m) => m !== mealType)))
  }

  const handleCuisineChange = (cuisineType: string, checked: boolean) => {
    setSelectedCuisines((prev) => (checked ? [...prev, cuisineType] : prev.filter((c) => c !== cuisineType)))
  }

  const handleRatingChange = (rating: string, checked: boolean) => {
    setSelectedRatings((prev) => (checked ? [...prev, rating] : prev.filter((r) => r !== rating)))
  }

  const handleBannerClick = (banner: (typeof PROMOTIONAL_BANNERS)[0]) => {
    console.log(`Banner clicked: ${banner.text}`)
    window.open(banner.link, "_blank")
  }

  const clearAllFilters = () => {
    setSelectedPrices([])
    setSelectedMealTypes([])
    setSelectedCuisines([])
    setSelectedRatings([])
    setSearchQuery("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-700">Loading restaurants...</p>
          <p className="text-sm text-gray-500 mt-2">Finding the best dining experiences for you</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Business Directory Navigation */}
          {showBusinessDirectory && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowBusinessDirectory(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dining
                </Button>
                <h2 className="text-2xl font-bold text-gray-900">Complete Business Directory</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {BUSINESS_CATEGORIES.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => category.id === "restaurants-dining" && setShowBusinessDirectory(false)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        category.active
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white shadow-md`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center leading-tight">
                        {category.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {!showBusinessDirectory && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowBusinessDirectory(true)}
                    className="flex items-center gap-2 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Directory
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Restaurants & Dining</h1>
                      <p className="text-sm text-gray-600 font-medium">
                        Part of the Shozzle Network • GreatFoodPlaces.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Heart className="w-4 h-4" />
                    Saved ({savedCount})
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-md"
                  >
                    Sign in
                  </Button>
                </div>
              </div>

              {/* Reservation Form */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option>19:00</option>
                      <option>18:00</option>
                      <option>20:00</option>
                      <option>21:00</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Party Size</label>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <Input
                      placeholder="Pattaya, Thailand"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine</label>
                    <Input
                      placeholder="Restaurant or cuisine"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="h-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 h-12 px-8 font-semibold shadow-lg">
                    Let's go
                  </Button>
                </div>
              </div>

              {/* Promotional Banners */}
              <div className="relative overflow-hidden mb-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4">
                <div className="flex animate-marquee gap-6 whitespace-nowrap">
                  {[...PROMOTIONAL_BANNERS, ...PROMOTIONAL_BANNERS].map((banner, index) => (
                    <button
                      key={`${banner.id}-${index}`}
                      onClick={() => handleBannerClick(banner)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 ${banner.color} flex-shrink-0 hover:scale-105 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg font-medium`}
                    >
                      <span className="text-lg">{banner.icon}</span>
                      <span className="text-sm font-semibold">{banner.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {!showBusinessDirectory && (
        <>
          {/* Cuisine Categories */}
          <div className="bg-white py-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Cuisines</h2>

              {/* Cuisine Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {CUISINE_TYPES.map((cuisineType) => {
                  const Icon = cuisineType.icon
                  return (
                    <Button
                      key={cuisineType.id}
                      variant={selectedCuisineFilter === cuisineType.id ? "default" : "outline"}
                      onClick={() => setSelectedCuisineFilter(cuisineType.id)}
                      className="flex items-center gap-2 h-auto py-3 px-6"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{cuisineType.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {cuisineType.count}
                      </Badge>
                    </Button>
                  )
                })}
              </div>

              {/* Cuisine Grid */}
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4">
                {CUISINE_CATEGORIES_ROW_1.map((category, index) => (
                  <button
                    key={category.id}
                    className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg bg-white border border-gray-100"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-md flex items-center justify-center text-lg shadow-md group-hover:shadow-lg transition-shadow duration-300`}
                    >
                      {category.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors text-center leading-tight">
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Restaurants */}
          <div className="bg-white py-6 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Restaurants</h2>
              <div className="flex gap-6 overflow-x-auto">
                {FEATURED_RESTAURANTS.map((restaurant) => (
                  <Card key={restaurant.id} className="min-w-80 overflow-hidden">
                    <div className="relative">
                      <img
                        src={restaurant.image || "/placeholder.svg?height=200&width=320&query=restaurant"}
                        alt={restaurant.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-gray-800 text-white text-xs">PLATINUM</Badge>
                        <Badge className="bg-green-500 text-white text-xs">Open now</Badge>
                      </div>
                      {restaurant.discount && (
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-orange-500 text-white">{restaurant.discount}</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {restaurant.location} • {restaurant.cuisine}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(restaurant.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{restaurant.rating}</span>
                      </div>
                      <div className="space-y-2">
                        {restaurant.timeSlots.map((slot, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>
                              {slot.time} • {slot.seats} seats
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">฿{slot.price.toLocaleString()}</span>
                              <Button size="sm" className="bg-orange-600 text-white hover:bg-orange-700">
                                Book
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Enhanced Search Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search for restaurants, services, attractions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-14 px-6 border-gray-300 hover:bg-gray-50"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
                  className="h-14 px-6 border-gray-300 hover:bg-gray-50"
                >
                  {viewMode === "map" ? <List className="w-5 h-5 mr-2" /> : <MapPin className="w-5 h-5 mr-2" />}
                  {viewMode === "map" ? "Show List" : "Live Map"}
                </Button>
              </div>
            </div>

            <div className="flex gap-8">
              {/* Filters Sidebar */}
              <div className="w-80 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>
                </div>

                {/* Price */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Price</h4>
                  <div className="flex gap-2">
                    {PRICE_RANGES.map((price) => (
                      <button
                        key={price}
                        onClick={() => handlePriceChange(price, !selectedPrices.includes(price))}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${
                          selectedPrices.includes(price)
                            ? "bg-orange-600 text-white border-orange-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meal Type */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Meal type</h4>
                  <div className="space-y-2">
                    {MEAL_TYPES.map((mealType) => (
                      <div key={mealType} className="flex items-center space-x-2">
                        <Checkbox
                          id={mealType}
                          checked={selectedMealTypes.includes(mealType)}
                          onCheckedChange={(checked) => handleMealTypeChange(mealType, checked as boolean)}
                        />
                        <label htmlFor={mealType} className="text-sm text-gray-700">
                          {mealType}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Traveler Rating */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Traveler rating</h4>
                  <div className="space-y-2">
                    {RATINGS.map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={rating}
                          checked={selectedRatings.includes(rating)}
                          onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                        />
                        <label htmlFor={rating} className="text-sm text-gray-700">
                          {rating}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <p className="text-lg font-semibold text-gray-900">
                      {filteredRestaurants.length} results • <span className="text-gray-600">Pattaya, Thailand</span>
                    </p>
                    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">Earn points every time you book</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option>Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Rating</option>
                        <option>Distance</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Saved ({savedCount})</span>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="p-2"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "map" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("map")}
                        className="p-2"
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {filteredRestaurants.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Try adjusting your search terms or filters to find more results.
                    </p>
                    <Button onClick={clearAllFilters} variant="outline" className="hover:bg-gray-50 bg-transparent">
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredRestaurants.map((restaurant) => (
                      <Card
                        key={restaurant.id}
                        className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                      >
                        <div className="flex">
                          <div className="w-80 h-56 relative">
                            <img
                              src={restaurant.images?.[0] || "/placeholder.svg?height=224&width=320&query=restaurant"}
                              alt={restaurant.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                              <Badge className="bg-gray-900 text-white text-xs font-semibold">PLATINUM</Badge>
                              <Badge className="bg-green-500 text-white text-xs font-semibold">Open now</Badge>
                            </div>
                            <div className="absolute bottom-4 left-4">
                              <Badge className="bg-orange-500 text-white font-semibold">
                                {Math.floor(Math.random() * 30) + 10}% off
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="flex-1 p-8">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                                <p className="text-base text-gray-600 mb-3 font-medium">
                                  {restaurant.subcategory} • {restaurant.tags?.join(", ")}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(restaurant.rating)
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-sm text-gray-600 font-medium">
                                  {restaurant.rating} • {restaurant.reviewCount} reviews
                                </p>
                              </div>
                            </div>

                            <p className="text-base text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                              {restaurant.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="text-sm text-gray-700 font-medium">17:00-18:00 • 8 seats</div>
                                <div className="text-sm text-gray-700 font-medium">18:00-19:00 • 3 seats</div>
                              </div>
                              <div className="text-right">
                                <div className="text-base text-gray-700 mb-3 font-semibold">
                                  AYCE • ฿{Math.floor(Math.random() * 2000) + 1000}
                                </div>
                                <div className="flex gap-3">
                                  <Button variant="outline" size="lg" className="font-semibold bg-transparent">
                                    Details
                                  </Button>
                                  <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 font-semibold shadow-md"
                                  >
                                    Book
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Booking Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-600">Selected: 17:00-18:00 at Copper Beyond (30% off)</div>
              <div className="flex items-center gap-4">
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                </select>
                <span className="text-sm text-gray-600">Change time</span>
                <Button className="bg-orange-600 text-white hover:bg-orange-700">Continue</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
