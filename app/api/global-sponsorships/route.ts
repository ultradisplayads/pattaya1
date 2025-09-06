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
      // Return empty data for 403/404 errors instead of throwing
      if (response.status === 403 || response.status === 404) {
        return NextResponse.json({ data: [] })
      }
      throw new Error(`Strapi API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching global sponsorships:', error)
    // Return empty data instead of error for graceful degradation
    return NextResponse.json({ data: [] })
  }
}
