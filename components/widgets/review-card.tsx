"use client"

import { Star, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Platform icons - you can replace these with actual platform logos
const PlatformIcon = ({ platform }: { platform: string }) => {
  const getIconColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'google':
        return 'text-blue-500'
      case 'facebook':
        return 'text-blue-600'
      case 'yelp':
        return 'text-red-500'
      case 'foursquare':
        return 'text-blue-400'
      default:
        return 'text-gray-500'
    }
  }

  const getIconText = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'google':
        return 'G'
      case 'facebook':
        return 'f'
      case 'yelp':
        return 'Y'
      case 'foursquare':
        return '4'
      default:
        return '?'
    }
  }

  return (
    <div className={`w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold ${getIconColor(platform)}`}>
      {getIconText(platform)}
    </div>
  )
}

interface ReviewCardProps {
  review: {
    id: number
    source_platform: string
    author_name: string
    rating: number
    review_text: string
    review_timestamp: string
    author_profile_url?: string
    author_profile_photo_url?: string
    business_name: string
    business_address?: string
    verified: boolean
    business?: {
      name: string
      slug: string
      rating: number
      reviewCount: number
    }
  }
  showBusinessInfo?: boolean
}

export function ReviewCard({ review, showBusinessInfo = true }: ReviewCardProps) {
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-2.5 h-2.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
      />
    ))

  const formatTimeAgo = (iso: string) => {
    const now = Date.now()
    const then = new Date(iso).getTime()
    const diffMins = Math.floor((now - then) / 60000)
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'google':
        return 'text-blue-600'
      case 'facebook':
        return 'text-blue-700'
      case 'yelp':
        return 'text-red-600'
      case 'foursquare':
        return 'text-blue-500'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-1.5">
      {/* Author and rating info */}
      <div className="flex items-center space-x-1.5">
        <Avatar className="w-5 h-5">
          <AvatarImage 
            src={review.author_profile_photo_url || "/placeholder.svg"} 
            alt={review.author_name} 
          />
          <AvatarFallback className="text-[10px] bg-gray-200 text-gray-800">
            {review.author_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <span className="font-medium text-gray-900 truncate text-xs">
              {review.author_name}
            </span>
            {review.verified && (
              <span className="text-blue-500 text-[10px]">✓</span>
            )}
            <PlatformIcon platform={review.source_platform} />
          </div>
          
          <div className="flex items-center space-x-1.5">
            {renderStars(review.rating)}
            <span className="text-[10px] text-gray-500">
              {formatTimeAgo(review.review_timestamp)}
            </span>
            <span className={`text-[10px] font-medium ${getPlatformColor(review.source_platform)}`}>
              {review.source_platform}
            </span>
          </div>
        </div>
      </div>

      {/* Review text */}
      <p className="text-gray-800 text-xs leading-relaxed line-clamp-2">
        {review.review_text}
      </p>

      {/* Business info */}
      {showBusinessInfo && (
        <div className="flex items-center justify-between text-[10px] text-gray-600">
          <span className="font-medium truncate">{review.business_name}</span>
          {review.business_address && (
            <span className="truncate ml-1 text-[9px]">{review.business_address}</span>
          )}
        </div>
      )}

      {/* Business link if available */}
      {review.business?.slug && (
        <div className="flex items-center justify-end">
          <button
            onClick={() => window.open(`/business/${review.business.slug}`, '_blank')}
            className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      )}
    </div>
  )
}
