import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search') || ''

    // Build the Strapi query - simple fetch with last activity sort
    let strapiUrl = "http://localhost:1337/api/forum-activities?populate=*&sort=LastActivity:desc"
    
    if (category && category !== 'all') {
      strapiUrl += `&filters[Category][$eq]=${encodeURIComponent(category)}`
    }
    
    if (search) {
      strapiUrl += `&filters[$or][0][Title][$containsi]=${encodeURIComponent(search)}`
      strapiUrl += `&filters[$or][1][Content][$containsi]=${encodeURIComponent(search)}`
    }

    console.log('Fetching forum topics from Strapi:', strapiUrl)
    const response = await fetch(strapiUrl)
    
    if (!response.ok) {
      console.error('Failed to fetch from Strapi:', response.status)
      return NextResponse.json({ data: [], error: 'Failed to fetch data' }, { status: 500 })
    }

    const strapiData = await response.json()
    
    // Transform Strapi data to match the expected format
    const topics = strapiData.data?.map((item: any) => ({
      id: item.id.toString(),
      title: item.Title,
      content: item.Content || '',
      author: {
        name: item.AuthorName,
        avatar: item.AuthorAvatar?.url || "/placeholder.svg?height=40&width=40",
      },
      category: item.Category.toLowerCase().replace(' & ', '-').replace(' ', '-'),
      replies: item.Replies,
      views: item.Views,
      likes: item.Likes,
      lastActivity: item.LastActivity,
      pinned: item.IsPinned,
      trending: item.IsHot,
      featured: item.Featured,
      authorReputation: item.AuthorReputation,
      tags: item.Tags || [],
      url: item.URL || '',
    })) || []

    return NextResponse.json({ data: topics })
  } catch (error) {
    console.error('Error fetching forum topics:', error)
    return NextResponse.json({ data: [], error: 'Internal server error' }, { status: 500 })
  }
}
