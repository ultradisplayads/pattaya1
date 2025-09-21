"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Clock,
  Star,
  Music,
  Zap,
  Filter,
  Grid,
  List,
  Calendar,
  Phone,
  Globe,
  Instagram,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { localDB } from "@/lib/database/local-storage"
import type { Business } from "@/lib/database/local-storage"

const NIGHTLIFE_CATEGORIES = [
  { id: "nightclub", label: "Nightclubs", icon: "🎵", color: "bg-purple-600" },
  { id: "rooftop-bar", label: "Rooftop Bars", icon: "🏙️", color: "bg-blue-600" },
  { id: "beach-bar", label: "Beach Bars", icon: "🏖️", color: "bg-cyan-600" },
  { id: "sports-bar", label: "Sports Bars", icon: "⚽", color: "bg-green-600" },
  { id: "cocktail-lounge", label: "Cocktail Lounges", icon: "🍸", color: "bg-pink-600" },
  { id: "live-music", label: "Live Music", icon: "🎸", color: "bg-orange-600" },
  { id: "karaoke", label: "Karaoke", icon: "🎤", color: "bg-red-600" },
  { id: "wine-bar", label: "Wine Bars", icon: "🍷", color: "bg-purple-700" },
]

const FEATURED_VENUES = [
  {
    id: "skyline-club",
    name: "Skyline Club",
    description: "Premium rooftop bar with panoramic views of Pattaya Bay and signature cocktails",
    category: "rooftop-bar",
    subcategory: "rooftop bar",
    tier: "platinum",
    rating: 4.6,
    reviewCount: 321,
    priceRange: "$$$",
    location: {
      address: "Hilton Pattaya, 333/101 Moo 9, Pattaya City",
      coordinates: { lat: 12.928, lng: 100.8847 },
      distance: 1.1,
    },
    contact: {
      phone: "+66 38 253 000",
      website: "https://skylinepattaya.com",
      social: {
        instagram: "@skylinepattaya",
        facebook: "skylinepattaya",
      },
    },
    hours: {
      monday: { open: "20:00", close: "02:00", isOpen: false },
      tuesday: { open: "20:00", close: "02:00", isOpen: false },
      wednesday: { open: "20:00", close: "02:00", isOpen: false },
      thursday: { open: "20:00", close: "02:00", isOpen: false },
      friday: { open: "20:00", close: "02:00", isOpen: true },
      saturday: { open: "20:00", close: "02:00", isOpen: true },
      sunday: { open: "20:00", close: "02:00", isOpen: false },
    },
    images: ["/skyline-club-night.jpg", "/skyline-club-interior.jpg"],
    tags: ["dj", "rooftop", "table service", "city view"],
    features: ["vip-area", "live-music", "cocktails", "city-view", "dress-code"],
    isOpenNow: false,
    isFeatured: true,
    specialOffers: ["Happy Hour 8-10 PM", "Ladies Night Wednesday"],
    dressCode: "Smart Casual",
    ageRestriction: "21+",
    capacity: 200,
    musicGenre: ["House", "Electronic", "Top 40"],
    events: [
      { date: "2024-02-24", title: "DJ Night with International DJs", time: "22:00" },
      { date: "2024-02-25", title: "Rooftop Party Weekend", time: "21:00" },
    ],
  },
  {
    id: "walking-street-club",
    name: "Insomnia Nightclub",
    description: "The hottest nightclub on Walking Street with world-class DJs and VIP experiences",
    category: "nightclub",
    subcategory: "nightclub",
    tier: "gold",
    rating: 4.3,
    reviewCount: 892,
    priceRange: "$$",
    location: {
      address: "Walking Street, South Pattaya",
      coordinates: { lat: 12.9156, lng: 100.8734 },
      distance: 0.8,
    },
    contact: {
      phone: "+66 38 710 808",
      social: {
        instagram: "@insomniaclub",
        facebook: "insomniaclubpattaya",
      },
    },
    hours: {
      monday: { open: "22:00", close: "04:00", isOpen: false },
      tuesday: { open: "22:00", close: "04:00", isOpen: false },
      wednesday: { open: "22:00", close: "04:00", isOpen: true },
      thursday: { open: "22:00", close: "04:00", isOpen: true },
      friday: { open: "22:00", close: "04:00", isOpen: true },
      saturday: { open: "22:00", close: "04:00", isOpen: true },
      sunday: { open: "22:00", close: "04:00", isOpen: true },
    },
    images: ["/insomnia-club-main.jpg", "/insomnia-club-dj.jpg"],
    tags: ["nightclub", "walking street", "vip", "international djs"],
    features: ["vip-tables", "bottle-service", "dance-floor", "light-show", "sound-system"],
    isOpenNow: true,
    isFeatured: true,
    specialOffers: ["Free Entry Before 11 PM", "Bottle Service Packages"],
    dressCode: "No Flip Flops",
    ageRestriction: "18+",
    capacity: 500,
    musicGenre: ["EDM", "House", "Techno", "Hip Hop"],
    events: [
      { date: "2024-02-24", title: "International DJ Festival", time: "23:00" },
      { date: "2024-02-26", title: "Neon Party Night", time: "22:30" },
    ],
  },
  {
    id: "beach-bar-sunset",
    name: "Sunset Beach Bar",
    description: "Relaxed beachfront bar perfect for sunset drinks and live acoustic music",
    category: "beach-bar",
    subcategory: "beach bar",
    tier: "silver",
    rating: 4.4,
    reviewCount: 156,
    priceRange: "$$",
    location: {
      address: "Jomtien Beach Road, Pattaya",
      coordinates: { lat: 12.8967, lng: 100.8756 },
      distance: 2.3,
    },
    contact: {
      phone: "+66 38 456 789",
      social: {
        instagram: "@sunsetbeachbar",
        facebook: "sunsetbeachbarpattaya",
      },
    },
    hours: {
      monday: { open: "16:00", close: "01:00", isOpen: true },
      tuesday: { open: "16:00", close: "01:00", isOpen: true },
      wednesday: { open: "16:00", close: "01:00", isOpen: true },
      thursday: { open: "16:00", close: "01:00", isOpen: true },
      friday: { open: "16:00", close: "02:00", isOpen: true },
      saturday: { open: "16:00", close: "02:00", isOpen: true },
      sunday: { open: "16:00", close: "01:00", isOpen: true },
    },
    images: ["/sunset-beach-bar.jpg", "/sunset-beach-acoustic.jpg"],
    tags: ["beach", "sunset", "acoustic", "chill"],
    features: ["beachfront", "live-music", "happy-hour", "sunset-view", "outdoor-seating"],
    isOpenNow: true,
    isFeatured: false,
    specialOffers: ["Happy Hour 4-7 PM", "Sunset Special Cocktails"],
    dressCode: "Casual",
    ageRestriction: "All Ages",
    capacity: 80,
    musicGenre: ["Acoustic", "Chill", "Reggae"],
    events: [
      { date: "2024-02-25", title: "Acoustic Sunday Sessions", time: "18:00" },
      { date: "2024-02-27", title: "Beach Bonfire Night", time: "19:00" },
    ],
  },
]

