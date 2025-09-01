"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Star, Users, Zap, ExternalLink, Heart, Share2, Calendar, DollarSign, Percent, Timer, TrendingUp, CheckCircle, Flame } from "lucide-react"
import Image from "next/image"
import { CountdownTimer } from "./countdown-timer"

interface Deal {
  id: string
  deal_title: string
  sale_price: number
  original_price: number
  deal_category: string
  expiry_date_time: string
}

interface DealCardProps {
  deal: Deal
  viewMode?: "grid" | "list"
  onPurchase?: () => void
}

export function DealCard({ deal, viewMode = "grid", onPurchase }: DealCardProps) {
  const discountPercentage = Math.round(((deal.original_price - deal.sale_price) / deal.original_price) * 100)
  const isExpiringSoon = new Date(deal.expiry_date_time).getTime() - Date.now() < 24 * 60 * 60 * 1000

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${viewMode === "list" ? "flex" : ""}`}>
      <div className={`relative ${viewMode === "list" ? "w-48 h-32" : "h-48"}`}>
        <Image
          src="/placeholder.svg?height=200&width=300&text=Deal"
          alt={deal.deal_title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {discountPercentage}% OFF
          </Badge>
        </div>
        {isExpiringSoon && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-orange-500 text-white">
              <Timer className="h-3 w-3 mr-1" />
              Expiring Soon
            </Badge>
          </div>
        )}
      </div>

      <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {deal.deal_category}
          </Badge>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer" />
            <Share2 className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-pointer" />
          </div>
        </div>

        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
          {deal.deal_title}
        </CardTitle>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5</span>
            <span className="text-xs text-gray-400">(128)</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">Pattaya</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              ฿{deal.sale_price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ฿{deal.original_price.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Expires in</div>
            <CountdownTimer expiryDate={deal.expiry_date_time} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={onPurchase}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            Get Deal
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
