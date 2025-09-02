import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:1337/api/global-sponsorships', {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Strapi API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching global sponsorships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch global sponsorships' },
      { status: 500 }
    )
  }
}
