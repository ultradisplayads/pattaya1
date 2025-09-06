"use client"

import { useState, useEffect } from "react"
import { buildApiUrl } from "@/lib/strapi-config"

export function SponsorshipDebug() {
  const [sponsorships, setSponsorships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSponsorships()
  }, [])

  const loadSponsorships = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${buildApiUrl('')}/global-sponsorships?populate=*`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('🔍 All sponsorships:', data)
        setSponsorships(data.data || [])
      }
    } catch (error) {
      console.error('Error loading sponsorships:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4 bg-gray-100 rounded">Loading sponsorships...</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Sponsorship Debug Info</h3>
      <div className="text-sm space-y-2">
        <div><strong>Total Sponsorships:</strong> {sponsorships.length}</div>
        {sponsorships.map((sponsorship, index) => (
          <div key={sponsorship.id} className="border p-2 rounded bg-white">
            <div><strong>ID:</strong> {sponsorship.id}</div>
            <div><strong>Active:</strong> {sponsorship.isActive ? 'Yes' : 'No'}</div>
            <div><strong>Widgets:</strong> {JSON.stringify(sponsorship.sponsoredWidgets)}</div>
            <div><strong>Titles:</strong> {sponsorship.sponsorshipTitles?.length || 0}</div>
            {sponsorship.sponsorshipTitles?.map((title: any, i: number) => (
              <div key={i} className="ml-4 text-xs">
                - {title.title} (Active: {title.isActive ? 'Yes' : 'No'})
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
