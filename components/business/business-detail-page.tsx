"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  Heart,
  Share2,
  Camera,
  MessageCircle,
  Calendar,
  Percent,
  Navigation,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

interface BusinessDetailPageProps {
  businessId: string
}

export function BusinessDetailPage({ businessId }: BusinessDetailPageProps) {
  const [business, setBusiness] = useState<any>(null)
  const [reviews, setReviews] = useState([])
  const [events, setEvents] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    loadBusinessData()
  }, [businessId])

  const loadBusinessData = async () => {
    try {
      const [businessRes, reviewsRes, eventsRes, dealsRes] = await Promise.all([
        fetch(`/api/businesses/${businessId}`),
        fetch(`/api/businesses/${businessId}/reviews`),
        fetch(`/api/businesses/${businessId}/events`),
        fetch(`/api/businesses/${businessId}/deals`),
      ])

      if (businessRes.ok) {
        const businessData = await businessRes.json()
        setBusiness(businessData.data)
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData.data || [])
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        setEvents(eventsData.data || [])
      }

      if (dealsRes.ok) {
        const dealsData = await dealsRes.json()
        setDeals(dealsData.data || [])
      }
    } catch (error) {
      console.error("Failed to load business data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: business.name,
        text: business.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleGetDirections = () => {
    const query = encodeURIComponent(business.address)
    window.open(`https://maps.google.com/?q=${query}`, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Business Not Found</h2>
          <p className="text-gray-500">The business you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={business.images?.[currentImageIndex] || "/placeholder.svg?height=400&width=800"}
              alt={business.name}
              fill
              className="object-cover"
            />

            {business.images?.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setCurrentImageIndex(Math.min(business.images.length - 1, currentImageIndex + 1))}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-4 flex space-x-2">
              <Badge className="bg-black/70 text-white">
                <Camera className="h-3 w-3 mr-1" />
                {business.images?.length || 1} Photos
              </Badge>
              {business.isOpen && <Badge className="bg-green-500 text-white">Open Now</Badge>}
            </div>

            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/90 hover:bg-white"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white" onClick={handleShare}>
                <Share2 className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{business.rating}</span>
                      <span>({business.reviewCount} reviews)</span>
                    </div>
                    <Badge variant="outline">{business.category}</Badge>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{business.description}</p>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleGetDirections}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" onClick={() => window.open(`tel:${business.phone}`)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                {business.website && (
                  <Button variant="outline" onClick={() => window.open(business.website, "_blank")}>
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                )}
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
                <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <OverviewTab business={business} />
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <ReviewsTab
                  reviews={reviews}
                  showReviewForm={showReviewForm}
                  setShowReviewForm={setShowReviewForm}
                  businessId={businessId}
                />
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <EventsTab events={events} />
              </TabsContent>

              <TabsContent value="deals" className="space-y-6">
                <DealsTab deals={deals} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BusinessInfoCard business={business} />
            <BusinessHoursCard business={business} />
            <ContactCard business={business} />
          </div>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ business }: { business: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{business.longDescription || business.description}</p>
        </CardContent>
      </Card>

      {business.amenities && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {business.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {business.location && (
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map integration would go here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ReviewsTab({
  reviews,
  showReviewForm,
  setShowReviewForm,
  businessId,
}: {
  reviews: any[]
  showReviewForm: boolean
  setShowReviewForm: (show: boolean) => void
  businessId: string
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>Write a Review</Button>
      </div>

      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea placeholder="Share your experience..." rows={4} />
              </div>
              <div className="flex space-x-3">
                <Button>Submit Review</Button>
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{review.user.name}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">{review.createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function EventsTab({ events }: { events: any[] }) {
  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No upcoming events</h3>
            <p className="text-gray-500">Check back later for new events</p>
          </CardContent>
        </Card>
      ) : (
        events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{event.date}</span>
                    <span>{event.time}</span>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                </div>
                <Button variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

function DealsTab({ deals }: { deals: any[] }) {
  return (
    <div className="space-y-4">
      {deals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Percent className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No current deals</h3>
            <p className="text-gray-500">Check back later for special offers</p>
          </CardContent>
        </Card>
      ) : (
        deals.map((deal) => (
          <Card key={deal.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Percent className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-lg">{deal.title}</h4>
                    <Badge className="bg-red-500 text-white">-{deal.discount}%</Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{deal.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">{deal.salePrice}</span>
                      <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                    </div>
                    <span className="text-sm text-gray-500">Valid until {deal.validUntil}</span>
                  </div>
                </div>
                <Button>Claim Deal</Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

function BusinessInfoCard({ business }: { business: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium">Address</p>
            <p className="text-sm text-gray-600">{business.address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-gray-600">{business.phone}</p>
          </div>
        </div>

        {business.email && (
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-gray-600">{business.email}</p>
            </div>
          </div>
        )}

        {business.website && (
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Website</p>
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center"
              >
                Visit Website
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BusinessHoursCard({ business }: { business: any }) {
  const hours = business.hours || {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 8:00 PM",
    saturday: "10:00 AM - 8:00 PM",
    sunday: "10:00 AM - 6:00 PM",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Business Hours</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(hours).map(([day, time]) => (
            <div key={day} className="flex justify-between">
              <span className="capitalize font-medium">{day}</span>
              <span className="text-gray-600">{time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ContactCard({ business }: { business: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" onClick={() => window.open(`tel:${business.phone}`)}>
          <Phone className="h-4 w-4 mr-2" />
          Call Now
        </Button>
        <Button variant="outline" className="w-full bg-transparent">
          <MessageCircle className="h-4 w-4 mr-2" />
          Send Message
        </Button>
        <Button variant="outline" className="w-full bg-transparent">
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  )
}
