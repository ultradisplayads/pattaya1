"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Tag, MapPin, RefreshCw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface Location {
  city?: string
  country?: string
  lat?: number
  lng?: number
}

interface Deal {
  id: string
  title: string
  price: number
  originalPrice: number
  url: string
  location: Location
  expiresAt: string
  image: string
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatCurrency(value?: number, currency = "THB") {
  if (typeof value !== "number") return "—"
  return value.toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })
}

function formatLocation(loc: Location | undefined) {
  if (!loc) return "N/A"
  const parts = [loc.city, loc.country].filter(Boolean)
  return parts.join(", ") || "N/A"
}

function formatExpiry(dateStr?: string) {
  if (!dateStr) return "—"
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function EnhancedHotDealsWidget() {
  const { data, error, isValidating, mutate } = useSWR<Deal[]>("/api/deals/groupon", fetcher, {
    refreshInterval: 30 * 60_000, // 30 minutes
  })

  /* Optional client-side fallback while waiting for SWR */
  const [initialising, setInitialising] = useState(true)
  useEffect(() => {
    if (data || error) setInitialising(false)
  }, [data, error])

  /* ---------------------------------------------------------------- */

  return (
    <Card className="top-row-widget bg-gradient-to-br from-rose-50 to-amber-50 border-amber-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2 text-amber-900">
          <Tag className="w-4 h-4" />
          <span>Hot Deals</span>
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => mutate()} disabled={isValidating}>
          <RefreshCw className={`w-3 h-3 ${isValidating ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>

      <CardContent>
        {error && <div className="text-center py-6 text-sm text-red-600">Failed to load deals. Please try again.</div>}

        {(initialising || isValidating) && !data && !error && (
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded bg-gray-200/60" />
            ))}
          </div>
        )}

        {data && data.length === 0 && <div className="text-center py-6 text-sm text-gray-500">No deals available.</div>}

        {data && data.length > 0 && (
          <ul className="space-y-4">
            {data.slice(0, 4).map((deal) => (
              <li key={deal.id}>
                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4 items-start rounded-lg p-2 hover:bg-amber-100 transition"
                >
                  <img
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.title}
                    className="h-16 w-16 rounded object-cover shrink-0 border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-amber-800">{deal.title}</h3>

                    <div className="flex items-center gap-2 mt-1 text-xs text-amber-700">
                      <span>{formatCurrency(deal.price)}</span>
                      {deal.originalPrice && (
                        <span className="line-through text-amber-500">{formatCurrency(deal.originalPrice)}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                        Ends {formatExpiry(deal.expiresAt)}
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] text-amber-600">
                        <MapPin className="w-3 h-3" />
                        {formatLocation(deal.location)}
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
