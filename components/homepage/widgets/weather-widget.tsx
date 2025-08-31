"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudDrizzle, CloudSnow, Zap, RefreshCw, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buildApiUrl } from "@/lib/strapi-config"

interface WeatherData {
  current: {
    temperature: number
    condition: string
    description: string
    humidity: number
    windSpeed: number
    pressure: number
    visibility: number
    uvIndex: number
    feelsLike: number
    icon: string
  }
  forecast: Array<{
    date: string
    high: number
    low: number
    condition: string
    description: string
    icon: string
    humidity: number
    windSpeed: number
  }>
  airQuality: {
    index: number
    level: string
    pm25: number
    pm10: number
    o3: number
    no2: number
  } | null
  location: string
  lastUpdated: string
  source: string
}

interface StrapiWeather {
  id: number
  Location: string
  Condition: string
  Description: string
  Icon: string
  Temperature: number
  FeelsLike: number
  Humidity: number
  Windspeed: number
  Pressure: number
  Visibility: number
  UvIndex: number
  LastUpdated: string
  Source: string
  IsActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    loadWeather()
    // Refresh every 10 minutes
    const interval = setInterval(loadWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  const loadWeather = async () => {
    try {
      setError(null)
      // Call Strapi API to get the most recent active weather data
      const response = await fetch(buildApiUrl("weathers?filters[IsActive][$eq]=true&sort=LastUpdated:desc&pagination[limit]=1"))
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          const strapiWeather: StrapiWeather = data.data[0]
          
          // Transform Strapi data to match component interface
          const transformedWeather: WeatherData = {
            current: {
              temperature: strapiWeather.Temperature,
              condition: strapiWeather.Condition,
              description: strapiWeather.Description,
              humidity: strapiWeather.Humidity,
              windSpeed: strapiWeather.Windspeed,
              pressure: strapiWeather.Pressure,
              visibility: strapiWeather.Visibility,
              uvIndex: strapiWeather.UvIndex,
              feelsLike: strapiWeather.FeelsLike,
              icon: strapiWeather.Icon,
            },
            forecast: [],
            airQuality: null,
            location: strapiWeather.Location,
            lastUpdated: strapiWeather.LastUpdated || strapiWeather.publishedAt,
            source: strapiWeather.Source,
          }
          
          setWeather(transformedWeather)
          setLastRefresh(new Date())
          console.log('Weather data loaded from Strapi:', strapiWeather.Location, strapiWeather.Condition)
        } else {
          throw new Error("No active weather data available")
        }
      } else {
        console.error("Failed to fetch weather from Strapi:", response.status)
        throw new Error("Failed to fetch weather data")
      }
    } catch (err) {
      console.error("Weather loading error:", err)
      setError("Unable to load weather data")
      
      // Set fallback data
      setWeather({
        current: {
          temperature: 32,
          condition: "broken clouds",
          description: "Broken Clouds",
          humidity: 65,
          windSpeed: 3,
          pressure: 1013,
          visibility: 10,
          uvIndex: 6,
          feelsLike: 39,
          icon: "04d",
        },
        forecast: [],
        airQuality: null,
        location: "Pattaya, Thailand",
        lastUpdated: new Date().toISOString(),
        source: "OpenWeatherMap",
      })
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition?: string) => {
    const conditionLower = condition?.toLowerCase() ?? "unknown"
    const iconClass = "h-12 w-12"

    switch (conditionLower) {
      case "clear":
      case "clear sky":
      case "sunny":
        return <Sun className={`${iconClass} text-amber-500`} />
      case "clouds":
      case "cloudy":
      case "partly cloudy":
      case "few clouds":
      case "scattered clouds":
      case "broken clouds":
        return <Cloud className={`${iconClass} text-gray-400`} />
      case "rain":
      case "light rain":
      case "moderate rain":
      case "shower rain":
        return <CloudRain className={`${iconClass} text-gray-500`} />
      case "drizzle":
      case "light intensity drizzle":
        return <CloudDrizzle className={`${iconClass} text-gray-500`} />
      case "thunderstorm":
        return <Zap className={`${iconClass} text-amber-600`} />
      case "snow":
        return <CloudSnow className={`${iconClass} text-gray-300`} />
      default:
        return <Cloud className={`${iconClass} text-gray-400`} />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (loading) {
    return (
      <Card className="top-row-widget bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-16 animate-pulse"></div>
            </div>
            <div className="w-8 h-4 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-100 rounded w-12"></div>
                <div className="h-3 bg-gray-100 rounded w-20"></div>
                <div className="h-3 bg-gray-100 rounded w-16"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-8 bg-gray-100 rounded"></div>
              <div className="h-8 bg-gray-100 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="top-row-widget bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-[15px] font-medium text-gray-900">Weather</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-gray-500">
            <Cloud className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">Weather unavailable</p>
            <p className="text-[11px] text-gray-400 mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget bg-white/95 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="text-[15px] font-medium text-gray-900">Weather</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 text-[11px] px-2 py-0.5 font-medium border border-blue-200 rounded-full">
              Live
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadWeather} 
              className="h-7 w-7 p-0 hover:bg-gray-100/80 rounded-full transition-colors" 
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
          <MapPin className="w-3 h-3" />
          <span className="tracking-wide uppercase">Pattaya, Thailand</span>
        </div>

        {/* Main Weather Display */}
        <div className="weather-main">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.current.condition)}
              <div className="space-y-1">
                <div className="temperature text-3xl font-light text-gray-900 tracking-tight">
                  {Math.round(weather.current.temperature)}°
                </div>
                <div className="text-[13px] font-medium text-gray-600 capitalize">
                  {weather.current.description}
                </div>
                <div className="text-[11px] text-gray-400 font-medium">
                  Feels like {Math.round(weather.current.feelsLike)}°
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
            <div className="p-1.5 bg-blue-50 rounded-full">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-gray-900">{weather.current.humidity}%</div>
              <div className="text-[11px] text-gray-500 font-medium">Humidity</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
            <div className="p-1.5 bg-gray-50 rounded-full">
              <Wind className="w-3.5 h-3.5 text-gray-600" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-gray-900">{Math.round(weather.current.windSpeed)} km/h</div>
              <div className="text-[11px] text-gray-500 font-medium">Wind Speed</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
            <Clock className="w-3 h-3" />
            <span>Updated {formatTime(lastRefresh)}</span>
          </div>
          {error && (
            <div className="flex items-center gap-1 text-[11px] text-amber-600">
              <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
              <span className="font-medium">Connection issue</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
