"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DealCard } from "./deal-card"

interface Deal {
  id: string
  deal_title: string
  description: string
  sale_price: number
  original_price: number
  deal_category: string
  slug: string
  isActive: boolean
  featured: boolean
  views: number
  clicks: number
  conversions: number
  expiry_date_time?: string
  requires_reservation?: boolean
  business?: {
    name: string
    address: string
  }
  image_gallery?: any[]
}

export function DealsWidget() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch deals from API
    setDeals([])
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 overflow-hidden">
        <h2 className="text-2xl font-bold">Hot Deals</h2>
        <div className="min-h-64 max-h-64 overflow-y-auto pr-1">
          <div className="h-full flex items-center justify-center text-sm text-gray-500">
            Loading deals...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-hidden">
      <h2 className="text-2xl font-bold">Hot Deals</h2>
      <div className="min-h-64 max-h-64 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 h-full flex items-center justify-center text-sm text-gray-500">
              No deals available right now.
            </div>
          ) : (
            deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
