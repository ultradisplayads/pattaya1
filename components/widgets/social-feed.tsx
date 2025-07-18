"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface SocialFeedProps {
  theme: "primary" | "nightlife"
}

export function SocialFeed({ theme }: SocialFeedProps) {
  const [posts] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40&text=SJ",
        username: "@sarahj",
      },
      content: "Amazing sunset at Pattaya Beach tonight! 🌅 The colors were absolutely breathtaking.",
      image: "/placeholder.svg?height=200&width=300&text=Sunset",
      likes: 24,
      comments: 8,
      timeAgo: "2h ago",
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40&text=MC",
        username: "@mikec",
      },
      content: "Just tried the best pad thai at this local spot! Highly recommend 🍜",
      likes: 15,
      comments: 3,
      timeAgo: "4h ago",
    },
  ])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Social Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {post.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{post.user.name}</span>
                  <span className="text-xs text-muted-foreground">{post.user.username}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm">{post.content}</p>

            {post.image && (
              <img
                src={post.image || "/placeholder.svg"}
                alt="Post content"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Heart className="h-4 w-4 mr-1" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
