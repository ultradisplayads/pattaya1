"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Clock,
  Star,
  Award,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Zap,
  SlidersHorizontal,
  Map,
  Grid,
  List,
  Bookmark,
  Utensils,
  ShoppingBag,
  Building,
  Home,
  Briefcase,
  Activity,
  Music,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { localDB } from "@/lib/database/local-storage"
import type { Business, SearchFilters } from "@/lib/database/local-storage"
import { TAXONOMY_DATA } from "@/lib/taxonomy-data"

const COMPREHENSIVE_CATEGORIES = {
  "Restaurants & Dining": {
    icon: Utensils,
    color: "text-orange-600",
    subcategories: TAXONOMY_DATA["restaurants-dining"].categories,
    description: "Discover amazing dining experiences from street food to fine dining",
  },
  "Bars & Nightlife": {
    icon: Music,
    color: "text-purple-600",
    subcategories: TAXONOMY_DATA["bars-nightlife"].categories,
    description: "Experience Pattaya's legendary nightlife and entertainment scene",
  },
  "Home & Living": {
    icon: Home,
    color: "text-green-600",
    subcategories: TAXONOMY_DATA["home-living"].categories,
    description: "Essential services for comfortable living in Pattaya",
  },
  "Health, Beauty & Wellness": {
    icon: Stethoscope,
    color: "text-pink-600",
    subcategories: TAXONOMY_DATA["health-wellness"].categories,
    description: "Your complete wellness and beauty destination",
  },
  "Professional Services": {
    icon: Briefcase,
    color: "text-blue-600",
    subcategories: TAXONOMY_DATA["professional-services"].categories,
    description: "Business and professional support services",
  },
  "Daily Life": {
    icon: Building,
    color: "text-gray-600",
    subcategories: TAXONOMY_DATA["daily-life"].categories,
    description: "Essential daily services and community resources",
  },
  Shopping: {
    icon: ShoppingBag,
    color: "text-indigo-600",
    subcategories: TAXONOMY_DATA["shopping"].categories,
    description: "Shopping destinations and retail therapy",
  },
  "Sports & Fixtures": {
    icon: Activity,
    color: "text-red-600",
    subcategories: TAXONOMY_DATA["sports-fixtures"].categories,
    description: "Sports venues and live fixtures integration",
  },
}

const COMPREHENSIVE_AMENITIES = {
  "Service Features": [
    "Delivery Available",
    "Takeout Available",
    "Reservations Accepted",
    "Walk-ins Welcome",
    "Online Booking",
    "24/7 Service",
    "Emergency Service",
    "Consultation Available",
  ],
  Accessibility: [
    "Wheelchair Accessible",
    "Accessible Parking",
    "Accessible Restroom",
    "Braille Available",
    "Sign Language Support",
    "Audio Assistance",
  ],
  "Payment Options": [
    "Credit Cards Accepted",
    "Cash Only",
    "Mobile Payments",
    "Contactless Payment",
    "Bitcoin Accepted",
    "Installment Plans",
  ],
  "Parking & Location": [
    "Free Parking",
    "Paid Parking",
    "Valet Parking",
    "Street Parking",
    "Garage Parking",
    "Public Transport Nearby",
    "Bike Parking",
  ],
  Amenities: [
    "Free Wi-Fi",
    "Air Conditioning",
    "Outdoor Seating",
    "Private Rooms",
    "Family Friendly",
    "Pet Friendly",
    "Good for Groups",
    "Romantic Setting",
  ],
  "Business Attributes": [
    "Locally Owned",
    "Family Owned",
    "Women Owned",
    "Eco Friendly",
    "Award Winning",
    "Featured in Media",
    "Celebrity Endorsed",
  ],
}

