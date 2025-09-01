"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Radio, Megaphone, DollarSign } from "lucide-react"

interface RadioStation {
  id: string
  name: string
  isSponsored: boolean
  sponsoredLabel?: string
  preRollAdActive: boolean
}

export function RadioSponsorshipAdmin() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [widgetSponsored, setWidgetSponsored] = useState(false)

  useEffect(() => {
    // Mock data
    setStations([
      {
        id: "1",
        name: "Fabulas 103 FM",
        isSponsored: true,
        sponsoredLabel: "Sponsored by Singha Beer",
        preRollAdActive: true
      },
      {
        id: "2",
        name: "Pattaya Radio",
        isSponsored: false,
        preRollAdActive: false
      }
    ])
  }, [])

  const toggleStationSponsorship = (stationId: string) => {
    setStations(prev => prev.map(station => 
      station.id === stationId 
        ? { ...station, isSponsored: !station.isSponsored }
        : station
    ))
  }

  const togglePreRollAd = (stationId: string) => {
    setStations(prev => prev.map(station => 
      station.id === stationId 
        ? { ...station, preRollAdActive: !station.preRollAdActive }
        : station
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Radio Sponsorship Management</h1>
        <p className="text-gray-600">Manage sponsored stations and widget banners</p>
      </div>

      <Tabs defaultValue="stations">
        <TabsList>
          <TabsTrigger value="stations">Sponsored Stations</TabsTrigger>
          <TabsTrigger value="widget">Widget Banner</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="stations" className="space-y-4">
          {stations.map((station) => (
            <Card key={station.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  {station.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Switch
                        checked={station.isSponsored}
                        onCheckedChange={() => toggleStationSponsorship(station.id)}
                      />
                      Sponsored Station
                    </Label>
                    <p className="text-sm text-gray-500">Appears at top of list</p>
                  </div>
                  {station.isSponsored && (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Switch
                        checked={station.preRollAdActive}
                        onCheckedChange={() => togglePreRollAd(station.id)}
                      />
                      Pre-Roll Ad
                    </Label>
                    <p className="text-sm text-gray-500">Play ad before station starts</p>
                  </div>
                  {station.preRollAdActive && (
                    <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Widget Banner Sponsorship
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Switch
                      checked={widgetSponsored}
                      onCheckedChange={setWidgetSponsored}
                    />
                    Sponsor Entire Widget
                  </Label>
                  <p className="text-sm text-gray-500">Display sponsor banner on radio widget</p>
                </div>
                {widgetSponsored && (
                  <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {stations.filter(s => s.isSponsored).length}
                </div>
                <p className="text-sm text-gray-500">Sponsored Stations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {stations.filter(s => s.preRollAdActive).length}
                </div>
                <p className="text-sm text-gray-500">Pre-Roll Ads</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {widgetSponsored ? "Active" : "Inactive"}
                </div>
                <p className="text-sm text-gray-500">Widget Banner</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
