"use client"

import { useState } from "react"
import { TrendingUp, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TrendingTagsProps {
  theme: "primary" | "nightlife"
}

export function TrendingTags({ theme }: TrendingTagsProps) {
  const [tags] = useState([
    { name: "PattayaBeach", posts: 1234, trend: "+15%" },
    { name: "ThaiFood", posts: 892, trend: "+8%" },
    { name: "WalkingStreet", posts: 756, trend: "+22%" },
    { name: "Nightlife", posts: 643, trend: "+12%" },
    { name: "Sunset", posts: 521, trend: "+5%" },
    { name: "LocalEats", posts: 387, trend: "+18%" },
  ])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Trending</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tags.map((tag, index) => (
          <div key={tag.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
              <div>
                <div className="flex items-center space-x-1">
                  <Hash className="h-3 w-3" />
                  <span className="font-medium">{tag.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{tag.posts} posts</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-green-600">
              {tag.trend}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
