"use client"

import { Sun, Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface EnhancedWeatherWidgetProps {
  theme: "primary" | "nightlife"
}

export function EnhancedWeatherWidget({ theme }: EnhancedWeatherWidgetProps) {
  const isPrimary = theme === "primary"

  const handleViewForecast = () => {
    window.location.href = "/weather"
  }

  return (
    <Card
      className={`transition-all duration-500 hover:scale-105 cursor-pointer group ${
        isPrimary
          ? "bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 border-cyan-200 hover:shadow-xl hover:shadow-cyan-200/50"
          : "bg-gradient-to-br from-purple-800 to-pink-800 border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/30"
      }`}
      onClick={handleViewForecast}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-semibold ${isPrimary ? "text-cyan-800" : "text-white"}`}>Pattaya Weather</h3>
          <div className="relative">
            <Sun
              className={`h-8 w-8 transition-all duration-500 group-hover:rotate-180 ${
                isPrimary ? "text-yellow-500" : "text-yellow-400"
              }`}
            />
            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-20 animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-bold ${isPrimary ? "text-cyan-900" : "text-white"}`}>32°C</span>
              <Badge
                variant="secondary"
                className={`${isPrimary ? "bg-green-100 text-green-800" : "bg-green-500/20 text-green-300"}`}
              >
                Perfect
              </Badge>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${isPrimary ? "text-cyan-700" : "text-cyan-200"}`}>
                Sunny & Clear
              </span>
              <div className={`text-xs ${isPrimary ? "text-cyan-600" : "text-purple-200"}`}>Feels like 35°C</div>
            </div>
          </div>

          <div className={`grid grid-cols-4 gap-3 text-xs ${isPrimary ? "text-cyan-700" : "text-purple-200"}`}>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/20">
              <Droplets className="h-4 w-4" />
              <span className="font-medium">65%</span>
              <span>Humidity</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/20">
              <Wind className="h-4 w-4" />
              <span className="font-medium">12km/h</span>
              <span>Wind</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/20">
              <Eye className="h-4 w-4" />
              <span className="font-medium">10km</span>
              <span>Visibility</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/20">
              <Thermometer className="h-4 w-4" />
              <span className="font-medium">1013</span>
              <span>Pressure</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <Sunrise className={`h-4 w-4 ${isPrimary ? "text-orange-500" : "text-orange-400"}`} />
              <span className={`text-xs ${isPrimary ? "text-cyan-600" : "text-purple-200"}`}>6:24 AM</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sunset className={`h-4 w-4 ${isPrimary ? "text-orange-600" : "text-orange-400"}`} />
              <span className={`text-xs ${isPrimary ? "text-cyan-600" : "text-purple-200"}`}>6:45 PM</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className={`w-full mt-2 ${
              isPrimary
                ? "border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                : "border-pink-400 text-pink-300 hover:bg-purple-700"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleViewForecast()
            }}
          >
            7-Day Forecast
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
