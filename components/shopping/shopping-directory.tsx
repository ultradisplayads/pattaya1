"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Clock,
  Star,
  ShoppingBag,
  Store,
  Filter,
  Grid,
  List,
  Phone,
  Globe,
  Tag,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { localDB } from "@/lib/database/local-storage"
import type { Business } from "@/lib/database/local-storage"

const SHOPPING_CATEGORIES = [
  { id: "all", label: "All Shopping", icon: "🛍️", color: "bg-pink-600" },
  { id: "shopping-mall", label: "Shopping Malls", icon: "🏬", color: "bg-blue-600" },
  { id: "market", label: "Markets", icon: "🏪", color: "bg-green-600" },
  { id: "boutique", label: "Boutiques", icon: "👗", color: "bg-purple-600" },
  { id: "electronics", label: "Electronics", icon: "📱", color: "bg-indigo-600" },
  { id: "fashion", label: "Fashion", icon: "👔", color: "bg-pink-600" },
  { id: "jewelry", label: "Jewelry", icon: "💎", color: "bg-yellow-600" },
  { id: "souvenirs", label: "Souvenirs", icon: "🎁", color: "bg-orange-600" },
]

const FEATURED_SHOPS = [
  {
    id: "terminal21",
    name: "Terminal 21 Pattaya",
    description: "Large shopping mall with international brands, food court, cinema, and entertainment facilities",
    category: "shopping",
    subcategory: "shopping mall",
    tier: "gold",
    rating: 4.3,
    reviewCount: 1205,
    priceRange: "$$",
    location: {
      address: "777/888 Moo 6, Sukhumvit Road, Pattaya",
      coordinates: { lat: 12.9156, lng: 100.8901 },
      distance: 3.2,
    },
    contact: {
      phone: "+66 38 103 700",
      website: "https://terminal21.co.th/pattaya",
      social: {
        facebook: "terminal21pattaya",
        instagram: "@terminal21pattaya",
      },
    },
    hours: {
      monday: { open: "10:00", close: "22:00", isOpen: true },
      tuesday: { open: "10:00", close: "22:00", isOpen: true },
      wednesday: { open: "10:00", close: "22:00", isOpen: true },
      thursday: { open: "10:00", close: "22:00", isOpen: true },
      friday: { open: "10:00", close: "23:00", isOpen: true },
      saturday: { open: "10:00", close: "23:00", isOpen: true },
      sunday: { open: "10:00", close: "22:00", isOpen: true },
    },
    images: ["/terminal21-exterior.jpg", "/terminal21-interior.jpg", "/terminal21-foodcourt.jpg"],
    tags: ["shopping", "food court", "cinema", "brands", "air-con"],
    features: ["air-con", "parking", "cinema", "food-court", "brands", "wifi", "atm"],
    isOpenNow: true,
    isFeatured: true,
    specialOffers: ["Weekend Sale up to 70% off", "Cinema discount packages"],
    brands: ["H&M", "Uniqlo", "Zara", "Nike", "Adidas", "Apple", "Samsung"],
    floors: 9,
    parkingSpaces: 2000,
    facilities: ["Cinema", "Food Court", "Supermarket", "Bank", "Pharmacy"],
  },
  {
    id: "central-festival",
    name: "Central Festival Pattaya Beach",
    description: "Premium beachfront shopping center with luxury brands and stunning ocean views",
    category: "shopping",
    subcategory: "shopping mall",
    tier: "platinum",
    rating: 4.5,
    reviewCount: 892,
    priceRange: "$$$",
    location: {
      address: "333/99 Moo 9, Pattaya Beach Road",
      coordinates: { lat: 12.928, lng: 100.8847 },
      distance: 1.1,
    },
    contact: {
      phone: "+66 38 672 999",
      website: "https://centralfestival.co.th/pattayabeach",
      social: {
        facebook: "centralfestivalpattaya",
        instagram: "@centralfestivalpattaya",
      },
    },
    hours: {
      monday: { open: "10:00", close: "22:00", isOpen: true },
      tuesday: { open: "10:00", close: "22:00", isOpen: true },
      wednesday: { open: "10:00", close: "22:00", isOpen: true },
      thursday: { open: "10:00", close: "22:00", isOpen: true },
      friday: { open: "10:00", close: "23:00", isOpen: true },
      saturday: { open: "10:00", close: "23:00", isOpen: true },
      sunday: { open: "10:00", close: "22:00", isOpen: true },
    },
    images: ["/central-festival-exterior.jpg", "/central-festival-luxury.jpg"],
    tags: ["luxury", "beachfront", "premium brands", "ocean view"],
    features: ["beachfront", "luxury-brands", "valet-parking", "concierge", "ocean-view", "fine-dining"],
    isOpenNow: true,
    isFeatured: true,
    specialOffers: ["Luxury brand VIP events", "Beachfront dining specials"],
    brands: ["Louis Vuitton", "Gucci", "Prada", "Rolex", "Cartier", "Hermès"],
    floors: 8,
    parkingSpaces: 1500,
    facilities: ["Luxury Lounge", "Fine Dining", "Spa", "Art Gallery", "Concierge"],
  },
  {
    id: "walking-street-market",
    name: "Walking Street Night Market",
    description: "Vibrant night market with local vendors, street food, souvenirs, and entertainment",
    category: "shopping",
    subcategory: "market",
    tier: "free",
    rating: 4.1,
    reviewCount: 2341,
    priceRange: "$",
    location: {
      address: "Walking Street, South Pattaya",
      coordinates: { lat: 12.9156, lng: 100.8734 },
      distance: 0.8,
    },
    contact: {
      phone: "+66 38 429 113",
    },
    hours: {
      monday: { open: "18:00", close: "02:00", isOpen: false },
      tuesday: { open: "18:00", close: "02:00", isOpen: false },
      wednesday: { open: "18:00", close: "02:00", isOpen: false },
      thursday: { open: "18:00", close: "02:00", isOpen: false },
      friday: { open: "18:00", close: "02:00", isOpen: true },
      saturday: { open: "18:00", close: "02:00", isOpen: true },
      sunday: { open: "18:00", close: "02:00", isOpen: true },
    },
    images: ["/walking-street-market.jpg", "/walking-street-vendors.jpg"],
    tags: ["night market", "street food", "souvenirs", "local", "bargaining"],
    features: ["outdoor", "street-food", "bargaining", "local-vendors", "entertainment"],
    isOpenNow: false,
    isFeatured: false,
    specialOffers: ["Bargain prices", "Local authentic products"],
    vendors: 150,
    marketType: "Night Market",
    paymentMethods: ["Cash", "Some vendors accept cards"],
  },
  {
    id: "royal-garden-plaza",
    name: "Royal Garden Plaza",
    description: "Multi-level shopping and entertainment complex with diverse shops and dining options",
    category: "shopping",
    subcategory: "shopping mall",
    tier: "silver",
    rating: 4.0,
    reviewCount: 567,
    priceRange: "$$",
    location: {
      address: "218 Moo 10, Beach Road, Pattaya",
      coordinates: { lat: 12.9234, lng: 100.8823 },
      distance: 1.5,
    },
    contact: {
      phone: "+66 38 412 120",
      website: "https://royalgardenplaza.com",
    },
    hours: {
      monday: { open: "10:00", close: "22:00", isOpen: true },
      tuesday: { open: "10:00", close: "22:00", isOpen: true },
      wednesday: { open: "10:00", close: "22:00", isOpen: true },
      thursday: { open: "10:00", close: "22:00", isOpen: true },
      friday: { open: "10:00", close: "23:00", isOpen: true },
      saturday: { open: "10:00", close: "23:00", isOpen: true },
      sunday: { open: "10:00", close: "22:00", isOpen: true },
    },
    images: ["/royal-garden-plaza.jpg"],
    tags: ["shopping", "dining", "entertainment", "central location"],
    features: ["central-location", "diverse-shops", "restaurants", "entertainment"],
    isOpenNow: true,
    isFeatured: false,
    specialOffers: ["Mid-season sales", "Restaurant promotions"],
    floors: 4,
    parkingSpaces: 500,
    facilities: ["Restaurants", "Entertainment", "Currency Exchange", "Tourist Information"],
  },
]

