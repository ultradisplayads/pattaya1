"use client"

import { useState, useEffect } from 'react'
import { 
  Sun, Cloud, CloudRain, Wind, Droplets, Thermometer, 
  Eye, Sunrise, Sunset, AlertTriangle, MapPin, Clock,
  ChevronDown, ChevronUp, RefreshCw, CloudDrizzle, Zap, CloudSnow
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LocateMeButton } from '@/components/location/locate-me-button'
import { useLocation } from '@/components/location/location-provider'

interface WeatherData {
  location: {
    name: string
    lat: number
    lon: number
  }
  current: {
    temperature: number
    feelsLike: number
    condition: string
    description: string
    humidity: number
    windSpeed: number
    pressure: number
    visibility: number
    uvIndex: number
    icon: string
    sunrise: string
    sunset: string
  }
  hourly: Array<{
    time: string
    temp: number
    icon: string
  }>
  daily: Array<{
    date: string
    high: number
    low: number
    icon: string
  }>
  airQuality?: {
    index: number
    level: string
    pm25: number
    pm10: number
  }
  alerts?: Array<{
    event: string
    severity: string
    start: string
    end: string
    description: string
  }>
  marine?: {
    tideTimes?: Array<{
      type: 'High' | 'Low'
      time: string
    }>
    seaState?: 'Calm' | 'Moderate' | 'Rough'
    waveHeightM?: number
  }
  suggestions?: Array<{
    title: string
    description?: string
    link: string
    icon: string
  }>
  units: 'metric' | 'imperial'
  lastUpdated: string
  source: string
}

interface WeatherSettings {
  defaultCityName: string
  defaultLatitude: number
  defaultLongitude: number
  units: 'metric' | 'imperial'
  updateFrequencyMinutes: number
  widgetEnabled: boolean
  sponsoredEnabled: boolean
  sponsorName?: string
  sponsorLogo?: string
}

