import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch forum activities to get unique categories and their counts
    const response = await fetch("http://localhost:1337/api/forum-activities?populate=*")
    
    if (!response.ok) {
      console.error('Failed to fetch from Strapi:', response.status)
      return NextResponse.json({ data: [], error: 'Failed to fetch data' }, { status: 500 })
    }

    const strapiData = await response.json()
    
    // Count topics per category
    const categoryCounts: { [key: string]: number } = {}
    const categoryDescriptions: { [key: string]: string } = {
      'Nightlife': 'Bars, clubs, and nightlife in Pattaya',
      'Visa & Legal': 'Visa, immigration, and legal matters',
      'Transportation': 'Getting around Pattaya',
      'Events': 'Events and activities in Pattaya',
      'Living': 'Living in Pattaya as an expat',
      'Food & Dining': 'Restaurants and dining recommendations',
      'Accommodation': 'Hotels, apartments, and accommodation',
      'Shopping': 'Shopping and retail in Pattaya',
      'Health': 'Healthcare and wellness',
      'Entertainment': 'Entertainment and recreation',
      'Sports': 'Sports and fitness activities',
      'General': 'General discussion about Pattaya'
    }
    
    const categoryIcons: { [key: string]: string } = {
      'Nightlife': 'music',
      'Visa & Legal': 'file-text',
      'Transportation': 'car',
      'Events': 'calendar',
      'Living': 'home',
      'Food & Dining': 'utensils',
      'Accommodation': 'bed',
      'Shopping': 'shopping-bag',
      'Health': 'heart',
      'Entertainment': 'play',
      'Sports': 'activity',
      'General': 'message-circle'
    }

    // Count topics in each category
    strapiData.data?.forEach((item: any) => {
      const category = item.Category
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    // Create categories array
    const categories = Object.keys(categoryCounts).map((category, index) => ({
      id: (index + 1).toString(),
      name: category,
      slug: category.toLowerCase().replace(' & ', '-').replace(' ', '-'),
      icon: categoryIcons[category] || 'message-circle',
      topicCount: categoryCounts[category],
      description: categoryDescriptions[category] || `Discussion about ${category.toLowerCase()} in Pattaya`,
    }))

    // Add "All" category
    const totalTopics = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
    categories.unshift({
      id: "0",
      name: "All Topics",
      slug: "all",
      icon: "grid",
      topicCount: totalTopics,
      description: "All forum topics and discussions",
    })

    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error('Error fetching forum categories:', error)
    return NextResponse.json({ data: [], error: 'Internal server error' }, { status: 500 })
  }
}
