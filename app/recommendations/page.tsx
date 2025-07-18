import { EnhancedRecommendedPicks } from "@/components/widgets/enhanced-recommended-picks"

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-violet-800 mb-8">Pattaya1 Recommendations</h1>
        <div className="max-w-4xl mx-auto">
          <EnhancedRecommendedPicks theme="primary" />
        </div>
      </div>
    </div>
  )
}
