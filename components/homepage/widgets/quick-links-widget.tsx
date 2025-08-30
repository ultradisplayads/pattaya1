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

interface QuickLink {
  id: string
  title: string
  icon: React.ReactNode
  href: string
  color: string
  hoverColor: string
  count?: number
  category?: string
}

export function QuickLinksWidget() {
  const [animatedCounts, setAnimatedCounts] = useState<{ [key: string]: number }>({})

  const quickLinks: QuickLink[] = [
    {
      id: "directory",
      title: "Directory",
      icon: <MapPin className="w-4 h-4" />,
      href: "/directory",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      count: 1250,
      category: "main",
    },
    {
      id: "events",
      title: "Events",
      icon: <Calendar className="w-4 h-4" />,
      href: "/events",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      count: 45,
      category: "main",
    },
    {
      id: "restaurants",
      title: "Dining",
      icon: <Utensils className="w-4 h-4" />,
      href: "/restaurants",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      hoverColor: "from-orange-600 to-orange-700",
      count: 320,
      category: "main",
    },
    {
      id: "nightlife",
      title: "Nightlife",
      icon: <Music className="w-4 h-4" />,
      href: "/nightlife",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700",
      count: 180,
      category: "main",
    },
    {
      id: "shopping",
      title: "Shopping",
      icon: <ShoppingBag className="w-4 h-4" />,
      href: "/shopping",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      hoverColor: "from-pink-600 to-pink-700",
      count: 95,
      category: "main",
    },
    {
      id: "beaches",
      title: "Beaches",
      icon: <Waves className="w-4 h-4" />,
      href: "/beaches",
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      hoverColor: "from-cyan-600 to-cyan-700",
      count: 12,
      category: "main",
    },
    {
      id: "forum",
      title: "Forum",
      icon: <MessageSquare className="w-4 h-4" />,
      href: "/forum",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      hoverColor: "from-indigo-600 to-indigo-700",
      count: 890,
      category: "main",
    },
    {
      id: "photos",
      title: "Photos",
      icon: <Camera className="w-4 h-4" />,
      href: "/photos",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      hoverColor: "from-red-600 to-red-700",
      count: 2100,
      category: "main",
    },
    {
      id: "hotels",
      title: "Hotels",
      icon: <Hotel className="w-4 h-4" />,
      href: "/hotels",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      hoverColor: "from-teal-600 to-teal-700",
      count: 156,
      category: "travel",
    },
    {
      id: "transport",
      title: "Transport",
      icon: <Car className="w-4 h-4" />,
      href: "/transport",
      color: "bg-gradient-to-br from-gray-500 to-gray-600",
      hoverColor: "from-gray-600 to-gray-700",
      count: 78,
      category: "travel",
    },
    {
      id: "flights",
      title: "Flights",
      icon: <Plane className="w-4 h-4" />,
      href: "/flights",
      color: "bg-gradient-to-br from-sky-500 to-sky-600",
      hoverColor: "from-sky-600 to-sky-700",
      count: 34,
      category: "travel",
    },
    {
      id: "favorites",
      title: "Favorites",
      icon: <Heart className="w-4 h-4" />,
      href: "/favorites",
      color: "bg-gradient-to-br from-rose-500 to-rose-600",
      hoverColor: "from-rose-600 to-rose-700",
      count: 67,
      category: "personal",
    },
    {
      id: "reviews",
      title: "Reviews",
      icon: <Star className="w-4 h-4" />,
      href: "/reviews",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      hoverColor: "from-yellow-600 to-yellow-700",
      count: 2340,
      category: "main",
    },
    {
      id: "trending",
      title: "Trending",
      icon: <TrendingUp className="w-4 h-4" />,
      href: "/trending",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      hoverColor: "from-emerald-600 to-emerald-700",
      count: 156,
      category: "main",
    },
    {
      id: "community",
      title: "Community",
      icon: <Users className="w-4 h-4" />,
      href: "/community",
      color: "bg-gradient-to-br from-violet-500 to-violet-600",
      hoverColor: "from-violet-600 to-violet-700",
      count: 890,
      category: "social",
    },
    {
      id: "guides",
      title: "Guides",
      icon: <BookOpen className="w-4 h-4" />,
      href: "/guides",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      hoverColor: "from-amber-600 to-amber-700",
      count: 45,
      category: "info",
    },
    {
      id: "deals",
      title: "Deals",
      icon: <Zap className="w-4 h-4" />,
      href: "/deals",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      hoverColor: "from-orange-600 to-orange-700",
      count: 23,
      category: "main",
    },
  ]

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
          setAnimatedCounts((prev) => ({ ...prev, [link.id]: Math.floor(current) }))
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
                {link.icon}
              </div>
              <span className="text-xs font-medium text-center line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                {link.title}
              </span>
              {link.count && (
                <span className="text-xs text-gray-500 mt-1 group-hover:text-blue-500 transition-colors duration-200 font-mono">
                  {formatCount(animatedCounts[link.id] || 0)}
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
