"use client"

import { useState } from "react"
import { Clock, Users, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HappeningNowProps {
  theme: "primary" | "nightlife"
}

export function HappeningNow({ theme }: HappeningNowProps) {
  const [activities] = useState([
    {
      id: 1,
      title: "Live Music at Hard Rock Cafe",
      location: "Central Pattaya",
      attendees: 45,
      timeAgo: "2 min ago",
      type: "Entertainment",
    },
    {
      id: 2,
      title: "Street Food Festival",
      location: "Jomtien Beach",
      attendees: 120,
      timeAgo: "5 min ago",
      type: "Food",
    },
    {
      id: 3,
      title: "Sunset Yoga Session",
      location: "Pattaya Beach",
      attendees: 28,
      timeAgo: "8 min ago",
      type: "Wellness",
    },
  ])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Happening Now</span>
          <Badge variant="secondary" className="bg-green-500 text-white animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-l-4 border-primary pl-4 py-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{activity.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{activity.attendees} people</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{activity.timeAgo}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
