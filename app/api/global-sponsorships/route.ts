import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/lib/strapi-config'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(buildApiUrl('global-sponsorships'), {
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
