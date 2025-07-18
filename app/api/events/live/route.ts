import { NextResponse } from "next/server"

export async function GET() {
  const liveEvents = [
    {
      id: "live-1",
      title: "Live Jazz at Ocean Bar",
      location: "Beach Road",
      time: "Now - 12:00 AM",
      attendees: 45,
      category: "music",
    },
    {
      id: "live-2",
      title: "Night Market Open",
      location: "Thepprasit Road",
      time: "Until 2:00 AM",
      attendees: 120,
      category: "market",
    },
    {
      id: "live-3",
      title: "Walking Street Party",
      location: "Walking Street",
      time: "All Night",
      attendees: 300,
      category: "nightlife",
    },
    {
      id: "live-4",
      title: "Beach Volleyball Tournament",
      location: "Pattaya Beach",
      time: "Finals Now",
      attendees: 80,
      category: "sports",
    },
    {
      id: "live-5",
      title: "Thai Cooking Demo",
      location: "Central Festival",
      time: "30 mins left",
      attendees: 25,
      category: "food",
    },
  ]

  return NextResponse.json({ data: liveEvents })
}
