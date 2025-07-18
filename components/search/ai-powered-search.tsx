"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Sparkles, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  location: string
  rating: number
  image: string
  distance: number
  isOpen: boolean
  verified: boolean
}

interface SearchSuggestion {
  id: string
  text: string
  type: "location" | "business" | "category"
  icon: string
}

export function AIPoweredSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("pattaya1-recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      loadSuggestions()
    } else {
      setSuggestions([])
    }
  }, [query])

  const loadSuggestions = async () => {
    try {
      const response = await fetch(`/api/ai/search/suggestions?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || getFallbackSuggestions())
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error)
      setSuggestions(getFallbackSuggestions())
    }
  }

  const getFallbackSuggestions = (): SearchSuggestion[] => [
    { id: "1", text: "Restaurants in Pattaya Beach", type: "category", icon: "🍽️" },
    { id: "2", text: "Jomtien Beach activities", type: "location", icon: "🏖️" },
    { id: "3", text: "Walking Street nightlife", type: "location", icon: "🌃" },
    { id: "4", text: "Central Festival shopping", type: "business", icon: "🛍️" },
    { id: "5", text: "Sanctuary of Truth", type: "business", icon: "🏛️" },
  ]

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setShowSuggestions(false)

    try {
      const response = await fetch("/api/ai/search/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          location: "pattaya,jomtien,chonburi",
          useAI: true,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        setShowResults(true)

        // Save to recent searches
        const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem("pattaya1-recent-searches", JSON.stringify(updated))
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setSuggestions([])
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Compact Search Input */}
      <Card className="w-full h-16">
        <CardContent className="p-3 h-full">
          <div className="flex items-center space-x-2 h-full">
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm text-gray-700 whitespace-nowrap">AI Search</span>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1 py-0">
                Gemini
              </Badge>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="AI-powered local search..."
                className="pl-7 pr-20 h-8 text-sm bg-white border border-purple-200 focus:border-purple-400 rounded-md"
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {query && (
                  <Button variant="ghost" size="sm" onClick={clearSearch} className="h-6 w-6 p-0 hover:bg-gray-100">
                    <X className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  onClick={() => handleSearch()}
                  disabled={loading || !query.trim()}
                  size="sm"
                  className="h-6 px-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded text-xs"
                >
                  {loading ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : "Go"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.length > 0 || recentSearches.length > 0) && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-xl border-purple-200">
          <CardContent className="p-0">
            {/* Recent Searches */}
            {query.length === 0 && recentSearches.length > 0 && (
              <div className="p-3 border-b">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-purple-50 rounded"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center space-x-3 px-2 py-2 text-sm hover:bg-purple-50 rounded transition-colors"
                    >
                      <span className="text-lg">{suggestion.icon}</span>
                      <span className="text-gray-700">{suggestion.text}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {suggestion.type}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Compact Search Results */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-40 shadow-xl max-h-96 overflow-y-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Results ({results.length})</h3>
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  AI Filtered
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setShowResults(false)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {results.slice(0, 5).map((result) => (
                <div
                  key={result.id}
                  className="flex space-x-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => window.open(`/business/${result.id}`, "_blank")}
                >
                  <img
                    src={result.image || "/placeholder.svg"}
                    alt={result.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm text-gray-800 truncate">{result.title}</h4>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div key={i} className={`w-2 h-2 ${i < result.rating ? "text-yellow-400" : "text-gray-300"}`}>
                            ⭐
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-1">{result.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500 truncate">{result.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {result.isOpen && <Badge className="bg-green-500 text-white text-xs">Open</Badge>}
                        {result.verified && <Badge className="bg-blue-500 text-white text-xs">✓</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {results.length > 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 bg-transparent"
                  onClick={() => window.open(`/search?q=${encodeURIComponent(query)}`, "_blank")}
                >
                  View All {results.length} Results
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
