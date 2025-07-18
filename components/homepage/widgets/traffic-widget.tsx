"use client"

import { useState, useEffect } from "react"
import {
  Car,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Navigation,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TrafficRoute {
  id: string
  from: string
  to: string
  distance: string
  normalTime: string
  currentTime: string
  delay: number
  status: "clear" | "moderate" | "heavy" | "blocked"
  incidents: number
  lastUpdated: string
}

interface TrafficIncident {
  id: string
  type: "accident" | "construction" | "event" | "weather"
  location: string
  severity: "low" | "medium" | "high"
  description: string
  estimatedClearTime: string
}

interface TrafficWidgetProps {
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function TrafficWidget({ isExpanded = false, onToggleExpand }: TrafficWidgetProps) {
  const [routes, setRoutes] = useState<TrafficRoute[]>([])
  const [incidents, setIncidents] = useState<TrafficIncident[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    loadTrafficData()
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const dataInterval = setInterval(loadTrafficData, 120000) // Refresh every 2 minutes

    return () => {
      clearInterval(timeInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const loadTrafficData = async () => {
    try {
      // Simulate API call - replace with actual traffic data
      const mockRoutes: TrafficRoute[] = [
        {
          id: "1",
          from: "Bangkok",
          to: "Pattaya",
          distance: "147 km",
          normalTime: "1h 45m",
          currentTime: "2h 15m",
          delay: 30,
          status: "moderate",
          incidents: 2,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          from: "Pattaya Center",
          to: "Jomtien Beach",
          distance: "6.2 km",
          normalTime: "15m",
          currentTime: "12m",
          delay: -3,
          status: "clear",
          incidents: 0,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "3",
          from: "Suvarnabhumi Airport",
          to: "Pattaya",
          distance: "120 km",
          normalTime: "1h 30m",
          currentTime: "2h 45m",
          delay: 75,
          status: "heavy",
          incidents: 3,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "4",
          from: "Walking Street",
          to: "Terminal 21",
          distance: "3.8 km",
          normalTime: "8m",
          currentTime: "8m",
          delay: 0,
          status: "clear",
          incidents: 0,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "5",
          from: "Pattaya",
          to: "Rayong",
          distance: "85 km",
          normalTime: "1h 15m",
          currentTime: "1h 35m",
          delay: 20,
          status: "moderate",
          incidents: 1,
          lastUpdated: new Date().toISOString(),
        },
      ]

      const mockIncidents: TrafficIncident[] = [
        {
          id: "1",
          type: "accident",
          location: "Highway 7, km 125",
          severity: "high",
          description: "Multi-vehicle accident blocking 2 lanes",
          estimatedClearTime: "45 minutes",
        },
        {
          id: "2",
          type: "construction",
          location: "Sukhumvit Road, Central Pattaya",
          severity: "medium",
          description: "Road maintenance, single lane closure",
          estimatedClearTime: "2 hours",
        },
        {
          id: "3",
          type: "event",
          location: "Beach Road",
          severity: "low",
          description: "Festival setup causing minor delays",
          estimatedClearTime: "30 minutes",
        },
      ]

      setRoutes(mockRoutes)
      setIncidents(mockIncidents)
    } catch (error) {
      console.error("Failed to load traffic data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clear":
        return "bg-green-500 text-white"
      case "moderate":
        return "bg-yellow-500 text-white"
      case "heavy":
        return "bg-red-500 text-white animate-pulse"
      case "blocked":
        return "bg-red-700 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clear":
        return <CheckCircle className="w-3 h-3" />
      case "moderate":
        return <Clock className="w-3 h-3" />
      case "heavy":
        return <AlertTriangle className="w-3 h-3" />
      case "blocked":
        return <XCircle className="w-3 h-3" />
      default:
        return <Car className="w-3 h-3" />
    }
  }

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "accident":
        return "🚗"
      case "construction":
        return "🚧"
      case "event":
        return "🎉"
      case "weather":
        return "🌧️"
      default:
        return "⚠️"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-yellow-100 text-yellow-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayRoutes = isExpanded ? routes : routes.slice(0, 2)
  const displayIncidents = isExpanded ? incidents : incidents.slice(0, 2)
  const maxHeight = isExpanded ? "500px" : "280px"

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          <div className="flex items-center">
            <Car className="h-4 w-4 mr-2 text-green-500" />
            Traffic Conditions
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs text-gray-500">
              <Navigation className="h-3 w-3 mr-1" />
              Live
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
        <div className="overflow-y-auto transition-all duration-300" style={{ maxHeight }}>
          {/* Major Routes */}
          <div className="space-y-3 mb-4">
            <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Major Routes</h5>
            {displayRoutes.map((route, index) => (
              <div
                key={route.id}
                className="p-3 rounded-lg bg-white/70 hover:bg-white border border-gray-100 hover:shadow-sm transition-all duration-200 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(route.status)}`}>
                      {getStatusIcon(route.status)}
                      <span className="ml-1 capitalize">{route.status}</span>
                    </Badge>
                    {route.incidents > 0 && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                        {route.incidents} incident{route.incidents > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{route.distance}</span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1 text-xs">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="font-medium truncate max-w-[80px]">{route.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium truncate max-w-[80px]">{route.to}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span
                      className={
                        route.delay > 0
                          ? "text-red-600 font-semibold"
                          : route.delay < 0
                            ? "text-green-600 font-semibold"
                            : "text-gray-600"
                      }
                    >
                      {route.currentTime}
                    </span>
                    <span className="text-gray-400">({route.normalTime})</span>
                  </div>
                  {route.delay !== 0 && (
                    <span className={`font-semibold ${route.delay > 0 ? "text-red-600" : "text-green-600"}`}>
                      {route.delay > 0 ? "+" : ""}
                      {route.delay}m
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Traffic Incidents */}
          {displayIncidents.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Incidents</h5>
              <div className="space-y-2">
                {displayIncidents.map((incident, index) => (
                  <div
                    key={incident.id}
                    className="p-2 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors duration-200"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-sm">{getIncidentIcon(incident.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-800 line-clamp-1 max-w-[120px]">
                            {incident.location}
                          </span>
                          <Badge variant="secondary" className={`text-xs ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">{incident.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 capitalize">{incident.type}</span>
                          <span className="text-gray-500">Clear in {incident.estimatedClearTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Updated: {currentTime.toLocaleTimeString("en-US", { hour12: false })}</span>
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={loadTrafficData}>
            <Navigation className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
