"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, Zap } from "lucide-react"

interface LiveEvent {
  id: string
  title: string
  location: string
  time: string
  attendees: number
  status: "live" | "starting" | "upcoming"
  category: string
  image: string
}

export function LiveEventsWidget() {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [currentEvent, setCurrentEvent] = useState(0)

  useEffect(() => {
    const liveEvents: LiveEvent[] = [
      {
        id: "1",
        title: "Beach Volleyball Tournament",
        location: "Jomtien Beach",
        time: "Now - 8:00 PM",
        attendees: 250,
        status: "live",
        category: "Sports",
        image: "/placeholder.svg?height=100&width=150&text=Volleyball",
      },
      {
        id: "2",
        title: "Thai Cooking Workshop",
        location: "Central Pattaya",
        time: "Starting in 30 min",
        attendees: 25,
        status: "starting",
        category: "Food",
        image: "/placeholder.svg?height=100&width=150&text=Cooking",
      },
      {
        id: "3",
        title: "Live Jazz Performance",
        location: "Rooftop Bar",
        time: "8:00 PM - 11:00 PM",
        attendees: 120,
        status: "upcoming",
        category: "Music",
        image: "/placeholder.svg?height=100&width=150&text=Jazz",
      },
      {
        id: "4",
        title: "Night Market Opening",
        location: "Walking Street",
        time: "6:00 PM - 12:00 AM",
        attendees: 1500,
        status: "live",
        category: "Shopping",
        image: "/placeholder.svg?height=100&width=150&text=Market",
      },
    ]
    setEvents(liveEvents)

    // Auto-rotate events every 4 seconds
    const interval = setInterval(() => {
      setCurrentEvent((prev) => (prev + 1) % liveEvents.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white"
      case "starting":
        return "bg-orange-500 text-white"
      case "upcoming":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "LIVE"
      case "starting":
        return "STARTING"
      case "upcoming":
        return "UPCOMING"
      default:
        return status.toUpperCase()
    }
  }

  if (events.length === 0) return <div className="animate-pulse bg-gray-200 rounded-lg h-full"></div>

  const event = events[currentEvent]

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          Live Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Event Image */}
        <div className="relative">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-20 object-cover rounded-lg"
          />
          <Badge className={`absolute top-2 left-2 text-xs ${getStatusColor(event.status)} animate-pulse`}>
            {getStatusText(event.status)}
          </Badge>
          <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
            {event.category}
          </Badge>
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold line-clamp-2">{event.title}</h3>

          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{event.attendees.toLocaleString()} attending</span>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-1">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentEvent(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentEvent ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
