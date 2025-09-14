// "use client"

// import React, { useState, useEffect, useRef } from 'react'
// import { Search, Globe, Image, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// interface WebSearchResult {
//   title: string
//   link: string
//   snippet: string
//   displayLink: string
//   htmlTitle: string
//   htmlSnippet: string
//   image?: {
//     src: string
//     width: number
//     height: number
//   }
//   thumbnail?: {
//     src: string
//     width: number
//     height: number
//   }
// }

// interface ImageSearchResult {
//   title: string
//   link: string
//   image: {
//     src: string
//     width: number
//     height: number
//   }
//   thumbnail: {
//     src: string
//     width: number
//     height: number
//   }
// }

// interface SearchSuggestion {
//   suggestion: string
// }

// interface WebSearchResponse {
//   success: boolean
//   data: {
//     query: string
//     totalResults: number
//     searchTime: number
//     results: WebSearchResult[]
//     pagination: {
//       currentPage: number
//       totalPages: number
//       hasNextPage: boolean
//       hasPreviousPage: boolean
//       nextPageStart: number | null
//       previousPageStart: number | null
//     }
//   }
//   meta: {
//     query: string
//     page: number
//     resultsPerPage: number
//     totalResults: number
//     searchTime: number
//   }
// }

// export default function WebSearchWidget() {
//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.pattaya1.com'
//   const [query, setQuery] = useState('')
//   const [webResults, setWebResults] = useState<WebSearchResult[]>([])
//   const [imageResults, setImageResults] = useState<ImageSearchResult[]>([])
//   const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
//   const [loading, setLoading] = useState(false)
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalResults, setTotalResults] = useState(0)
//   const [searchTime, setSearchTime] = useState(0)
//   const [activeTab, setActiveTab] = useState('web')
  
//   const searchInputRef = useRef<HTMLInputElement>(null)
//   const suggestionsRef = useRef<HTMLDivElement>(null)
//   const RESULTS_PER_PAGE = 8

//   // Handle search suggestions as user types
//   useEffect(() => {
//     if (query.length >= 2) {
//       const debounceTimer = setTimeout(() => {
//         loadSuggestions(query)
//       }, 300)
//       return () => clearTimeout(debounceTimer)
//     } else {
//       setSuggestions([])
//       setShowSuggestions(false)
//     }
//   }, [query])

