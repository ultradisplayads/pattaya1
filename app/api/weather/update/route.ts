import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Fetch weather data from OpenWeatherMap or your preferred service
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Pattaya,TH&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    )
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather from OpenWeatherMap')
    }

    const weatherData = await weatherResponse.json()
    
    // Transform the data to match your Strapi schema
    const transformedData = {
      data: {
        location: "Pattaya, Thailand",
        condition: weatherData.weather[0].main.toLowerCase(),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        windspeed: weatherData.wind.speed,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility / 1000, // Convert to km
        uvIndex: 6, // You might need a separate API call for UV index
        lastUpdated: new Date().toISOString(),
        source: "OpenWeatherMap",
        isActive: true
      }
    }

    // Update or create weather entry in Strapi
    const strapiResponse = await fetch('http://localhost:1337/api/weathers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData)
    })

    if (!strapiResponse.ok) {
      throw new Error('Failed to update weather in Strapi')
    }

    return NextResponse.json({ success: true, message: 'Weather updated successfully' })
  } catch (error) {
    console.error('Weather update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update weather' },
      { status: 500 }
    )
  }
} 