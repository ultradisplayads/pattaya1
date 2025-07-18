import { NextResponse } from "next/server"

// Simulated API endpoint for blog posts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const populate = searchParams.get("populate")

  try {
    const blogPosts = {
      data: [
        {
          id: "1",
          attributes: {
            title: "The Ultimate Guide to Pattaya's Best Beaches",
            slug: "ultimate-guide-pattaya-beaches",
            excerpt:
              "Discover the most beautiful beaches in Pattaya, from the bustling Pattaya Beach to the serene Jomtien Beach.",
            content: "Full article content here...",
            publishedAt: "2024-01-10T10:00:00.000Z",
            featured_image: {
              data: {
                attributes: {
                  url: "/placeholder.svg?height=400&width=600",
                },
              },
            },
            author: populate?.includes("author")
              ? {
                  data: {
                    attributes: {
                      name: "Sarah Johnson",
                      bio: "Travel writer and Pattaya local",
                    },
                  },
                }
              : undefined,
            tags: populate?.includes("tags")
              ? {
                  data: [
                    { id: "1", attributes: { name: "Beaches" } },
                    { id: "2", attributes: { name: "Travel Guide" } },
                  ],
                }
              : undefined,
          },
        },
        {
          id: "2",
          attributes: {
            title: "Top 10 Thai Restaurants You Must Try in Pattaya",
            slug: "top-10-thai-restaurants-pattaya",
            excerpt: "From street food to fine dining, explore the best Thai cuisine Pattaya has to offer.",
            content: "Full article content here...",
            publishedAt: "2024-01-08T14:30:00.000Z",
            featured_image: {
              data: {
                attributes: {
                  url: "/placeholder.svg?height=400&width=600",
                },
              },
            },
            author: populate?.includes("author")
              ? {
                  data: {
                    attributes: {
                      name: "Chef Somchai",
                      bio: "Local chef and food enthusiast",
                    },
                  },
                }
              : undefined,
            tags: populate?.includes("tags")
              ? {
                  data: [
                    { id: "3", attributes: { name: "Food" } },
                    { id: "4", attributes: { name: "Restaurants" } },
                  ],
                }
              : undefined,
          },
        },
        {
          id: "3",
          attributes: {
            title: "Pattaya Nightlife: A Complete Guide to Walking Street",
            slug: "pattaya-nightlife-walking-street-guide",
            excerpt:
              "Everything you need to know about Pattaya's famous Walking Street and its vibrant nightlife scene.",
            content: "Full article content here...",
            publishedAt: "2024-01-05T20:00:00.000Z",
            featured_image: {
              data: {
                attributes: {
                  url: "/placeholder.svg?height=400&width=600",
                },
              },
            },
            author: populate?.includes("author")
              ? {
                  data: {
                    attributes: {
                      name: "Mike Thompson",
                      bio: "Nightlife expert and local guide",
                    },
                  },
                }
              : undefined,
            tags: populate?.includes("tags")
              ? {
                  data: [
                    { id: "5", attributes: { name: "Nightlife" } },
                    { id: "6", attributes: { name: "Entertainment" } },
                  ],
                }
              : undefined,
          },
        },
      ],
    }

    return NextResponse.json(blogPosts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
