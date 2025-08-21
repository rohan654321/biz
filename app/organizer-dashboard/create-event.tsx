"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  X,
  Upload,
  MapPin,
  IndianRupee,
  Star,
  Calendar,
  Building,
  Camera,
  FileText,
  Layout,
  Hotel,
  Plane,
} from "lucide-react"

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    // Basic Information
    title: "",
    description: "",
    eventType: "",
    categories: [] as string[],

    // Timing
    startDate: "",
    endDate: "",
    dailyStart: "10:00",
    dailyEnd: "18:00",
    timezone: "Asia/Kolkata",

    // Location
    venue: "",
    city: "",
    address: "",

    // Pricing
    currency: "₹",
    generalPrice: 0,
    studentPrice: 0,
    vipPrice: 0,

    // Event Details
    highlights: [] as string[],
    tags: [] as string[],
    dressCode: "Business Casual",
    ageLimit: "All Ages Welcome",

    // Features
    featured: false,
    vip: false,

    // Images
    images: [] as string[],

    // Exhibitor Space Costs
    exhibitSpaceCosts: [
      { type: "Standard Booth", description: "Basic booth space", minArea: 9, pricePerSqm: 5000 },
      { type: "Premium Booth", description: "Enhanced booth with premium location", minArea: 12, pricePerSqm: 7500 },
      { type: "Corner Booth", description: "Corner location with extra visibility", minArea: 9, pricePerSqm: 6000 },
    ],

    // Additional Content
    brochureUrl: "",
    layoutPlanUrl: "",

    // Featured Items
    featuredHotels: [] as Array<{ name: string; category: string; rating: number }>,
    travelPartners: [] as Array<{ name: string; category: string; rating: number }>,
    touristAttractions: [] as Array<{ name: string; description: string; category: string; rating: number }>,
  })

  const [currentHighlight, setCurrentHighlight] = useState("")
  const [currentTag, setCurrentTag] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  const availableCategories = [
    "Exhibition",
    "Conference",
    "Workshop",
    "Seminar",
    "Trade Show",
    "Manufacturing",
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
  ]

  const addHighlight = () => {
    if (currentHighlight.trim()) {
      setEventData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, currentHighlight.trim()],
      }))
      setCurrentHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (currentTag.trim()) {
      setEventData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const toggleCategory = (category: string) => {
    setEventData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const updateSpaceCost = (index: number, field: string, value: any) => {
    setEventData((prev) => ({
      ...prev,
      exhibitSpaceCosts: prev.exhibitSpaceCosts.map((cost, i) => (i === index ? { ...cost, [field]: value } : cost)),
    }))
  }

  const addSpaceCost = () => {
    setEventData((prev) => ({
      ...prev,
      exhibitSpaceCosts: [
        ...prev.exhibitSpaceCosts,
        {
          type: "Custom Booth",
          description: "Custom booth space",
          minArea: 9,
          pricePerSqm: 5000,
        },
      ],
    }))
  }

  const removeSpaceCost = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      exhibitSpaceCosts: prev.exhibitSpaceCosts.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-transparent">
            <FileText className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Publish Event
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Space</TabsTrigger>
          <TabsTrigger value="media">Media & Content</TabsTrigger>
          {/* <TabsTrigger value="features">Features</TabsTrigger> */}
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Basic Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title *</Label>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={eventData.title}
                    onChange={(e) => setEventData((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-type">Event  Categories *</Label>
                  <Select
                    value={eventData.eventType}
                    onValueChange={(value) => setEventData((prev) => ({ ...prev, eventType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exhibition">Education</SelectItem>
                      <SelectItem value="conference">Finance</SelectItem>
                      <SelectItem value="workshop">blockchain</SelectItem>
                      <SelectItem value="seminar">etc</SelectItem>
                      {/* <SelectItem value="trade-show">Trade Show</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Event Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event in detail"
                  rows={4}
                  value={eventData.description}
                  onChange={(e) => setEventData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <Label>Event Type</Label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={eventData.categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {eventData.categories.map((category, index) => (
                    <Badge key={index} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={eventData.startDate}
                    onChange={(e) => setEventData((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={eventData.endDate}
                    onChange={(e) => setEventData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={eventData.timezone}
                    onValueChange={(value) => setEventData((prev) => ({ ...prev, timezone: value }))}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="daily-start">Daily Start Time</Label>
                  <Input
                    id="daily-start"
                    type="time"
                    value={eventData.dailyStart}
                    onChange={(e) => setEventData((prev) => ({ ...prev, dailyStart: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily-end">Daily End Time</Label>
                  <Input
                    id="daily-end"
                    type="time"
                    value={eventData.dailyEnd}
                    onChange={(e) => setEventData((prev) => ({ ...prev, dailyEnd: e.target.value }))}
                  />
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
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue Name *</Label>
                  <Input
                    id="venue"
                    placeholder="Event venue name"
                    value={eventData.venue}
                    onChange={(e) => setEventData((prev) => ({ ...prev, venue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={eventData.city}
                    onChange={(e) => setEventData((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Complete venue address"
                  rows={2}
                  value={eventData.address}
                  onChange={(e) => setEventData((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Event Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add event highlight"
                  value={currentHighlight}
                  onChange={(e) => setCurrentHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addHighlight()}
                />
                <Button onClick={addHighlight} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {eventData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{highlight}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeHighlight(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
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
                  placeholder="Add event tag (e.g., #Automation)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {eventData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    #{tag}
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeTag(index)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dress-code">Dress Code</Label>
                  <Select
                    value={eventData.dressCode}
                    onValueChange={(value) => setEventData((prev) => ({ ...prev, dressCode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Business Casual">Business Casual</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Smart Casual">Smart Casual</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="No Dress Code">No Dress Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age-limit">Age Restrictions</Label>
                  <Select
                    value={eventData.ageLimit}
                    onValueChange={(value) => setEventData((prev) => ({ ...prev, ageLimit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Ages Welcome">All Ages Welcome</SelectItem>
                      <SelectItem value="18+ Only">18+ Only</SelectItem>
                      <SelectItem value="21+ Only">21+ Only</SelectItem>
                      <SelectItem value="Professional Adults Only">Professional Adults Only</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Label htmlFor="featured">Featured Event</Label>
                    <p className="text-sm text-gray-600">Highlight this event on homepage</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={eventData.featured}
                    onCheckedChange={(checked) => setEventData((prev) => ({ ...prev, featured: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="vip">VIP Event</Label>
                    <p className="text-sm text-gray-600">Mark as premium/VIP event</p>
                  </div>
                  <Switch
                    id="vip"
                    checked={eventData.vip}
                    onCheckedChange={(checked) => setEventData((prev) => ({ ...prev, vip: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
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
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={eventData.currency}
                    onValueChange={(value) => setEventData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₹">₹ (INR)</SelectItem>
                      <SelectItem value="$">$ (USD)</SelectItem>
                      <SelectItem value="€">€ (EUR)</SelectItem>
                      <SelectItem value="£">£ (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="general-price">General Ticket Price</Label>
                  <Input
                    id="general-price"
                    type="number"
                    placeholder="0"
                    value={eventData.generalPrice}
                    onChange={(e) => setEventData((prev) => ({ ...prev, generalPrice: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-price">Student Ticket Price</Label>
                  <Input
                    id="student-price"
                    type="number"
                    placeholder="0"
                    value={eventData.studentPrice}
                    onChange={(e) => setEventData((prev) => ({ ...prev, studentPrice: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vip-price">VIP Ticket Price</Label>
                  <Input
                    id="vip-price"
                    type="number"
                    placeholder="0"
                    value={eventData.vipPrice}
                    onChange={(e) => setEventData((prev) => ({ ...prev, vipPrice: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Exhibitor Space Costs
                </CardTitle>
                <Button onClick={addSpaceCost} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Space Type
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventData.exhibitSpaceCosts.map((cost, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Space Type {index + 1}</h4>
                    {eventData.exhibitSpaceCosts.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeSpaceCost(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Space Type</Label>
                      <Input
                        value={cost.type}
                        onChange={(e) => updateSpaceCost(index, "type", e.target.value)}
                        placeholder="e.g., Standard Booth"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={cost.description}
                        onChange={(e) => updateSpaceCost(index, "description", e.target.value)}
                        placeholder="Brief description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Min Area (sq.m)</Label>
                      <Input
                        type="number"
                        value={cost.minArea}
                        onChange={(e) => updateSpaceCost(index, "minArea", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price per sq.m</Label>
                      <Input
                        type="number"
                        value={cost.pricePerSqm}
                        onChange={(e) => updateSpaceCost(index, "pricePerSqm", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media & Content Tab */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Event Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Upload event images</p>
                <p className="text-sm text-gray-500 mb-4">Drag and drop images or click to browse</p>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Images
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Event Brochure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brochure-url">Brochure URL</Label>
                  <Input
                    id="brochure-url"
                    placeholder="https://example.com/brochure.pdf"
                    value={eventData.brochureUrl}
                    onChange={(e) => setEventData((prev) => ({ ...prev, brochureUrl: e.target.value }))}
                  />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload PDF brochure</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Upload PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Layout Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="layout-url">Layout Plan URL</Label>
                  <Input
                    id="layout-url"
                    placeholder="https://example.com/layout.pdf"
                    value={eventData.layoutPlanUrl}
                    onChange={(e) => setEventData((prev) => ({ ...prev, layoutPlanUrl: e.target.value }))}
                  />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Layout className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload floor plan</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Upload Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Features Tab */}
          {/* <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5" />
                  Featured Hotels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Add recommended hotels for attendees</p>
                <div className="space-y-3">
                  {eventData.featuredHotels.map((hotel, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded">
                      <Input placeholder="Hotel name" value={hotel.name} className="flex-1" />
                      <Input placeholder="Category" value={hotel.category} className="w-32" />
                      <Input
                        placeholder="Rating"
                        type="number"
                        step="0.1"
                        max="5"
                        value={hotel.rating}
                        className="w-20"
                      />
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Hotel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Travel Partners
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Add travel and transportation partners</p>
                <div className="space-y-3">
                  {eventData.travelPartners.map((partner, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded">
                      <Input placeholder="Partner name" value={partner.name} className="flex-1" />
                      <Input placeholder="Service type" value={partner.category} className="w-32" />
                      <Input
                        placeholder="Rating"
                        type="number"
                        step="0.1"
                        max="5"
                        value={partner.rating}
                        className="w-20"
                      />
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Partner
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Tourist Attractions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Add local attractions and places to visit</p>
                <div className="space-y-3">
                  {eventData.touristAttractions.map((attraction, index) => (
                    <div key={index} className="p-3 border rounded space-y-3">
                      <div className="flex items-center gap-4">
                        <Input placeholder="Attraction name" value={attraction.name} className="flex-1" />
                        <Input placeholder="Category" value={attraction.category} className="w-32" />
                        <Input
                          placeholder="Rating"
                          type="number"
                          step="0.1"
                          max="5"
                          value={attraction.rating}
                          className="w-20"
                        />
                        <Button variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea placeholder="Description" value={attraction.description} rows={2} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Attraction
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">{eventData.title || "Event Title"}</h2>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {eventData.venue || "Venue"}, {eventData.city || "City"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {eventData.startDate || "Start Date"} - {eventData.endDate || "End Date"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{eventData.description || "Event description will appear here..."}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {eventData.categories.map((category, index) => (
                    <Badge key={index} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>

                {eventData.highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Event Highlights:</h4>
                    <ul className="space-y-1">
                      {eventData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Pricing</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>General:</span>
                      <span>
                        {eventData.currency}
                        {eventData.generalPrice}
                      </span>
                    </div>
                    {eventData.studentPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Student:</span>
                        <span>
                          {eventData.currency}
                          {eventData.studentPrice}
                        </span>
                      </div>
                    )}
                    {eventData.vipPrice > 0 && (
                      <div className="flex justify-between">
                        <span>VIP:</span>
                        <span>
                          {eventData.currency}
                          {eventData.vipPrice}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Timing</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      Daily: {eventData.dailyStart} - {eventData.dailyEnd}
                    </div>
                    <div>Timezone: {eventData.timezone}</div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Guidelines</h4>
                  <div className="space-y-1 text-sm">
                    <div>Dress Code: {eventData.dressCode}</div>
                    <div>Age Limit: {eventData.ageLimit}</div>
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
