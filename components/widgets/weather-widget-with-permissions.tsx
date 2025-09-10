"use client"

import { useState } from "react"
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WidgetWrapper } from "./WidgetWrapper"

interface WeatherWidgetProps {
  theme: "primary" | "nightlife"
}

export function WeatherWidgetWithPermissions({ theme }: WeatherWidgetProps) {
  const [weather, setWeather] = useState({
    temperature: 32,
    condition: "Sunny",
    humidity: 75,
    windSpeed: 12,
    feelsLike: 35,
    uvIndex: 8,
  })

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const handleResize = () => {
    console.log('Weather widget resize requested');
    // Implement resize logic here
  };

  const handleDrag = () => {
    console.log('Weather widget drag started');
    // Implement drag logic here
  };

  const handleDelete = () => {
    console.log('Weather widget delete requested');
    // Implement delete logic here
  };

  return (
    <WidgetWrapper
      widgetId="weather"
      onResize={handleResize}
      onDrag={handleDrag}
      onDelete={handleDelete}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pattaya Weather</span>
            <Badge variant="secondary">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{weather.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{weather.condition}</div>
            </div>
            {getWeatherIcon(weather.condition)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>Humidity: {weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span>Wind: {weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span>Feels like: {weather.feelsLike}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <span>UV Index: {weather.uvIndex}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </WidgetWrapper>
  )
}