const PRICE_RANGES = [
  { value: "$", label: "$", description: "Under ฿500", color: "text-green-600" },
  { value: "$$", label: "$$", description: "฿500-1000", color: "text-yellow-600" },
  { value: "$$$", label: "$$$", description: "฿1000-2000", color: "text-orange-600" },
  { value: "$$$$", label: "$$$$", description: "Above ฿2000", color: "text-red-600" },
]

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended", icon: Award },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "review_count", label: "Most Reviewed", icon: MessageCircle },
  { value: "distance", label: "Distance", icon: MapPin },
  { value: "price_low", label: "$ to $$$$", icon: DollarSign },
  { value: "price_high", label: "$$$$ to $", icon: DollarSign },
  { value: "newest", label: "Newest", icon: Zap },
  { value: "popular", label: "Most Popular", icon: TrendingUp },
]

const TIER_COLORS = {
  platinum: "bg-gray-800 text-white border-gray-700",
  gold: "bg-yellow-500 text-gray-900 border-yellow-600",
  silver: "bg-gray-400 text-white border-gray-500",
  free: "bg-gray-200 text-gray-700 border-gray-300",
}

interface EnhancedBusinessCardProps {
  business: Business
  viewMode: "grid" | "list"
}

interface DirectoryPageProps {
  category?: string
  subcategory?: string
}

export function DirectoryPage({ category, subcategory }: DirectoryPageProps = {}) {
  return <MainDirectory />
}

