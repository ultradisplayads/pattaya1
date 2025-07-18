"use client"

import { WeatherWidget } from "./weather-widget"
import { EventsMarquee } from "./events-marquee"
import { NewsCarousel } from "./news-carousel"
import { HappeningNow } from "./happening-now"
import { SocialFeed } from "./social-feed"
import { TrendingTags } from "./trending-tags"
import { RecommendedPicks } from "./recommended-picks"
import { DealsSection } from "./deals-section"

interface WidgetGridProps {
  theme: "primary" | "nightlife"
}

export function WidgetGrid({ theme }: WidgetGridProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Pattaya1
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your ultimate guide to discovering the best of Pattaya - from restaurants and attractions to events and
          nightlife.
        </p>
      </div>

      {/* Events Marquee */}
      <EventsMarquee theme={theme} />

      {/* Main Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NewsCarousel theme={theme} />
        </div>
        <div>
          <WeatherWidget theme={theme} />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HappeningNow theme={theme} />
        <SocialFeed theme={theme} />
      </div>

      {/* Trending and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrendingTags theme={theme} />
        <div className="lg:col-span-2">
          <RecommendedPicks theme={theme} />
        </div>
      </div>

      {/* Deals Section */}
      <DealsSection theme={theme} />
    </div>
  )
}
