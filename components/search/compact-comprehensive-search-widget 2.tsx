"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Search, Filter, TrendingUp, Clock, X, ChevronDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SearchResult {
  title: string
  content: string
  source: string
  category: string
  url: string
  contentType: string
  publishedAt: string
  featuredImage?: string
  isBreaking?: boolean
  severity?: string
  sponsorName?: string
  type?: string
}

interface SearchSuggestion {
  text: string
  type: string
  source: string
  category: string
}

interface TrendingTopic {
  query: string
  rank: number
  category: string
  searchCount?: number
}

interface SearchFacets {
  categories: string[]
  sources: string[]
  contentTypes: string[]
  severities: string[]
}

export default function CompactComprehensiveSearchWidget() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [trending, setTrending] = useState<TrendingTopic[]>([])
  const [facets, setFacets] = useState<SearchFacets | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showTrending, setShowTrending] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSource, setSelectedSource] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const hitsPerPage = 5

  // Load trending topics and facets on component mount
  useEffect(() => {
    loadTrendingTopics()
    loadFacets()
  }, [])

  // Handle search suggestions as user types
  useEffect(() => {
    if (query.length >= 2) {
      const debounceTimer = setTimeout(() => {
        loadSuggestions(query)
      }, 300)
      return () => clearTimeout(debounceTimer)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadTrendingTopics = async () => {
    try {
      const response = await fetch('/api/search/trending?limit=5')
      if (response.ok) {
        const data = await response.json()
        setTrending(data.data)
      }
    } catch (error) {
      console.error('Error loading trending topics:', error)
    }
  }

  const loadFacets = async () => {
    try {
      const response = await fetch('/api/search/facets')
      if (response.ok) {
        const data = await response.json()
        setFacets(data.data)
      }
    } catch (error) {
      console.error('Error loading facets:', error)
    }
  }

  const loadSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search/suggestions?query=${encodeURIComponent(searchQuery)}&limit=3`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.data)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }

  const performSearch = async (searchQuery: string, page = 0) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Build filters string
      const filters = []
      if (selectedCategory) filters.push(`category:${selectedCategory}`)
      if (selectedSource) filters.push(`source:${selectedSource}`)
      if (selectedContentType) filters.push(`contentType:${selectedContentType}`)
      if (selectedSeverity) filters.push(`severity:${selectedSeverity}`)
      
      const filtersParam = filters.length > 0 ? `&filters=${filters.join(',')}` : ''
      const url = `/api/search/unified?query=${encodeURIComponent(searchQuery)}&page=${page}&hitsPerPage=${hitsPerPage}${filtersParam}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setResults(data.data)
        setTotalResults(data.meta.pagination.total)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error performing search:', error)
    } finally {
      setLoading(false)
      setShowSuggestions(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query, 0)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)
    performSearch(suggestion.text, 0)
  }

  const handleTrendingClick = (topic: TrendingTopic) => {
    setQuery(topic.query)
    performSearch(topic.query, 0)
    setShowTrending(false)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedSource('')
    setSelectedContentType('')
    setSelectedSeverity('')
    if (query) {
      performSearch(query, 0)
    }
  }

  const getContentTypeBadge = (contentType: string, isBreaking?: boolean, severity?: string) => {
    if (contentType === 'sponsored-post') {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">SPONSORED</Badge>
    }
    if (isBreaking) {
      const severityColor = severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      return <Badge variant="secondary" className={`${severityColor} text-xs`}>BREAKING</Badge>
    }
    return <Badge variant="outline" className="text-xs">{contentType.replace('-', ' ').toUpperCase()}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const totalPages = Math.ceil(totalResults / hitsPerPage)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Search className="h-5 w-5" />
          Site Search
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search news, topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm"
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setResults([])
                    setShowSuggestions(false)
                  }}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900 text-sm">{suggestion.text}</div>
                  <Search className="h-3 w-3 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTrending(!showTrending)}
            className="text-xs"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Button>
        </div>

        {/* Filters */}
        {showFilters && facets && (
          <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {facets.categories.slice(0, 5).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedContentType} onValueChange={setSelectedContentType}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {facets.contentTypes.slice(0, 5).map(type => (
                  <SelectItem key={type} value={type}>{type.replace('-', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Trending Topics */}
        {showTrending && trending.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-2">Trending Topics</div>
            <div className="space-y-1">
              {trending.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(topic)}
                  className="w-full text-left p-1 rounded hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900">{topic.query}</span>
                    <span className="text-xs text-gray-500">#{topic.rank}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-1 text-xs text-gray-600">Searching...</p>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && !loading && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="text-xs text-gray-600 mb-2">
              {totalResults} results found
            </div>
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                <div className="flex gap-2">
                  {result.featuredImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={result.featuredImage}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 
                          className="text-sm font-medium text-gray-900 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.title }}
                        />
                        <div className="flex items-center gap-1 mt-1">
                          {getContentTypeBadge(result.contentType, result.isBreaking, result.severity)}
                        </div>
                      </div>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 ml-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    
                    <p 
                      className="text-xs text-gray-600 line-clamp-1 mt-1"
                      dangerouslySetInnerHTML={{ __html: result.content }}
                    />
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{result.source}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-2 w-2" />
                        {formatDate(result.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => performSearch(query, currentPage - 1)}
                  className="h-6 px-2 text-xs"
                >
                  Prev
                </Button>
                
                <span className="text-xs text-gray-600 px-2">
                  {currentPage + 1}/{totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => performSearch(query, currentPage + 1)}
                  className="h-6 px-2 text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-4">
            <p className="text-xs text-gray-600">No results found for "{query}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
