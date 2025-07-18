import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const businessId = params.id

  // Simulate events data
  const events = [
    {
      id: "1",
      title: "Live Jazz Night",
      description: "Enjoy smooth jazz music every Friday night with our resident band",
      date: "2024-01-19",
      time: "8:00 PM - 11:00 PM",
      category: "Music",
      price: "Free with dinner",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "Thai Cooking Class",
      description: "Learn to cook authentic Thai dishes with our head chef",
      date: "2024-01-25",
      time: "2:00 PM - 5:00 PM",
      category: "Workshop",
      price: "฿1,500 per person",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return NextResponse.json({ data: events })
}
