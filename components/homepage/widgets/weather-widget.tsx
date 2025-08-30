"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudDrizzle, CloudSnow, Zap, RefreshCw, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
      const response = await fetch("http://localhost:1337/api/weathers?filters[IsActive][$eq]=true&sort=LastUpdated:desc&pagination[limit]=1")
      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          const weatherData = data.data[0]
          setWeather({
            current: {
              temperature: weatherData.Temperature,
              condition: weatherData.Condition,
              description: weatherData.Description,
              humidity: weatherData.Humidity,
              windSpeed: weatherData.Windspeed,
              pressure: weatherData.Pressure,
              visibility: weatherData.Visibility,
              uvIndex: weatherData.UvIndex,
              feelsLike: weatherData.FeelsLike,
              icon: weatherData.Icon,
            },
            forecast: [],
            airQuality: null,
            location: weatherData.Location,
            lastUpdated: weatherData.LastUpdated,
            source: weatherData.Source,
          })
          setLastRefresh(new Date())
        } else {
          throw new Error("No weather data available")
        }
      } else {
        throw new Error("Failed to fetch weather")
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
    const iconClass = "h-16 w-16"

    switch (conditionLower) {
      case "clear":
      case "clear sky":
      case "sunny":
        return <Sun className={`${iconClass} text-amber-500 drop-shadow-sm`} />
      case "clouds":
      case "cloudy":
      case "partly cloudy":
      case "few clouds":
      case "scattered clouds":
      case "broken clouds":
        return <Cloud className={`${iconClass} text-slate-400 drop-shadow-sm`} />
      case "rain":
      case "light rain":
      case "moderate rain":
      case "shower rain":
        return <CloudRain className={`${iconClass} text-slate-600 drop-shadow-sm`} />
      case "drizzle":
      case "light intensity drizzle":
        return <CloudDrizzle className={`${iconClass} text-slate-500 drop-shadow-sm`} />
      case "thunderstorm":
        return <Zap className={`${iconClass} text-amber-600 drop-shadow-sm`} />
      case "snow":
        return <CloudSnow className={`${iconClass} text-slate-300 drop-shadow-sm`} />
      default:
        return <Cloud className={`${iconClass} text-slate-400 drop-shadow-sm`} />
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
      <Card className="top-row-widget overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-8 bg-slate-200 rounded w-16"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-3 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-8 bg-slate-200 rounded"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="top-row-widget overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Weather</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-slate-500">
            <Cloud className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">Weather unavailable</p>
            <p className="text-xs text-slate-400 mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-50 via-white to-slate-50 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700 tracking-wide">WEATHER</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              LIVE
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadWeather} 
              className="h-7 w-7 p-0 hover:bg-slate-100 rounded-full transition-colors" 
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Location */}
        <div className="flex items-center space-x-2 text-slate-600">
          <MapPin className="w-3 h-3" />
          <span className="text-xs font-medium tracking-wide uppercase">Pattaya, Thailand</span>
        </div>

        {/* Main Weather Display */}
        <div className="weather-main">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getWeatherIcon(weather.current.condition)}
              <div className="space-y-1">
                <div className="temperature text-4xl font-light text-slate-800 tracking-tight">
                  {Math.round(weather.current.temperature)}°
                </div>
                <div className="text-sm font-medium text-slate-600 capitalize tracking-wide">
                  {weather.current.description}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Feels like {Math.round(weather.current.feelsLike)}°
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
            <div className="p-2 bg-blue-50 rounded-full">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">{weather.current.humidity}%</div>
              <div className="text-xs text-slate-500 font-medium">Humidity</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
            <div className="p-2 bg-slate-50 rounded-full">
              <Wind className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">{Math.round(weather.current.windSpeed)} km/h</div>
              <div className="text-xs text-slate-500 font-medium">Wind Speed</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span className="font-medium">Updated {formatTime(lastRefresh)}</span>
          </div>
          {error && (
            <div className="flex items-center space-x-1 text-xs text-amber-600">
              <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
              <span className="font-medium">Connection issue</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
