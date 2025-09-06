"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar, MapPin, Clock, IndianRupee, Upload, X, Plus, Eye, Save, Send } from "lucide-react"
import Image from "next/image"

interface SpaceCost {
  type: string
  description: string
  pricePerSqm?: number
  minArea?: number
  pricePerUnit?: number
  unit?: string
  isFixed: boolean
}

interface EventFormData {
  // Basic Info
  title: string
  description: string
  eventType: string
  categories: string[]
  startDate: string
  endDate: string
  dailyStart: string
  dailyEnd: string
  timezone: string
  venue: string
  city: string
  address: string

  // Pricing
  currency: string
  generalPrice: number
  studentPrice: number
  vipPrice: number

  // Event Details
  highlights: string[]
  tags: string[]
  dressCode: string
  ageLimit: string
  featured: boolean
  vip: boolean

  // Space Costs
  spaceCosts: SpaceCost[]

  // Media
  images: string[]
  brochure: string
  layoutPlan: string

  // Features
  featuredHotels: Array<{
    name: string
    category: string
    rating: number
    image: string
  }>
  travelPartners: Array<{
    name: string
    category: string
    rating: number
    image: string
    description: string
  }>
  touristAttractions: Array<{
    name: string
    category: string
    rating: number
    image: string
    description: string
  }>
}

