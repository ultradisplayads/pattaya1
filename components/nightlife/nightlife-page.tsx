"use client"

import { useState, useEffect } from "react"
import { Shield, MapPin, Clock, Star, Users, Music, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export function NightlifePage() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [ageVerified, setAgeVerified] = useState(false)

  useEffect(() => {
    // Check age verification
    const verified = localStorage.getItem("age-verified")
    if (verified) {
      setAgeVerified(true)
      loadVenues()
    } else {
      // Redirect to age gate
      window.location.href = "/"
    }
  }, [])

  const loadVenues = async () => {
    try {
      const response = await fetch("/api/nightlife/venues")
      if (response.ok) {
        const data = await response.json()
        setVenues(data.data || [])
      }
    } catch (error) {
      console.error("Failed to load venues:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: "all", label: "All Venues" },
    { value: "bars", label: "Bars & Pubs" },
    { value: "clubs", label: "Night Clubs" },
    { value: "lounges", label: "Lounges" },
    { value: "karaoke", label: "Karaoke" },
    { value: "adult", label: "Adult Entertainment" },
  ]

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      !searchTerm ||
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || venue.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (!ageVerified) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-purple-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-64 bg-purple-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-8 w-8 text-pink-400" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Pattaya Nightlife
                </h1>
                <Badge className="bg-red-500 text-white">18+</Badge>
              </div>
              <p className="text-purple-200">Discover the best nightlife venues in Pattaya</p>
            </div>
          </div>

          {/* Warning Banner */}
          <Card className="bg-red-500/20 border-red-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-300">Adult Content Area</h3>
                  <p className="text-sm text-red-200">
                    This section contains information about adult entertainment venues. Must be 18+ to access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-purple-800/50 border-pink-500/30 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />
                <Input
                  placeholder="Search venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-purple-900/50 border-pink-500/30 text-white placeholder-purple-300"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-purple-900/50 border-pink-500/30 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-purple-900 border-pink-500/30">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-white">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-purple-200 text-sm flex items-center">{filteredVenues.length} venues found</div>
            </div>
          </CardContent>
        </Card>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <NightlifeVenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-200 mb-2">No venues found</h3>
            <p className="text-purple-300">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

function NightlifeVenueCard({ venue }: { venue: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-200 hover:scale-105 group bg-purple-800/30 border-pink-500/30">
      <div className="aspect-video relative">
        <Image
          src={venue.image || "/placeholder.svg?height=200&width=400"}
          alt={venue.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge className={`${venue.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {venue.isOpen ? "OPEN" : "CLOSED"}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-pink-500 text-white">{venue.category}</Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg mb-1">{venue.name}</h3>
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{venue.rating}</span>
            <span>•</span>
            <span>{venue.reviewCount} reviews</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-purple-200 text-sm mb-4 line-clamp-2">{venue.description}</p>

        <div className="space-y-2 text-sm text-purple-300 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{venue.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{venue.hours}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{venue.capacity} capacity</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {venue.features?.slice(0, 2).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs border-pink-400 text-pink-300">
                {feature}
              </Badge>
            ))}
          </div>
          <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
