import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const businessId = params.id

  // Simulate reviews data
  const reviews = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      comment:
        "Absolutely amazing food and service! The pad thai was the best I've had in Thailand. The ocean view made the experience even more special.",
      createdAt: "2 days ago",
      helpful: 12,
    },
    {
      id: "2",
      user: {
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      comment:
        "Great location right on the beach. Food was delicious and authentic. Service was a bit slow during peak hours but overall a good experience.",
      createdAt: "1 week ago",
      helpful: 8,
    },
    {
      id: "3",
      user: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      comment:
        "Perfect spot for a romantic dinner. The sunset view was breathtaking and the tom yum soup was incredible. Will definitely come back!",
      createdAt: "2 weeks ago",
      helpful: 15,
    },
  ]

  return NextResponse.json({ data: reviews })
}
