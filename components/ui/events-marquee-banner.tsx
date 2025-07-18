"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EventsMarqueeBannerProps {
  theme: "primary" | "nightlife"
}

export function EventsMarqueeBanner({ theme }: EventsMarqueeBannerProps) {
  const [liveEvents, setLiveEvents] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    loadLiveEvents()
  }, [])

  const loadLiveEvents = async () => {
    try {
      const response = await fetch("/api/events/live")
      if (response.ok) {
        const data = await response.json()
        setLiveEvents(data.data || [])
      }
    } catch (error) {
      console.error("Failed to load live events:", error)
    }
  }

  if (!isVisible || liveEvents.length === 0) return null

  const isPrimary = theme === "primary"

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${
        isPrimary ? "bg-gradient-to-r from-red-500 to-pink-500" : "bg-gradient-to-r from-purple-600 to-pink-600"
      } text-white shadow-lg`}
    >
      <div className="relative overflow-hidden h-12">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 text-white hover:bg-white/20"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>

        {/* Scrolling Content */}
        <div className="flex items-center h-full">
          <div className="flex items-center space-x-2 px-4 flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm">LIVE EVENTS</span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee flex items-center space-x-8 whitespace-nowrap">
              {/* Duplicate events for seamless loop */}
              {[...liveEvents, ...liveEvents].map((event, index) => (
                <div
                  key={`${event.id}-${index}`}
                  className="flex items-center space-x-4 cursor-pointer hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                  onClick={() => (window.location.href = `/events/${event.id}`)}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{event.title}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-sm opacity-90">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-sm opacity-90">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>

                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {event.attendees} attending
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
