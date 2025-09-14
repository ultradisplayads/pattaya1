"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Clock, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    rating: [0],
    priceRange: "",
    distance: [5],
    openNow: false,
    hasDeals: false,
    verified: false,
  })

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch()
    }
  }, [searchQuery, filters])

  const performSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: filters.category,
        rating: filters.rating[0].toString(),
        priceRange: filters.priceRange,
        distance: filters.distance[0].toString(),
        openNow: filters.openNow.toString(),
        hasDeals: filters.hasDeals.toString(),
        verified: filters.verified.toString(),
      })

      const response = await fetch(`/api/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: "", label: "All Categories" },
    { value: "restaurants", label: "Restaurants" },
    { value: "hotels", label: "Hotels" },
    { value: "attractions", label: "Attractions" },
    { value: "shopping", label: "Shopping" },
    { value: "services", label: "Services" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Pattaya</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for businesses, attractions, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="sticky top-8">
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Minimum Rating: {filters.rating[0]} stars</Label>
                  <Slider
                    value={filters.rating}
                    onValueChange={(value) => setFilters({ ...filters, rating: value })}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Distance: {filters.distance[0]} km</Label>
                  <Slider
                    value={filters.distance}
                    onValueChange={(value) => setFilters({ ...filters, distance: value })}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="openNow"
                      checked={filters.openNow}
                      onCheckedChange={(checked) => setFilters({ ...filters, openNow: checked as boolean })}
                    />
                    <Label htmlFor="openNow">Open now</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasDeals"
                      checked={filters.hasDeals}
                      onCheckedChange={(checked) => setFilters({ ...filters, hasDeals: checked as boolean })}
                    />
                    <Label htmlFor="hasDeals">Has deals</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={filters.verified}
                      onCheckedChange={(checked) => setFilters({ ...filters, verified: checked as boolean })}
                    />
                    <Label htmlFor="verified">Verified business</Label>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() =>
                    setFilters({
                      category: "",
                      rating: [0],
                      priceRange: "",
                      distance: [5],
                      openNow: false,
                      hasDeals: false,
                      verified: false,
                    })
                  }
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {searchQuery && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {loading ? "Searching..." : `${results.length} results for "${searchQuery}"`}
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {results.map((result: any) => (
                  <SearchResultCard key={result.id} result={result} viewMode={viewMode} />
                ))}
              </div>
            )}

            {!loading && results.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchResultCard({ result, viewMode }: { result: any; viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Image
              src={result.image || "/placeholder.svg?height=100&width=100"}
              alt={result.name}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {result.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{result.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-3 line-clamp-2">{result.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{result.address}</span>
                </div>
                {result.isOpen && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-green-600">Open now</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge variant="outline">{result.category}</Badge>
                  {result.hasDeals && <Badge className="bg-red-500 text-white">Deals</Badge>}
                </div>
                <Button size="sm">View Details</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 group">
      <div className="aspect-video relative">
        <Image
          src={result.image || "/placeholder.svg?height=200&width=400"}
          alt={result.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-800">
            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
            {result.rating}
          </Badge>
        </div>
        {result.hasDeals && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 text-white">Deals</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer transition-colors">
          {result.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{result.description}</p>

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{result.address}</span>
          </div>
          {result.isOpen && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="text-green-600">Open now</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline">{result.category}</Badge>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
