"use client"

import { useState } from "react"
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
  TrendingUp,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface DesktopMegaMenuProps {
  isOpen: boolean
  onClose: () => void
  theme: "primary" | "nightlife"
  navigationData: any
}

export function DesktopMegaMenu({ isOpen, onClose, theme, navigationData }: DesktopMegaMenuProps) {
  const isPrimary = theme === "primary"
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const categoryIcons = {
    "Dining & Food": Utensils,
    "Health & Wellness": Heart,
    Shopping: ShoppingBag,
    Transportation: Car,
    Services: Briefcase,
    "Explore Pattaya": MapPin,
  }

  const quickActions = [
    { icon: Calendar, label: "Live Events", href: "/events", badge: "Live", color: "red" },
    { icon: Users, label: "Community", href: "/forum", badge: "Active", color: "green" },
    { icon: Newspaper, label: "News & Blog", href: "/blog", badge: "New", color: "blue" },
    { icon: Shield, label: "Nightlife 18+", href: "/nightlife", badge: "Adult", color: "purple" },
  ]

  const featuredContent = [
    {
      title: "Top Rated This Week",
      items: [
        {
          name: "Ocean View Restaurant",
          rating: 4.9,
          category: "Thai Food",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop",
        },
        {
          name: "Sanctuary of Truth",
          rating: 4.8,
          category: "Attraction",
          image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=100&h=100&fit=crop",
        },
        {
          name: "Central Festival",
          rating: 4.7,
          category: "Shopping",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
        },
      ],
    },
    {
      title: "Trending Now",
      items: [
        {
          name: "Songkran Festival",
          trend: "+45%",
          category: "Event",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
        },
        {
          name: "Walking Street",
          trend: "+22%",
          category: "Nightlife",
          image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop",
        },
        {
          name: "Floating Market",
          trend: "+18%",
          category: "Market",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
        },
      ],
    },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40 hidden lg:block" onClick={onClose} />

      {/* Mega Menu */}
      <div
        className={`fixed top-16 left-0 right-0 z-50 hidden lg:block transform transition-all duration-300 ${
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
              size="icon"
              onClick={onClose}
              className={`h-8 w-8 rounded-full ${isPrimary ? "hover:bg-amber-100" : "hover:bg-purple-800 text-white"}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Quick Actions Column */}
              <div className="col-span-3">
                <h3 className={`font-bold text-lg mb-6 ${isPrimary ? "text-gray-900" : "text-white"}`}>Quick Access</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full justify-between p-4 h-auto hover:scale-105 transition-all duration-200 ${
                        isPrimary ? "hover:bg-amber-50" : "hover:bg-purple-800 text-white"
                      }`}
                      onClick={() => {
                        window.location.href = action.href
                        onClose()
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <action.icon className={`h-5 w-5 ${isPrimary ? "text-amber-600" : "text-pink-400"}`} />
                        <span className="font-medium">{action.label}</span>
                      </div>
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
                    </Button>
                  ))}
                </div>
              </div>

              {/* Directory Categories */}
              <div className="col-span-6">
                <h3 className={`font-bold text-lg mb-6 ${isPrimary ? "text-gray-900" : "text-white"}`}>
                  Directory Categories
                </h3>
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
                        onClick={() => {
                          window.location.href = `/${category.attributes.slug}`
                          onClose()
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`p-2 rounded-lg ${isPrimary ? "bg-amber-100" : "bg-pink-500/20"}`}>
                              <IconComponent className={`h-5 w-5 ${isPrimary ? "text-amber-600" : "text-pink-400"}`} />
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
                                  className={`flex items-center justify-between py-1 px-2 rounded hover:bg-opacity-50 transition-colors cursor-pointer ${
                                    isPrimary ? "hover:bg-amber-100" : "hover:bg-purple-700"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.location.href = `/${category.attributes.slug}/${sub.attributes.slug}`
                                    onClose()
                                  }}
                                >
                                  <span>{sub.attributes.name}</span>
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                              ))}
                              {category.attributes.sub_categories.data.length > 4 && (
                                <div className="text-xs text-center pt-2 opacity-70">
                                  +{category.attributes.sub_categories.data.length - 4} more
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Featured Content */}
              <div className="col-span-3">
                <h3 className={`font-bold text-lg mb-6 ${isPrimary ? "text-gray-900" : "text-white"}`}>Featured</h3>
                <div className="space-y-6">
                  {featuredContent.map((section, index) => (
                    <div key={index}>
                      <h4
                        className={`font-medium text-sm mb-3 flex items-center space-x-2 ${
                          isPrimary ? "text-gray-700" : "text-purple-200"
                        }`}
                      >
                        {index === 0 ? <Star className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                        <span>{section.title}</span>
                      </h4>
                      <div className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`p-3 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer ${
                              isPrimary ? "bg-gray-50 hover:bg-amber-50" : "bg-purple-800/30 hover:bg-purple-700/50"
                            }`}
                            onClick={() => {
                              // Navigate to item detail page
                              onClose()
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className={`font-medium text-sm ${isPrimary ? "text-gray-900" : "text-white"}`}>
                                  {item.name}
                                </div>
                                <div
                                  className={`text-xs flex items-center justify-between mt-1 ${
                                    isPrimary ? "text-gray-600" : "text-purple-300"
                                  }`}
                                >
                                  <span>{item.category}</span>
                                  {"rating" in item && (
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                                      <span>{item.rating}</span>
                                    </div>
                                  )}
                                  {"trend" in item && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                      {item.trend}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div
              className={`mt-8 pt-6 border-t flex items-center justify-between ${
                isPrimary ? "border-amber-200" : "border-pink-500/30"
              }`}
            >
              <div className={`text-sm ${isPrimary ? "text-gray-600" : "text-purple-300"}`}>
                Discover everything Pattaya has to offer
              </div>
              <div className="flex space-x-3">
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
                    window.location.href = "/directory"
                    onClose()
                  }}
                >
                  Explore All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