const PRICE_RANGES = [
  { id: "budget", label: "$", description: "Budget-friendly" },
  { id: "moderate", label: "$$", description: "Moderate pricing" },
  { id: "upscale", label: "$$$", description: "Upscale shopping" },
  { id: "luxury", label: "$$$$", description: "Luxury brands" },
]

const SHOP_FEATURES = [
  { id: "air-con", label: "Air Conditioning" },
  { id: "parking", label: "Parking Available" },
  { id: "wifi", label: "Free WiFi" },
  { id: "atm", label: "ATM Available" },
  { id: "food-court", label: "Food Court" },
  { id: "cinema", label: "Cinema" },
  { id: "brands", label: "International Brands" },
  { id: "luxury-brands", label: "Luxury Brands" },
  { id: "local-vendors", label: "Local Vendors" },
  { id: "bargaining", label: "Bargaining Allowed" },
  { id: "outdoor", label: "Outdoor Shopping" },
  { id: "entertainment", label: "Entertainment" },
  { id: "valet-parking", label: "Valet Parking" },
  { id: "concierge", label: "Concierge Service" },
]

const BRANDS_CATEGORIES = [
  { id: "fashion", label: "Fashion & Apparel", brands: ["H&M", "Uniqlo", "Zara"] },
  { id: "luxury", label: "Luxury Brands", brands: ["Louis Vuitton", "Gucci", "Prada"] },
  { id: "electronics", label: "Electronics", brands: ["Apple", "Samsung", "Sony"] },
  { id: "sports", label: "Sports & Outdoor", brands: ["Nike", "Adidas", "Under Armour"] },
]

