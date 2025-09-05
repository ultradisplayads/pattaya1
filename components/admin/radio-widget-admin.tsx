"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Radio, Settings, Save, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SponsoredWidgetBanner {
  isSponsored: boolean
  sponsorName: string
  sponsorLogo: string
  sponsorMessage: string
  sponsorWebsite: string
  sponsorColor: string
  bannerPosition: "top" | "bottom" | "overlay"
  sponsorStartDate: string
  sponsorEndDate: string
}

export function RadioWidgetAdmin() {
  const [sponsoredBanner, setSponsoredBanner] = useState<SponsoredWidgetBanner>({
    isSponsored: false,
    sponsorName: "",
    sponsorLogo: "",
    sponsorMessage: "",
    sponsorWebsite: "",
    sponsorColor: "#1e40af",
    bannerPosition: "top",
    sponsorStartDate: "",
    sponsorEndDate: ""
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCurrentSponsorship()
  }, [])

  const loadCurrentSponsorship = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/homepage-configs/widget/radio')
      if (response.ok) {
        const data = await response.json()
        if (data.data?.sponsoredWidgetBanner) {
          setSponsoredBanner(data.data.sponsoredWidgetBanner)
        }
      }
    } catch (error) {
      console.error('Error loading sponsorship:', error)
      toast({
        title: "Error",
        description: "Failed to load current sponsorship settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSponsorship = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/homepage-configs/widget/radio/sponsorship', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sponsoredWidgetBanner: sponsoredBanner })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Radio widget sponsorship updated successfully",
        })
      } else {
        throw new Error('Failed to update sponsorship')
      }
    } catch (error) {
      console.error('Error saving sponsorship:', error)
      toast({
        title: "Error",
        description: "Failed to save sponsorship settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to Strapi and get the URL
      // For now, we'll use a placeholder
      setSponsoredBanner(prev => ({
        ...prev,
        sponsorLogo: URL.createObjectURL(file)
      }))
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-5 w-5" />
          Radio Widget Sponsorship Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sponsorship Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="isSponsored">Enable Widget Sponsorship</Label>
            <p className="text-sm text-muted-foreground">
              Show a sponsored banner on the radio widget
            </p>
          </div>
          <Switch
            id="isSponsored"
            checked={sponsoredBanner.isSponsored}
            onCheckedChange={(checked) => 
              setSponsoredBanner(prev => ({ ...prev, isSponsored: checked }))
            }
          />
        </div>

        {sponsoredBanner.isSponsored && (
          <>
            {/* Sponsor Name */}
            <div className="space-y-2">
              <Label htmlFor="sponsorName">Sponsor Name *</Label>
              <Input
                id="sponsorName"
                placeholder="e.g., Singha Beer, Coca-Cola"
                value={sponsoredBanner.sponsorName}
                onChange={(e) => 
                  setSponsoredBanner(prev => ({ ...prev, sponsorName: e.target.value }))
                }
              />
            </div>

            {/* Sponsor Message */}
            <div className="space-y-2">
              <Label htmlFor="sponsorMessage">Sponsor Message</Label>
              <Textarea
                id="sponsorMessage"
                placeholder="e.g., Pattaya's Radio, brought to you by Singha Beer"
                value={sponsoredBanner.sponsorMessage}
                onChange={(e) => 
                  setSponsoredBanner(prev => ({ ...prev, sponsorMessage: e.target.value }))
                }
              />
                              <p className="text-sm text-muted-foreground">
                  Leave empty to use default format: "Pattaya's Radio, brought to you by {'{Sponsor Name}'}"
                </p>
            </div>

            {/* Sponsor Logo */}
            <div className="space-y-2">
              <Label htmlFor="sponsorLogo">Sponsor Logo</Label>
              <div className="flex items-center gap-3">
                {sponsoredBanner.sponsorLogo && (
                  <img
                    src={sponsoredBanner.sponsorLogo}
                    alt="Sponsor logo"
                    className="w-12 h-12 object-contain border rounded"
                  />
                )}
                <Button variant="outline" size="sm" onClick={() => document.getElementById('logoUpload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>

            {/* Sponsor Website */}
            <div className="space-y-2">
              <Label htmlFor="sponsorWebsite">Sponsor Website</Label>
              <Input
                id="sponsorWebsite"
                type="url"
                placeholder="https://example.com"
                value={sponsoredBanner.sponsorWebsite}
                onChange={(e) => 
                  setSponsoredBanner(prev => ({ ...prev, sponsorWebsite: e.target.value }))
                }
              />
            </div>

            {/* Sponsor Color */}
            <div className="space-y-2">
              <Label htmlFor="sponsorColor">Sponsor Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="sponsorColor"
                  type="color"
                  value={sponsoredBanner.sponsorColor}
                  onChange={(e) => 
                    setSponsoredBanner(prev => ({ ...prev, sponsorColor: e.target.value }))
                  }
                  className="w-16 h-10 p-1 border rounded"
                />
                <span className="text-sm text-muted-foreground">
                  {sponsoredBanner.sponsorColor}
                </span>
              </div>
            </div>

            {/* Banner Position */}
            <div className="space-y-2">
              <Label>Banner Position</Label>
              <div className="flex gap-2">
                {(["top", "bottom", "overlay"] as const).map((position) => (
                  <Button
                    key={position}
                    variant={sponsoredBanner.bannerPosition === position ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      setSponsoredBanner(prev => ({ ...prev, bannerPosition: position }))
                    }
                  >
                    {position.charAt(0).toUpperCase() + position.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sponsorStartDate">Start Date</Label>
                <Input
                  id="sponsorStartDate"
                  type="date"
                  value={sponsoredBanner.sponsorStartDate}
                  onChange={(e) => 
                    setSponsoredBanner(prev => ({ ...prev, sponsorStartDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sponsorEndDate">End Date</Label>
                <Input
                  id="sponsorEndDate"
                  type="date"
                  value={sponsoredBanner.sponsorEndDate}
                  onChange={(e) => 
                    setSponsoredBanner(prev => ({ ...prev, sponsorEndDate: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="text-center">
                  <p 
                    className="text-sm font-medium"
                    style={{ color: sponsoredBanner.sponsorColor }}
                  >
                    {sponsoredBanner.sponsorMessage || 
                      `Pattaya's Radio, brought to you by ${sponsoredBanner.sponsorName || 'Sponsor'}`}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={saveSponsorship} 
            disabled={saving || !sponsoredBanner.isSponsored || !sponsoredBanner.sponsorName}
            className="min-w-[120px]"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Current Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Status:</span>
            <Badge variant={sponsoredBanner.isSponsored ? "default" : "secondary"}>
              {sponsoredBanner.isSponsored ? "Sponsored" : "Not Sponsored"}
            </Badge>
          </div>
          {sponsoredBanner.isSponsored && sponsoredBanner.sponsorName && (
            <p className="text-sm text-muted-foreground mt-1">
              Sponsored by: <span className="font-medium">{sponsoredBanner.sponsorName}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
