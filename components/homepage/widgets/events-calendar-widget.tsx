"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Users, ExternalLink, Star, DollarSign, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
      // Simulate API call - replace with actual events data
      const mockEvents: Event[] = [
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
        {
          id: "4",
          title: "Floating Market Tour",
          date: "2024-01-16",
          time: "08:00",
          location: "Damnoen Saduak",
          attendees: 45,
          maxAttendees: 50,
          price: 800,
          category: "Tourism",
          status: "filling-fast",
          image: "/placeholder.svg?height=60&width=80&text=Floating+Market",
          featured: false,
        },
        {
          id: "5",
          title: "Cabaret Show Spectacular",
          date: "2024-01-16",
          time: "21:00",
          location: "Alcazar Theatre",
          attendees: 300,
          maxAttendees: 300,
          price: 1200,
          category: "Entertainment",
          status: "sold-out",
          image: "/placeholder.svg?height=60&width=80&text=Cabaret+Show",
          featured: false,
        },
        {
          id: "6",
          title: "Sunset Yacht Party",
          date: "2024-01-18",
          time: "17:00",
          location: "Pattaya Marina",
          attendees: 67,
          maxAttendees: 80,
          price: 2500,
          category: "Nightlife",
          status: "confirmed",
          image: "/placeholder.svg?height=60&width=80&text=Yacht+Party",
          featured: true,
        },
      ]

      // Sort by date and time
      const sortedEvents = mockEvents.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateA.getTime() - dateB.getTime()
      })

      setEvents(sortedEvents)
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white"
      case "filling-fast":
        return "bg-orange-500 text-white animate-pulse"
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
      Music: "bg-purple-100 text-purple-800",
      Sports: "bg-red-100 text-red-800",
      Tourism: "bg-blue-100 text-blue-800",
      Entertainment: "bg-pink-100 text-pink-800",
      Nightlife: "bg-indigo-100 text-indigo-800",
      Shopping: "bg-green-100 text-green-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayEvents = isExpanded ? events : events.slice(0, 3)
  const maxHeight = isExpanded ? "600px" : "320px"

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            Events Calendar
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
            {onToggleExpand && (
              <Button variant="ghost" size="sm" onClick={onToggleExpand} className="h-6 w-6 p-0">
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3 overflow-y-auto transition-all duration-300" style={{ maxHeight }}>
          {displayEvents.map((event, index) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg transition-all duration-200 cursor-pointer group border ${
                event.featured
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-md"
                  : "bg-white/70 hover:bg-white border-gray-100 hover:shadow-sm"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-16 h-12 rounded object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {event.title}
                      {event.featured && <Star className="inline w-3 h-3 ml-1 text-yellow-500 fill-current" />}
                    </h4>
                    <Badge variant="secondary" className={`text-xs ml-2 ${getStatusColor(event.status)}`}>
                      {event.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="font-mono">{formatTimeUntil(event.date, event.time)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate max-w-[120px]">{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{event.attendees}</span>
                        {event.maxAttendees && <span>/{event.maxAttendees}</span>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-xs font-semibold">
                        <DollarSign className="w-3 h-3 mr-1" />
                        <span className={event.price === 0 ? "text-green-600" : "text-gray-700"}>
                          {formatPrice(event.price)}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Attendance progress bar */}
                  {event.maxAttendees && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
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
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <Calendar className="h-3 w-3 mr-1" />
              View Full Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
