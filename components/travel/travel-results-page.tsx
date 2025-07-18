"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Plane, Hotel, Car, Package, Filter, SortAsc } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface TravelResult {
  id: string
  type: string
  title: string
  description: string
  price: number
  currency: string
  provider: string
  rating: number
  image: string
  features: string[]
}

export function TravelResultsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<TravelResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searchType, setSearchType] = useState("")

  useEffect(() => {
    const type = searchParams.get("type") || "flights"
    const from = searchParams.get("from") || ""
    const to = searchParams.get("to") || ""

    setSearchType(type)
    fetchTravelResults(type, from, to)
  }, [searchParams])

  const fetchTravelResults = async (type: string, from: string, to: string) => {
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock results based on search type
    const mockResults: TravelResult[] = [
      {
        id: "1",
        type: type,
        title: type === "flights" ? `${from} → ${to}` : `Hotel in ${to}`,
        description: type === "flights" ? "Direct flight, 2h 30m" : "Luxury beachfront resort",
        price: type === "flights" ? 299 : 150,
        currency: "USD",
        provider: type === "flights" ? "Thai Airways" : "Booking.com",
        rating: 4.5,
        image: "/placeholder.svg?height=200&width=300",
        features: type === "flights" ? ["Direct", "Meals included", "WiFi"] : ["Pool", "Beach access", "Spa"],
      },
      {
        id: "2",
        type: type,
        title: type === "flights" ? `${from} → ${to}` : `Hotel in ${to}`,
        description: type === "flights" ? "Via Bangkok, 4h 15m" : "City center boutique hotel",
        price: type === "flights" ? 199 : 89,
        currency: "USD",
        provider: type === "flights" ? "Bangkok Airways" : "Agoda",
        rating: 4.2,
        image: "/placeholder.svg?height=200&width=300",
        features: type === "flights" ? ["1 stop", "Entertainment"] : ["Restaurant", "Gym", "WiFi"],
      },
    ]

    setResults(mockResults)
    setLoading(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flights":
        return <Plane className="w-5 h-5" />
      case "hotels":
        return <Hotel className="w-5 h-5" />
      case "cars":
        return <Car className="w-5 h-5" />
      case "packages":
        return <Package className="w-5 h-5" />
      default:
        return <Plane className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            {getTypeIcon(searchType)}
            <h1 className="text-3xl font-bold capitalize">{searchType} Results</h1>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">{loading ? "Searching..." : `Found ${results.length} results`}</p>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading
            ? // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Skeleton className="w-48 h-32 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : // Actual results
              results.map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <img
                        src={result.image || "/placeholder.svg"}
                        alt={result.title}
                        className="w-48 h-32 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">{result.title}</h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">{result.rating}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{result.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {result.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-gray-500">via {result.provider}</p>
                      </div>

                      <div className="text-right">
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-green-600">${result.price}</span>
                          <span className="text-gray-500 text-sm block">{result.currency}</span>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* No results */}
        {!loading && results.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">{getTypeIcon(searchType)}</div>
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
