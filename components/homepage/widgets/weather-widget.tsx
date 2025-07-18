"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudDrizzle, CloudSnow, Zap, RefreshCw } from "lucide-react"
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
      const response = await fetch("/api/weather/pattaya")
      if (response.ok) {
        const data = await response.json()
        setWeather(data)
        setLastRefresh(new Date())
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
    const iconClass = "h-12 w-12"

    switch (conditionLower) {
      case "clear":
      case "clear sky":
      case "sunny":
        return <Sun className={`${iconClass} text-yellow-500`} />
      case "clouds":
      case "cloudy":
      case "partly cloudy":
      case "few clouds":
      case "scattered clouds":
      case "broken clouds":
        return <Cloud className={`${iconClass} text-gray-500`} />
      case "rain":
      case "light rain":
      case "moderate rain":
      case "shower rain":
        return <CloudRain className={`${iconClass} text-blue-500`} />
      case "drizzle":
      case "light intensity drizzle":
        return <CloudDrizzle className={`${iconClass} text-blue-400`} />
      case "thunderstorm":
        return <Zap className={`${iconClass} text-purple-500`} />
      case "snow":
        return <CloudSnow className={`${iconClass} text-blue-200`} />
      default:
        return <Cloud className={`${iconClass} text-gray-500`} />
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
      <Card className="top-row-widget">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Cloud className="w-4 h-4" />
            <span>Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="top-row-widget">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Cloud className="w-4 h-4" />
            <span>Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Cloud className="w-8 h-8 mx-auto mb-3" />
            <p className="text-sm">Weather unavailable</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget weather-widget-proper bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2 text-blue-800">
            <span>Pattaya Weather</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-500 text-white text-xs live-badge">LIVE</Badge>
            <Button variant="ghost" size="sm" onClick={loadWeather} className="h-6 w-6 p-0" disabled={loading}>
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="weather-main">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.current.condition)}
            <div className="flex-1">
              <div className="temperature text-blue-900">{Math.round(weather.current.temperature)}°C</div>
              <div className="text-lg font-medium text-blue-800 capitalize">{weather.current.description}</div>
              <div className="text-sm text-blue-600">Feels like {Math.round(weather.current.feelsLike)}°C</div>
            </div>
          </div>
        </div>

        <div className="weather-details-grid">
          <div className="weather-detail-item">
            <Droplets className="icon text-blue-500" />
            <span className="text-sm text-blue-700">{weather.current.humidity}%</span>
          </div>
          <div className="weather-detail-item">
            <Wind className="icon text-blue-500" />
            <span className="text-sm text-blue-700">{Math.round(weather.current.windSpeed)} km/h</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-blue-600 pt-2 border-t border-blue-200">
          <span>Last updated: {formatTime(lastRefresh)}</span>
          {error && <span className="text-orange-600">⚠ {error}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
