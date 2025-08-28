import { TravelResultsPage } from "@/components/travel/travel-results-page"
import { Suspense } from "react"

export default function TravelResults() {
  return (
    <Suspense>
      <TravelResultsPage />
    </Suspense>
  )
}
