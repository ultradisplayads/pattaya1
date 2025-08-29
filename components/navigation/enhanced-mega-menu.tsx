"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Utensils,
  Heart,
  ShoppingBag,
  Car,
  Briefcase,
  Calendar,
  Users,
  Newspaper,
  Shield,
  Star,
  ChevronRight,
  ExternalLink,
  Zap,
  Building,
  Music,
  Scissors,
  GraduationCap,
  Home,
  Loader2,
  Building2,
  BarChart3,
  CreditCard,
  Percent,
  TrendingUp,
  UserPlus,
  Settings,
  Megaphone,
  Award,
  Target,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AgeVerification } from "@/components/modals/age-verification"

interface EnhancedMegaMenuProps {
  isOpen: boolean
  activeMenu: string | null
  onClose: () => void
  theme: "primary" | "nightlife"
  onThemeChange: (theme: "primary" | "nightlife") => void
}

export function EnhancedMegaMenu({ isOpen, activeMenu, onClose, theme, onThemeChange }: EnhancedMegaMenuProps) {
  const isPrimary = theme === "primary"
  const [navigationData, setNavigationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [showAgeVerification, setShowAgeVerification] = useState(false)
  const [pendingNightlifeAction, setPendingNightlifeAction] = useState<(() => void) | null>(null)

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
      return () => document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    loadNavigationData()
  }, [])

  const loadNavigationData = async () => {
    try {
      const response = await fetch("/api/parent-categories?populate=sub-categories")
      if (response.ok) {
        const data = await response.json()
        setNavigationData(data)
      }
    } catch (error) {
      console.error("Failed to load navigation data:", error)
    } finally {
      setLoading(false)
    }
  }

  const categoryIcons = {
    "Dining & Food": Utensils,
    "Health & Wellness": Heart,
    Shopping: ShoppingBag,
    Transportation: Car,
    Services: Briefcase,
    "Explore Pattaya": MapPin,
    Entertainment: Music,
    Accommodation: Building,
    "Beauty & Spa": Scissors,
    Education: GraduationCap,
    "Real Estate": Home,
    Technology: Zap,
  }

  const businessMenuItems = [
    {
      icon: Building2,
      title: "List Your Business",
      description: "Get discovered by thousands of visitors",
      href: "/business/register",
      badge: "Free Trial",
      color: "green",
      features: ["Free basic listing", "Photo gallery", "Contact details", "Business hours"],
    },
    {
      icon: BarChart3,
      title: "Business Dashboard",
      description: "Manage your listings and analytics",
      href: "/dashboard",
      badge: "Pro",
      color: "blue",
      features: ["Analytics dashboard", "Customer insights", "Performance metrics", "Review management"],
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Create and promote your events",
      href: "/business/events",
      badge: "Popular",
      color: "purple",
      features: ["Event calendar", "Ticket sales", "Promotion tools", "Attendee management"],
    },
    {
      icon: Percent,
      title: "Deals & Offers",
      description: "Attract customers with special offers",
      href: "/business/deals",
      badge: "Hot",
      color: "red",
      features: ["Deal creation", "Coupon system", "Time-limited offers", "Customer targeting"],
    },
    {
      icon: CreditCard,
      title: "Subscription Plans",
      description: "Choose the right plan for your business",
      href: "/business/pricing",
      badge: "Flexible",
      color: "yellow",
      features: ["Multiple plans", "Monthly/yearly billing", "Feature comparison", "Upgrade anytime"],
    },
    {
      icon: Megaphone,
      title: "Marketing Tools",
      description: "Boost your visibility and reach",
      href: "/business/marketing",
      badge: "New",
      color: "pink",
      features: ["Social media integration", "Email campaigns", "SEO optimization", "Ad management"],
    },
  ]

  const businessServices = [
    {
      icon: UserPlus,
      title: "Account Setup",
      description: "Get started with professional onboarding",
      href: "/business/onboarding",
    },
    {
      icon: Settings,
      title: "Business Settings",
      description: "Configure your business profile",
      href: "/business/settings",
    },
    {
      icon: Award,
      title: "Verification Badge",
      description: "Get verified for increased trust",
      href: "/business/verification",
    },
    {
      icon: Target,
      title: "Local SEO",
      description: "Improve your local search ranking",
      href: "/business/seo",
    },
  ]

  const businessStats = [
    { label: "Active Businesses", value: "2,847", icon: Building2, color: "blue" },
    { label: "Monthly Visitors", value: "45K+", icon: Users, color: "green" },
    { label: "Customer Reviews", value: "15,234", icon: Star, color: "yellow" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "purple" },
  ]

  const supportOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us: +66 38 123 456",
      href: "tel:+6638123456",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "business@pattaya1.com",
      href: "mailto:business@pattaya1.com",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team",
      href: "/business/chat",
    },
    {
      icon: Globe,
      title: "Help Center",
      description: "Browse our knowledge base",
      href: "/business/help",
    },
  ]

  const quickActions = [
    {
      icon: Calendar,
      label: "Live Events",
      href: "/events/live",
      badge: "Live",
      color: "red",
      description: "Happening now in Pattaya",
    },
    {
      icon: Users,
      label: "Community Forum",
      href: "/forum",
      badge: "Active",
      color: "green",
      description: "Connect with locals & travelers",
    },
    {
      icon: Newspaper,
      label: "News & Blog",
      href: "/news",
      badge: "New",
      color: "blue",
      description: "Latest updates and stories",
    },
    {
      icon: Shield,
      label: "Nightlife 18+",
      href: "/nightlife",
      badge: "Adult",
      color: "purple",
      description: "Adult entertainment venues",
      requiresAgeVerification: true,
    },
  ]

  const featuredBusinesses = [
    {
      name: "Ocean View Restaurant",
      category: "Thai Cuisine",
      rating: 4.9,
      reviews: 234,
      image: "/placeholder.svg?height=60&width=60",
      href: "/business/ocean-view-restaurant",
      badge: "Top Rated",
    },
    {
      name: "Sanctuary of Truth",
      category: "Attraction",
      rating: 4.8,
      reviews: 1456,
      image: "/placeholder.svg?height=60&width=60",
      href: "/business/sanctuary-of-truth",
      badge: "Must Visit",
    },
    {
      name: "Central Festival",
      category: "Shopping Mall",
      rating: 4.7,
      reviews: 892,
      image: "/placeholder.svg?height=60&width=60",
      href: "/business/central-festival",
      badge: "Popular",
    },
  ]

  const trendingSearches = [
    { term: "Thai massage", trend: "+45%", href: "/search?q=thai+massage" },
    { term: "Seafood restaurants", trend: "+32%", href: "/search?q=seafood+restaurants" },
    { term: "Walking Street", trend: "+28%", href: "/search?q=walking+street" },
    { term: "Visa services", trend: "+22%", href: "/search?q=visa+services" },
    { term: "Motorbike rental", trend: "+18%", href: "/search?q=motorbike+rental" },
  ]

  const handleCategoryClick = (categorySlug: string) => {
    window.location.href = `/${categorySlug}`
    onClose()
  }

  const handleSubCategoryClick = (parentSlug: string, subSlug: string) => {
    window.location.href = `/${parentSlug}/${subSlug}`
    onClose()
  }

  const handleQuickActionClick = (action: any) => {
    if (action.requiresAgeVerification) {
      const ageVerified = sessionStorage.getItem("age-verified")
      if (ageVerified !== "true") {
        setPendingNightlifeAction(() => () => {
          onThemeChange("nightlife")
          window.location.href = action.href
          onClose()
        })
        setShowAgeVerification(true)
        return
      }
    }

    if (action.href === "/nightlife") {
      onThemeChange("nightlife")
    }
    window.location.href = action.href
    onClose()
  }

  const handleBusinessActionClick = (href: string) => {
    window.location.href = href
    onClose()
  }

  const handleAgeVerified = () => {
    setShowAgeVerification(false)
    if (pendingNightlifeAction) {
      pendingNightlifeAction()
      setPendingNightlifeAction(null)
    }
  }

  const handleAgeDenied = () => {
    setShowAgeVerification(false)
    setPendingNightlifeAction(null)
    // Redirect to family-friendly content
    window.location.href = "/family-activities"
    onClose()
  }

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-500 text-white"
      case "blue":
        return "bg-blue-500 text-white"
      case "purple":
        return "bg-purple-500 text-white"
      case "red":
        return "bg-red-500 text-white"
      case "yellow":
        return "bg-yellow-500 text-black"
      case "pink":
        return "bg-pink-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (!isOpen || !activeMenu) return null

  return (
    <>
      {/* Age Verification Modal */}
      <AgeVerification
        isOpen={showAgeVerification}
        onVerified={handleAgeVerified}
        onDenied={handleAgeDenied}
        category="Nightlife & Adult Entertainment"
      />

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-[calc(var(--z-mega-menu)-1)] hidden lg:block" onClick={onClose} />

      {/* Desktop Mega Menu */}
      <div
        className={`fixed top-16 left-0 right-0 z-[var(--z-mega-menu)] hidden lg:block transform transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`mx-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            isPrimary ? "bg-white/95 border-amber-200/50" : "bg-purple-900/95 border-pink-500/30"
          }`}
        >
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`h-8 w-8 p-0 rounded-full ${
                isPrimary ? "hover:bg-gray-100" : "hover:bg-purple-800 text-white"
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-8">
            {activeMenu === "directory" && (
              <div className="grid grid-cols-12 gap-8">
                {/* Quick Actions Column */}
                <div className="col-span-3">
                  <h3 className={`font-bold text-lg mb-6 ${isPrimary ? "text-gray-900" : "text-white"}`}>
                    Quick Access
                  </h3>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={`w-full justify-start p-4 h-auto hover:scale-105 transition-all duration-200 ${
                          isPrimary ? "hover:bg-amber-50" : "hover:bg-purple-800 text-white"
                        }`}
                        onClick={() => handleQuickActionClick(action)}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div className={`p-2 rounded-lg ${isPrimary ? "bg-amber-100" : "bg-pink-500/20"}`}>
                            <action.icon className={`h-5 w-5 ${isPrimary ? "text-amber-600" : "text-pink-400"}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{action.label}</span>
                              <Badge
                                variant="secondary"
                                className={`
                                  ${action.color === "red" ? "bg-red-500 text-white" : ""}
                                  ${action.color === "green" ? "bg-green-500 text-white" : ""}
                                  ${action.color === "blue" ? "bg-blue-500 text-white" : ""}
                                  ${action.color === "purple" ? "bg-purple-500 text-white" : ""}
                                `}
                              >
                                {action.badge}
                              </Badge>
                            </div>
                            <p className={`text-xs ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Trending Searches */}
                  <h4 className={`font-semibold mb-4 ${isPrimary ? "text-gray-800" : "text-purple-200"}`}>
                    Trending Searches
                  </h4>
                  <div className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          window.location.href = search.href
                          onClose()
                        }}
                        className={`w-full text-left p-2 rounded-lg hover:bg-opacity-50 transition-colors ${
                          isPrimary ? "hover:bg-amber-100" : "hover:bg-purple-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${isPrimary ? "text-gray-700" : "text-purple-200"}`}>
                            {search.term}
                          </span>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                            {search.trend}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Directory Categories */}
                <div className="col-span-6">
                  <h3 className={`font-bold text-lg mb-6 ${isPrimary ? "text-gray-900" : "text-white"}`}>
                    Directory Categories
                  </h3>

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {navigationData?.data?.map((category: any) => {
                        const IconComponent = categoryIcons[category.attributes.name] || MapPin
                        const isHovered = hoveredCategory === category.id

                        return (
                          <Card
                            key={category.id}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                              isPrimary ? "hover:bg-amber-50" : "hover:bg-purple-800/50 bg-purple-900/30"
                            }`}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            onClick={() => handleCategoryClick(category.attributes.slug)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`p-2 rounded-lg ${isPrimary ? "bg-amber-100" : "bg-pink-500/20"}`}>
                                  <IconComponent
                                    className={`h-5 w-5 ${isPrimary ? "text-amber-600" : "text-pink-400"}`}
                                  />
                                </div>
                                <h4 className={`font-semibold ${isPrimary ? "text-gray-900" : "text-white"}`}>
                                  {category.attributes.name}
                                </h4>
                              </div>

                              {isHovered && category.attributes.sub_categories?.data && (
                                <div
                                  className={`space-y-1 text-sm animate-in slide-in-from-top-2 duration-200 ${
                                    isPrimary ? "text-gray-600" : "text-purple-200"
                                  }`}
                                >
                                  {category.attributes.sub_categories.data.slice(0, 4).map((sub: any) => (
                                    <div
                                      key={sub.id}
                                      className={`flex items-center justify-between py-1 px-2 rounded hover:bg-opacity-50 transition-colors ${
                                        isPrimary ? "hover:bg-amber-100" : "hover:bg-purple-700"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSubCategoryClick(category.attributes.slug, sub.attributes.slug)
                                      }}
                                    >
                                      <span>{sub.attributes.name}</span>
                                      <ChevronRight className="h-3 w-3" />
                                    </div>
                                  ))}
                                  {category.attributes.sub_categories.data.length > 4 && (
                                    <div className="text-xs text-center pt-2 opacity-70">
                                      +{category.attributes.sub_categories.data.length - 4} more categories
                                    </div>
                                  )}
                                </div>
                              )}

                              {!isHovered && (
                                <p className={`text-xs ${isPrimary ? "text-gray-500" : "text-purple-300"}`}>
                                  {category.attributes.sub_categories?.data?.length || 0} subcategories
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Featured Content */}
                <div className="col-span-3">
                  <h3 className={`font-bold text-lg mb-6 ${isPrimary ? "text-gray-900" : "text-white"}`}>
                    Featured Businesses
                  </h3>
                  <div className="space-y-4">
                    {featuredBusinesses.map((business, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer hover:scale-105 transition-all duration-200 ${
                          isPrimary ? "hover:bg-amber-50" : "hover:bg-purple-800/50 bg-purple-900/30"
                        }`}
                        onClick={() => {
                          window.location.href = business.href
                          onClose()
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src={business.image || "/placeholder.svg"}
                              alt={business.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h4
                                  className={`font-medium text-sm truncate ${isPrimary ? "text-gray-900" : "text-white"}`}
                                >
                                  {business.name}
                                </h4>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs ml-2">
                                  {business.badge}
                                </Badge>
                              </div>
                              <p className={`text-xs mb-2 ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>
                                {business.category}
                              </p>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                                  <span className={`text-xs ${isPrimary ? "text-gray-700" : "text-purple-200"}`}>
                                    {business.rating}
                                  </span>
                                </div>
                                <span className={`text-xs ${isPrimary ? "text-gray-500" : "text-purple-400"}`}>
                                  ({business.reviews} reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <h4 className={`font-semibold ${isPrimary ? "text-gray-800" : "text-purple-200"}`}>
                      Platform Stats
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`text-center p-3 rounded-lg ${isPrimary ? "bg-gray-50" : "bg-purple-800/30"}`}>
                        <div className={`text-lg font-bold ${isPrimary ? "text-blue-600" : "text-pink-400"}`}>
                          2,847
                        </div>
                        <div className={`text-xs ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>Businesses</div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${isPrimary ? "bg-gray-50" : "bg-purple-800/30"}`}>
                        <div className={`text-lg font-bold ${isPrimary ? "text-green-600" : "text-pink-400"}`}>
                          15,234
                        </div>
                        <div className={`text-xs ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "business" && (
              <div className="grid grid-cols-12 gap-8">
                {/* Business Services */}
                <div className="col-span-8">
                  <h3 className={`font-bold text-xl mb-6 ${isPrimary ? "text-gray-900" : "text-white"}`}>
                    Business Solutions
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {businessMenuItems.map((item, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                          isPrimary ? "hover:bg-amber-50" : "hover:bg-purple-800/50 bg-purple-900/30"
                        }`}
                        onClick={() => handleBusinessActionClick(item.href)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${isPrimary ? "bg-blue-100" : "bg-pink-500/20"}`}>
                              <item.icon className={`h-6 w-6 ${isPrimary ? "text-blue-600" : "text-pink-400"}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className={`font-semibold ${isPrimary ? "text-gray-900" : "text-white"}`}>
                                  {item.title}
                                </h4>
                                {item.badge && (
                                  <Badge variant="secondary" className={`text-xs ${getBadgeColor(item.color)}`}>
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm mb-3 ${isPrimary ? "text-gray-600" : "text-purple-200"}`}>
                                {item.description}
                              </p>
                              <ul className={`text-xs space-y-1 ${isPrimary ? "text-gray-500" : "text-purple-300"}`}>
                                {item.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-center space-x-2">
                                    <div
                                      className={`w-1 h-1 rounded-full ${isPrimary ? "bg-blue-400" : "bg-pink-400"}`}
                                    />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="my-8" />

                  {/* Additional Services */}
                  <h4 className={`font-semibold text-lg mb-4 ${isPrimary ? "text-gray-800" : "text-purple-200"}`}>
                    Additional Services
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    {businessServices.map((service, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-auto p-4 flex-col space-y-2 ${
                          isPrimary
                            ? "border-amber-200 hover:bg-amber-50"
                            : "border-pink-500/30 bg-purple-800/30 text-white hover:bg-purple-700"
                        }`}
                        onClick={() => handleBusinessActionClick(service.href)}
                      >
                        <service.icon className={`h-5 w-5 ${isPrimary ? "text-amber-600" : "text-pink-400"}`} />
                        <div className="text-center">
                          <div className={`font-medium text-sm ${isPrimary ? "text-gray-900" : "text-white"}`}>
                            {service.title}
                          </div>
                          <div className={`text-xs ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>
                            {service.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Business Stats & Support */}
                <div className="col-span-4">
                  <h3 className={`font-bold text-lg mb-6 ${isPrimary ? "text-gray-900" : "text-white"}`}>
                    Why Choose Pattaya1?
                  </h3>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {businessStats.map((stat, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center ${isPrimary ? "bg-blue-50" : "bg-purple-800/30"}`}
                      >
                        <stat.icon
                          className={`h-6 w-6 mx-auto mb-2 ${
                            stat.color === "blue"
                              ? "text-blue-600"
                              : stat.color === "green"
                                ? "text-green-600"
                                : stat.color === "yellow"
                                  ? "text-yellow-600"
                                  : stat.color === "purple"
                                    ? "text-purple-600"
                                    : isPrimary
                                      ? "text-blue-600"
                                      : "text-pink-400"
                          }`}
                        />
                        <div className={`text-xl font-bold ${isPrimary ? "text-gray-900" : "text-white"}`}>
                          {stat.value}
                        </div>
                        <div className={`text-xs ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleBusinessActionClick("/business/register")}
                    className={`w-full mb-6 ${
                      isPrimary
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    } text-white`}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Get Started Free
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>

                  <Separator className="my-6" />

                  {/* Support Options */}
                  <h4 className={`font-semibold mb-4 ${isPrimary ? "text-gray-800" : "text-purple-200"}`}>
                    Need Help?
                  </h4>
                  <div className="space-y-3">
                    {supportOptions.map((option, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={`w-full justify-start p-3 h-auto ${
                          isPrimary ? "hover:bg-amber-50" : "hover:bg-purple-800 text-white"
                        }`}
                        onClick={() => handleBusinessActionClick(option.href)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className={`p-2 rounded-lg ${isPrimary ? "bg-gray-100" : "bg-purple-700/50"}`}>
                            <option.icon className={`h-4 w-4 ${isPrimary ? "text-gray-600" : "text-purple-300"}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className={`font-medium text-sm ${isPrimary ? "text-gray-900" : "text-white"}`}>
                              {option.title}
                            </div>
                            <div className={`text-xs ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {/* Testimonial */}
                  <div className={`mt-6 p-4 rounded-lg ${isPrimary ? "bg-green-50" : "bg-purple-800/30"}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${isPrimary ? "bg-green-100" : "bg-green-500/20"}`}>
                        <Star className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className={`text-sm italic mb-2 ${isPrimary ? "text-green-800" : "text-green-300"}`}>
                          "Pattaya1 helped us increase our bookings by 300% in just 3 months!"
                        </p>
                        <p className={`text-xs ${isPrimary ? "text-green-600" : "text-green-400"}`}>
                          - Ocean View Restaurant
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div
              className={`mt-8 pt-6 border-t flex items-center justify-between ${
                isPrimary ? "border-amber-200" : "border-pink-500/30"
              }`}
            >
              <div className={`text-sm ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>
                {activeMenu === "business"
                  ? "Join thousands of successful businesses on Pattaya1"
                  : "Discover everything Pattaya has to offer • Updated daily"}
              </div>
              <div className="flex space-x-3">
                {activeMenu === "business" ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleBusinessActionClick("/business/help")}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Get Help
                    </Button>
                    <Button
                      size="sm"
                      className={isPrimary ? "bg-amber-600 hover:bg-amber-700" : "bg-pink-600 hover:bg-pink-700"}
                      onClick={() => handleBusinessActionClick("/business/register")}
                    >
                      Start Free Trial
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = "/business"
                        onClose()
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Business Owners
                    </Button>
                    <Button
                      size="sm"
                      className={isPrimary ? "bg-amber-600 hover:bg-amber-700" : "bg-pink-600 hover:bg-pink-700"}
                      onClick={() => {
                        window.location.href = "/search"
                        onClose()
                      }}
                    >
                      Explore All
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Mega Menu */}
      <div
        className={`fixed top-16 left-0 right-0 z-[var(--z-mega-menu)] block lg:hidden transform transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`mx-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            isPrimary ? "bg-white/95 border-amber-200/50" : "bg-purple-900/95 border-pink-500/30"
          }`}
        >
          {/* Mobile Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`h-8 w-8 p-0 rounded-full ${
                isPrimary ? "hover:bg-gray-100" : "hover:bg-purple-800 text-white"
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-8">
            {activeMenu === "directory" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Restaurants</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/restaurants/thai" className="hover:text-primary">
                          Thai Cuisine
                        </a>
                      </li>
                      <li>
                        <a href="/restaurants/international" className="hover:text-primary">
                          International
                        </a>
                      </li>
                      <li>
                        <a href="/restaurants/seafood" className="hover:text-primary">
                          Seafood
                        </a>
                      </li>
                      <li>
                        <a href="/restaurants/street-food" className="hover:text-primary">
                          Street Food
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Hotels</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/hotels/luxury" className="hover:text-primary">
                          Luxury Hotels
                        </a>
                      </li>
                      <li>
                        <a href="/hotels/boutique" className="hover:text-primary">
                          Boutique Hotels
                        </a>
                      </li>
                      <li>
                        <a href="/hotels/budget" className="hover:text-primary">
                          Budget Hotels
                        </a>
                      </li>
                      <li>
                        <a href="/hotels/resorts" className="hover:text-primary">
                          Beach Resorts
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Attractions</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/attractions/temples" className="hover:text-primary">
                          Temples
                        </a>
                      </li>
                      <li>
                        <a href="/attractions/beaches" className="hover:text-primary">
                          Beaches
                        </a>
                      </li>
                      <li>
                        <a href="/attractions/shows" className="hover:text-primary">
                          Shows
                        </a>
                      </li>
                      <li>
                        <a href="/attractions/tours" className="hover:text-primary">
                          Tours
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Nightlife</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/nightlife/bars" className="hover:text-primary">
                          Bars
                        </a>
                      </li>
                      <li>
                        <a href="/nightlife/clubs" className="hover:text-primary">
                          Clubs
                        </a>
                      </li>
                      <li>
                        <a href="/nightlife/rooftop" className="hover:text-primary">
                          Rooftop Bars
                        </a>
                      </li>
                      <li>
                        <a href="/nightlife/walking-street" className="hover:text-primary">
                          Walking Street
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeMenu === "business" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">List Your Business</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get discovered by thousands of visitors to Pattaya
                    </p>
                    <Button className="w-full">
                      Get Started
                      <Badge variant="secondary" className="ml-2 bg-green-500 text-white">
                        Free
                      </Badge>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Premium Features</h3>
                    <ul className="text-sm space-y-2 mb-4">
                      <li>• Priority listing</li>
                      <li>• Photo gallery</li>
                      <li>• Customer reviews</li>
                      <li>• Analytics dashboard</li>
                    </ul>
                    <Button variant="outline" className="w-full bg-transparent">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Need help getting started? Our team is here to help.
                    </p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
