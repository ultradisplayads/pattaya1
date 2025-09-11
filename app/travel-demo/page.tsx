'use client'

import TravelSearchWidget from "@/components/search/travel-search-widget"

export default function TravelDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Search Demo</h1>
          <p className="text-gray-600">Test the travel search widget functionality</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <TravelSearchWidget />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This demo page allows you to test flight and hotel search functionality.</p>
          <p>Searches will open in new tabs on Skyscanner and Trivago.</p>
        </div>
      </div>
    </div>
  )
}
