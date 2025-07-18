import { NextResponse } from "next/server"

export async function GET() {
  const topics = [
    {
      id: "1",
      title: "Best Thai restaurants in Central Pattaya?",
      content: "Looking for authentic Thai food recommendations near Central Festival. Any hidden gems?",
      author: {
        name: "FoodLover123",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "food",
      replies: 23,
      views: 456,
      likes: 12,
      lastActivity: "2 hours ago",
      pinned: false,
      trending: true,
    },
    {
      id: "2",
      title: "Songkran Festival 2024 - Best locations?",
      content: "Planning to experience Songkran this year. Where are the best spots to celebrate?",
      author: {
        name: "TravelGuru",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "events",
      replies: 45,
      views: 1234,
      likes: 28,
      lastActivity: "1 hour ago",
      pinned: true,
      trending: true,
    },
    {
      id: "3",
      title: "Visa extension process in Pattaya",
      content: "Need help with tourist visa extension. What documents are required?",
      author: {
        name: "VisaHelper",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "visa",
      replies: 18,
      views: 789,
      likes: 15,
      lastActivity: "3 hours ago",
      pinned: false,
      trending: false,
    },
  ]

  return NextResponse.json({ data: topics })
}
