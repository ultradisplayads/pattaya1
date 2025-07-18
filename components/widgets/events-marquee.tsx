"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EventsMarqueeProps {
  theme: "primary" | "nightlife"
}

export function EventsMarquee({ theme }: EventsMarqueeProps) {
  const [events] = useState([
    {
      id: 1,
      title: "Pattaya Music Festival 2024",
      location: "Central Pattaya Beach",
      time: "7:00 PM",
      date: "Tonight",
      type: "Music",
      isLive: true,
    },
    {
      id: 2,
      title: "Night Bazaar Grand Opening",
      location: "Walking Street",
      time: "6:00 PM",
      date: "Tomorrow",
      type: "Shopping",
      isLive: false,
    },
    {
      id: 3,
      title: "Thai Cooking Class",
      location: "Pattaya Cooking School",
      time: "2:00 PM",
      date: "This Weekend",
      type: "Culture",
      isLive: false,
    },
  ])

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
      <div className="flex items-center space-x-2 mb-3">
        <Calendar className="h-5 w-5" />
        <span className="font-semibold">Live Events</span>
        <Badge variant="secondary" className="bg-red-500 text-white animate-pulse">
          LIVE
        </Badge>
      </div>

      <div className="flex animate-scroll space-x-8">
        {events.concat(events).map((event, index) => (
          <div key={`${event.id}-${index}`} className="flex-shrink-0 bg-white/10 rounded-lg p-3 min-w-[300px]">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-sm">{event.title}</h3>
              {event.isLive && (
                <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                  LIVE
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-xs text-white/80">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>
                  {event.date} at {event.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
