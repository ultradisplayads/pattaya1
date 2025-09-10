import ThreeWidgetSearchLayout from '@/components/search/three-widget-search-layout'

export default function SearchGridDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Three Widget Search Layout</h1>
          <p className="text-gray-600">Breaking News • Trending Topics • Universal Search</p>
        </div>
        
        <ThreeWidgetSearchLayout variant="compact" />
      </div>
    </div>
  )
}
