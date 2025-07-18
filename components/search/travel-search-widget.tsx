"use client"

import type React from "react"

import { useState } from "react"
import { Plane, MapPin, Calendar, Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TravelSearchWidget() {
  const [searchType, setSearchType] = useState("flights")
  const [quickSearch, setQuickSearch] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: "1",
    class: "economy",
    flexible: false,
  })

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (quickSearch.trim()) {
      // For quick search, open advanced popup
      setShowAdvanced(true)
    }
  }

  const handleAdvancedSearch = () => {
    const params = new URLSearchParams({
      type: searchType,
      ...searchParams,
      quick: quickSearch,
    })
    window.location.href = `/travel/results?${params.toString()}`
    setShowAdvanced(false)
  }

  const popularDestinations = [
    { code: "BKK", name: "Bangkok", flag: "🇹🇭" },
    { code: "SIN", name: "Singapore", flag: "🇸🇬" },
    { code: "HKG", name: "Hong Kong", flag: "🇭🇰" },
    { code: "KUL", name: "Kuala Lumpur", flag: "🇲🇾" },
    { code: "MNL", name: "Manila", flag: "🇵🇭" },
    { code: "ICN", name: "Seoul", flag: "🇰🇷" },
  ]

  const quickOptions = [
    { label: "Weekend Getaway", query: "weekend flights from pattaya" },
    { label: "Beach Hotels", query: "beach hotels pattaya jomtien" },
    { label: "Airport Transfer", query: "car rental pattaya airport" },
    { label: "Island Tours", query: "koh larn ferry packages" },
  ]

  return (
    <>
      <Card className="w-full h-16">
        <CardContent className="p-3 h-full">
          <form onSubmit={handleQuickSearch} className="flex items-center space-x-2 h-full">
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <Plane className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm text-gray-700 whitespace-nowrap">Travel</span>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1 py-0">
                Multi-API
              </Badge>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Flights, hotels, cars..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="pl-7 pr-20 h-8 text-sm bg-white border border-purple-200 focus:border-purple-400 rounded-md"
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <DialogTrigger asChild>
                    <Button type="button" size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-purple-100">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Button
                  type="submit"
                  size="sm"
                  className="h-6 px-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded text-xs"
                >
                  Go
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Advanced Search Dialog */}
      <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plane className="w-5 h-5 text-purple-600" />
              <span>Advanced Travel Search</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Options */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Quick Options</Label>
              <div className="grid grid-cols-2 gap-2">
                {quickOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickSearch(option.query)}
                    className="justify-start text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Type Tabs */}
            <Tabs value={searchType} onValueChange={setSearchType}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="flights" className="text-xs">
                  ✈️ Flights
                </TabsTrigger>
                <TabsTrigger value="hotels" className="text-xs">
                  🏨 Hotels
                </TabsTrigger>
                <TabsTrigger value="cars" className="text-xs">
                  🚗 Cars
                </TabsTrigger>
                <TabsTrigger value="packages" className="text-xs">
                  📦 Packages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flights" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">From</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Departure city"
                        value={searchParams.from}
                        onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">To</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Destination city"
                        value={searchParams.to}
                        onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Popular Destinations */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Popular Destinations</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {popularDestinations.map((dest) => (
                      <Button
                        key={dest.code}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchParams({ ...searchParams, to: dest.name })}
                        className="justify-start text-xs"
                      >
                        <span className="mr-1">{dest.flag}</span>
                        {dest.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Departure</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.departDate}
                        onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Return</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.returnDate}
                        onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Passengers</Label>
                    <Select
                      value={searchParams.passengers}
                      onValueChange={(value) => setSearchParams({ ...searchParams, passengers: value })}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Passenger</SelectItem>
                        <SelectItem value="2">2 Passengers</SelectItem>
                        <SelectItem value="3">3 Passengers</SelectItem>
                        <SelectItem value="4">4+ Passengers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Class</Label>
                    <Select
                      value={searchParams.class}
                      onValueChange={(value) => setSearchParams({ ...searchParams, class: value })}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="premium">Premium Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hotels" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="City or hotel name"
                        value={searchParams.to}
                        onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Guests</Label>
                    <Select
                      value={searchParams.passengers}
                      onValueChange={(value) => setSearchParams({ ...searchParams, passengers: value })}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Check-in</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.departDate}
                        onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Check-out</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.returnDate}
                        onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cars" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Pick-up Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Airport, city, or address"
                        value={searchParams.from}
                        onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Drop-off Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Same as pick-up"
                        value={searchParams.to}
                        onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Pick-up Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.departDate}
                        onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Drop-off Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="date"
                        value={searchParams.returnDate}
                        onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="packages" className="space-y-4">
                <div>
                  <Label className="text-sm">Package Type</Label>
                  <Select
                    value={searchParams.class}
                    onValueChange={(value) => setSearchParams({ ...searchParams, class: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight-hotel">Flight + Hotel</SelectItem>
                      <SelectItem value="flight-car">Flight + Car</SelectItem>
                      <SelectItem value="all-inclusive">All Inclusive</SelectItem>
                      <SelectItem value="cruise">Cruise Packages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Where do you want to go?"
                        value={searchParams.to}
                        onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                        className="pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Travelers</Label>
                    <Select
                      value={searchParams.passengers}
                      onValueChange={(value) => setSearchParams({ ...searchParams, passengers: value })}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Traveler</SelectItem>
                        <SelectItem value="2">2 Travelers</SelectItem>
                        <SelectItem value="3">3 Travelers</SelectItem>
                        <SelectItem value="4">4+ Travelers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Search Button */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAdvanced(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdvancedSearch}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Travel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
