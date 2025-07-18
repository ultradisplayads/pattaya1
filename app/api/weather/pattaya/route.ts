import { NextResponse } from "next/server"
import { cache } from "@/lib/cache"
import { weatherApiLimiter } from "@/lib/rate-limiter"

const OPENWEATHER_API_KEY = "2fccda5d95bfce098523fdbef24d0dda"
const PATTAYA_LAT = 12.9236
const PATTAYA_LON = 100.8825

export async function GET() {
  try {
    // Check cache first
    const cacheKey = "weather-pattaya"
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Check rate limit
    const rateLimitCheck = await weatherApiLimiter.checkLimit("weather-api")
    if (!rateLimitCheck.allowed) {
      console.warn("Weather API rate limit reached, using fallback data")
      const fallbackData = getFallbackWeatherData()
      cache.set(cacheKey, fallbackData, 300) // Cache fallback for 5 minutes
      return NextResponse.json(fallbackData)
    }

    // Fetch current weather and forecast
    const [currentResponse, forecastResponse, airQualityResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${PATTAYA_LAT}&lon=${PATTAYA_LON}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${PATTAYA_LAT}&lon=${PATTAYA_LON}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${PATTAYA_LAT}&lon=${PATTAYA_LON}&appid=${OPENWEATHER_API_KEY}`,
      ),
    ])

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Weather API request failed")
    }

    const [currentData, forecastData, airQualityData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
      airQualityResponse.ok ? airQualityResponse.json() : null,
    ])

    // Process forecast data for 3-day forecast
    const dailyForecasts = processForecastData(forecastData.list)

    const weatherData = {
      current: {
        temperature: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        pressure: currentData.main.pressure,
        visibility: currentData.visibility / 1000, // Convert to km
        uvIndex: 7, // OpenWeather UV requires separate API call
        feelsLike: Math.round(currentData.main.feels_like),
        icon: currentData.weather[0].icon,
      },
      forecast: dailyForecasts,
      airQuality: airQualityData
        ? {
            index: airQualityData.list[0].main.aqi,
            level: getAirQualityLevel(airQualityData.list[0].main.aqi),
            pm25: airQualityData.list[0].components.pm2_5,
            pm10: airQualityData.list[0].components.pm10,
            o3: airQualityData.list[0].components.o3,
            no2: airQualityData.list[0].components.no2,
          }
        : null,
      location: "Pattaya, Thailand",
      lastUpdated: new Date().toISOString(),
      source: "OpenWeatherMap",
    }

    // Cache for 15 minutes
    cache.set(cacheKey, weatherData, 900)
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    const fallbackData = getFallbackWeatherData()
    cache.set("weather-pattaya", fallbackData, 300) // Cache fallback for 5 minutes
    return NextResponse.json(fallbackData)
  }
}

function processForecastData(forecastList: any[]) {
  const dailyData = new Map()

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!dailyData.has(date)) {
      dailyData.set(date, {
        date: date,
        high: item.main.temp_max,
        low: item.main.temp_min,
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      })
    } else {
      const existing = dailyData.get(date)
      existing.high = Math.max(existing.high, item.main.temp_max)
      existing.low = Math.min(existing.low, item.main.temp_min)
    }
  })

  return Array.from(dailyData.values())
    .slice(0, 3)
    .map((day) => ({
      ...day,
      high: Math.round(day.high),
      low: Math.round(day.low),
    }))
}

function getAirQualityLevel(aqi: number): string {
  switch (aqi) {
    case 1:
      return "Good"
    case 2:
      return "Fair"
    case 3:
      return "Moderate"
    case 4:
      return "Poor"
    case 5:
      return "Very Poor"
    default:
      return "Unknown"
  }
}

function getFallbackWeatherData() {
  return {
    current: {
      temperature: 32,
      condition: "Clear",
      description: "clear sky",
      humidity: 65,
      windSpeed: 3.2,
      pressure: 1013,
      visibility: 10,
      uvIndex: 8,
      feelsLike: 36,
      icon: "01d",
    },
    forecast: [
      {
        date: new Date(Date.now() + 86400000).toDateString(),
        high: 33,
        low: 26,
        condition: "Clouds",
        description: "few clouds",
        icon: "02d",
        humidity: 70,
        windSpeed: 2.8,
      },
      {
        date: new Date(Date.now() + 172800000).toDateString(),
        high: 31,
        low: 25,
        condition: "Rain",
        description: "light rain",
        icon: "10d",
        humidity: 80,
        windSpeed: 4.1,
      },
      {
        date: new Date(Date.now() + 259200000).toDateString(),
        high: 34,
        low: 27,
        condition: "Clear",
        description: "clear sky",
        icon: "01d",
        humidity: 60,
        windSpeed: 2.5,
      },
    ],
    airQuality: {
      index: 2,
      level: "Fair",
      pm25: 15.2,
      pm10: 22.8,
      o3: 45.6,
      no2: 12.3,
    },
    location: "Pattaya, Thailand",
    lastUpdated: new Date().toISOString(),
    source: "Fallback Data",
  }
}
