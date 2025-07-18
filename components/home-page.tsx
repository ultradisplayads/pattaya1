"use client"

import { EnhancedHeader } from "@/components/layout/enhanced-header"
import { WidgetGrid } from "@/components/widgets/widget-grid"

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <EnhancedHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Pattaya1
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your ultimate guide to Pattaya - discover the best restaurants, nightlife, events, and experiences in the
            city.
          </p>
        </div>

        <WidgetGrid />
      </main>
    </div>
  )
}
