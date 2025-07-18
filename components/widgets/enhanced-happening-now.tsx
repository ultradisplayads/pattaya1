"use client"

import { Clock, MapPin, Users, Zap, ExternalLink, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EnhancedHappeningNowProps {
  theme: "primary" | "nightlife"
}

export function EnhancedHappeningNow({ theme }: EnhancedHappeningNowProps) {
  const isPrimary = theme === "primary"

  const events = [
    {
      title: "Live Jazz Performance",
      venue: "Horizon Rooftop Bar",
      time: "Now - 11:00 PM",
      attendees: 45,
      status: "Live",
      rating: 4.8,
      category: "music",
      image: "/placeholder.svg?height=60&width=80&text=Jazz",
    },
    {
      title: "Night Market Extravaganza",
      venue: "Thepprasit Road",
      time: "Until 2:00 AM",
      attendees: 120,
      status: "Active",
      rating: 4.6,
      category: "market",
      image: "/placeholder.svg?height=60&width=80&text=Market",
    },
    {
      title: "Beach Volleyball Finals",
      venue: "Pattaya Beach",
      time: "Starting Soon",
      attendees: 28,
      status: "Starting",
      rating: 4.5,
      category: "sports",
      image: "/placeholder.svg?height=60&width=80&text=Volleyball",
    },
  ]

  const handleViewAll = () => {
    window.location.href = "/events/live"
  }

  return (
    <Card
      className={`transition-all duration-500 hover:scale-105 cursor-pointer group ${
        isPrimary
          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-200 hover:shadow-xl hover:shadow-emerald-200/50"
          : "bg-gradient-to-br from-purple-800 to-pink-800 border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/30"
      }`}
      onClick={handleViewAll}
    >
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center space-x-2 text-lg ${isPrimary ? "text-emerald-800" : "text-white"}`}>
          <div className="relative">
            <Clock className="h-5 w-5" />
            <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-30 animate-pulse"></div>
          </div>
          <span>Happening Now</span>
          <Badge variant="secondary" className="bg-red-500 text-white animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {events.map((event, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
              isPrimary ? "bg-white/70 hover:bg-white/90" : "bg-purple-900/50 hover:bg-purple-900/70"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `/events/${event.title.toLowerCase().replace(/\s+/g, "-")}`
            }}
          >
            <div className="flex space-x-3">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-16 h-12 rounded-lg object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-medium text-sm line-clamp-1 ${isPrimary ? "text-emerald-900" : "text-white"}`}>
                    {event.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`ml-2 text-xs ${
                      event.status === "Live"
                        ? "border-red-500 text-red-600 bg-red-50 animate-pulse"
                        : event.status === "Active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : isPrimary
                            ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                            : "border-pink-400 text-pink-300 bg-pink-500/10"
                    }`}
                  >
                    {event.status}
                  </Badge>
                </div>

                <div className={`space-y-1 text-xs ${isPrimary ? "text-emerald-700" : "text-purple-200"}`}>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span>{event.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className={`w-full mt-3 ${
            isPrimary
              ? "border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              : "border-pink-400 text-pink-300 hover:bg-purple-700"
          }`}
          onClick={(e) => {
            e.stopPropagation()
            handleViewAll()
          }}
        >
          View All Live Events
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}
