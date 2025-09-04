"use client"

import { useState, useEffect } from "react"
import { Star, ExternalLink, RefreshCw, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buildApiUrl } from "@/lib/strapi-config"

interface GoogleReview {
  id: string
  author: {
    name: string
    profilePhotoUrl?: string
    profileUrl?: string
  }
  rating: number
  text: string
  time: string
  relativeTimeDescription: string
  businessName: string
  businessAddress?: string
  businessType?: string
  businessUrl?: string
  verified: boolean
}

interface GoogleReviewsData {
  reviews: GoogleReview[]
  averageRating: number
  totalReviews: number
  businessInfo: {
    name: string
    address: string
    type: string
    placeId: string
  }
  lastUpdated: string
}

interface StrapiGoogleReview {
  id: number
  AuthorName: string
  AuthorProfilePhotoUrl: string
  AuthorProfileUrl: string
  Rating: number
  ReviewText: string
  ReviewTime: string
  RelativeTimeDescription: string
  BusinessName: string
  BusinessAddress: string
  BusinessType: string
  BusinessUrl: string
  Verified: boolean
  IsActive: boolean
  Featured: boolean
  Category: string
  Location: string
  Language: string
  LastUpdated: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function GoogleReviewsWidget({ isExpanded = false, onToggleExpand }: { isExpanded?: boolean; onToggleExpand?: () => void }) {
  const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  useEffect(() => {
    loadReviews()

    const interval = setInterval(() => {
      const total = reviewsData?.reviews?.length ?? 0
      if (!total) return
      setCurrentReviewIndex((prev) => (prev + 1) % total)
    }, 8000)

    return () => clearInterval(interval)
    // React will re-run when total review count changes
  }, [reviewsData?.reviews?.length ?? 0])

  /* ------------------------------------------------------------------ */
  /*                        DATA FETCH / FALLBACK                       */
  /* ------------------------------------------------------------------ */
  const loadReviews = async () => {
    try {
      setError(null)
      setLoading(true)
      console.log('Fetching Google reviews from Strapi...')
      
      const response = await fetch(buildApiUrl("google-reviews?populate=*&sort=ReviewTime:desc"))
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          const transformedReviews: GoogleReview[] = data.data.map((strapiReview: any) => ({
            id: strapiReview.id.toString(),
            author: {
              name: strapiReview.AuthorName,
              profilePhotoUrl: strapiReview.AuthorProfilePhotoUrl,
              profileUrl: strapiReview.AuthorProfileUrl,
            },
            rating: strapiReview.Rating,
            text: strapiReview.ReviewText,
            time: strapiReview.ReviewTime,
            relativeTimeDescription: strapiReview.RelativeTimeDescription,
            businessName: strapiReview.BusinessName,
            businessAddress: strapiReview.BusinessAddress,
            businessType: strapiReview.BusinessType,
            businessUrl: strapiReview.BusinessUrl,
            verified: strapiReview.Verified,
          }))

          // Calculate average rating and total reviews
          const totalRating = transformedReviews.reduce((sum, review) => sum + review.rating, 0)
          const averageRating = totalRating / transformedReviews.length

          setReviewsData({
            reviews: transformedReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: transformedReviews.length,
            businessInfo: {
              name: "Pattaya Businesses",
              address: "Pattaya, Thailand",
              type: "Various",
              placeId: "pattaya-general",
            },
            lastUpdated: new Date().toISOString(),
          })
        } else {
          setReviewsData(getFallbackReviewsData())
        }
      } else {
        console.error("Failed to load Google reviews from Strapi:", response.status)
        setReviewsData(getFallbackReviewsData())
      }
    } catch (err) {
      console.error("Reviews loading error:", err)
      setError("Unable to load reviews")
      setReviewsData(getFallbackReviewsData())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackReviewsData = (): GoogleReviewsData => ({
    reviews: sampleReviews,
    averageRating: 4.6,
    totalReviews: 1247,
    businessInfo: {
      name: "Pattaya Businesses",
      address: "Pattaya, Thailand",
      type: "Various",
      placeId: "pattaya-general",
    },
    lastUpdated: new Date().toISOString(),
  })

  /* ------------------------------------------------------------------ */
  /*                            HELPERS                                 */
  /* ------------------------------------------------------------------ */
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
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

  /* ------------------------------------------------------------------ */
  /*                          RENDER STATES                             */
  /* ------------------------------------------------------------------ */
  if (loading) return <SkeletonCard />

  if (!reviewsData || (reviewsData.reviews?.length ?? 0) === 0) return <EmptyCard />

  const current = reviewsData.reviews[currentReviewIndex]

  return (
    <>
      {!isExpanded ? (
        // Compact Google Reviews View
        <Card className="top-row-widget reviews-widget bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2 text-yellow-800">
            <Star className="w-4 h-4 text-yellow-600" />
            <span>Google Reviews</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500 text-white text-xs">Live</Badge>
            {onToggleExpand && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleExpand()
                }}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs font-medium bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105"
                title="Expand widget"
              >
                {isExpanded ? 'Less' : 'More'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={loadReviews}
              className="h-6 w-6 p-0"
              disabled={loading}
              aria-label="Refresh"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Current review */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={current.author.profilePhotoUrl ?? "/placeholder.svg"} alt={current.author.name} />
              <AvatarFallback className="text-xs bg-yellow-200 text-yellow-800">
                {current.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="font-medium text-yellow-900 truncate">{current.author.name}</span>
                {current.verified && <span className="text-blue-500 text-xs">✓</span>}
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(current.rating)}
                <span className="text-xs">{formatTimeAgo(current.time)}</span>
              </div>
            </div>
          </div>

          <p className="text-yellow-800 text-sm">{current.text}</p>

          <div className="flex items-center justify-between text-xs text-yellow-600">
            <span>{current.businessName}</span>
            <span>{current.businessType}</span>
          </div>
        </div>

        {/* Navigation / meta */}
        <div className="flex items-center justify-between text-xs text-yellow-600">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>Pattaya Reviews</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>
              {currentReviewIndex + 1}/{reviewsData.reviews.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0"
              onClick={() => window.open("https://www.google.com/maps/search/pattaya+reviews", "_blank")}
              aria-label="Open in Google Maps"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {error && <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded text-center">{error}</div>}
          </CardContent>
        </Card>
      ) : (
        // Expanded Google Reviews View
        <Card className="top-row-widget reviews-widget bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2 text-yellow-800">
                <Star className="w-5 h-5 text-yellow-600" />
                <span>Google Reviews - Full View</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500 text-white text-sm">Live</Badge>
                {onToggleExpand && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpand()
                    }}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs font-medium bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105"
                    title="Collapse widget"
                  >
                    Less
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadReviews}
                  className="h-8 w-8 p-0"
                  disabled={loading}
                  aria-label="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Business Overview */}
            <div className="bg-white/60 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-yellow-900">{reviewsData.businessInfo.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-yellow-600">{reviewsData.averageRating.toFixed(1)}</span>
                  <div className="flex items-center">{renderStars(reviewsData.averageRating)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-yellow-800">
                <div>
                  <span className="font-medium">Address:</span> {reviewsData.businessInfo.address}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {reviewsData.businessInfo.type}
                </div>
                <div>
                  <span className="font-medium">Total Reviews:</span> {reviewsData.totalReviews}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {formatTimeAgo(reviewsData.lastUpdated)}
                </div>
              </div>
            </div>

            {/* All Reviews */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-900">All Reviews</h3>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {reviewsData.reviews.map((review, index) => (
                  <div key={review.id} className="bg-white/60 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={review.author.profilePhotoUrl ?? "/placeholder.svg"} alt={review.author.name} />
                        <AvatarFallback className="text-sm bg-yellow-200 text-yellow-800">
                          {review.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-yellow-900">{review.author.name}</span>
                            {review.verified && <span className="text-blue-500 text-sm">✓ Verified</span>}
                          </div>
                          <span className="text-xs text-yellow-600">{formatTimeAgo(review.time)}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-yellow-700">{review.rating}/5</span>
                        </div>
                        <p className="text-yellow-800 text-sm leading-relaxed mb-2">{review.text}</p>
                        <div className="flex items-center justify-between text-xs text-yellow-600">
                          <span className="font-medium">{review.businessName}</span>
                          <span>{review.businessType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation / meta */}
            <div className="flex items-center justify-between text-sm text-yellow-600 pt-4 border-t border-yellow-200">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Pattaya Reviews</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://www.google.com/maps/search/pattaya+reviews", "_blank")}
                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Google Maps
              </Button>
            </div>

            {error && <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded text-center">{error}</div>}
          </CardContent>
        </Card>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*               SMALL SUB-COMPONENTS & SAMPLE DATA                    */
/* ------------------------------------------------------------------ */
function SkeletonCard() {
  return (
    <Card className="top-row-widget">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Star className="w-4 h-4" />
          <span>Google Reviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyCard() {
  return (
    <Card className="top-row-widget">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Star className="w-4 h-4" />
          <span>Google Reviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Star className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm">No reviews available</p>
        </div>
      </CardContent>
    </Card>
  )
}

/* Demo fallback reviews shown if API fails */
const sampleReviews: GoogleReview[] = [
  {
    id: "1",
    author: { name: "Sarah Johnson", profilePhotoUrl: "" },
    rating: 5,
    text: "Amazing atmosphere and great live music! The food was delicious and the staff was very friendly. Highly recommend for a night out in Pattaya.",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    relativeTimeDescription: "2 hours ago",
    businessName: "Hard Rock Cafe Pattaya",
    businessAddress: "Beach Road, Pattaya",
    businessType: "Restaurant",
    verified: true,
  },
  {
    id: "2",
    author: { name: "Mike Chen", profilePhotoUrl: "" },
    rating: 4,
    text: "Great location right on the beach. Service was good and the drinks were reasonably priced. Will definitely come back!",
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    relativeTimeDescription: "5 hours ago",
    businessName: "Beachside Bar & Grill",
    businessAddress: "Jomtien Beach, Pattaya",
    businessType: "Bar & Restaurant",
    verified: true,
  },
]
