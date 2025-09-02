"use client"

import { useState } from "react"
import { ExternalLink, Eye, MousePointer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SponsoredPost {
  id: string
  type: 'sponsored'
  title: string
  summary: string
  content?: string
  url: string
  sponsorName: string
  image?: string
  sponsorLogo?: string
  logo?: string
  callToAction?: string
  category?: string
  publishedAt: string
  impressions?: number
  clicks?: number
}

interface SponsoredPostProps {
  post: SponsoredPost
  onImpression?: (postId: string) => void
  onClick?: (postId: string, url: string) => void
}

export function SponsoredPost({ post, onImpression, onClick }: SponsoredPostProps) {
  const [hasBeenViewed, setHasBeenViewed] = useState(false)

  // Track impression when component becomes visible
  const handleImpression = () => {
    if (!hasBeenViewed) {
      setHasBeenViewed(true)
      onImpression?.(post.id)
    }
  }

  // Track click and navigate
  const handleClick = () => {
    onClick?.(post.id, post.url)
    window.open(post.url, '_blank', 'noopener,noreferrer')
  }

  // Get the primary image (priority: image > sponsorLogo > logo)
  const primaryImage = post.image || post.sponsorLogo || post.logo

  return (
    <Card 
      className="sponsored-post" 
      data-tracked="true"
      onClick={handleClick}
      onMouseEnter={handleImpression}
    >
      {/* Sponsored indicator stripe is handled by CSS */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 pointer-events-none" />

      <CardContent className="p-6 relative">
        <div className="flex gap-4">
          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Sponsor Info */}
            <div className="flex items-center gap-2 mb-3">
              {post.sponsorLogo && (
                <img
                  src={post.sponsorLogo}
                  alt={`${post.sponsorName} logo`}
                  className="w-6 h-6 rounded-full object-cover border border-gray-200"
                />
              )}
              <span className="text-sm font-medium text-blue-600">
                {post.sponsorName}
              </span>
              <Badge className="sponsored-badge">
                Sponsored
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
              {post.title}
            </h3>

            {/* Summary */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {post.summary}
            </p>

            {/* Call to Action */}
            <div className="flex items-center justify-between">
              <Button
                className="sponsor-cta-button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                {post.callToAction || 'Learn More'}
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>

              {/* Engagement Stats */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                {post.impressions && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.impressions.toLocaleString()}</span>
                  </div>
                )}
                {post.clicks && (
                  <div className="flex items-center gap-1">
                    <MousePointer className="w-3 h-3" />
                    <span>{post.clicks.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Section */}
          {primaryImage && (
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={primaryImage}
                  alt={post.title}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover shadow-md border border-gray-200"
                />
                {/* Logo overlay if we have both image and logo */}
                {post.image && (post.sponsorLogo || post.logo) && (
                  <div className="absolute -bottom-2 -right-2">
                    <img
                      src={post.sponsorLogo || post.logo}
                      alt={`${post.sponsorName} logo`}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sponsor Attribution */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Sponsored content by <span className="font-medium text-blue-600">{post.sponsorName}</span>
          </p>
        </div>
      </CardContent>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}

export default SponsoredPost
