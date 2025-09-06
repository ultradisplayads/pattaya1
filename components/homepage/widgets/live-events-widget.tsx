"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, Zap } from "lucide-react"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"

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

interface StrapiLiveEvent {
  id: number
  Title: string
  Location: string
  Time: string
  Attendees: number
  Status: string
  Category: string
  Image?: {
    id: number
    name: string
    url: string
    formats?: {
      thumbnail?: { url: string }
      small?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }
  IsActive: boolean
  Featured: boolean
  Order: number
  Description?: string
  Tags?: string[]
  StartTime?: string
  EndTime?: string
  LastUpdated?: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function LiveEventsWidget() {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [currentEvent, setCurrentEvent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLiveEvents()
    const interval = setInterval(loadLiveEvents, 180000) // Refresh every 3 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      // Auto-rotate events every 4 seconds
      const interval = setInterval(() => {
        setCurrentEvent((prev) => (prev + 1) % events.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [events])

  const loadLiveEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl("live-events?populate=*&sort=Order:asc"))
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          const transformedEvents: LiveEvent[] = data.data.map((strapiEvent: StrapiLiveEvent) => {
            // Get image URL with fallback
            let imageUrl = "/placeholder.svg?height=100&width=150&text=Event"
            if (strapiEvent.Image) {
              imageUrl = buildStrapiUrl(strapiEvent.Image.url)
            }

            return {
              id: strapiEvent.id.toString(),
              title: strapiEvent.Title,
              location: strapiEvent.Location,
              time: strapiEvent.Time,
              attendees: strapiEvent.Attendees,
              status: strapiEvent.Status as "live" | "starting" | "upcoming",
              category: strapiEvent.Category,
              image: imageUrl,
            }
          })

          setEvents(transformedEvents)
        } else {
          setEvents(getFallbackLiveEvents())
        }
      } else {
        console.error("Failed to load live events from Strapi:", response.status)
        setEvents(getFallbackLiveEvents())
      }
    } catch (error) {
      console.error("Failed to load live events:", error)
      setEvents(getFallbackLiveEvents())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackLiveEvents = (): LiveEvent[] => [
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500/90 backdrop-blur-sm"
      case "starting":
        return "bg-orange-500/90 backdrop-blur-sm"
      case "upcoming":
        return "bg-blue-500/90 backdrop-blur-sm"
      default:
        return "bg-gray-500/90 backdrop-blur-sm"
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

  if (loading) return <div className="animate-pulse bg-gray-200 rounded-lg h-full"></div>

  const event = events[currentEvent]

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out">
      {/* Global Sponsorship Banner */}
      <SponsorshipBanner widgetType="live-events" />
      <CardHeader className="pb-3 px-5 pt-5">
        <CardTitle className="text-[15px] font-semibold text-gray-900 flex items-center tracking-tight">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2.5 animate-pulse"></div>
          Live Events
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-4">
        {/* Event Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-20 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Status Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full ${getStatusColor(event.status)}`}>
            <span className="text-[10px] font-semibold text-white tracking-wide">
              {getStatusText(event.status)}
            </span>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm">
            <span className="text-[10px] font-medium text-gray-700 tracking-wide">
              {event.category}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          <h3 className="text-[14px] font-semibold text-gray-900 leading-tight tracking-tight line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-[12px] text-gray-600 font-medium truncate">{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-[12px] text-gray-600 font-medium truncate">{event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-[12px] text-gray-600 font-medium truncate">
                {event.attendees.toLocaleString()} attending
              </span>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-1.5 pt-1">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentEvent(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ease-out ${
                index === currentEvent 
                  ? "bg-gray-900 scale-125" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