export function EnhancedWeatherWidget() {
  const { location, units, setUnits } = useLocation()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [settings, setSettings] = useState<WeatherSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (settings) {
      loadWeather()
      loadSuggestions()
    }
  }, [location, units, settings])

  const loadSuggestions = async () => {
    try {
      console.log('🌤️ Loading weather suggestions...')
      const suggestionsUrl = 'http://localhost:1337/api/weather-activity-suggestions?filters[isActive][$eq]=true&sort=priority:asc&pagination[limit]=3'
      console.log('🌤️ Fetching suggestions from:', suggestionsUrl)
      const response = await fetch(suggestionsUrl)
      console.log('🌤️ Suggestions response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('🌤️ Suggestions data:', data)
        if (data.data && data.data.length > 0) {
          // Transform suggestions to match our interface
          const transformedSuggestions = data.data.map((suggestion: any) => ({
            title: suggestion.title,
            description: suggestion.description,
            link: suggestion.link,
            icon: suggestion.icon
          }))
          console.log('🌤️ Transformed suggestions:', transformedSuggestions)
          
          // Update weather state with suggestions
          setWeather(prev => prev ? { ...prev, suggestions: transformedSuggestions } : null)
        }
      }
    } catch (error) {
      console.error('🌤️ Failed to load weather suggestions:', error)
    }
  }

  const loadSettings = async () => {
    try {
      console.log('🌤️ Loading weather settings...')
      const response = await fetch('http://localhost:1337/api/weather-settings')
      console.log('🌤️ Weather settings response:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('🌤️ Weather settings data:', data)
        if (data.data && data.data.length > 0) {
          const settingsData = data.data[0]
          console.log('🌤️ Setting weather settings:', settingsData)
          setSettings(settingsData)
          setUnits(settingsData.units)
        }
      }
    } catch (error) {
      console.error('🌤️ Failed to load weather settings:', error)
    }
  }

  const loadWeather = async () => {
    try {
      console.log('🌤️ Loading weather data...')
      setLoading(true)
      setError(null)

      // Use user location or fallback to default
      const coords = location || {
        lat: settings?.defaultLatitude || 12.9236,
        lon: settings?.defaultLongitude || 100.8825
      }
      console.log('🌤️ Using coordinates:', coords)

      // Use the new OpenWeatherMap integration
      const weatherUrl = `http://localhost:1337/api/weather/current?lat=${coords.lat}&lon=${coords.lon}&units=${units}`
      console.log('🌤️ Fetching weather from:', weatherUrl)
      const response = await fetch(weatherUrl)

      console.log('🌤️ Weather response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('🌤️ Weather response data:', data)
        if (data.data) {
          const openWeatherData = data.data
          console.log('🌤️ OpenWeatherMap data:', openWeatherData)
          
          // Transform OpenWeatherMap data to match our interface
          const transformedWeather: WeatherData = {
            location: {
              name: openWeatherData.location.name || 'Pattaya, Thailand',
              lat: coords.lat,
              lon: coords.lon
            },
            current: {
              temperature: openWeatherData.current.temperature || 32,
              feelsLike: openWeatherData.current.feelsLike || 35,
              condition: openWeatherData.current.condition || 'Clear',
              description: openWeatherData.current.description || 'clear sky',
              humidity: openWeatherData.current.humidity || 65,
              windSpeed: openWeatherData.current.windSpeed || 3,
              pressure: openWeatherData.current.pressure || 1013,
              visibility: openWeatherData.current.visibility || 10,
              uvIndex: openWeatherData.current.uvIndex || 7,
              icon: openWeatherData.current.icon || '01d',
              sunrise: openWeatherData.current.sunrise || new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              sunset: openWeatherData.current.sunset || new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
            },
            hourly: openWeatherData.hourly || [],
            daily: openWeatherData.daily || [],
            airQuality: openWeatherData.airQuality || null,
            alerts: openWeatherData.alerts || [],
            marine: openWeatherData.marine || null,
            units,
            lastUpdated: openWeatherData.lastUpdated || new Date().toISOString(),
            source: 'OpenWeatherMap'
          }
          
          setWeather(transformedWeather)
        } else {
          throw new Error('No weather data available')
        }
      } else {
        throw new Error('Failed to fetch weather data')
      }
    } catch (error) {
      console.error('Weather loading error:', error)
      setError('Unable to load weather data')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string, size = 'h-12 w-12') => {
    const conditionLower = condition.toLowerCase()
    
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
      return <Sun className={`${size} text-amber-500 animate-spin-slow`} />
    } else if (conditionLower.includes('cloud')) {
      return <Cloud className={`${size} text-gray-400`} />
    } else if (conditionLower.includes('rain')) {
      return <CloudRain className={`${size} text-blue-500 animate-bounce`} />
    } else if (conditionLower.includes('thunder')) {
      return <Zap className={`${size} text-yellow-600 animate-pulse`} />
    } else if (conditionLower.includes('drizzle')) {
      return <CloudDrizzle className={`${size} text-gray-500`} />
    } else if (conditionLower.includes('snow')) {
      return <CloudSnow className={`${size} text-gray-300`} />
    } else {
      return <Cloud className={`${size} text-gray-400`} />
    }
  }

  const getAirQualityColor = (index: number) => {
    if (index <= 2) return 'bg-green-100 text-green-800'
    if (index <= 3) return 'bg-yellow-100 text-yellow-800'
    if (index <= 4) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getSeaStateColor = (state: string) => {
    switch (state) {
      case 'Calm': return 'bg-blue-100 text-blue-800'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800'
      case 'Rough': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!settings?.widgetEnabled) {
    return null
  }

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardContent className="p-6 text-center">
          <Cloud className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">Weather unavailable</p>
          <Button onClick={loadWeather} variant="outline" size="sm" className="mt-3">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const hasAlerts = weather.alerts && weather.alerts.length > 0
  const isSponsored = settings.sponsoredEnabled && settings.sponsorName

  return (
    <Card
      className={`transition-all duration-500 hover:shadow-lg ${
        hasAlerts 
          ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
          : 'bg-white/95 backdrop-blur-xl border-0'
      } shadow-sm`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">Weather</span>
            {hasAlerts && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Alert
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LocateMeButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-8 w-8 p-0 hover:bg-gray-100/80 rounded-full transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <MapPin className="w-3 h-3" />
          <span className="tracking-wide uppercase">
            {weather.location.name || 'Pattaya, Thailand'}
          </span>
        </div>

        {/* Sponsor Badge */}
        {isSponsored && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Weather brought to you by</span>
            {settings.sponsorLogo && (
              <img 
                src={settings.sponsorLogo} 
                alt={settings.sponsorName}
                className="h-4 w-auto"
              />
            )}
            <span className="font-medium">{settings.sponsorName}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Main Weather Display */}
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.current.condition)}
            <div className="space-y-1">
              <div className="text-4xl font-light text-gray-900 tracking-tight">
                {Math.round(weather.current.temperature)}°{units === 'metric' ? 'C' : 'F'}
              </div>
              <div className="text-sm font-medium text-gray-600 capitalize">
                {weather.current.description}
              </div>
              <div className="text-xs text-gray-400 font-medium">
                Feels like {Math.round(weather.current.feelsLike)}°{units === 'metric' ? 'C' : 'F'}
              </div>
            </div>
          </div>

          {/* Units Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={units === 'metric' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setUnits('metric')}
              className="h-6 px-2 text-xs"
            >
              °C
            </Button>
            <Button
              variant={units === 'imperial' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setUnits('imperial')}
              className="h-6 px-2 text-xs"
            >
              °F
            </Button>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
            <div className="p-1.5 bg-blue-50 rounded-full">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{weather.current.humidity}%</div>
              <div className="text-xs text-gray-500 font-medium">Humidity</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
            <div className="p-1.5 bg-gray-50 rounded-full">
              <Wind className="w-3.5 h-3.5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {Math.round(weather.current.windSpeed)} {units === 'metric' ? 'km/h' : 'mph'}
              </div>
              <div className="text-xs text-gray-500 font-medium">Wind Speed</div>
            </div>
          </div>
        </div>

        {/* Severe Weather Alerts */}
        {hasAlerts && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-red-800">
                  {weather.alerts![0].event}
                </h4>
                <p className="text-sm text-red-700">
                  {weather.alerts![0].description}
                </p>
                <p className="text-xs text-red-600">
                  {formatTime(weather.alerts![0].start)} - {formatTime(weather.alerts![0].end)}
                </p>
            </div>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {expanded && (
          <div className="space-y-6 pt-4 border-t border-gray-100">
            {/* Hourly Forecast */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">12-Hour Forecast</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {weather.hourly.slice(0, 12).map((hour, index) => (
                  <div key={index} className="flex flex-col items-center min-w-[60px]">
                    <span className="text-xs text-gray-500 mb-1">
                      {formatTime(hour.time)}
                    </span>
                    {getWeatherIcon(hour.icon, 'h-8 w-8')}
                    <span className="text-sm font-medium text-gray-900 mt-1">
                      {Math.round(hour.temp)}°
                    </span>
                  </div>
                ))}
            </div>
          </div>

            {/* Daily Forecast */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">5-Day Forecast</h4>
              <div className="space-y-3">
                {weather.daily.slice(0, 5).map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(day.date)}
                    </span>
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(day.icon, 'h-6 w-6')}
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{Math.round(day.high)}°</div>
                        <div className="text-xs text-gray-500">{Math.round(day.low)}°</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Air Quality */}
            {weather.airQuality && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Air Quality</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getAirQualityColor(weather.airQuality.index)}`}>
                    {weather.airQuality.level}
                  </div>
                  <div className="text-sm text-gray-600">
                    PM2.5: {weather.airQuality.pm25} | PM10: {weather.airQuality.pm10}
                  </div>
                </div>
              </div>
            )}

            {/* Sunrise/Sunset */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Sun Times</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">
                    {formatTime(weather.current.sunrise)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">
                    {formatTime(weather.current.sunset)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tide Times & Sea Conditions */}
            {weather.marine && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Beach Conditions</h4>
                <div className="space-y-3">
                  {weather.marine.tideTimes && (
                    <div className="p-3 bg-gray-50/50 rounded-lg">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Today's Tides</h5>
                      <div className="flex justify-between text-sm">
                        {weather.marine.tideTimes.map((tide, index) => (
                          <div key={index} className="text-center">
                            <div className="font-medium text-gray-900">{tide.type}</div>
                            <div className="text-gray-600">{formatTime(tide.time)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {weather.marine.seaState && (
                    <div className="p-3 bg-gray-50/50 rounded-lg">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Sea Conditions</h5>
                      <div className="flex items-center justify-between">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeaStateColor(weather.marine.seaState)}`}>
                          {weather.marine.seaState}
                        </div>
                        {weather.marine.waveHeightM && (
                          <span className="text-sm text-gray-600">
                            Waves: {weather.marine.waveHeightM}m
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Suggestions */}
            {weather.suggestions && weather.suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Smart Suggestions</h4>
                <div className="space-y-2">
                  {weather.suggestions.map((suggestion, index) => (
                    <a
                      key={index}
                      href={suggestion.link}
                      className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{suggestion.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-blue-900">
                            {suggestion.title}
                          </div>
                          {suggestion.description && (
                            <div className="text-xs text-blue-700">
                              {suggestion.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Clock className="w-3 h-3" />
            <span>Updated {formatTime(weather.lastUpdated)}</span>
          </div>
          {error && (
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
              <span className="font-medium">Connection issue</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
