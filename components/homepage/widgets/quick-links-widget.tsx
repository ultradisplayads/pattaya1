"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Utensils, Music, ShoppingBag, Waves, MessageSquare, Camera } from "lucide-react"

interface QuickLink {
  id: string
  title: string
  icon: React.ReactNode
  href: string
  color: string
  hoverColor: string
  count?: number
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
    },
    {
      id: "events",
      title: "Events",
      icon: <Calendar className="w-4 h-4" />,
      href: "/events",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      count: 45,
    },
    {
      id: "restaurants",
      title: "Dining",
      icon: <Utensils className="w-4 h-4" />,
      href: "/restaurants",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      hoverColor: "from-orange-600 to-orange-700",
      count: 320,
    },
    {
      id: "nightlife",
      title: "Nightlife",
      icon: <Music className="w-4 h-4" />,
      href: "/nightlife",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700",
      count: 180,
    },
    {
      id: "shopping",
      title: "Shopping",
      icon: <ShoppingBag className="w-4 h-4" />,
      href: "/shopping",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      hoverColor: "from-pink-600 to-pink-700",
      count: 95,
    },
    {
      id: "beaches",
      title: "Beaches",
      icon: <Waves className="w-4 h-4" />,
      href: "/beaches",
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      hoverColor: "from-cyan-600 to-cyan-700",
      count: 12,
    },
    {
      id: "forum",
      title: "Forum",
      icon: <MessageSquare className="w-4 h-4" />,
      href: "/forum",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      hoverColor: "from-indigo-600 to-indigo-700",
      count: 890,
    },
    {
      id: "photos",
      title: "Photos",
      icon: <Camera className="w-4 h-4" />,
      href: "/photos",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      hoverColor: "from-red-600 to-red-700",
      count: 2100,
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

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
          Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Single row layout with enhanced animations */}
        <div className="flex flex-wrap gap-2 justify-between">
          {quickLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              className="group flex flex-col items-center p-2 rounded-lg hover:bg-white/80 transition-all duration-300 flex-1 min-w-0 hover:scale-105 hover:shadow-md"
              style={{ animationDelay: `${index * 100}ms` }}
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
                  {(animatedCounts[link.id] || 0).toLocaleString()}
                </span>
              )}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
