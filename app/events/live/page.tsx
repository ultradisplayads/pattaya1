import { EnhancedHappeningNow } from "@/components/widgets/enhanced-happening-now"

export default function LiveEventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-emerald-800 mb-8">Live Events in Pattaya</h1>
        <div className="max-w-4xl mx-auto">
          <EnhancedHappeningNow theme="primary" />
        </div>
      </div>
    </div>
  )
}
