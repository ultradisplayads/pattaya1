"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Search, Globe, Image, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface WebSearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  htmlTitle: string
  htmlSnippet: string
  image?: {
    src: string
    width: number
    height: number
  }
  thumbnail?: {
    src: string
    width: number
    height: number
  }
}

interface ImageSearchResult {
  title: string
  link: string
  image: {
    src: string
    width: number
    height: number
  }
  thumbnail: {
    src: string
    width: number
    height: number
  }
}

interface SearchSuggestion {
  suggestion: string
}

interface WebSearchResponse {
  success: boolean
  data: {
    query: string
    totalResults: number
    searchTime: number
    results: WebSearchResult[]
    pagination: {
      currentPage: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
      nextPageStart: number | null
      previousPageStart: number | null
    }
  }
  meta: {
    query: string
    page: number
    resultsPerPage: number
    totalResults: number
    searchTime: number
  }
}

export default function WebSearchWidget() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.pattaya1.com'
  const [query, setQuery] = useState('')
  const [webResults, setWebResults] = useState<WebSearchResult[]>([])
  const [imageResults, setImageResults] = useState<ImageSearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [searchTime, setSearchTime] = useState(0)
  const [activeTab, setActiveTab] = useState('web')
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const RESULTS_PER_PAGE = 8

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

  const loadSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/web-search/suggestions?query=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const normalized = Array.isArray(data.data)
            ? data.data.map((item: any) => (typeof item === 'string' ? { suggestion: item } : item))
            : []
          setSuggestions(normalized)
          setShowSuggestions(true)
        }
      }
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }

  const performWebSearch = async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/web-search?query=${encodeURIComponent(searchQuery)}&page=${page}&num=${RESULTS_PER_PAGE}`)
      if (response.ok) {
        const data: WebSearchResponse = await response.json()
        if (data.success) {
          setWebResults(data.data.results)
          setTotalResults(data.data.totalResults)
          setSearchTime(data.data.searchTime)
          setCurrentPage(page)
        }
      }
    } catch (error) {
      console.error('Error performing web search:', error)
    } finally {
      setLoading(false)
      setShowSuggestions(false)
    }
  }

  const performImageSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/web-search/images?query=${encodeURIComponent(searchQuery)}&num=${RESULTS_PER_PAGE}&imgSize=medium`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setImageResults(data.data.results || [])
        }
      }
    } catch (error) {
      console.error('Error performing image search:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (activeTab === 'web') {
        performWebSearch(query, 1)
      } else {
        performImageSearch(query)
      }
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.suggestion)
    setShowSuggestions(false)
    if (activeTab === 'web') {
      performWebSearch(suggestion.suggestion, 1)
    } else {
      performImageSearch(suggestion.suggestion)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (query.trim()) {
      performWebSearch(query, newPage)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="h-full flex flex-col bg-transparent min-h-0">
      {/* Google-style search bar */}
      <div className="relative w-full">
        <form className="relative" onSubmit={handleSearch}>
          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search the web..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:ring-0 shadow-sm bg-white"
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Prevent page reload and let form onSubmit handle it
                e.preventDefault()
                handleSearch(e as unknown as React.FormEvent)
              }
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setWebResults([])
                setImageResults([])
                setShowSuggestions(false)
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>

        {/* Google-style search suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div ref={suggestionsRef} className="absolute top-full left-0 right-0 z-[9999] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{suggestion.suggestion}</div>
                <Search className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="web" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Web
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images
          </TabsTrigger>
        </TabsList>

        {/* Results container - render inline below the bar so it's always visible */}
        {(webResults.length > 0 || imageResults.length > 0 || loading) && (
          <div
            className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto overscroll-contain relative z-20"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Results Info */}
            {(webResults.length > 0 || imageResults.length > 0) && !loading && (
              <div className="flex items-center justify-between text-sm text-gray-600 py-3 px-4 border-b border-gray-200">
                <span>
                  {formatNumber(totalResults)} results ({searchTime.toFixed(3)} seconds)
                </span>
                {activeTab === 'web' && (
                  <span>Page {currentPage}</span>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Searching...</p>
              </div>
            )}

            {/* Web Results */}
            {activeTab === 'web' && webResults.length > 0 && !loading && (
              <div className="p-4">
                <div className="space-y-4">
                  {webResults.map((result, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex gap-3">
                        {result.thumbnail && (
                          <div className="flex-shrink-0">
                            <img
                              src={result.thumbnail.src}
                              alt=""
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <a
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: result.htmlTitle }}
                              />
                              <div className="text-xs text-green-600 mt-1">{result.displayLink}</div>
                            </div>
                            <ExternalLink className="h-3 w-3 text-gray-400 ml-2" />
                          </div>
                          
                          <p 
                            className="text-xs text-gray-600 line-clamp-2 mt-1"
                            dangerouslySetInnerHTML={{ __html: result.htmlSnippet }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for Web Results */}
                {Math.max(1, Math.ceil(totalResults / RESULTS_PER_PAGE)) > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm text-gray-600">
                      Page {currentPage}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= 10} // Google CSE limit
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Image Results */}
            {activeTab === 'images' && imageResults.length > 0 && !loading && (
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {imageResults.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={result.link}
                          alt={result.title}
                          className="w-full h-24 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="p-2">
                          <p className="text-xs text-gray-900 line-clamp-2">{result.title}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && ((activeTab === 'web' && webResults.length === 0) || (activeTab === 'images' && imageResults.length === 0)) && query && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  )
}
