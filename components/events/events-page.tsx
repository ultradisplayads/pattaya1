"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, MapPin, Clock, Users, Ticket, Filter, Grid, List, Music, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { localDB } from "@/lib/database/local-storage"
import type { Event } from "@/lib/database/local-storage"

const EVENT_CATEGORIES = [
  { id: "music", label: "Music & Concerts", icon: Music, color: "bg-purple-500" },
  { id: "food", label: "Food & Drink", icon: Utensils, color: "bg-orange-500" },
  { id: "nightlife", label: "Nightlife", icon: "🌙", color: "bg-indigo-500" },
  { id: "workshop", label: "Workshops", icon: "🎨", color: "bg-green-500" },
  { id: "sports", label: "Sports", icon: "⚽", color: "bg-blue-500" },
  { id: "culture", label: "Culture", icon: "🎭", color: "bg-pink-500" },
  { id: "business", label: "Business", icon: "💼", color: "bg-gray-500" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦", color: "bg-yellow-500" },
]

const PRICE_RANGES = [
  { id: "free", label: "Free", min: 0, max: 0 },
  { id: "budget", label: "Under ฿500", min: 0, max: 500 },
  { id: "mid", label: "฿500 - ฿1,500", min: 500, max: 1500 },
  { id: "premium", label: "฿1,500+", min: 1500, max: 10000 },
]

const TIME_FILTERS = [
  { id: "morning", label: "Morning (6AM - 12PM)" },
  { id: "afternoon", label: "Afternoon (12PM - 6PM)" },
  { id: "evening", label: "Evening (6PM - 12AM)" },
  { id: "late", label: "Late Night (12AM - 6AM)" },
]

const DATE_FILTERS = [
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "This Weekend" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
]

export function EventsDirectory() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedTimeFilters, setSelectedTimeFilters] = useState<string[]>([])
  const [selectedDateFilters, setSelectedDateFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      localDB.init()
      const data = await localDB.getEvents()
      setEvents(data)
      setFilteredEvents(data)
      setLoading(false)
    }
    initializeData()
  }, [])

  useEffect(() => {
    const applyFilters = async () => {
      const filters = {
        category: selectedCategory,
        priceRanges: selectedPriceRanges,
      }

      let results = await localDB.searchEvents(searchQuery, filters)

      // Sort events
      results.sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          case "price-low":
            return a.price.min - b.price.min
          case "price-high":
            return b.price.min - a.price.min
          case "popular":
            return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
          default: // featured
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        }
      })

      setFilteredEvents(results)
    }

    applyFilters()
  }, [events, searchQuery, selectedCategory, selectedPriceRanges, sortBy])

  const handlePriceRangeChange = (rangeId: string, checked: boolean) => {
    setSelectedPriceRanges((prev) => (checked ? [...prev, rangeId] : prev.filter((id) => id !== rangeId)))
  }

  const handleTimeFilterChange = (timeId: string, checked: boolean) => {
    setSelectedTimeFilters((prev) => (checked ? [...prev, timeId] : prev.filter((id) => id !== timeId)))
  }

  const handleDateFilterChange = (dateId: string, checked: boolean) => {
    setSelectedDateFilters((prev) => (checked ? [...prev, dateId] : prev.filter((id) => id !== dateId)))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatPrice = (price: any) => {
    if (price.min === 0) return "Free"
    if (price.min === price.max) return `฿${price.min.toLocaleString()}`
    return `฿${price.min.toLocaleString()} - ฿${price.max.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Pattaya Events</h1>
              <p className="text-gray-600 mt-1">Discover amazing events happening in Pattaya</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                My Events
              </Button>
              <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                <Ticket className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search events, venues, or organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
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
              className={selectedCategory === "all" ? "bg-green-600 text-white" : ""}
            >
              All Events
            </Button>
            {EVENT_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === category.id ? category.color + " text-white" : ""
                }`}
              >
                {typeof category.icon === "string" ? (
                  <span>{category.icon}</span>
                ) : (
                  <category.icon className="h-4 w-4" />
                )}
                {category.label}
              </Button>
            ))}
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
                      <label htmlFor={range.id} className="text-sm text-gray-700">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time of Day */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Time of Day</h3>
                <div className="space-y-2">
                  {TIME_FILTERS.map((time) => (
                    <div key={time.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={time.id}
                        checked={selectedTimeFilters.includes(time.id)}
                        onCheckedChange={(checked) => handleTimeFilterChange(time.id, checked as boolean)}
                      />
                      <label htmlFor={time.id} className="text-sm text-gray-700">
                        {time.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">When</h3>
                <div className="space-y-2">
                  {DATE_FILTERS.map((date) => (
                    <div key={date.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={date.id}
                        checked={selectedDateFilters.includes(date.id)}
                        onCheckedChange={(checked) => handleDateFilterChange(date.id, checked as boolean)}
                      />
                      <label htmlFor={date.id} className="text-sm text-gray-700">
                        {date.label}
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
                  <option value="date">Date</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
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
            <p className="text-gray-600">{filteredEvents.length} events found</p>
            {(selectedCategory !== "all" || selectedPriceRanges.length > 0) && (
              <div className="flex items-center gap-2">
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {EVENT_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedPriceRanges.map((rangeId) => {
                  const range = PRICE_RANGES.find((r) => r.id === rangeId)
                  return range ? (
                    <Badge key={rangeId} variant="secondary" className="flex items-center gap-1">
                      {range.label}
                      <button
                        onClick={() => handlePriceRangeChange(rangeId, false)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null
                })}
              </div>
            )}
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

        {/* Events Grid */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={event.image || "/placeholder.svg?height=200&width=400&query=event"}
                  alt={event.title}
                  className={`w-full object-cover ${viewMode === "grid" ? "h-48" : "h-32"}`}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {event.isFeatured && <Badge className="bg-green-600 text-white text-xs">Featured</Badge>}
                  {event.isPopular && <Badge className="bg-orange-500 text-white text-xs">Popular</Badge>}
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white text-gray-800 text-xs">{formatDate(event.date)}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{event.title}</h3>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {event.time} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{event.ticketsAvailable} tickets available</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{formatPrice(event.price)}</p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                      <Ticket className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Events
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms to find more events.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedPriceRanges([])
                setSelectedTimeFilters([])
                setSelectedDateFilters([])
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

