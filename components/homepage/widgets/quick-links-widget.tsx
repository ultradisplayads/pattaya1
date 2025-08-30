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

export function QuickLinksWidget() {
  const [animatedCounts, setAnimatedCounts] = useState<{ [key: string]: number }>({})
  const [quickLinks, setQuickLinks] = useState<StrapiQuickLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuickLinks()
  }, [])

  const loadQuickLinks = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:1337/api/quick-links?populate=*")
      
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
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quickLinks.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1 overflow-y-auto widget-content">
          <div className="text-center text-gray-500 py-8">
            No quick links available at the moment.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Quick Access
          </div>
          <span className="text-xs text-gray-500 font-normal">
            {quickLinks.length} Links
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1 overflow-y-auto widget-content">
        {/* Grid layout with enhanced animations */}
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              className="group flex flex-col items-center p-2 rounded-lg hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-md border border-transparent hover:border-gray-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`${link.color} group-hover:bg-gradient-to-br group-hover:${link.hoverColor} text-white p-2 rounded-lg mb-1 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl`}
              >
                {getIconComponent(link.icon)}
              </div>
              <span className="text-xs font-medium text-center line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                {link.title}
              </span>
              {link.count && (
                <span className="text-xs text-gray-500 mt-1 group-hover:text-blue-500 transition-colors duration-200 font-mono">
                  {formatCount(animatedCounts[link.id.toString()] || 0)}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Quick Categories Section */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Categories</h4>
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(quickLinks.map(link => link.category))).map((category) => (
              <span
                key={category}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
