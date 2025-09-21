"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import {
  Heart,
  Star,
  MapPin,
  Clock,
  Users,
  Waves,
  Camera,
  Share2,
  Filter,
  Search,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  MessageCircle,
  ThumbsUp,
  Thermometer,
  Droplets,
  Sun,
  Wifi,
  Car,
  Utensils,
  ShoppingBag,
  Music,
  Gamepad2,
  Dumbbell,
  Umbrella,
} from "lucide-react"

const beaches = [
  {
    id: 1,
    name: "Pattaya Beach",
    category: "Party · Family",
    image: "/api/placeholder/60/60",
    description:
      "The city's 4km crescent backed by malls and the famous Walking Street. Watersports by day and neon by night.",
    isActive: true,
    rating: 4.2,
    visitors: "2.1k",
    distance: "0.5km",
    activities: ["Jet Ski", "Parasailing", "Beach Volleyball"],
    bestTime: "Evening",
    crowdLevel: "High",
    tags: ["Nightlife", "Shopping", "Water Sports"],
    weather: { temp: 32, condition: "Sunny" },
    liveViews: 847,
  },
  {
    id: 2,
    name: "Wong Amat Beach",
    category: "Luxury · Quiet",
    image: "/api/placeholder/60/60",
    rating: 4.7,
    visitors: "456",
    distance: "2.1km",
    activities: ["Swimming", "Sunbathing", "Fine Dining"],
    bestTime: "Morning",
    crowdLevel: "Low",
    tags: ["Luxury", "Peaceful", "Clean"],
    weather: { temp: 30, condition: "Partly Cloudy" },
    liveViews: 234,
  },
  {
    id: 3,
    name: "Jomtien Beach (Hub)",
    category: "Family · Quiet",
    image: "/api/placeholder/60/60",
    rating: 4.4,
    visitors: "1.3k",
    distance: "3.2km",
    activities: ["Windsurfing", "Beach Games", "Family Fun"],
    bestTime: "All Day",
    crowdLevel: "Medium",
    tags: ["Family Friendly", "Water Sports", "Restaurants"],
    weather: { temp: 31, condition: "Sunny" },
    liveViews: 567,
  },
  {
    id: 4,
    name: "Na Jomtien",
    category: "Luxury · Quiet",
    image: "/api/placeholder/60/60",
    rating: 4.6,
    visitors: "289",
    distance: "5.8km",
    activities: ["Snorkeling", "Kayaking", "Spa"],
    bestTime: "Morning",
    crowdLevel: "Low",
    tags: ["Pristine", "Snorkeling", "Luxury"],
    weather: { temp: 29, condition: "Clear" },
    liveViews: 123,
  },
  {
    id: 5,
    name: "Bang Saray",
    category: "Quiet · Hidden",
    image: "/api/placeholder/60/60",
    rating: 4.8,
    visitors: "156",
    distance: "12.4km",
    activities: ["Fishing", "Photography", "Hiking"],
    bestTime: "Sunrise",
    crowdLevel: "Very Low",
    tags: ["Hidden Gem", "Photography", "Peaceful"],
    weather: { temp: 28, condition: "Perfect" },
    liveViews: 89,
  },
  {
    id: 6,
    name: "Rayong Coast (Saeng Chan - Laem Charaoen)",
    category: "Family · Hidden",
    image: "/api/placeholder/60/60",
    rating: 4.5,
    visitors: "678",
    distance: "45.2km",
    activities: ["Island Hopping", "Seafood", "Camping"],
    bestTime: "Weekend",
    crowdLevel: "Medium",
    tags: ["Island Hopping", "Seafood", "Adventure"],
    weather: { temp: 30, condition: "Breezy" },
    liveViews: 345,
  },
]

const tabs = [
  "Overview",
  "Zones",
  "Photos",
  "Food",
  "Nightlife",
  "Shopping",
  "Events",
  "Hidden Gems",
  "Transport",
  "Tips",
]

const trendingBeaches = [
  { name: "Wong Amat Beach", trend: "+15%" },
  { name: "Bang Saray", trend: "+23%" },
  { name: "Na Jomtien", trend: "+8%" },
  { name: "Koh Larn", trend: "+31%" },
  { name: "Jomtien Beach", trend: "+12%" },
]

