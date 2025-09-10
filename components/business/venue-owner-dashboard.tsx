"use client"

import { useState, useEffect } from "react"
import { Building2, Calendar, Percent, CreditCard, BarChart3, Upload, Clock, Bell, Save, Eye, Monitor, Download } from "lucide-react"
import { widgetTracker, getCurrentWidgetPositions, exportWidgetLayout } from "@/lib/widget-tracker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function VenueOwnerDashboard() {
  const [businessData, setBusinessData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    loadBusinessData()
    
    // Initialize widget tracker for dashboard monitoring
    widgetTracker.initializeGrid({
      totalRows: 20,
      totalColumns: 12,
      gridWidth: 1200,
      gridHeight: 1000,
      rowHeight: 50,
      margin: [8, 8],
      containerPadding: [8, 8]
    });
  }, [])

  const loadBusinessData = async () => {
    try {
      // Get user's businesses using owner filter
      const response = await fetch("/api/businesses?filters[owner][$eq]=me&populate=*", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBusinessData(data.data || [])
      } else {
        console.error("Failed to load business data:", response.status)
      }
    } catch (error) {
      console.error("Failed to load business data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-light text-gray-800">Loading Dashboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-light">
      {/* Apple-style Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-normal tracking-tight text-gray-900">Business Dashboard</div>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Support
              </button>
              <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full transition-all duration-200">
                View Public Page
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4 text-gray-900">
          Manage your
        </h1>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Pattaya1 presence
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-light">
          Everything you need to connect with customers and grow your business.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          {/* Apple-style Tab Navigation */}
          <div className="flex justify-center">
            <TabsList className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-full p-1 inline-flex shadow-sm">
              <TabsTrigger 
                value="profile" 
                className="rounded-full px-6 py-2 text-sm font-light data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 transition-all duration-200"
              >
                My Profile
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="rounded-full px-6 py-2 text-sm font-light data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 transition-all duration-200"
              >
                My Events
              </TabsTrigger>
              <TabsTrigger 
                value="deals" 
                className="rounded-full px-6 py-2 text-sm font-light data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 transition-all duration-200"
              >
                My Deals
              </TabsTrigger>
              <TabsTrigger 
                value="subscription" 
                className="rounded-full px-6 py-2 text-sm font-light data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 transition-all duration-200"
              >
                Subscription
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="rounded-full px-6 py-2 text-sm font-light data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 transition-all duration-200"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-12">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="events" className="space-y-12">
            <EventsTab />
          </TabsContent>

          <TabsContent value="deals" className="space-y-12">
            <DealsTab />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-12">
            <SubscriptionTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-12">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProfileTab() {
  const [formData, setFormData] = useState({
    name: "Ocean View Restaurant",
    description: "Authentic Thai cuisine with stunning ocean views",
    address: "123 Beach Road, Pattaya",
    phone: "+66 38 123 4567",
    website: "https://oceanview-pattaya.com",
    hours: "10:00 AM - 11:00 PM",
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Business Information Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 shadow-sm">
        <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">Business Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 text-sm font-light mb-2">Business Name</label>
            <input
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-light mb-2">Description</label>
            <textarea
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none h-24"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-light mb-2">Address</label>
            <input
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-light mb-2">Phone</label>
              <input
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-light mb-2">Website</label>
              <input
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            Save Changes
          </button>
        </div>
      </div>

      {/* Photos & Media Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 shadow-sm">
        <h2 className="text-2xl font-light mb-8 tracking-tight text-gray-900">Photos & Media</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-gray-400 transition-all duration-300">
          <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-lg font-light text-gray-700 mb-2">Upload photos of your business</h3>
          <p className="text-sm text-gray-500 mb-8">PNG, JPG up to 10MB each</p>
          <button className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-8 py-3 rounded-full font-light transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            Choose Files
          </button>
        </div>
      </div>
    </div>
  )
}

function EventsTab() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Live Jazz Night",
      date: "2024-01-15",
      time: "8:00 PM",
      description: "Enjoy live jazz music with dinner",
      proximityEnabled: true,
      status: "active",
    },
    {
      id: 2,
      title: "Thai Cooking Class",
      date: "2024-01-20",
      time: "2:00 PM",
      description: "Learn to cook authentic Thai dishes",
      proximityEnabled: false,
      status: "draft",
    },
  ])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-light tracking-tight text-gray-900">My Events</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          Create New Event
        </button>
      </div>

      <div className="space-y-6">
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 shadow-sm"
            style={{animationDelay: `${index * 100}ms`}}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h3 className="text-xl font-light tracking-tight text-gray-900">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-light ${
                    event.status === "active" 
                      ? "bg-green-100 text-green-700 border border-green-200" 
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}>
                    {event.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-6 font-light">{event.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    checked={event.proximityEnabled}
                    onCheckedChange={(checked) => {
                      setEvents(events.map((e) => (e.id === event.id ? { ...e, proximityEnabled: checked } : e)))
                    }}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <label className="text-sm text-gray-600 font-light flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Enable Proximity Push Notifications
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 ml-8">
                <button className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-light transition-all duration-200">
                  Edit
                </button>
                <button className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-full text-sm font-light transition-all duration-200">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DealsTab() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-light tracking-tight text-gray-900">My Deals & Offers</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          Create New Deal
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
        <Percent className="h-20 w-20 text-gray-300 mx-auto mb-8" />
        <h3 className="text-2xl font-light text-gray-700 mb-4 tracking-tight">No deals created yet</h3>
        <p className="text-gray-500 mb-8 font-light">Create your first deal to attract more customers</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          Get Started
        </button>
      </div>
    </div>
  )
}

function SubscriptionTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-light tracking-tight text-gray-900">Subscription Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Plan Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 shadow-sm">
          <h3 className="text-xl font-light mb-6 tracking-tight text-gray-900">Current Plan</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-light text-lg text-gray-900">Premium Plan</span>
              <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                Active
              </span>
            </div>
            <div className="text-3xl font-light tracking-tight text-gray-900">฿2,500<span className="text-lg text-gray-500">/month</span></div>
            <div className="text-sm text-gray-500 font-light">Next billing date: January 15, 2024</div>
            <button className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 py-4 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              Manage Billing
            </button>
          </div>
        </div>

        {/* Plan Features Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 shadow-sm">
          <h3 className="text-xl font-light mb-6 tracking-tight text-gray-900">Plan Features</h3>
          
          <div className="space-y-4">
            {[
              "Unlimited events",
              "Push notifications", 
              "Priority support",
              "Analytics dashboard"
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-light">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-light tracking-tight text-gray-900">Analytics Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Page Views", value: "1,234", change: "+12%" },
          { title: "Profile Clicks", value: "456", change: "+8%" },
          { title: "Event Views", value: "789", change: "-3%" }
        ].map((stat, index) => (
          <div 
            key={index}
            className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 hover:bg-white/90 transition-all duration-300 shadow-sm"
            style={{animationDelay: `${index * 100}ms`}}
          >
            <h3 className="text-sm font-light text-gray-600 mb-2 tracking-wide">{stat.title}</h3>
            <div className="text-2xl font-light tracking-tight text-gray-900 mb-1">{stat.value}</div>
            <p className={`text-xs font-light ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
        <BarChart3 className="h-20 w-20 text-gray-300 mx-auto mb-8" />
        <h3 className="text-2xl font-light text-gray-700 mb-4 tracking-tight">Advanced Analytics</h3>
        <p className="text-gray-500 font-light">Detailed insights and reporting will be available soon</p>
      </div>
    </div>
  )
}