//   // Handle clicks outside suggestions
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const loadSuggestions = async (searchQuery: string) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/web-search/suggestions?query=${encodeURIComponent(searchQuery)}`)
//       if (response.ok) {
//         const data = await response.json()
//         if (data.success) {
//           const normalized = Array.isArray(data.data)
//             ? data.data.map((item: any) => (typeof item === 'string' ? { suggestion: item } : item))
//             : []
//           setSuggestions(normalized)
//           setShowSuggestions(true)
//         }
//       }
//     } catch (error) {
//       console.error('Error loading suggestions:', error)
//     }
//   }

//   const performWebSearch = async (searchQuery: string, page = 1) => {
//     if (!searchQuery.trim()) return

//     setLoading(true)
//     try {
//       const response = await fetch(`${API_BASE}/api/web-search?query=${encodeURIComponent(searchQuery)}&page=${page}&num=${RESULTS_PER_PAGE}`)
//       if (response.ok) {
//         const data: WebSearchResponse = await response.json()
//         if (data.success) {
//           setWebResults(data.data.results)
//           setTotalResults(data.data.totalResults)
//           setSearchTime(data.data.searchTime)
//           setCurrentPage(page)
//         }
//       }
//     } catch (error) {
//       console.error('Error performing web search:', error)
//     } finally {
//       setLoading(false)
//       setShowSuggestions(false)
//     }
//   }

//   const performImageSearch = async (searchQuery: string) => {
//     if (!searchQuery.trim()) return

//     setLoading(true)
//     try {
//       const response = await fetch(`${API_BASE}/api/web-search/images?query=${encodeURIComponent(searchQuery)}&num=${RESULTS_PER_PAGE}&imgSize=medium`)
//       if (response.ok) {
//         const data = await response.json()
//         if (data.success) {
//           setImageResults(data.data.results || [])
//         }
//       }
//     } catch (error) {
//       console.error('Error performing image search:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (query.trim()) {
//       if (activeTab === 'web') {
//         performWebSearch(query, 1)
//       } else {
//         performImageSearch(query)
//       }
//     }
//   }

//   const handleSuggestionClick = (suggestion: SearchSuggestion) => {
//     setQuery(suggestion.suggestion)
//     setShowSuggestions(false)
//     if (activeTab === 'web') {
//       performWebSearch(suggestion.suggestion, 1)
//     } else {
//       performImageSearch(suggestion.suggestion)
//     }
//   }

//   const handlePageChange = (newPage: number) => {
//     if (query.trim()) {
//       performWebSearch(query, newPage)
//     }
//   }

//   const formatNumber = (num: number) => {
//     return new Intl.NumberFormat().format(num)
//   }

//   return (
//     <div className="h-full flex flex-col bg-transparent min-h-0">
//       {/* Google-style search bar */}
//       <div className="relative w-full">
//         <form className="relative" onSubmit={handleSearch}>
//           <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           <Input
//             ref={searchInputRef}
//             type="text"
//             placeholder="Search the web..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:ring-0 shadow-sm bg-white"
//             onFocus={() => query.length >= 2 && setShowSuggestions(true)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 // Prevent page reload and let form onSubmit handle it
//                 e.preventDefault()
//                 handleSearch(e as unknown as React.FormEvent)
//               }
//             }}
//           />
//           {query && (
//             <button
//               type="button"
//               onClick={() => {
//                 setQuery('')
//                 setWebResults([])
//                 setImageResults([])
//                 setShowSuggestions(false)
//               }}
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           )}
//         </form>

//         {/* Google-style search suggestions dropdown */}
//         {showSuggestions && suggestions.length > 0 && (
//           <div ref={suggestionsRef} className="absolute top-full left-0 right-0 z-[9999] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
//             {suggestions.slice(0, 5).map((suggestion, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleSuggestionClick(suggestion)}
//                 className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
//               >
//                 <div className="font-medium text-gray-900">{suggestion.suggestion}</div>
//                 <Search className="h-4 w-4 text-gray-400" />
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Search Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-3">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="web" className="flex items-center gap-2">
//             <Globe className="h-4 w-4" />
//             Web
//           </TabsTrigger>
//           <TabsTrigger value="images" className="flex items-center gap-2">
//             <Image className="h-4 w-4" />
//             Images
//           </TabsTrigger>
//         </TabsList>

//         {/* Results container - render inline below the bar so it's always visible */}
//         {(webResults.length > 0 || imageResults.length > 0 || loading) && (
//           <div
//             className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto overscroll-contain relative z-20"
//             style={{ WebkitOverflowScrolling: 'touch' }}
//           >
//             {/* Results Info */}
//             {(webResults.length > 0 || imageResults.length > 0) && !loading && (
//               <div className="flex items-center justify-between text-sm text-gray-600 py-3 px-4 border-b border-gray-200">
//                 <span>
//                   {formatNumber(totalResults)} results ({searchTime.toFixed(3)} seconds)
//                 </span>
//                 {activeTab === 'web' && (
//                   <span>Page {currentPage}</span>
//                 )}
//               </div>
//             )}

//             {/* Loading State */}
//             {loading && (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-2 text-sm text-gray-600">Searching...</p>
//               </div>
//             )}

//             {/* Web Results */}
//             {activeTab === 'web' && webResults.length > 0 && !loading && (
//               <div className="p-4">
//                 <div className="space-y-4">
//                   {webResults.map((result, index) => (
//                     <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
//                       <div className="flex gap-3">
//                         {result.thumbnail && (
//                           <div className="flex-shrink-0">
//                             <img
//                               src={result.thumbnail.src}
//                               alt=""
//                               className="w-16 h-16 object-cover rounded"
//                             />
//                           </div>
//                         )}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <a
//                                 href={result.link}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-sm font-medium text-blue-600 hover:text-blue-800 line-clamp-2"
//                                 dangerouslySetInnerHTML={{ __html: result.htmlTitle }}
//                               />
//                               <div className="text-xs text-green-600 mt-1">{result.displayLink}</div>
//                             </div>
//                             <ExternalLink className="h-3 w-3 text-gray-400 ml-2" />
//                           </div>
                          
//                           <p 
//                             className="text-xs text-gray-600 line-clamp-2 mt-1"
//                             dangerouslySetInnerHTML={{ __html: result.htmlSnippet }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination for Web Results */}
//                 {Math.max(1, Math.ceil(totalResults / RESULTS_PER_PAGE)) > 1 && (
//                   <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={currentPage === 1}
//                       onClick={() => handlePageChange(currentPage - 1)}
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
                    
//                     <span className="text-sm text-gray-600">
//                       Page {currentPage}
//                     </span>
                    
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={currentPage >= 10} // Google CSE limit
//                       onClick={() => handlePageChange(currentPage + 1)}
//                     >
//                       <ChevronRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Image Results */}
//             {activeTab === 'images' && imageResults.length > 0 && !loading && (
//               <div className="p-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   {imageResults.map((result, index) => (
//                     <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
//                       <a
//                         href={result.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="block"
//                       >
//                         <img
//                           src={result.link}
//                           alt={result.title}
//                           className="w-full h-24 object-cover"
//                           onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.style.display = 'none';
//                           }}
//                         />
//                         <div className="p-2">
//                           <p className="text-xs text-gray-900 line-clamp-2">{result.title}</p>
//                         </div>
//                       </a>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* No Results */}
//             {!loading && ((activeTab === 'web' && webResults.length === 0) || (activeTab === 'images' && imageResults.length === 0)) && query && (
//               <div className="text-center py-8">
//                 <p className="text-sm text-gray-600">No results found for "{query}"</p>
//               </div>
//             )}
//           </div>
//         )}
//       </Tabs>
//     </div>
//   )
// }


"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Search,
  Globe,
  Image,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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

/* ---------------------------
   Component
   --------------------------- */
export default function WebSearchWidget(): JSX.Element {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.pattaya1.com"
  const [query, setQuery] = useState("")
  const [webResults, setWebResults] = useState<WebSearchResult[]>([])
  const [imageResults, setImageResults] = useState<ImageSearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [searchTime, setSearchTime] = useState(0)
  const [activeTab, setActiveTab] = useState<"web" | "images">("web")

  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const RESULTS_PER_PAGE = 8

  /* ---------- Effects ---------- */
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ---------- Networking ---------- */
  const loadSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/web-search/suggestions?query=${encodeURIComponent(searchQuery)}`
      )
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const normalized = Array.isArray(data.data)
            ? data.data.map((item: any) => (typeof item === "string" ? { suggestion: item } : item))
            : []
          setSuggestions(normalized)
          setShowSuggestions(true)
        }
      }
    } catch (error) {
      // keep console logging for debugging
      // production: consider showing a non-blocking toast
      console.error("Error loading suggestions:", error)
    }
  }

  const performWebSearch = async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `${API_BASE}/api/web-search?query=${encodeURIComponent(searchQuery)}&page=${page}&num=${RESULTS_PER_PAGE}`
      )
      if (response.ok) {
        const data: WebSearchResponse = await response.json()
        if (data.success) {
          setWebResults(data.data.results)
          setTotalResults(data.data.totalResults)
          setSearchTime(data.data.searchTime)
          setCurrentPage(page)
        } else {
          setWebResults([])
          setTotalResults(0)
        }
      }
    } catch (error) {
      console.error("Error performing web search:", error)
    } finally {
      setLoading(false)
      setShowSuggestions(false)
    }
  }

  const performImageSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `${API_BASE}/api/web-search/images?query=${encodeURIComponent(searchQuery)}&num=${RESULTS_PER_PAGE}&imgSize=medium`
      )
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setImageResults(data.data.results || [])
        } else {
          setImageResults([])
        }
      }
    } catch (error) {
      console.error("Error performing image search:", error)
    } finally {
      setLoading(false)
    }
  }

  /* ---------- Handlers ---------- */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (activeTab === "web") performWebSearch(query, 1)
      else performImageSearch(query)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.suggestion)
    setShowSuggestions(false)
    if (activeTab === "web") performWebSearch(suggestion.suggestion, 1)
    else performImageSearch(suggestion.suggestion)
  }

  const handlePageChange = (newPage: number) => {
    if (query.trim()) performWebSearch(query, newPage)
  }

  const formatNumber = (num: number) => new Intl.NumberFormat().format(num)

  /* ---------- Animations ---------- */
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  }
  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.06 } },
  }

  /* ---------- Small animated icon components ---------- */
  const AnimatedGlobe = () => (
    <motion.div
      aria-hidden
      style={{ display: "inline-block" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    >
      <Globe className="h-5 w-5 text-cyan-400" />
    </motion.div>
  )

  const AnimatedSearch = () => (
    <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
      <Search className="h-4 w-4 text-white" />
    </motion.div>
  )

  const AnimatedSparkles = () => (
    <motion.div animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 3, repeat: Infinity }}>
      <Sparkles className="h-4 w-4 text-yellow-400" />
    </motion.div>
  )

  const AnimatedZap = () => (
    <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
      <Zap className="h-4 w-4 text-amber-400" />
    </motion.div>
  )

  return (
    <div className="relative h-full min-h-0 p-4">
      {/* Background animated gradient (CSS keyframes below) */}
      <div className="absolute inset-0 -z-20 rounded-xl overflow-hidden">
        <div className="absolute inset-0 animate-gradient bg-[length:200%_200%]" />
        {/* soft frosted overlay */}
        <div className="absolute inset-0 bg-white/14 backdrop-blur-[8px]" />
      </div>

      {/* Main container (glass) */}
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex items-center justify-center mb-4">
          <div className="p-2 bg-white/30 backdrop-blur-md rounded-full mr-3">
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </div>
          <h2 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Web Explorer
          </h2>
        </motion.div>

        {/* Search bar */}
        <div className="relative mb-4">
          <form onSubmit={handleSearch} aria-label="Search form">
            <motion.div
              initial={{ scale: 0.995, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.28 }}
              className="relative bg-white/30 backdrop-blur-md rounded-full border border-white/30 shadow-lg"
            >
              {/* left icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <AnimatedGlobe />
              </div>

              <Input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // prevent double submit; handled by form submit
                    e.preventDefault()
                    handleSearch(e as unknown as React.FormEvent)
                  }
                }}
                placeholder="Discover the web..."
                className="pl-14 pr-16 py-4 text-lg bg-transparent border-0 focus:ring-0 placeholder:text-purple-700/70 text-purple-900 font-medium"
                aria-label="Search the web"
              />

              {/* clear */}
              {query && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    setWebResults([])
                    setImageResults([])
                    setShowSuggestions(false)
                    searchInputRef.current?.focus()
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  title="Clear"
                  aria-label="Clear search"
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-purple-700 hover:text-purple-900"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}

              {/* submit */}
              <motion.button
                type="submit"
                title="Search"
                aria-label="Search button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-3 top-[10%] p-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm"
              >
                <AnimatedSearch />
              </motion.button>
            </motion.div>
          </form>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 right-0 z-40 mt-3 bg-white/92 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl overflow-hidden"
              >
                {suggestions.slice(0, 6).map((s, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    whileHover={{ x: 6 }}
                    className="w-full px-5 py-3 text-left flex items-center justify-between gap-3 border-b last:border-b-0 hover:bg-gradient-to-r from-purple-50 to-cyan-50"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.14, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.12 }}
                        className="text-pink-500"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </motion.div>
                      <span className="font-medium text-purple-900">{s.suggestion}</span>
                    </div>
                    <AnimatedZap />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "web" | "images")}>
            <TabsList className="grid grid-cols-2 gap-2 bg-white/30 backdrop-blur-md p-1 rounded-2xl border border-white/30 mb-4">
              <div className="rounded-xl overflow-hidden">
                <TabsTrigger value="web" className="flex items-center gap-2 w-full justify-center py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                    <Globe className="h-4 w-4" />
                  </motion.div>
                  Web
                </TabsTrigger>
              </div>
              <div className="rounded-xl overflow-hidden">
                <TabsTrigger value="images" className="flex items-center gap-2 w-full justify-center py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                  <motion.div animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Image className="h-4 w-4" />
                  </motion.div>
                  Images
                </TabsTrigger>
              </div>
            </TabsList>

            {/* Results container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + (webResults.length > 0 || imageResults.length > 0 ? "-results" : "-no")}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                {(webResults.length > 0 || imageResults.length > 0 || loading) && (
                  <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto relative" style={{ WebkitOverflowScrolling: "touch" }}>
                    {/* Info */}
                    {(webResults.length > 0 || imageResults.length > 0) && !loading && (
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 text-sm text-purple-900/80">
                        <div className="flex items-center gap-2">
                          <AnimatedSparkles />
                          <span>
                            {formatNumber(totalResults)} results ({searchTime.toFixed(3)}s)
                          </span>
                        </div>
                        {activeTab === "web" && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-400" />
                            <span>Page {currentPage}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Loading */}
                    {loading && (
                      <div className="text-center py-8">
                        <motion.div animate={{ rotate: 360, scale: [1, 1.16, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="mx-auto w-10 h-10 rounded-full border-4 border-r-transparent border-purple-400" />
                        <p className="mt-3 text-sm text-purple-900/80 font-medium">Exploring the web for you...</p>
                      </div>
                    )}

                    {/* Web Results */}
                    {activeTab === "web" && webResults.length > 0 && !loading && (
                      <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="p-5 space-y-5">
                        {webResults.map((result, i) => (
                          <motion.div key={i} variants={fadeIn} whileHover={{ y: -4 }} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all">
                            <div className="flex gap-4">
                              {result.thumbnail && (
                                <div className="flex-shrink-0">
                                  <img src={result.thumbnail.src} alt="" className="w-18 h-18 object-cover rounded-lg shadow-md" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <a
                                      href={result.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-semibold text-purple-800 hover:text-purple-600 line-clamp-2 hover:underline"
                                      dangerouslySetInnerHTML={{ __html: result.htmlTitle }}
                                    />
                                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                      <Zap className="h-3 w-3" />
                                      <span className="truncate">{result.displayLink}</span>
                                    </div>
                                  </div>
                                  <div className="ml-3">
                                    <a href={result.link} target="_blank" rel="noopener noreferrer" aria-label="Open link">
                                      <ExternalLink className="h-4 w-4 text-purple-500" />
                                    </a>
                                  </div>
                                </div>

                                <p className="text-xs text-purple-900/80 line-clamp-2" dangerouslySetInnerHTML={{ __html: result.htmlSnippet }} />
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {/* Pagination */}
                        {Math.max(1, Math.ceil(totalResults / RESULTS_PER_PAGE)) > 1 && (
                          <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-white/20">
                            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="rounded-xl px-4 py-2">
                              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>

                            <span className="text-sm text-purple-900/80 font-medium bg-white/40 py-1 px-3 rounded-lg">Page {currentPage}</span>

                            <Button variant="outline" size="sm" disabled={currentPage >= 10} onClick={() => handlePageChange(currentPage + 1)} className="rounded-xl px-4 py-2">
                              Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Image Results */}
                    {activeTab === "images" && imageResults.length > 0 && !loading && (
                      <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="p-5">
                        <div className="grid grid-cols-2 gap-4">
                          {imageResults.map((img, i) => (
                            <motion.div key={i} variants={fadeIn} whileHover={{ y: -6, scale: 1.02 }} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden shadow-sm">
                              <a href={img.link} target="_blank" rel="noopener noreferrer">
                                <div className="w-full h-28 overflow-hidden">
                                  <img src={img.link} alt={img.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                                </div>
                                <div className="p-3">
                                  <p className="text-xs text-purple-900 line-clamp-2 font-medium">{img.title}</p>
                                </div>
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* No results */}
                    {!loading && ((activeTab === "web" && webResults.length === 0) || (activeTab === "images" && imageResults.length === 0)) && query && (
                      <div className="text-center py-10 px-6">
                        <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl mb-4">
                          🔎
                        </motion.div>
                        <p className="text-sm text-purple-900/80 font-medium">No results found for &ldquo;{query}&rdquo;</p>
                        <p className="text-xs text-purple-900/60 mt-2">Try different keywords or check your spelling</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Inline styles for gradient animation */}
      <style jsx>{`
        .animate-gradient {
          background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 25%, #a1c4fd 50%, #c2e9fb 75%, #84fab0 100%);
          background-size: 200% 200%;
          animation: gradientShift 12s ease infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* tiny helpers for line-clamp fallback if not available in your setup */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