export function BeachDiscoveryInterface() {
  const [selectedBeach, setSelectedBeach] = useState(beaches[0])
  const [activeTab, setActiveTab] = useState("Overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState("all")
  const [selectedVibe, setSelectedVibe] = useState("all")
  const [favorites, setFavorites] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(0)
  const [weatherExpanded, setWeatherExpanded] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [newReview, setNewReview] = useState("")
  const [userRating, setUserRating] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredBeaches = beaches.filter((beach) => {
    const matchesSearch =
      beach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beach.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesArea = selectedArea === "all" || beach.name.toLowerCase().includes(selectedArea)
    const matchesVibe = selectedVibe === "all" || beach.category.toLowerCase().includes(selectedVibe)
    return matchesSearch && matchesArea && matchesVibe
  })

  const toggleFavorite = (beachId: number) => {
    setFavorites((prev) => (prev.includes(beachId) ? prev.filter((id) => id !== beachId) : [...prev, beachId]))
  }

  const photoGallery = [
    { id: 1, url: "/api/placeholder/800/600", caption: "Sunset view from Pattaya Beach", likes: 234, comments: 12 },
    { id: 2, url: "/api/placeholder/800/600", caption: "Water sports activities", likes: 189, comments: 8 },
    { id: 3, url: "/beach-volleyball-players.jpg", caption: "Beach volleyball tournament", likes: 156, comments: 15 },
    { id: 4, url: "/night-market-street-food.jpg", caption: "Night market nearby", likes: 298, comments: 23 },
    { id: 5, url: "/luxury-beach-resort.png", caption: "Luxury beachfront hotels", likes: 167, comments: 9 },
  ]

  const reviews = [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      date: "2 days ago",
      comment: "Amazing beach with crystal clear water! Perfect for families.",
      avatar: "/api/placeholder/40/40",
      helpful: 12,
    },
    {
      id: 2,
      user: "Mike R.",
      rating: 4,
      date: "1 week ago",
      comment: "Great nightlife scene, but can get quite crowded during peak hours.",
      avatar: "/api/placeholder/40/40",
      helpful: 8,
    },
    {
      id: 3,
      user: "Lisa K.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best sunset views in Pattaya! Highly recommend the beachside restaurants.",
      avatar: "/api/placeholder/40/40",
      helpful: 15,
    },
  ]

  const weatherForecast = [
    { day: "Today", temp: 32, condition: "Sunny", icon: Sun, rain: 0 },
    { day: "Tomorrow", temp: 30, condition: "Partly Cloudy", icon: Sun, rain: 10 },
    { day: "Wed", temp: 28, condition: "Light Rain", icon: Droplets, rain: 60 },
    { day: "Thu", temp: 31, condition: "Sunny", icon: Sun, rain: 5 },
    { day: "Fri", temp: 29, condition: "Cloudy", icon: Sun, rain: 20 },
  ]

  const amenities = [
    { icon: Wifi, name: "Free WiFi", available: true },
    { icon: Car, name: "Parking", available: true },
    { icon: Utensils, name: "Restaurants", available: true },
    { icon: ShoppingBag, name: "Shopping", available: true },
    { icon: Music, name: "Live Music", available: false },
    { icon: Gamepad2, name: "Beach Games", available: true },
    { icon: Dumbbell, name: "Fitness Area", available: false },
    { icon: Umbrella, name: "Umbrella Rental", available: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-100 to-blue-100 px-6 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-teal-400 rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-spin-slow">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                Beaches of Pattaya • Na Jomtien • Bang Saray • Rayong
              </h1>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          <p className="text-slate-600 mb-6">
            Granular zones, hidden gems, transport, food, nightlife, shopping, events & community tips.
          </p>
          <div className="flex gap-3">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-4 py-2 transition-all hover:scale-105">
              Enable beach nudges
            </Button>
            <Button
              variant="outline"
              className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 rounded-full px-4 py-2 transition-all hover:scale-105"
            >
              <Camera className="w-4 h-4 mr-2" />
              Open Photos
            </Button>
            <Button
              variant="outline"
              className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 rounded-full px-4 py-2 transition-all hover:scale-105"
            >
              Open Directory
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6 shadow-lg">
          {/* Find a Beach Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Find a Beach</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Area</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="pattaya">Pattaya</SelectItem>
                    <SelectItem value="jomtien">Jomtien</SelectItem>
                    <SelectItem value="rayong">Rayong</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-1 block">Vibe</label>
                <Select value={selectedVibe} onValueChange={setSelectedVibe}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="quiet">Quiet</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6 relative">
              <label className="text-sm text-slate-600 mb-1 block">Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search beaches or zones"
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Beaches List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Beaches ({filteredBeaches.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredBeaches.map((beach) => (
                <Card
                  key={beach.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                    selectedBeach.id === beach.id ? "ring-2 ring-cyan-500 bg-cyan-50" : ""
                  }`}
                  onClick={() => setSelectedBeach(beach)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Waves className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-800 truncate">{beach.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(beach.id)
                            }}
                            className="p-1 h-auto"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorites.includes(beach.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                              }`}
                            />
                          </Button>
                        </div>
                        <p className="text-sm text-slate-500">{beach.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-slate-600">{beach.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-600">{beach.visitors}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-slate-600">{beach.liveViews}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top 10 Trending */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-slate-800">Top 5 Trending</h3>
            </div>
            <div className="space-y-2">
              {trendingBeaches.map((beach, index) => (
                <div
                  key={beach.name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                    <span className="text-sm text-slate-700">{beach.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-green-600 bg-green-100">
                    {beach.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostics */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Diagnostics</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-slate-500">All systems operational</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Hero Image with Interactive Dots */}
          <div className="relative mb-6 group">
            <div className="w-full h-80 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 rounded-2xl overflow-hidden relative shadow-2xl">
              <Image
                src="/pattaya-sunset-hero.png"
                alt="Pattaya Beach sunset"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
              <div className="absolute inset-0">
                <div
                  className="absolute top-16 left-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform"
                  title="Beach Bar"
                ></div>
                <div
                  className="absolute top-20 right-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform"
                  title="Water Sports"
                ></div>
                <div
                  className="absolute bottom-32 left-1/3 w-4 h-4 bg-cyan-400 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform"
                  title="Restaurant"
                ></div>
                <div
                  className="absolute bottom-28 right-1/3 w-4 h-4 bg-cyan-400 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform"
                  title="Hotel"
                ></div>
                <div
                  className="absolute bottom-24 right-1/5 w-4 h-4 bg-cyan-400 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform"
                  title="Viewpoint"
                ></div>
                <div
                  className="absolute bottom-20 right-1/6 w-4 h-4 bg-cyan-400 rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform"
                  title="Parking"
                ></div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                >
                  {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => setIsSoundOn(!isSoundOn)}
                >
                  {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Dialog open={isPhotoGalleryOpen} onOpenChange={setIsPhotoGalleryOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Photo Gallery - {selectedBeach.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <Image
                          src={photoGallery[selectedPhoto].url || "/placeholder.svg"}
                          alt={photoGallery[selectedPhoto].caption}
                          width={400}
                          height={300}
                          className="rounded-lg object-cover w-full"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {photoGallery[selectedPhoto].likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {photoGallery[selectedPhoto].comments}
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {photoGallery.map((photo, index) => (
                          <div
                            key={photo.id}
                            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                              selectedPhoto === index ? "border-cyan-500" : "border-transparent"
                            }`}
                            onClick={() => setSelectedPhoto(index)}
                          >
                            <Image
                              src={photo.url || "/placeholder.svg"}
                              alt={photo.caption}
                              width={150}
                              height={100}
                              className="object-cover w-full h-20"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{selectedBeach.liveViews} watching</span>
              </div>
            </div>
          </div>

          {/* Beach Info Header */}
          <div className="mb-6 bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedBeach.name}</h1>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedBeach.rating}</span>
                    <span className="text-slate-500">({selectedBeach.visitors} visitors)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{selectedBeach.distance}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      selectedBeach.crowdLevel === "High"
                        ? "border-red-300 text-red-600"
                        : selectedBeach.crowdLevel === "Medium"
                          ? "border-yellow-300 text-yellow-600"
                          : "border-green-300 text-green-600"
                    }`}
                  >
                    {selectedBeach.crowdLevel} crowd
                  </Badge>
                </div>
                <div className="flex gap-2 mb-3">
                  {selectedBeach.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-cyan-100 text-cyan-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800">{selectedBeach.weather.temp}°C</div>
                <div className="text-sm text-slate-600">{selectedBeach.weather.condition}</div>
                <div className="text-xs text-slate-500 mt-1">Best time: {selectedBeach.bestTime}</div>
              </div>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">{selectedBeach.description}</p>
          </div>

          {/* Enhanced Tabs with Rich Content */}
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="text-xs">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="Overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-spin-slow">
                          <Waves className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Morning vibe</h2>
                      </div>
                      <p className="text-slate-600">Early walkers, runners, coffee carts; calm seas most days.</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-spin-slow">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Facilities & safety</h2>
                      </div>
                      <p className="text-slate-600">
                        Public toilets/showers by zone; swim in roped areas; watch jet-ski/boat lanes.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-spin-slow">
                          <Waves className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Activities</h2>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedBeach.activities.map((activity) => (
                          <Badge key={activity} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-spin-slow">
                          <Thermometer className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Weather Forecast</h2>
                      </div>
                      <div className="space-y-2">
                        {(weatherExpanded ? weatherForecast : weatherForecast.slice(0, 2)).map((day) => (
                          <div key={day.day} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <day.icon className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{day.day}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{day.temp}°C</span>
                              <div className="flex items-center gap-1">
                                <Droplets className="w-3 h-3 text-blue-400" />
                                <span className="text-xs text-slate-500">{day.rain}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setWeatherExpanded(!weatherExpanded)}
                        className="mt-4"
                      >
                        {weatherExpanded ? "Less" : "More"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-spin-slow">
                          <Umbrella className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Amenities</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {amenities.map((amenity) => (
                          <div
                            key={amenity.name}
                            className={`flex items-center gap-2 p-2 rounded-lg ${
                              amenity.available ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
                            }`}
                          >
                            <amenity.icon className="w-4 h-4" />
                            <span className="text-xs">{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="Photos" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photoGallery.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => {
                        setSelectedPhoto(index)
                        setIsPhotoGalleryOpen(true)
                      }}
                    >
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption}
                        width={300}
                        height={200}
                        className="object-cover w-full h-48 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">{photo.caption}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="Food" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-slate-800 mb-4">Popular Restaurants</h3>
                      <div className="space-y-3">
                        {[
                          { name: "Beachside Grill", cuisine: "Seafood", rating: 4.5, price: "$$" },
                          { name: "Sunset Bar", cuisine: "International", rating: 4.2, price: "$$$" },
                          { name: "Local Thai Kitchen", cuisine: "Thai", rating: 4.7, price: "$" },
                        ].map((restaurant) => (
                          <div
                            key={restaurant.name}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium">{restaurant.name}</h4>
                              <p className="text-sm text-slate-600">
                                {restaurant.cuisine} • {restaurant.price}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{restaurant.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-slate-800 mb-4">Street Food Spots</h3>
                      <div className="space-y-3">
                        {[
                          { name: "Night Market Stalls", specialty: "Pad Thai, Mango Sticky Rice", hours: "6PM - 2AM" },
                          { name: "Beach Vendors", specialty: "Fresh Coconut, Grilled Seafood", hours: "All Day" },
                          { name: "Walking Street Food", specialty: "Som Tam, Satay", hours: "7PM - 3AM" },
                        ].map((spot) => (
                          <div key={spot.name} className="p-3 bg-slate-50 rounded-lg">
                            <h4 className="font-medium">{spot.name}</h4>
                            <p className="text-sm text-slate-600">{spot.specialty}</p>
                            <p className="text-xs text-slate-500">{spot.hours}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="Tips" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800">Reviews & Tips</h3>
                        <Button variant="outline" size="sm" onClick={() => setShowReviews(!showReviews)}>
                          {showReviews ? "Write Review" : "View All Reviews"}
                        </Button>
                      </div>
                      {showReviews ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b border-slate-200 pb-4 last:border-b-0">
                              <div className="flex items-start gap-3">
                                <Image
                                  src={review.avatar || "/placeholder.svg"}
                                  alt={review.user}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{review.user}</span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-slate-500">{review.date}</span>
                                  </div>
                                  <p className="text-slate-700 mb-2">{review.comment}</p>
                                  <Button variant="ghost" size="sm" className="text-slate-500">
                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                    Helpful ({review.helpful})
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-6 h-6 cursor-pointer transition-colors ${
                                  i < userRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300 hover:text-yellow-400"
                                }`}
                                onClick={() => setUserRating(i + 1)}
                              />
                            ))}
                          </div>
                          <textarea
                            placeholder="Share your experience at this beach..."
                            className="w-full p-3 border border-slate-300 rounded-lg resize-none"
                            rows={4}
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                          />
                          <Button className="bg-cyan-600 hover:bg-cyan-700">Submit Review</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