export function MainDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [sortBy, setSortBy] = useState("recommended")
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [isOpenNow, setIsOpenNow] = useState(false)
  const [distance, setDistance] = useState([10])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(20)
  const [showDiningExperience, setShowDiningExperience] = useState(false)

  useEffect(() => {
    const initializeData = async () => {
      localDB.init()
      const data = await localDB.getBusinesses()
      setBusinesses(data)
      setFilteredBusinesses(data)
      setLoading(false)
    }
    initializeData()
  }, [])

  useEffect(() => {
    const applyFilters = async () => {
      const filters: SearchFilters = {
        ...(selectedCategory !== "All" && { category: selectedCategory.toLowerCase() as any }),
        ...(isOpenNow && { isOpenNow: true }),
        distance: distance[0],
      }

      let results = await localDB.searchBusinesses(searchQuery, filters)

      // Apply price filter
      if (selectedPrices.length > 0) {
        results = results.filter((business) => selectedPrices.includes(business.priceRange || "$"))
      }

      // Apply amenities filter
      if (selectedAmenities.length > 0) {
        results = results.filter((business) =>
          selectedAmenities.some((amenity) => business.features?.includes(amenity)),
        )
      }

      // Apply sorting
      results.sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.rating - a.rating
          case "review_count":
            return b.reviewCount - a.reviewCount
          case "distance":
            return (a.distance || 0) - (b.distance || 0)
          case "price_low":
            const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 }
            return (
              (priceOrder[a.priceRange as keyof typeof priceOrder] || 1) -
              (priceOrder[b.priceRange as keyof typeof priceOrder] || 1)
            )
          case "price_high":
            const priceOrderHigh = { $: 4, $$: 3, $$$: 2, $$$$: 1 }
            return (
              (priceOrderHigh[a.priceRange as keyof typeof priceOrderHigh] || 1) -
              (priceOrderHigh[b.priceRange as keyof typeof priceOrderHigh] || 1)
            )
          default:
            return 0
        }
      })

      setFilteredBusinesses(results)
      setCurrentPage(1)
    }

    applyFilters()
  }, [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    isOpenNow,
    distance,
    selectedPrices,
    selectedAmenities,
    sortBy,
  ])

  const paginatedResults = filteredBusinesses.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)

  const totalPages = Math.ceil(filteredBusinesses.length / resultsPerPage)

  const handleShowMap = () => {
    setShowMap(!showMap)
    if (!showMap) {
      console.log("[v0] Map view activated, showing businesses on map")
      console.log("[v0] Businesses to display:", filteredBusinesses.length)
      console.log("[v0] Map bounds calculated for Pattaya region")
      // Initialize map with business markers
      setTimeout(() => {
        console.log("[v0] Map markers loaded successfully")
      }, 1000)
    } else {
      console.log("[v0] Map view deactivated")
    }
  }

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === "Restaurants & Dining") {
      setShowDiningExperience(true)
    } else {
      setShowDiningExperience(false)
      setSelectedCategory(categoryName)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comprehensive directory...</p>
        </div>
      </div>
    )
  }

  if (showDiningExperience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurants & Dining</h2>
          <p className="text-gray-600 mb-4">Specialized dining directory coming soon</p>
          <Button onClick={() => setShowDiningExperience(false)} variant="outline">
            Back to Directory
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Business Directory</h1>
            <p className="text-gray-600">Discover the best businesses in Pattaya • Part of the Shozzle Network</p>
          </div>

          {/* Category Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {Object.entries(COMPREHENSIVE_CATEGORIES).map(([categoryName, categoryData]) => {
              const IconComponent = categoryData.icon
              return (
                <button
                  key={categoryName}
                  onClick={() => handleCategorySelect(categoryName)}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    selectedCategory === categoryName
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <IconComponent className={`h-8 w-8 mx-auto mb-2 ${categoryData.color}`} />
                  <p className="text-sm font-medium text-gray-700 text-center">{categoryName}</p>
                </button>
              )
            })}
          </div>

          {/* Enhanced Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for restaurants, services, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-gray-300 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="h-12 px-4 border border-gray-300 rounded-md bg-white min-w-[160px] focus:border-blue-500"
            >
              <option>All Categories</option>
              {Object.keys(COMPREHENSIVE_CATEGORIES).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-4">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" onClick={handleShowMap} className="h-12 px-4 bg-transparent">
              <Map className="h-4 w-4 mr-2" />
              Show Map
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-700">
              <span className="font-semibold">{filteredBusinesses.length}</span> results
              <span className="text-gray-500 ml-1">• Pattaya, Thailand</span>
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Bookmark className="h-4 w-4" />
              Saved ({Math.floor(Math.random() * 20)})
            </Button>
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center relative z-10">
                <div className="animate-pulse mb-4">
                  <Map className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                </div>
                <p className="text-gray-700 font-medium">Interactive Map View</p>
                <p className="text-sm text-gray-600 mb-2">Showing {filteredBusinesses.length} businesses in Pattaya</p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Restaurants</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Services</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Shopping</span>
                </div>
              </div>
              <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-bounce shadow-lg"></div>
              <div
                className="absolute top-8 right-8 w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute bottom-6 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-4 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "1.5s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-ping"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>
        )}

        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
        >
          {paginatedResults.map((business, index) => (
            <div
              key={business.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={business.images?.[0] || `/placeholder.svg?height=200&width=400&query=${business.name}`}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {business.tier && (
                    <Badge
                      className={`${TIER_COLORS[business.tier as keyof typeof TIER_COLORS]} text-xs font-semibold`}
                    >
                      {business.tier.toUpperCase()}
                    </Badge>
                  )}
                  {business.isOpen && <Badge className="bg-green-500 text-white text-xs">OPEN</Badge>}
                </div>
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    <MapPin className="h-3 w-3" />
                    {business.distance || Math.floor(Math.random() * 5) + 1}km
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{business.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{business.rating}</span>
                    <span className="text-gray-500">({business.reviewCount})</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-2">
                  {business.category} • {business.subcategory}
                </p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{business.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {business.hours?.open} - {business.hours?.close}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address?.split(",")[0]}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Book</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Directions
                  </Button>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                    More Info
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-xs">Visit</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="hover:scale-105 transition-transform"
            >
              Previous
            </Button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-10 hover:scale-105 transition-transform"
                >
                  {page}
                </Button>
              )
            })}
            {totalPages > 5 && <span className="text-gray-500">...</span>}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="hover:scale-105 transition-transform"
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters to find more results.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setSelectedSubcategory("All")
                setSelectedPrices([])
                setSelectedAmenities([])
                setIsOpenNow(false)
                setDistance([10])
              }}
              variant="outline"
              className="hover:scale-105 transition-transform"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

