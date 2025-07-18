"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LiveNotificationsProps {
  theme: "primary" | "nightlife"
}

export function LiveNotifications({ theme }: LiveNotificationsProps) {
  const [notifications, setNotifications] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate live notifications
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: Math.random() > 0.5 ? "event" : "deal",
        title: Math.random() > 0.5 ? "Live Jazz at Ocean Bar" : "50% Off Spa Treatment",
        location: "Walking Street",
        time: "Now",
        icon: Math.random() > 0.5 ? Calendar : Star,
      }

      setNotifications((prev) => [newNotification, ...prev.slice(0, 2)])
      setIsVisible(true)

      // Auto hide after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
      }, 5000)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`w-80 animate-in slide-in-from-right-full duration-500 shadow-lg border-l-4 ${
            theme === "primary"
              ? "bg-white/95 backdrop-blur-sm border-l-amber-500"
              : "bg-purple-900/95 backdrop-blur-sm border-l-pink-500"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${theme === "primary" ? "bg-amber-100" : "bg-pink-500/20"}`}>
                  <notification.icon
                    className={`h-4 w-4 ${theme === "primary" ? "text-amber-600" : "text-pink-400"}`}
                  />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm ${theme === "primary" ? "text-gray-900" : "text-white"}`}>
                    {notification.title}
                  </h4>
                  <div
                    className={`flex items-center space-x-2 text-xs mt-1 ${
                      theme === "primary" ? "text-gray-600" : "text-purple-200"
                    }`}
                  >
                    <MapPin className="h-3 w-3" />
                    <span>{notification.location}</span>
                    <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                      {notification.time}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
