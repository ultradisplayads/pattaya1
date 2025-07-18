import { NextResponse } from "next/server"

export async function GET() {
  const categories = [
    {
      id: "1",
      name: "General Discussion",
      slug: "general",
      icon: "message-circle",
      topicCount: 156,
      description: "General chat about life in Pattaya",
    },
    {
      id: "2",
      name: "Food & Dining",
      slug: "food",
      icon: "utensils",
      topicCount: 89,
      description: "Restaurant reviews and food recommendations",
    },
    {
      id: "3",
      name: "Events & Activities",
      slug: "events",
      icon: "calendar",
      topicCount: 67,
      description: "What's happening in Pattaya",
    },
    {
      id: "4",
      name: "Travel & Tourism",
      slug: "travel",
      icon: "plane",
      topicCount: 134,
      description: "Travel tips and tourist information",
    },
    {
      id: "5",
      name: "Health & Wellness",
      slug: "health",
      icon: "heart",
      topicCount: 45,
      description: "Healthcare and wellness in Pattaya",
    },
    {
      id: "6",
      name: "Living in Pattaya",
      slug: "living",
      icon: "home",
      topicCount: 78,
      description: "For expats and long-term residents",
    },
  ]

  return NextResponse.json({ data: categories })
}
