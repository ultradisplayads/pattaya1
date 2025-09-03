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
    return <div>Loading deals...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hot Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
