"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MapPin, 
  Calendar, 
  Utensils, 
  Music, 
  ShoppingBag, 
  Waves, 
  MessageSquare, 
  Camera,
  Hotel,
  Car,
  Plane,
  Heart,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buildApiUrl } from "@/lib/strapi-config"

interface StrapiQuickLink {
  id: number
  title: string
  icon: string
  href: string
  color: string
  hoverColor: string
  count: number
  category: string
  description: string | null
}

export function QuickLinksWidget({ isExpanded = false, onToggleExpand }: { isExpanded?: boolean; onToggleExpand?: () => void }) {
  const [animatedCounts, setAnimatedCounts] = useState<{ [key: string]: number }>({})
  const [quickLinks, setQuickLinks] = useState<StrapiQuickLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuickLinks()
  }, [])

  const loadQuickLinks = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl("quick-links?populate=*"))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Quick links data received:', data)
      
      if (data.data && Array.isArray(data.data)) {
        const mappedData = data.data.map((item: any) => ({
          id: item.id,
          title: item.Title,
          icon: item.Icon,
          href: item.Href,
          color: item.Color,
          hoverColor: item.HoverColor,
          count: item.Count,
          category: item.Category,
          description: item.Description,
        }))
        setQuickLinks(mappedData)
      } else {
        console.warn('No quick links data found or invalid format')
        setQuickLinks([])
      }
    } catch (error) {
      console.error("Failed to load quick links from Strapi:", error)
      setQuickLinks([])
    } finally {
      setLoading(false)
    }
  }

  // Map icon string to React component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'MapPin': return <MapPin className="w-4 h-4" />
      case 'Calendar': return <Calendar className="w-4 h-4" />
      case 'Utensils': return <Utensils className="w-4 h-4" />
      case 'Music': return <Music className="w-4 h-4" />
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />
      case 'Waves': return <Waves className="w-4 h-4" />
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />
      case 'Camera': return <Camera className="w-4 h-4" />
      case 'Hotel': return <Hotel className="w-4 h-4" />
      case 'Car': return <Car className="w-4 h-4" />
      case 'Plane': return <Plane className="w-4 h-4" />
      case 'Heart': return <Heart className="w-4 h-4" />
      case 'Star': return <Star className="w-4 h-4" />
      case 'TrendingUp': return <TrendingUp className="w-4 h-4" />
      case 'Users': return <Users className="w-4 h-4" />
      case 'BookOpen': return <BookOpen className="w-4 h-4" />
      case 'Zap': return <Zap className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  useEffect(() => {
    // Animate count numbers on load
    quickLinks.forEach((link) => {
      if (link.count) {
        let current = 0
        const target = link.count
        const increment = target / 30
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          setAnimatedCounts((prev) => ({ ...prev, [link.id.toString()]: Math.floor(current) }))
        }, 50)
      }
    })
  }, [])

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  }

  if (loading) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-100 rounded-full w-24"></div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quickLinks.length === 0) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-base font-medium text-gray-900">
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="text-center text-gray-400 py-12">
            <p className="text-sm font-medium">No quick links available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {!isExpanded ? (
        // Compact Quick Links View
        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-base font-medium text-gray-900 flex items-center justify-between">
          <span>Quick Access</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-normal">
              {quickLinks.length}
            </span>
            {onToggleExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleExpand()
                }}
                className="h-8 px-3 text-xs font-medium bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 shadow-sm rounded-lg border"
                title="Expand widget"
              >
                {isExpanded ? 'Less' : 'More'}
              </button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 flex-1 overflow-y-auto">
        {/* Grid layout with Apple-style design */}
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              className="group relative flex flex-col items-center p-4 rounded-2xl bg-gray-50/50 hover:bg-white transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-100"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div
                className={`${link.color} text-white p-3 rounded-2xl mb-3 transition-all duration-200 group-hover:scale-105 shadow-sm`}
              >
                {getIconComponent(link.icon)}
              </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors duration-200">
                {link.title}
              </span>
              {link.count && (
                <span className="text-xs text-gray-400 mt-1 font-medium">
                  {formatCount(animatedCounts[link.id.toString()] || 0)}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Categories section with refined styling */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-600 mb-3">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(quickLinks.map(link => link.category))).map((category) => (
              <span
                key={category}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
          </CardContent>
        </Card>
      ) : (
        // Expanded Quick Links View
        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
          <CardHeader className="pb-4 px-6 pt-6">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center justify-between">
              <span>Quick Access - Full View</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-normal">
                  {quickLinks.length} links
                </span>
                {onToggleExpand && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpand()
                    }}
                    className="h-8 px-3 text-xs font-medium bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 shadow-sm rounded-lg border"
                    title="Collapse widget"
                  >
                    Less
                  </button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-6 pb-6 flex-1 overflow-y-auto">
            {/* Enhanced Grid layout */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {quickLinks.map((link, index) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="group relative flex flex-col items-center p-5 rounded-2xl bg-gray-50/50 hover:bg-white transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div
                    className={`${link.color} text-white p-4 rounded-2xl mb-4 transition-all duration-200 group-hover:scale-110 shadow-md`}
                  >
                    {getIconComponent(link.icon)}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors duration-200 mb-2">
                    {link.title}
                  </span>
                  {link.description && (
                    <p className="text-xs text-gray-500 text-center leading-relaxed mb-2">
                      {link.description}
                    </p>
                  )}
                  {link.count && (
                    <span className="text-sm text-gray-600 font-medium">
                      {formatCount(animatedCounts[link.id.toString()] || 0)}
                    </span>
                  )}
                </a>
              ))}
            </div>

            {/* Enhanced Categories section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Categories</h4>
              <div className="flex flex-wrap gap-3">
                {Array.from(new Set(quickLinks.map(link => link.category))).map((category) => (
                  <span
                    key={category}
                    className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer font-medium hover:shadow-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{quickLinks.length}</div>
                  <div className="text-xs text-blue-600 font-medium">Total Links</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <div className="text-2xl font-bold text-green-600">
                    {Array.from(new Set(quickLinks.map(link => link.category))).length}
                  </div>
                  <div className="text-xs text-green-600 font-medium">Categories</div>
                </div>
              </div>
            </div>

            {/* Popular Links */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Popular Links</h4>
              <div className="space-y-2">
                {quickLinks
                  .sort((a, b) => (b.count || 0) - (a.count || 0))
                  .slice(0, 5)
                  .map((link, index) => (
                    <div key={link.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="text-sm font-medium text-gray-400">#{index + 1}</div>
                      <div className={`${link.color} text-white p-2 rounded-lg`}>
                        {getIconComponent(link.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{link.title}</div>
                        <div className="text-xs text-gray-500">{link.category}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        {formatCount(animatedCounts[link.id.toString()] || 0)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
