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
import { buildApiUrl } from "@/lib/strapi-config"

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

interface StrapiTrafficRoute {
  id: number
  From: string
  To: string
  Distance: string
  NormalTime: string
  CurrentTime: string
  Delay: number
  Status: string
  Incidents: number
  IsActive: boolean
  Featured: boolean
  Order: number
  Description?: string
  LastUpdated: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface StrapiTrafficIncident {
  id: number
  Type: string
  Location: string
  Severity: string
  Description: string
  EstimatedClearTime: string
  IsActive: boolean
  Featured: boolean
  Order: number
  Coordinates?: {
    lat: number
    lng: number
  }
  AffectedRoutes?: string[]
  LastUpdated: string
  createdAt: string
  updatedAt: string
  publishedAt: string
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
      setLoading(true)
      console.log('Fetching traffic data from Strapi...')
      
      // Fetch traffic routes
      const routesResponse = await fetch(buildApiUrl("traffic-routes?populate=*&sort=Order:asc"))
      const incidentsResponse = await fetch(buildApiUrl("traffic-incidents?populate=*&sort=Order:asc"))
      
      if (routesResponse.ok && incidentsResponse.ok) {
        const routesData = await routesResponse.json()
        const incidentsData = await incidentsResponse.json()
        
        if (routesData.data && routesData.data.length > 0) {
          const transformedRoutes: TrafficRoute[] = routesData.data.map((strapiRoute: StrapiTrafficRoute) => ({
            id: strapiRoute.id.toString(),
            from: strapiRoute.From,
            to: strapiRoute.To,
            distance: strapiRoute.Distance,
            normalTime: strapiRoute.NormalTime,
            currentTime: strapiRoute.CurrentTime,
            delay: strapiRoute.Delay,
            status: strapiRoute.Status as "clear" | "moderate" | "heavy" | "blocked",
            incidents: strapiRoute.Incidents,
            lastUpdated: strapiRoute.LastUpdated,
          }))
          setRoutes(transformedRoutes)
        } else {
          setRoutes(getFallbackRoutes())
        }
        
        if (incidentsData.data && incidentsData.data.length > 0) {
          const transformedIncidents: TrafficIncident[] = incidentsData.data.map((strapiIncident: StrapiTrafficIncident) => ({
            id: strapiIncident.id.toString(),
            type: strapiIncident.Type as "accident" | "construction" | "event" | "weather",
            description: strapiIncident.Description,
            estimatedClearTime: strapiIncident.EstimatedClearTime,
            location: strapiIncident.Location,
            severity: strapiIncident.Severity as "low" | "medium" | "high",
          }))
          setIncidents(transformedIncidents)
        } else {
          setIncidents(getFallbackIncidents())
        }
      } else {
        console.error("Failed to load traffic data from Strapi:", routesResponse.status, incidentsResponse.status)
        setRoutes(getFallbackRoutes())
        setIncidents(getFallbackIncidents())
      }
    } catch (error) {
      console.error("Failed to load traffic data:", error)
      setRoutes(getFallbackRoutes())
      setIncidents(getFallbackIncidents())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackRoutes = (): TrafficRoute[] => [
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

  const getFallbackIncidents = (): TrafficIncident[] => [
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clear":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "moderate":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "heavy":
        return "bg-red-50 text-red-700 border-red-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
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
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  if (loading) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-100 rounded-lg w-32"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>
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
    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-[15px] font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            Traffic Conditions
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-[11px] text-gray-500 font-medium">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
              Live
            </div>
            {onToggleExpand && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleExpand} 
                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="overflow-y-auto transition-all duration-300" style={{ maxHeight }}>
          {/* Major Routes */}
          <div className="space-y-3 mb-5">
            <h5 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Major Routes</h5>
            {displayRoutes.map((route, index) => (
              <div
                key={route.id}
                className="p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 border border-gray-100/50 hover:border-gray-200 transition-all duration-200 cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getStatusColor(route.status)}`}
                    >
                      {getStatusIcon(route.status)}
                      <span className="ml-1 capitalize">{route.status}</span>
                    </Badge>
                    {route.incidents > 0 && (
                      <Badge 
                        variant="outline" 
                        className="text-[10px] font-medium px-2 py-1 rounded-full bg-red-50 text-red-700 border-red-200"
                      >
                        {route.incidents} incident{route.incidents > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{route.distance}</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 text-[12px]">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="font-medium text-gray-900 truncate max-w-[80px]">{route.from}</span>
                    <span className="text-gray-300">→</span>
                    <span className="font-medium text-gray-900 truncate max-w-[80px]">{route.to}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span
                      className={`text-[12px] font-medium ${
                        route.delay > 0
                          ? "text-red-600"
                          : route.delay < 0
                            ? "text-emerald-600"
                            : "text-gray-900"
                      }`}
                    >
                      {route.currentTime}
                    </span>
                    <span className="text-[11px] text-gray-400">({route.normalTime})</span>
                  </div>
                  {route.delay !== 0 && (
                    <span className={`text-[11px] font-semibold ${
                      route.delay > 0 ? "text-red-600" : "text-emerald-600"
                    }`}>
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
            <div className="space-y-3">
              <h5 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Active Incidents</h5>
              <div className="space-y-2">
                {displayIncidents.map((incident, index) => (
                  <div
                    key={incident.id}
                    className="p-3 rounded-xl bg-red-50/50 border border-red-100/50 hover:bg-red-50 transition-colors duration-200"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-sm mt-0.5">{getIncidentIcon(incident.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[12px] font-medium text-gray-900 line-clamp-1 max-w-[120px]">
                            {incident.location}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getSeverityColor(incident.severity)}`}
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-2 mb-2 leading-relaxed">{incident.description}</p>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-500 capitalize font-medium">{incident.type}</span>
                          <span className="text-gray-500 font-medium">Clear in {incident.estimatedClearTime}</span>
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
        <div className="mt-5 pt-4 border-t border-gray-100/50 flex items-center justify-between text-[10px] text-gray-500">
          <span className="font-medium">Updated: {currentTime.toLocaleTimeString("en-US", { hour12: false })}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-[10px] font-medium hover:bg-gray-100 rounded-lg transition-colors" 
            onClick={loadTrafficData}
          >
            <Navigation className="h-3 w-3 mr-1.5" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
