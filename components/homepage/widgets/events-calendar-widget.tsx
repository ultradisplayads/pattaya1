"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Users, ExternalLink, Star, DollarSign, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees?: number
  price: number
  category: string
  status: "confirmed" | "filling-fast" | "sold-out" | "free"
  image: string
  featured: boolean
}

interface StrapiEventCalendar {
  id: number
  Title: string
  Date: string
  Time: string
  Location: string
  Attendees: number
  MaxAttendees?: number
  Price: number
  Category: string
  Status: "confirmed" | "filling-fast" | "sold-out" | "free" | "cancelled" | "postponed"
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
  Featured: boolean
  IsActive: boolean
  Description: string
  Organizer: string
  ContactEmail: string
  ContactPhone: string
  Website: string
  Tags: string[]
  Duration: string
  AgeRestriction: string
  Accessibility: string
  LastUpdated: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface EventsCalendarWidgetProps {
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function EventsCalendarWidget({ isExpanded = false, onToggleExpand }: EventsCalendarWidgetProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    loadEvents()
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const dataInterval = setInterval(loadEvents, 300000) // Refresh every 5 minutes

    return () => {
      clearInterval(timeInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      console.log('Fetching events from Strapi...')
      
      const response = await fetch(buildApiUrl("event-calendars?populate=*&sort=Date:asc"))
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          const transformedEvents: Event[] = data.data.map((strapiEvent: StrapiEventCalendar) => {
            // Get image URL with fallback
            let imageUrl = "/placeholder.svg?height=60&width=80&text=Event"
            if (strapiEvent.Image) {
              imageUrl = buildStrapiUrl(strapiEvent.Image.url)
            }

            return {
              id: strapiEvent.id.toString(),
              title: strapiEvent.Title,
              date: strapiEvent.Date,
              time: strapiEvent.Time,
              location: strapiEvent.Location,
              attendees: strapiEvent.Attendees,
              maxAttendees: strapiEvent.MaxAttendees,
              price: strapiEvent.Price,
              category: strapiEvent.Category,
              status: strapiEvent.Status,
              image: imageUrl,
              featured: strapiEvent.Featured,
            }
          })

          // Sort by date and time
          const sortedEvents = transformedEvents.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)
            return dateA.getTime() - dateB.getTime()
          })

          setEvents(sortedEvents)
        } else {
          setEvents(getFallbackEvents())
        }
      } else {
        console.error("Failed to load events from Strapi:", response.status)
        setEvents(getFallbackEvents())
      }
    } catch (error) {
      console.error("Failed to load events:", error)
      setEvents(getFallbackEvents())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackEvents = (): Event[] => [
    {
      id: "1",
      title: "Pattaya Music Festival 2024",
      date: "2024-01-20",
      time: "19:00",
      location: "Pattaya Beach",
      attendees: 2847,
      maxAttendees: 5000,
      price: 0,
      category: "Music",
      status: "free",
      image: "/placeholder.svg?height=60&width=80&text=Music+Festival",
      featured: true,
    },
    {
      id: "2",
      title: "Walking Street Night Market",
      date: "2024-01-16",
      time: "18:00",
      location: "Walking Street",
      attendees: 156,
      maxAttendees: 200,
      price: 0,
      category: "Shopping",
      status: "filling-fast",
      image: "/placeholder.svg?height=60&width=80&text=Night+Market",
      featured: false,
    },
    {
      id: "3",
      title: "Muay Thai Championship",
      date: "2024-01-17",
      time: "20:30",
      location: "Max Muay Thai Stadium",
      attendees: 890,
      maxAttendees: 1000,
      price: 1500,
      category: "Sports",
      status: "confirmed",
      image: "/placeholder.svg?height=60&width=80&text=Muay+Thai",
      featured: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white"
      case "filling-fast":
        return "bg-orange-500 text-white"
      case "sold-out":
        return "bg-red-500 text-white"
      case "free":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Music: "bg-purple-50 text-purple-700 border-purple-200",
      Sports: "bg-red-50 text-red-700 border-red-200",
      Tourism: "bg-blue-50 text-blue-700 border-blue-200",
      Entertainment: "bg-pink-50 text-pink-700 border-pink-200",
      Nightlife: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Shopping: "bg-green-50 text-green-700 border-green-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const formatTimeUntil = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`)
    const now = currentTime
    const diff = eventDate.getTime() - now.getTime()

    if (diff < 0) return "Started"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours < 24) {
      return `${hours}h ${minutes}m`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
  }

  const formatPrice = (price: number) => {
    if (price === 0) return "Free"
    return `฿${price.toLocaleString()}`
  }

  if (loading) {
    return (
      <Card className="h-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-100 rounded-full w-32"></div>
            <div className="h-4 bg-gray-100 rounded-full w-16"></div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-16 h-12 bg-gray-100 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayEvents = isExpanded ? events : events.slice(0, 3)
  const maxHeight = isExpanded ? "600px" : "320px"

  return (
    <Card className="h-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
      {/* Global Sponsorship Banner */}
      <SponsorshipBanner widgetType="events" />
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-3 text-blue-500" />
            Events Calendar
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-xs text-gray-500 font-medium">
              <Clock className="h-3 w-3 mr-2" />
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
            {onToggleExpand && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleExpand} 
                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4 overflow-y-auto transition-all duration-300" style={{ maxHeight }}>
          {displayEvents.map((event, index) => (
            <div
              key={event.id}
              className={`p-4 rounded-xl transition-all duration-200 cursor-pointer group border ${
                event.featured
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:shadow-md"
                  : "bg-gray-50 hover:bg-white border-gray-100 hover:shadow-sm"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-16 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {event.title}
                      {event.featured && <Star className="inline w-3 h-3 ml-2 text-yellow-500 fill-current" />}
                    </h4>
                    <Badge className={`text-xs font-medium rounded-full border-0 ${getStatusColor(event.status)}`}>
                      {event.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                    <div className="flex items-center font-medium">
                      <Clock className="w-3 h-3 mr-2" />
                      <span className="font-mono">{formatTimeUntil(event.date, event.time)}</span>
                    </div>
                    <div className="flex items-center font-medium">
                      <MapPin className="w-3 h-3 mr-2" />
                      <span className="truncate max-w-[120px]">{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={`text-xs font-medium border ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <Users className="w-3 h-3 mr-2" />
                        <span>{event.attendees}</span>
                        {event.maxAttendees && <span>/{event.maxAttendees}</span>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-xs font-semibold">
                        <DollarSign className="w-3 h-3 mr-2" />
                        <span className={event.price === 0 ? "text-green-600" : "text-gray-700"}>
                          {formatPrice(event.price)}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Attendance progress bar */}
                  {event.maxAttendees && (
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-500 ${
                          event.attendees / event.maxAttendees > 0.8
                            ? "bg-red-500"
                            : event.attendees / event.maxAttendees > 0.6
                              ? "bg-orange-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isExpanded && (
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs font-medium bg-white border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-3 w-3 mr-2" />
              View Full Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