const ATMOSPHERE_FILTERS = [
  { id: "upscale", label: "Upscale" },
  { id: "casual", label: "Casual" },
  { id: "romantic", label: "Romantic" },
  { id: "energetic", label: "Energetic" },
  { id: "relaxed", label: "Relaxed" },
  { id: "trendy", label: "Trendy" },
]

const MUSIC_GENRES = [
  { id: "house", label: "House" },
  { id: "edm", label: "EDM" },
  { id: "hip-hop", label: "Hip Hop" },
  { id: "rock", label: "Rock" },
  { id: "pop", label: "Pop" },
  { id: "jazz", label: "Jazz" },
  { id: "acoustic", label: "Acoustic" },
  { id: "reggae", label: "Reggae" },
]

const FEATURES_FILTERS = [
  { id: "vip-area", label: "VIP Area" },
  { id: "dance-floor", label: "Dance Floor" },
  { id: "outdoor-seating", label: "Outdoor Seating" },
  { id: "live-music", label: "Live Music" },
  { id: "happy-hour", label: "Happy Hour" },
  { id: "bottle-service", label: "Bottle Service" },
  { id: "food-menu", label: "Food Menu" },
  { id: "parking", label: "Parking" },
]

export function NightlifeDirectory() {
  const [venues, setVenues] = useState<Business[]>([])
  const [filteredVenues, setFilteredVenues] = useState<Business[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<string[]>([])
  const [selectedMusicGenres, setSelectedMusicGenres] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string[]>([])
  const [openNow, setOpenNow] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      localDB.init()
      // Use featured venues as mock data
      setVenues(FEATURED_VENUES as any)
      setFilteredVenues(FEATURED_VENUES as any)
      setLoading(false)
    }
    initializeData()
  }, [])

  useEffect(() => {
    let filtered = [...venues]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(query) ||
          venue.description.toLowerCase().includes(query) ||
          venue.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          venue.address?.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((venue) => venue.category === selectedCategory)
    }

    // Apply open now filter
    if (openNow) {
      filtered = filtered.filter((venue) => venue.isOpen)
    }

    // Apply price range filter
    if (priceRange.length > 0) {
      filtered = filtered.filter((venue) => priceRange.includes(venue.priceRange || "$"))
    }

    // Apply features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter((venue) => selectedFeatures.some((feature) => venue.features?.includes(feature)))
    }

    // Sort venues
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
        default: // featured
          return 0
      }
    })

    setFilteredVenues(filtered)
  }, [venues, searchQuery, selectedCategory, openNow, priceRange, selectedFeatures, sortBy])

  const handleAtmosphereChange = (atmosphere: string, checked: boolean) => {
    setSelectedAtmosphere((prev) => (checked ? [...prev, atmosphere] : prev.filter((a) => a !== atmosphere)))
  }

  const handleMusicGenreChange = (genre: string, checked: boolean) => {
    setSelectedMusicGenres((prev) => (checked ? [...prev, genre] : prev.filter((g) => g !== genre)))
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setSelectedFeatures((prev) => (checked ? [...prev, feature] : prev.filter((f) => f !== feature)))
  }

  const handlePriceRangeChange = (price: string, checked: boolean) => {
    setPriceRange((prev) => (checked ? [...prev, price] : prev.filter((p) => p !== price)))
  }

  const formatHours = (hours: any) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const todayHours = hours[today]
    if (!todayHours) return "Hours not available"
    return `${todayHours.open} - ${todayHours.close}`
  }

  const getOpenStatus = (venue: any) => {
    if (venue.isOpen) {
      return { status: "Open", color: "text-green-500" }
    } else {
      return { status: "Closed", color: "text-red-500" }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading nightlife venues...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Bars & Nightlife</h1>
              <p className="text-purple-200">
                Discover the best bars, clubs, and entertainment venues • SportsBarz.co Integration
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-300 hover:bg-purple-800 bg-transparent"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events Tonight
              </Button>
              <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                <Zap className="h-4 w-4 mr-2" />
                VIP Booking
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search bars, clubs, or entertainment venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="open-now" checked={openNow} onCheckedChange={(checked) => setOpenNow(checked as boolean)} />
              <label htmlFor="open-now" className="text-sm text-purple-200">
                Open now
              </label>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 border-purple-300 text-purple-300 hover:bg-purple-800"
            >
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
              className={
                selectedCategory === "all"
                  ? "bg-purple-600 text-white"
                  : "border-purple-300 text-purple-300 hover:bg-purple-800"
              }
            >
              All Venues
            </Button>
            {NIGHTLIFE_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? category.color + " text-white"
                    : "border-purple-300 text-purple-300 hover:bg-purple-800"
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 border-b border-gray-700 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-white mb-3">Price Range</h3>
                <div className="space-y-2">
                  {["$", "$$", "$$$", "$$$$"].map((price) => (
                    <div key={price} className="flex items-center space-x-2">
                      <Checkbox
                        id={price}
                        checked={priceRange.includes(price)}
                        onCheckedChange={(checked) => handlePriceRangeChange(price, checked as boolean)}
                      />
                      <label htmlFor={price} className="text-sm text-gray-300">
                        {price}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atmosphere */}
              <div>
                <h3 className="font-semibold text-white mb-3">Atmosphere</h3>
                <div className="space-y-2">
                  {ATMOSPHERE_FILTERS.map((atmosphere) => (
                    <div key={atmosphere.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={atmosphere.id}
                        checked={selectedAtmosphere.includes(atmosphere.id)}
                        onCheckedChange={(checked) => handleAtmosphereChange(atmosphere.id, checked as boolean)}
                      />
                      <label htmlFor={atmosphere.id} className="text-sm text-gray-300">
                        {atmosphere.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Music Genre */}
              <div>
                <h3 className="font-semibold text-white mb-3">Music Genre</h3>
                <div className="space-y-2">
                  {MUSIC_GENRES.slice(0, 6).map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={genre.id}
                        checked={selectedMusicGenres.includes(genre.id)}
                        onCheckedChange={(checked) => handleMusicGenreChange(genre.id, checked as boolean)}
                      />
                      <label htmlFor={genre.id} className="text-sm text-gray-300">
                        {genre.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-white mb-3">Features</h3>
                <div className="space-y-2">
                  {FEATURES_FILTERS.slice(0, 6).map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={(checked) => handleFeatureChange(feature.id, checked as boolean)}
                      />
                      <label htmlFor={feature.id} className="text-sm text-gray-300">
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SportsBarz.co Integration Section */}
      <div className="bg-gradient-to-r from-purple-800 to-pink-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍺</span>
              <div>
                <h3 className="font-semibold text-white">SportsBarz.co Integration</h3>
                <p className="text-sm text-purple-200">
                  Live sports fixtures • Best sports bars • Real-time game schedules
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-white text-purple-800 hover:bg-gray-100">
              View Sports Schedule
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-300">{filteredVenues.length} venues found</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-sm text-white"
              >
                <option value="featured">Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="distance">Nearest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-purple-600" : "border-purple-300 text-purple-300"}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-purple-600" : "border-purple-300 text-purple-300"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Venues Grid */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredVenues.map((venue: any) => (
            <Card
              key={venue.id}
              className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={venue.images?.[0] || "/placeholder.svg?height=200&width=400&query=nightclub"}
                  alt={venue.name}
                  className={`w-full object-cover ${viewMode === "grid" ? "h-48" : "h-32"}`}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {venue.tier === "platinum" && <Badge className="bg-gray-800 text-white text-xs">PLATINUM</Badge>}
                  {venue.tier === "gold" && <Badge className="bg-yellow-500 text-gray-900 text-xs">GOLD</Badge>}
                  {venue.isFeatured && <Badge className="bg-purple-600 text-white text-xs">Featured</Badge>}
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={`text-xs ${getOpenStatus(venue).color} bg-gray-900/80`}>
                    {getOpenStatus(venue).status}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-black/60 text-white text-xs">{venue.priceRange}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-white line-clamp-1">{venue.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{venue.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{venue.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{venue.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{venue.hours?.open} - {venue.hours?.close}</span>
                  </div>
                  {venue.musicGenre && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Music className="h-4 w-4" />
                      <span>{venue.musicGenre.slice(0, 2).join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {venue.tags?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {venue.specialOffers && venue.specialOffers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-purple-400 font-medium">Special Offers:</p>
                    <p className="text-xs text-gray-400">{venue.specialOffers[0]}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {venue.contact?.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    {venue.contact?.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                    {venue.contact?.social?.instagram && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Instagram className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-600 text-purple-400 hover:bg-purple-900 bg-transparent"
                    >
                      Details
                    </Button>
                    <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                      <Zap className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No venues found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search terms to find more venues.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedAtmosphere([])
                setSelectedMusicGenres([])
                setSelectedFeatures([])
                setPriceRange([])
                setOpenNow(false)
              }}
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-900"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