export function ShoppingDirectory() {
  const [shops, setShops] = useState<Business[]>([])
  const [filteredShops, setFilteredShops] = useState<Business[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [openNow, setOpenNow] = useState(false)
  const [distance, setDistance] = useState([10])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      localDB.init()
      // Use featured shops as mock data
      setShops(FEATURED_SHOPS as any)
      setFilteredShops(FEATURED_SHOPS as any)
      setLoading(false)
    }
    initializeData()
  }, [])

  useEffect(() => {
    let filtered = [...shops]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (shop) =>
          shop.name.toLowerCase().includes(query) ||
          shop.description.toLowerCase().includes(query) ||
          shop.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          shop.address?.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((shop) => shop.subcategory === selectedCategory)
    }

    // Apply open now filter
    if (openNow) {
      filtered = filtered.filter((shop) => shop.isOpen)
    }

    // Apply distance filter
    filtered = filtered.filter((shop) => !shop.distance || shop.distance <= distance[0])

    // Apply features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter((shop) => selectedFeatures.some((feature) => shop.features?.includes(feature)))
    }

    // Sort shops
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "distance":
          return (a.distance || 0) - (b.distance || 0)
        case "price-low":
          const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 }
          return (
            (priceOrder[a.priceRange as keyof typeof priceOrder] || 1) -
            (priceOrder[b.priceRange as keyof typeof priceOrder] || 1)
          )
        case "price-high":
          const priceOrderHigh = { $: 4, $$: 3, $$$: 2, $$$$: 1 }
          return (
            (priceOrderHigh[a.priceRange as keyof typeof priceOrderHigh] || 1) -
            (priceOrderHigh[b.priceRange as keyof typeof priceOrderHigh] || 1)
          )
        case "newest":
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
        default: // featured
          return 0
      }
    })

    setFilteredShops(filtered)
  }, [shops, searchQuery, selectedCategory, openNow, distance, selectedFeatures, sortBy])

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setSelectedFeatures((prev) => (checked ? [...prev, feature] : prev.filter((f) => f !== feature)))
  }

  const handlePriceRangeChange = (priceRange: string, checked: boolean) => {
    setSelectedPriceRanges((prev) => (checked ? [...prev, priceRange] : prev.filter((p) => p !== priceRange)))
  }

  const formatHours = (hours: any) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const todayHours = hours[today]
    if (!todayHours) return "Hours not available"
    return `${todayHours.open} - ${todayHours.close}`
  }

  const getOpenStatus = (shop: any) => {
    if (shop.isOpen) {
      return { status: "Open", color: "text-green-600" }
    } else {
      return { status: "Closed", color: "text-red-600" }
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-gray-800 text-white"
      case "gold":
        return "bg-yellow-500 text-gray-900"
      case "silver":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shopping venues...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Directory</h1>
              <p className="text-gray-600 mt-1">Discover the best shopping destinations • Part of Shozzle Network</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Deals & Offers
              </Button>
              <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
                <Store className="h-4 w-4 mr-2" />
                List Your Store
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search shops, malls, brands, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="open-now" checked={openNow} onCheckedChange={(checked) => setOpenNow(checked as boolean)} />
              <label htmlFor="open-now" className="text-sm text-gray-700">
                Open now
              </label>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-6">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-pink-600 text-white" : ""}
            >
              All Shopping
            </Button>
            {SHOPPING_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === category.id ? category.color + " text-white" : ""
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛍️</span>
              <div>
                <h3 className="font-semibold text-indigo-800">Global Shopping Network</h3>
                <p className="text-sm text-indigo-700">API integrations ready • Google Places, Yelp, local partners</p>
              </div>
            </div>
            <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
              Explore Network
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <div key={range.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={range.id}
                        checked={selectedPriceRanges.includes(range.id)}
                        onCheckedChange={(checked) => handlePriceRangeChange(range.id, checked as boolean)}
                      />
                      <div>
                        <label htmlFor={range.id} className="text-sm text-gray-700 font-medium">
                          {range.label}
                        </label>
                        <p className="text-xs text-gray-500">{range.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Distance</h3>
                <div className="space-y-3">
                  <Slider value={distance} onValueChange={setDistance} max={20} min={1} step={1} className="w-full" />
                  <p className="text-sm text-gray-600">Within {distance[0]} km</p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {SHOP_FEATURES.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={(checked) => handleFeatureChange(feature.id, checked as boolean)}
                      />
                      <label htmlFor={feature.id} className="text-sm text-gray-700">
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">{filteredShops.length} shopping venues found</p>
            <div className="flex items-center gap-2 text-sm text-pink-600">
              <Percent className="h-4 w-4" />
              <span>Special offers available</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Shopping Venues Grid */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredShops.map((shop: any) => (
            <Card key={shop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={shop.images?.[0] || "/placeholder.svg?height=200&width=400&query=shopping mall"}
                  alt={shop.name}
                  className={`w-full object-cover ${viewMode === "grid" ? "h-48" : "h-32"}`}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={`${getTierBadgeColor(shop.tier)} text-xs font-semibold`}>
                    {shop.tier.toUpperCase()}
                  </Badge>
                  {shop.isFeatured && <Badge className="bg-pink-600 text-white text-xs">Featured</Badge>}
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={`text-xs ${getOpenStatus(shop).color} bg-white`}>
                    {getOpenStatus(shop).status}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-black/60 text-white text-xs">{shop.priceRange}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{shop.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{shop.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{shop.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{shop.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{shop.hours?.open} - {shop.hours?.close}</span>
                  </div>
                  {shop.floors && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Store className="h-4 w-4" />
                      <span>{shop.floors} floors</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {shop.tags?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {shop.specialOffers && shop.specialOffers.length > 0 && (
                  <div className="mb-4 p-2 bg-pink-50 rounded-lg">
                    <p className="text-xs text-pink-600 font-medium flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      Special Offer
                    </p>
                    <p className="text-xs text-pink-700">{shop.specialOffers[0]}</p>
                  </div>
                )}

                {shop.brands && shop.brands.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">Popular Brands:</p>
                    <p className="text-xs text-gray-600">{shop.brands.slice(0, 3).join(", ")}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {shop.contact?.phone && (
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    {shop.contact?.website && (
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="text-xs text-gray-500">{shop.reviewCount} reviews</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    <Button size="sm" className="bg-pink-600 text-white hover:bg-pink-700">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredShops.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Venues
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No shopping venues found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms to find more venues.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedPriceRanges([])
                setSelectedFeatures([])
                setOpenNow(false)
                setDistance([10])
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