export default function CreateEvent() {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    eventType: "",
    categories: [],
    startDate: "",
    endDate: "",
    dailyStart: "09:00",
    dailyEnd: "18:00",
    timezone: "Asia/Kolkata",
    venue: "",
    city: "",
    address: "",
    currency: "₹",
    generalPrice: 0,
    studentPrice: 0,
    vipPrice: 0,
    highlights: [],
    tags: [],
    dressCode: "Business Casual",
    ageLimit: "18+",
    featured: false,
    vip: false,
    spaceCosts: [
      {
        type: "Shell Space (Standard Booth)",
        description: "Fully constructed booth with walls, flooring, basic lighting, and standard amenities",
        pricePerSqm: 5000,
        minArea: 9,
        isFixed: true,
      },
      {
        type: "Raw Space",
        description: "Open floor space without any construction or amenities",
        pricePerSqm: 2500,
        minArea: 20,
        isFixed: false,
      },
      {
        type: "2 Side Open Space",
        description: "Space with two sides open for better visibility and accessibility",
        pricePerSqm: 3500,
        minArea: 12,
        isFixed: true,
      },
      {
        type: "3 Side Open Space",
        description: "Premium corner space with three sides open for maximum exposure",
        pricePerSqm: 4200,
        minArea: 15,
        isFixed: true,
      },
      {
        type: "4 Side Open Space",
        description: "Island space with all four sides open for 360-degree visibility",
        pricePerSqm: 5500,
        minArea: 25,
        isFixed: true,
      },
      {
        type: "Mezzanine Charges",
        description: "Additional upper level space for storage or display purposes",
        pricePerSqm: 1500,
        minArea: 10,
        isFixed: true,
      },
      {
        type: "Additional Power",
        description: "Extra electrical power supply for high-consumption equipment",
        pricePerUnit: 800,
        unit: "KW",
        isFixed: true,
      },
      {
        type: "Compressed Air",
        description: "Compressed air supply for machinery demonstration (6 bar pressure)",
        pricePerUnit: 1200,
        unit: "HP",
        isFixed: true,
      },
    ],
    images: [],
    brochure: "",
    layoutPlan: "",
    featuredHotels: [],
    travelPartners: [],
    touristAttractions: [],
  })

  const [newHighlight, setNewHighlight] = useState("")
  const [newTag, setNewTag] = useState("")

  const eventTypes = [
    "Conference",
    "Trade Show",
    "Exhibition",
    "Workshop",
    "Seminar",
    "Networking Event",
    "Product Launch",
    "Corporate Event",
  ]

  const eventCategories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Automotive",
    "Fashion",
    "Food & Beverage",
    "Real Estate",
    "Energy",
  ]

  const currencies = ["₹", "$", "€", "£", "¥"]

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }))
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const addCustomSpaceCost = () => {
    setFormData((prev) => ({
      ...prev,
      spaceCosts: [
        ...prev.spaceCosts,
        {
          type: "",
          description: "",
          pricePerSqm: 0,
          minArea: 0,
          isFixed: false,
        },
      ],
    }))
  }

  const updateSpaceCost = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      spaceCosts: prev.spaceCosts.map((cost, i) => (i === index ? { ...cost, [field]: value } : cost)),
    }))
  }

  const removeSpaceCost = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      spaceCosts: prev.spaceCosts.filter((_, i) => i !== index),
    }))
  }

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData)
    // Implement draft saving logic
  }

  const handlePublishEvent = () => {
    console.log("Publishing event:", formData)
    // Implement event publishing logic
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <p className="text-gray-600">Fill in the details to create your event</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handlePublishEvent}>
            <Send className="w-4 h-4 mr-2" />
            Publish Event
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Space</TabsTrigger>
          <TabsTrigger value="media">Media & Content</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, eventType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Event Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {eventCategories.map((category) => (
                      <Badge
                        key={category}
                        variant={formData.categories.includes(category) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Event Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your event"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Event Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="dailyStart">Daily Start Time</Label>
                  <Input
                    id="dailyStart"
                    type="time"
                    value={formData.dailyStart}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dailyStart: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="dailyEnd">Daily End Time</Label>
                  <Input
                    id="dailyEnd"
                    type="time"
                    value={formData.dailyEnd}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dailyEnd: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venue">Venue Name *</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData((prev) => ({ ...prev, venue: e.target.value }))}
                    placeholder="Enter venue name"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter complete address"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add event highlight"
                  onKeyPress={(e) => e.key === "Enter" && addHighlight()}
                />
                <Button onClick={addHighlight}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {highlight}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeHighlight(index)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Tags & Keywords</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add event tag"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    #{tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(index)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dressCode">Dress Code</Label>
                  <Select
                    value={formData.dressCode}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, dressCode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Business Casual">Business Casual</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Black Tie">Black Tie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ageLimit">Age Limit</Label>
                  <Select
                    value={formData.ageLimit}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, ageLimit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Ages">All Ages</SelectItem>
                      <SelectItem value="18+">18+</SelectItem>
                      <SelectItem value="21+">21+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured Event</Label>
                  <p className="text-sm text-gray-600">Mark this event as featured</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>VIP Event</Label>
                  <p className="text-sm text-gray-600">Mark this as a VIP event</p>
                </div>
                <Switch
                  checked={formData.vip}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, vip: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing & Space Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Ticket Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="generalPrice">General Entry</Label>
                  <Input
                    id="generalPrice"
                    type="number"
                    value={formData.generalPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, generalPrice: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="studentPrice">Student Price</Label>
                  <Input
                    id="studentPrice"
                    type="number"
                    value={formData.studentPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, studentPrice: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="vipPrice">VIP Price</Label>
                  <Input
                    id="vipPrice"
                    type="number"
                    value={formData.vipPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vipPrice: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exhibitor Space Costs</CardTitle>
              <p className="text-sm text-gray-600">
                Configure pricing for different types of exhibition spaces and services
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {formData.spaceCosts.map((cost, index) => (
                  <div key={index} className="p-6 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">{cost.type}</h4>
                        {cost.isFixed && (
                          <Badge variant="secondary" className="text-xs">
                            Standard
                          </Badge>
                        )}
                      </div>
                      {!cost.isFixed && (
                        <Button variant="outline" size="sm" onClick={() => removeSpaceCost(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Description</Label>
                        <p className="text-sm text-gray-600 mt-1 p-3 bg-white rounded border">{cost.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {cost.isFixed && cost.type !== "Shell Space (Standard Booth)" ? (
                          <>
                            <div>
                              <Label className="text-sm font-medium">Space Type</Label>
                              <Input
                                value={cost.type}
                                onChange={(e) => updateSpaceCost(index, "type", e.target.value)}
                                placeholder="Enter space type"
                                disabled={cost.isFixed}
                                className="bg-gray-100"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                {cost.unit ? `Price per ${cost.unit}` : "Price per sq.m"}
                              </Label>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{formData.currency}</span>
                                <Input
                                  type="number"
                                  value={cost.pricePerSqm || cost.pricePerUnit || 0}
                                  onChange={(e) =>
                                    updateSpaceCost(
                                      index,
                                      cost.unit ? "pricePerUnit" : "pricePerSqm",
                                      Number(e.target.value),
                                    )
                                  }
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            {!cost.unit && (
                              <div>
                                <Label className="text-sm font-medium">Minimum Area (sq.m)</Label>
                                <Input
                                  type="number"
                                  value={cost.minArea || 0}
                                  onChange={(e) => updateSpaceCost(index, "minArea", Number(e.target.value))}
                                  placeholder="0"
                                />
                              </div>
                            )}
                          </>
                        ) : cost.isFixed ? (
                          <>
                            <div>
                              <Label className="text-sm font-medium">Price per sq.m</Label>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{formData.currency}</span>
                                <Input
                                  type="number"
                                  value={cost.pricePerSqm || 0}
                                  onChange={(e) => updateSpaceCost(index, "pricePerSqm", Number(e.target.value))}
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Minimum Area (sq.m)</Label>
                              <Input
                                type="number"
                                value={cost.minArea || 0}
                                onChange={(e) => updateSpaceCost(index, "minArea", Number(e.target.value))}
                                placeholder="0"
                              />
                            </div>
                            <div className="flex items-end">
                              <div className="text-sm">
                                <span className="text-gray-600">Total from: </span>
                                <span className="font-semibold text-lg">
                                  {formData.currency}
                                  {((cost.pricePerSqm || 0) * (cost.minArea || 0)).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <Label className="text-sm font-medium">Space Type</Label>
                              <Input
                                value={cost.type}
                                onChange={(e) => updateSpaceCost(index, "type", e.target.value)}
                                placeholder="Enter space type"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Price per sq.m</Label>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{formData.currency}</span>
                                <Input
                                  type="number"
                                  value={cost.pricePerSqm || 0}
                                  onChange={(e) => updateSpaceCost(index, "pricePerSqm", Number(e.target.value))}
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Minimum Area (sq.m)</Label>
                              <Input
                                type="number"
                                value={cost.minArea || 0}
                                onChange={(e) => updateSpaceCost(index, "minArea", Number(e.target.value))}
                                placeholder="0"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Label className="text-sm font-medium">Description</Label>
                              <Textarea
                                value={cost.description}
                                onChange={(e) => updateSpaceCost(index, "description", e.target.value)}
                                placeholder="Describe this space type"
                                rows={2}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {cost.unit && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                          <span className="text-sm text-blue-800">Service pricing per {cost.unit}</span>
                          <span className="font-semibold text-blue-900">
                            {formData.currency}
                            {(cost.pricePerUnit || 0).toLocaleString()} per {cost.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" onClick={addCustomSpaceCost} className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Space Type
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media & Content Tab */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Event Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
                <Button variant="outline">Choose Images</Button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Event image ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Event Brochure</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={formData.brochure}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brochure: e.target.value }))}
                    placeholder="Upload brochure"
                    readOnly
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Layout Plan</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={formData.layoutPlan}
                    onChange={(e) => setFormData((prev) => ({ ...prev, layoutPlan: e.target.value }))}
                    placeholder="Upload layout plan"
                    readOnly
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Hotels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Add recommended hotels for attendees</p>
                <Button variant="outline" className="mt-2 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Hotel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Add travel and transportation partners</p>
                <Button variant="outline" className="mt-2 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tourist Attractions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Add local attractions and places to visit</p>
                <Button variant="outline" className="mt-2 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Attraction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Event Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900">{formData.title || "Event Title"}</h3>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formData.startDate || "Start Date"} - {formData.endDate || "End Date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {formData.venue || "Venue"}, {formData.city || "City"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-gray-700">{formData.description || "Event description will appear here..."}</p>

                  {formData.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Event Highlights:</h4>
                      <div className="space-y-1">
                        {formData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">General Entry</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {formData.currency}
                        {formData.generalPrice || 0}
                      </p>
                    </div>

                    {formData.studentPrice > 0 && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Student Price</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {formData.currency}
                          {formData.studentPrice}
                        </p>
                      </div>
                    )}

                    {formData.vipPrice > 0 && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">VIP Price</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {formData.currency}
                          {formData.vipPrice}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Space Costs Preview */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Exhibition Space Pricing</h4>
                    <div className="grid gap-3">
                      {formData.spaceCosts.map((cost, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">{cost.type}</h5>
                            <p className="text-sm text-gray-600">{cost.description}</p>
                          </div>
                          <div className="text-right">
                            {cost.unit ? (
                              <p className="font-semibold text-blue-600">
                                {formData.currency}
                                {(cost.pricePerUnit || 0).toLocaleString()} per {cost.unit}
                              </p>
                            ) : (
                              <>
                                <p className="font-semibold text-blue-600">
                                  {formData.currency}
                                  {(cost.pricePerSqm || 0).toLocaleString()} per sq.m
                                </p>
                                <p className="text-sm text-gray-500">Min: {cost.minArea || 0} sq.m</p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
