"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, DollarSign, TrendingUp, Users, Eye, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface BusinessDeal {
  id: string
  title: string
  description: string
  originalPrice: number
  salePrice: number
  discountPercent: number
  category: string
  startDate: string
  endDate: string
  isActive: boolean
  isGrouponListed: boolean
  maxQuantity?: number
  soldQuantity: number
  images: string[]
  terms: string
  businessId: string
  grouponCommission: number
  totalRevenue: number
  views: number
  clicks: number
  conversions: number
}

export function DealsManagement() {
  const [deals, setDeals] = useState<BusinessDeal[]>([])
  const [editingDeal, setEditingDeal] = useState<BusinessDeal | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      // Mock data for demonstration
      const mockDeals: BusinessDeal[] = [
        {
          id: "1",
          title: "50% Off Traditional Thai Massage",
          description:
            "Relax and rejuvenate with an authentic Thai massage experience. Includes aromatherapy oils and herbal compress treatment.",
          originalPrice: 1000,
          salePrice: 500,
          discountPercent: 50,
          category: "Health & Beauty",
          startDate: "2024-01-15",
          endDate: "2024-02-15",
          isActive: true,
          isGrouponListed: true,
          maxQuantity: 100,
          soldQuantity: 67,
          images: ["/placeholder.svg?height=200&width=300&text=Thai+Massage"],
          terms: "Valid for new customers only. Must be used within 30 days of purchase.",
          businessId: "business-1",
          grouponCommission: 30,
          totalRevenue: 23450,
          views: 1234,
          clicks: 234,
          conversions: 67,
        },
        {
          id: "2",
          title: "Buy 1 Get 1 Free Seafood Buffet",
          description:
            "All-you-can-eat seafood buffet featuring fresh lobster, crab, prawns, and local Thai specialties.",
          originalPrice: 1798,
          salePrice: 899,
          discountPercent: 50,
          category: "Food & Drink",
          startDate: "2024-01-10",
          endDate: "2024-01-31",
          isActive: true,
          isGrouponListed: false,
          maxQuantity: 200,
          soldQuantity: 89,
          images: ["/placeholder.svg?height=200&width=300&text=Seafood+Buffet"],
          terms: "Valid for dinner service only. Advance reservation required.",
          businessId: "business-1",
          grouponCommission: 0,
          totalRevenue: 80011,
          views: 2156,
          clicks: 445,
          conversions: 89,
        },
      ]

      setDeals(mockDeals)
    } catch (error) {
      console.error("Failed to load deals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDeal = () => {
    const newDeal: BusinessDeal = {
      id: Date.now().toString(),
      title: "",
      description: "",
      originalPrice: 0,
      salePrice: 0,
      discountPercent: 0,
      category: "",
      startDate: "",
      endDate: "",
      isActive: false,
      isGrouponListed: false,
      soldQuantity: 0,
      images: [],
      terms: "",
      businessId: "business-1",
      grouponCommission: 30,
      totalRevenue: 0,
      views: 0,
      clicks: 0,
      conversions: 0,
    }
    setEditingDeal(newDeal)
    setShowCreateForm(true)
  }

  const handleSaveDeal = async (deal: BusinessDeal) => {
    try {
      if (deal.id === editingDeal?.id) {
        // Update existing deal
        setDeals((prev) => prev.map((d) => (d.id === deal.id ? deal : d)))
      } else {
        // Create new deal
        setDeals((prev) => [...prev, deal])
      }

      setEditingDeal(null)
      setShowCreateForm(false)
    } catch (error) {
      console.error("Failed to save deal:", error)
    }
  }

  const handleDeleteDeal = async (dealId: string) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      setDeals((prev) => prev.filter((d) => d.id !== dealId))
    }
  }

  const handleToggleGroupon = async (dealId: string, enabled: boolean) => {
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, isGrouponListed: enabled } : d)))
  }

  const calculateMetrics = () => {
    const totalRevenue = deals.reduce((sum, deal) => sum + deal.totalRevenue, 0)
    const totalSold = deals.reduce((sum, deal) => sum + deal.soldQuantity, 0)
    const totalViews = deals.reduce((sum, deal) => sum + deal.views, 0)
    const avgConversionRate =
      deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.conversions / deal.views) * 100, 0) / deals.length : 0

    return { totalRevenue, totalSold, totalViews, avgConversionRate }
  }

  const metrics = calculateMetrics()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Deals Management</h2>
          <p className="text-gray-600">Create and manage your promotional deals</p>
        </div>
        <Button onClick={handleCreateDeal}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Deal
        </Button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold">฿{metrics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Sold</p>
                <p className="text-xl font-bold">{metrics.totalSold}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-xl font-bold">{metrics.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Conversion</p>
                <p className="text-xl font-bold">{metrics.avgConversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals List */}
      <div className="grid gap-4">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{deal.title}</h3>
                    <Badge variant={deal.isActive ? "default" : "secondary"}>
                      {deal.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {deal.isGrouponListed && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        Groupon Listed
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{deal.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-green-600">฿{deal.salePrice}</span>
                        <span className="text-gray-500 line-through">฿{deal.originalPrice}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Sold</p>
                      <p className="font-medium">
                        {deal.soldQuantity}/{deal.maxQuantity || "∞"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-medium">฿{deal.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Conversion</p>
                      <p className="font-medium">{((deal.conversions / deal.views) * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={deal.isGrouponListed}
                        onCheckedChange={(checked) => handleToggleGroupon(deal.id, checked)}
                      />
                      <Label className="text-sm">List on Groupon</Label>
                    </div>
                    <div className="text-xs text-gray-500">
                      Valid: {new Date(deal.startDate).toLocaleDateString()} -{" "}
                      {new Date(deal.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingDeal(deal)
                      setShowCreateForm(true)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteDeal(deal.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Deal Modal */}
      {showCreateForm && editingDeal && (
        <DealFormModal
          deal={editingDeal}
          onSave={handleSaveDeal}
          onCancel={() => {
            setShowCreateForm(false)
            setEditingDeal(null)
          }}
        />
      )}
    </div>
  )
}

function DealFormModal({
  deal,
  onSave,
  onCancel,
}: {
  deal: BusinessDeal
  onSave: (deal: BusinessDeal) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(deal)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate discount percentage
    const discountPercent = Math.round(((formData.originalPrice - formData.salePrice) / formData.originalPrice) * 100)

    onSave({
      ...formData,
      discountPercent,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{deal.id ? "Edit Deal" : "Create New Deal"}</h3>
          <Button variant="ghost" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Deal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
                  <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                  <SelectItem value="Travel & Tourism">Travel & Tourism</SelectItem>
                  <SelectItem value="Sports & Recreation">Sports & Recreation</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="originalPrice">Original Price (฿)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="salePrice">Sale Price (฿)</Label>
              <Input
                id="salePrice"
                type="number"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="maxQuantity">Max Quantity</Label>
              <Input
                id="maxQuantity"
                type="number"
                value={formData.maxQuantity || ""}
                onChange={(e) => setFormData({ ...formData, maxQuantity: Number(e.target.value) || undefined })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isGrouponListed}
                onCheckedChange={(checked) => setFormData({ ...formData, isGrouponListed: checked })}
              />
              <Label>List on Groupon</Label>
            </div>
          </div>

          {formData.isGrouponListed && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Groupon Integration</h4>
              <p className="text-sm text-orange-700 mb-2">Commission: {formData.grouponCommission}% of sale price</p>
              <p className="text-sm text-orange-600">
                Your earnings per sale: ฿{((formData.salePrice * (100 - formData.grouponCommission)) / 100).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save Deal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
