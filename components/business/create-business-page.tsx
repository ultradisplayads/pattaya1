"use client"

import { useState } from "react"
import { Building2, Upload, Save, ArrowLeft, ArrowRight, Check, Camera, MapPin, Phone, Globe, Clock, Wifi, Car, Truck, Music, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateBusinessPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categories: [],
    address: [{
      address: "",
      city: "",
      state: "",
      country: "Thailand",
      postalCode: "",
      latitutde: null,
      longitude: null,
      formattedAddress: ""
    }],
    contact: [{
      phone: "",
      email: "",
      website: "",
      lineId: "",
      whatsapp: ""
    }],
    hours: [{
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: ""
    }],
    amenities: [{
      wifi: false,
      parking: false,
      airConditioning: false,
      wheelchairAccessible: false,
      creditCardsAccepted: false,
      customAmenities: []
    }],
    images: [],
    logo: null,
    coverImage: null,
    rating: 0,
    reviewCount: 0,
    priceRange: "",
    tags: [{
      tags: []
    }],
    featured: false,
    verified: false,
    socialMedia: [{
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      line: ""
    }],
    seo: [{
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: null
    }]
  })

  const [loading, setLoading] = useState(false)

  const steps = [
    { id: 1, title: "Basic Info", icon: Building2 },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Photos", icon: Camera },
    { id: 4, title: "Features", icon: Wifi },
    { id: 5, title: "Social", icon: Globe },
    { id: 6, title: "Review", icon: Check }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Create business with owner
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Business created successfully:", result)
        // Redirect to dashboard or show success message
        // You can add navigation here
      } else {
        const error = await response.json()
        console.error("Failed to create business:", error)
      }
    } catch (error) {
      console.error("Failed to create business:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.categories.length > 0
      case 2:
        return formData.address[0]?.address && formData.contact[0]?.phone && formData.contact[0]?.email
      case 3:
        return true // Photos are optional
      case 4:
        return true // Amenities are optional
      case 5:
        return true // Social media is optional
      case 6:
        return true // Review step
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-light">
      {/* Apple-style Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center space-x-8">
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Help
              </button>
              <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full transition-all duration-200">
                Preview
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-12 px-6">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4 text-gray-900">
          Create your
        </h1>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          business profile
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
          Join thousands of businesses connecting with customers on Pattaya1.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between w-full">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center w-full">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      ) : (
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      )}
                    </div>
                    <span className={`mt-1 sm:mt-2 text-xs font-light text-center px-1 ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 sm:mx-2 md:mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step Content */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 shadow-sm min-h-[400px]">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light mb-6 tracking-tight text-gray-900">Basic Information</h2>
                
                <div>
                  <label className="block text-gray-600 text-sm font-light mb-2">Business Name *</label>
                  <input
                    required
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter your business name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-light mb-2">Categories *</label>
                  <select
                    required
                    multiple
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    value={formData.categories}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                      setFormData({ ...formData, categories: selectedOptions })
                    }}
                  >
                    <option value="">Select categories</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="bar">Bar & Nightlife</option>
                    <option value="hotel">Hotel & Accommodation</option>
                    <option value="spa">Spa & Wellness</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="services">Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-light mb-2">Description</label>
                  <textarea
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none h-24"
                    placeholder="Tell customers about your business..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-light mb-2">Price Range</label>
                  <select
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  >
                    <option value="">Select price range</option>
                    <option value="cheap">Cheap (Budget-friendly)</option>
                    <option value="mid">Mid (Moderate)</option>
                    <option value="good">Good (Quality)</option>
                    <option value="premium">Premium (High-end)</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light mb-6 tracking-tight text-gray-900">Location & Contact</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Address *</label>
                    <input
                      required
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Enter your business address"
                      value={formData.address[0]?.address}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: [{ ...formData.address[0], address: e.target.value }]
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">City</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="City"
                      value={formData.address[0]?.city}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: [{ ...formData.address[0], city: e.target.value }]
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">State/Province</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="State or Province"
                      value={formData.address[0]?.state}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: [{ ...formData.address[0], state: e.target.value }]
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Postal Code</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Postal Code"
                      value={formData.address[0]?.postalCode}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: [{ ...formData.address[0], postalCode: e.target.value }]
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Phone Number *</label>
                    <input
                      required
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="+66 38 123 4567"
                      value={formData.contact[0]?.phone}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        contact: [{ ...formData.contact[0], phone: e.target.value }]
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="business@example.com"
                      value={formData.contact[0]?.email}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        contact: [{ ...formData.contact[0], email: e.target.value }]
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Website</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="https://your-website.com"
                      value={formData.contact[0]?.website}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        contact: [{ ...formData.contact[0], website: e.target.value }]
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Line ID</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Your Line ID"
                      value={formData.contact[0]?.lineId}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        contact: [{ ...formData.contact[0], lineId: e.target.value }]
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light mb-6 tracking-tight text-gray-900">Photos & Media</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-gray-400 transition-all duration-300">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-light text-gray-700 mb-2">Business Photos</h3>
                    <p className="text-sm text-gray-500 mb-6">Upload photos of your business</p>
                    <button type="button" className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-6 py-2 rounded-full font-light transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      Choose Files
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-gray-400 transition-all duration-300">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-light text-gray-700 mb-2">Logo</h3>
                    <p className="text-sm text-gray-500 mb-6">Upload your business logo</p>
                    <button type="button" className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-6 py-2 rounded-full font-light transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      Choose Logo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light mb-6 tracking-tight text-gray-900">Amenities & Features</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.entries(formData.amenities[0] || {}).map(([key, value]) => {
                    if (key === 'customAmenities') return null // Skip custom amenities for now
                    
                    return (
                      <div key={key} className="flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl">
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setFormData({
                              ...formData,
                              amenities: [{ ...formData.amenities[0], [key]: checked }]
                            })
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <label className="text-sm text-gray-700 font-light capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </label>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-light mb-4 text-gray-900">Business Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day}>
                        <label className="block text-gray-600 text-sm font-light mb-2 capitalize">{day}</label>
                        <input
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          placeholder="e.g., 9:00 AM - 10:00 PM"
                          value={formData.hours[0]?.[day] || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            hours: [{ ...formData.hours[0], [day]: e.target.value }]
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light mb-6 tracking-tight text-gray-900">Social Media</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Facebook</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="https://facebook.com/yourpage"
                      value={formData.socialMedia[0]?.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: [{ ...formData.socialMedia[0], facebook: e.target.value }]
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Instagram</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="https://instagram.com/yourpage"
                      value={formData.socialMedia[0]?.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: [{ ...formData.socialMedia[0], instagram: e.target.value }]
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Twitter</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="https://twitter.com/yourpage"
                      value={formData.socialMedia[0]?.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: [{ ...formData.socialMedia[0], twitter: e.target.value }]
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">YouTube</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="https://youtube.com/yourchannel"
                      value={formData.socialMedia[0]?.youtube}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: [{ ...formData.socialMedia[0], youtube: e.target.value }]
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-light mb-2">Line</label>
                    <input
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Your Line account"
                      value={formData.socialMedia[0]?.line}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: [{ ...formData.socialMedia[0], line: e.target.value }]
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light mb-6 tracking-tight text-gray-900">Review & Submit</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-light text-gray-900">Basic Information</h3>
                      <div className="bg-gray-50/50 rounded-xl p-4">
                        <p className="text-sm text-gray-600">Name: <span className="text-gray-900 font-light">{formData.name || 'Not provided'}</span></p>
                        <p className="text-sm text-gray-600">Categories: <span className="text-gray-900 font-light">{formData.categories.length > 0 ? formData.categories.join(', ') : 'Not selected'}</span></p>
                        <p className="text-sm text-gray-600">Price Range: <span className="text-gray-900 font-light">{formData.priceRange || 'Not selected'}</span></p>
                        <p className="text-sm text-gray-600">Description: <span className="text-gray-900 font-light">{formData.description || 'Not provided'}</span></p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-light text-gray-900">Contact Information</h3>
                      <div className="bg-gray-50/50 rounded-xl p-4">
                        <p className="text-sm text-gray-600">Phone: <span className="text-gray-900 font-light">{formData.contact[0]?.phone || 'Not provided'}</span></p>
                        <p className="text-sm text-gray-600">Email: <span className="text-gray-900 font-light">{formData.contact[0]?.email || 'Not provided'}</span></p>
                        <p className="text-sm text-gray-600">Website: <span className="text-gray-900 font-light">{formData.contact[0]?.website || 'Not provided'}</span></p>
                        <p className="text-sm text-gray-600">Line ID: <span className="text-gray-900 font-light">{formData.contact[0]?.lineId || 'Not provided'}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-light text-gray-900">Location</h3>
                    <div className="bg-gray-50/50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Address: <span className="text-gray-900 font-light">{formData.address[0]?.address || 'Not provided'}</span></p>
                      <p className="text-sm text-gray-600">City: <span className="text-gray-900 font-light">{formData.address[0]?.city || 'Not provided'}</span></p>
                      <p className="text-sm text-gray-600">State: <span className="text-gray-900 font-light">{formData.address[0]?.state || 'Not provided'}</span></p>
                      <p className="text-sm text-gray-600">Postal Code: <span className="text-gray-900 font-light">{formData.address[0]?.postalCode || 'Not provided'}</span></p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-light text-gray-900">Amenities</h3>
                    <div className="bg-gray-50/50 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(formData.amenities[0] || {}).map(([key, value]) => {
                          if (key === 'customAmenities') return null
                          return value && (
                            <span key={key} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-light">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                          )
                        })}
                        {Object.entries(formData.amenities[0] || {}).every(([key, value]) => key === 'customAmenities' || !value) && (
                          <span className="text-gray-500 text-sm">No amenities selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Save as Draft
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-full font-light tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Business</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 