import { EnhancedWeatherWidget } from "@/components/widgets/enhanced-weather-widget"

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-cyan-800 mb-8">Pattaya Weather Forecast</h1>
        <div className="max-w-4xl mx-auto">
          <EnhancedWeatherWidget />
        </div>
      </div>
    </div>
  )
}
