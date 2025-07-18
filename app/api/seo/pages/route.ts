import { type NextRequest, NextResponse } from "next/server"

// Sample SEO page data - replace with database queries
const samplePages = [
  {
    id: "1",
    type: "page",
    title: "Pattaya Restaurants Guide",
    url: "/dining/restaurants",
    metaTitle: "Best Pattaya Restaurants 2024 - Complete Dining Guide",
    metaDescription:
      "Discover the best restaurants in Pattaya with our comprehensive guide. From street food to fine dining, find your perfect meal.",
    seoScore: 85,
    indexed: true,
    lastModified: "2024-01-15",
    keywords: ["pattaya restaurants", "best dining pattaya", "pattaya food guide"],
    headings: [
      { tag: "h1", text: "Best Pattaya Restaurants 2024" },
      { tag: "h2", text: "Top Fine Dining Restaurants" },
      { tag: "h2", text: "Best Street Food Spots" },
    ],
    schema: [{ type: "Restaurant", json: {} }],
    openGraph: {
      title: "Best Pattaya Restaurants 2024 - Complete Dining Guide",
      description: "Discover the best restaurants in Pattaya with our comprehensive guide.",
      image: "/images/pattaya-restaurants-og.jpg",
    },
    twitterCard: {
      title: "Best Pattaya Restaurants 2024",
      description: "Discover the best restaurants in Pattaya with our comprehensive guide.",
      image: "/images/pattaya-restaurants-twitter.jpg",
    },
    canonicalUrl: "https://pattaya1.com/dining/restaurants",
    robots: "index, follow",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    let filteredPages = samplePages

    if (type && type !== "all") {
      filteredPages = filteredPages.filter((page) => page.type === type)
    }

    if (search) {
      filteredPages = filteredPages.filter(
        (page) =>
          page.title.toLowerCase().includes(search.toLowerCase()) ||
          page.url.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredPages,
      total: filteredPages.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch SEO pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "url", "metaTitle", "metaDescription"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new SEO page record
    const newPage = {
      id: Date.now().toString(),
      type: body.type || "page",
      title: body.title,
      url: body.url,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      seoScore: 0, // Calculate SEO score
      indexed: false,
      lastModified: new Date().toISOString().split("T")[0],
      keywords: body.keywords || [],
      headings: body.headings || [],
      schema: body.schema || [],
      openGraph: body.openGraph || {},
      twitterCard: body.twitterCard || {},
      canonicalUrl: body.canonicalUrl || "",
      robots: body.robots || "index, follow",
    }

    // Save to database (implement your database logic here)

    return NextResponse.json({
      success: true,
      data: newPage,
      message: "SEO page created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create SEO page" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Page ID is required" }, { status: 400 })
    }

    // Update SEO page record in database
    const updatedPage = {
      ...updateData,
      id,
      lastModified: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      data: updatedPage,
      message: "SEO page updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update SEO page" }, { status: 500 })
  }
}
