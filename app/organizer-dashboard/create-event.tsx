"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import { Plus, Minus, Save, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { UploadResult } from "@/lib/firebase-storage"
import { Video } from "lucide-react" // Declared Video variable

interface EventFormData {
  title: string
  slug: string
  description: string
  highlights: string[]
  location: {
    city: string
    venue: string
    address: string
    lat?: number
    lng?: number
    country: string
  }
  timings: {
    startDate: string
    endDate: string
    dailyStartTime: string
    dailyEndTime: string
    timezone: string
  }
  pricing: {
    currency: string
    general: number
    student?: number
    vip?: number
  }
  stats: {
    expectedVisitors: string
    exhibitors: string
    duration: string
  }
  ageLimit: string
  dressCode: string
  status: string
  categories: string[]
  tags: string[]
  featured: boolean
  vip: boolean
  images: UploadResult[]
  videos: UploadResult[]
  organizerId: string
}

export default function AddEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentTab, setCurrentTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    slug: "",
    description: "",
    highlights: [""],
    location: {
      city: "",
      venue: "",
      address: "",
      country: "India",
    },
    timings: {
      startDate: "",
      endDate: "",
      dailyStartTime: "",
      dailyEndTime: "",
      timezone: "IST",
    },
    pricing: {
      currency: "₹",
      general: 0,
    },
    stats: {
      expectedVisitors: "",
      exhibitors: "",
      duration: "",
    },
    ageLimit: "",
    dressCode: "",
    status: "UPCOMING",
    categories: [],
    tags: [],
    featured: false,
    vip: false,
    images: [],
    videos: [],
    organizerId: "temp-organizer-id", // This should come from auth context
  })

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Update form data
  const updateFormData = (section: string, field: string, value: any) => {
    setFormData((prev:any) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof EventFormData],
        [field]: value,
      },
    }))
  }

  // Update top-level form data
  const updateTopLevelData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Highlight management
  const addHighlight = () => {
    updateTopLevelData("highlights", [...formData.highlights, ""])
  }

  const removeHighlight = (index: number) => {
    if (formData.highlights.length > 1) {
      const newHighlights = formData.highlights.filter((_, i) => i !== index)
      updateTopLevelData("highlights", newHighlights)
    }
  }

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    updateTopLevelData("highlights", newHighlights)
  }

  // Category management
  const addCategory = (category: string) => {
    if (!formData.categories.includes(category) && category.trim()) {
      updateTopLevelData("categories", [...formData.categories, category])
    }
  }

  const removeCategory = (category: string) => {
    updateTopLevelData(
      "categories",
      formData.categories.filter((c) => c !== category),
    )
  }

  // Tag management
  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag) && tag.trim()) {
      updateTopLevelData("tags", [...formData.tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    updateTopLevelData(
      "tags",
      formData.tags.filter((t) => t !== tag),
    )
  }

  // File upload handlers
  const handleImagesUploaded = (uploadedImages: UploadResult[]) => {
    updateTopLevelData("images", [...formData.images, ...uploadedImages])
    toast({
      title: "Success",
      description: `${uploadedImages.length} image(s) uploaded successfully`,
    })
  }

  const handleVideosUploaded = (uploadedVideos: UploadResult[]) => {
    updateTopLevelData("videos", [...formData.videos, ...uploadedVideos])
    toast({
      title: "Success",
      description: `${uploadedVideos.length} video(s) uploaded successfully`,
    })
  }

  const handleImagesRemoved = (removedImages: UploadResult[]) => {
    const remainingImages = formData.images.filter((img) => !removedImages.some((removed) => removed.path === img.path))
    updateTopLevelData("images", remainingImages)
  }

  const handleVideosRemoved = (removedVideos: UploadResult[]) => {
    const remainingVideos = formData.videos.filter(
      (video) => !removedVideos.some((removed) => removed.path === video.path),
    )
    updateTopLevelData("videos", remainingVideos)
  }

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic validation
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (formData.highlights.some((h) => !h.trim())) newErrors.highlights = "All highlights must be filled"

    // Location validation
    if (!formData.location.city.trim()) newErrors.city = "City is required"
    if (!formData.location.venue.trim()) newErrors.venue = "Venue is required"
    if (!formData.location.address.trim()) newErrors.address = "Address is required"

    // Timing validation
    if (!formData.timings.startDate) newErrors.startDate = "Start date is required"
    if (!formData.timings.endDate) newErrors.endDate = "End date is required"
    if (!formData.timings.dailyStartTime) newErrors.dailyStartTime = "Daily start time is required"
    if (!formData.timings.dailyEndTime) newErrors.dailyEndTime = "Daily end time is required"

    // Date validation
    if (formData.timings.startDate && formData.timings.endDate) {
      if (new Date(formData.timings.endDate) < new Date(formData.timings.startDate)) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    // Pricing validation
    if (formData.pricing.general <= 0) newErrors.general = "General price must be greater than 0"

    // Stats validation
    if (!formData.stats.expectedVisitors.trim()) newErrors.expectedVisitors = "Expected visitors is required"
    if (!formData.stats.exhibitors.trim()) newErrors.exhibitors = "Number of exhibitors is required"
    if (!formData.stats.duration.trim()) newErrors.duration = "Duration is required"

    // Details validation
    if (!formData.ageLimit.trim()) newErrors.ageLimit = "Age limit is required"
    if (!formData.dressCode.trim()) newErrors.dressCode = "Dress code is required"
    if (formData.categories.length === 0) newErrors.categories = "At least one category is required"
    if (formData.tags.length === 0) newErrors.tags = "At least one tag is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Transform data for API
      const apiData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description,
        highlights: formData.highlights.filter((h) => h.trim()),
        city: formData.location.city,
        venue: formData.location.venue,
        address: formData.location.address,
        lat: formData.location.lat || null,
        lng: formData.location.lng || null,
        country: formData.location.country,
        startDate: formData.timings.startDate,
        endDate: formData.timings.endDate,
        dailyStartTime: formData.timings.dailyStartTime,
        dailyEndTime: formData.timings.dailyEndTime,
        timezone: formData.timings.timezone,
        currency: formData.pricing.currency,
        generalPrice: formData.pricing.general,
        studentPrice: formData.pricing.student || null,
        vipPrice: formData.pricing.vip || null,
        expectedVisitors: formData.stats.expectedVisitors,
        exhibitors: formData.stats.exhibitors,
        duration: formData.stats.duration,
        ageLimit: formData.ageLimit,
        dressCode: formData.dressCode,
        status: formData.status,
        categories: formData.categories,
        tags: formData.tags,
        featured: formData.featured,
        vip: formData.vip,
        images: formData.images.map((img) => ({
          url: img.url,
          alt: formData.title,
          type: "gallery" as const,
        })),
        videos: formData.videos.map((video) => ({
          url: video.url,
          title: formData.title,
          type: "promotional" as const,
        })),
        organizerId: formData.organizerId,
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create event")
      }

      const result = await response.json()

      toast({
        title: "Success!",
        description: "Event created successfully",
      })

      // Redirect to events dashboard or event detail page
      router.push(`/organizer-dashboard/events`)
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Add New Event</h1>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="timing">Timing & Pricing</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media & Features</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      value={formData.title}
                      onChange={(e) => {
                        updateTopLevelData("title", e.target.value)
                        updateTopLevelData("slug", generateSlug(e.target.value))
                      }}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="event-url-slug"
                      value={formData.slug}
                      onChange={(e) => updateTopLevelData("slug", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Event Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event in detail..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateTopLevelData("description", e.target.value)}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Event Highlights *</Label>
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        placeholder="Enter highlight"
                        className={errors.highlights ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeHighlight(index)}
                        disabled={formData.highlights.length === 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addHighlight} className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                  {errors.highlights && <p className="text-sm text-red-500">{errors.highlights}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Event Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={formData.location.country}
                      onValueChange={(value) => updateFormData("location", "country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={formData.location.city}
                      onChange={(e) => updateFormData("location", "city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue *</Label>
                    <Input
                      id="venue"
                      placeholder="Convention Center"
                      value={formData.location.venue}
                      onChange={(e) => updateFormData("location", "venue", e.target.value)}
                      className={errors.venue ? "border-red-500" : ""}
                    />
                    {errors.venue && <p className="text-sm text-red-500">{errors.venue}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Complete venue address"
                    rows={3}
                    value={formData.location.address}
                    onChange={(e) => updateFormData("location", "address", e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      placeholder="19.1595"
                      value={formData.location.lat || ""}
                      onChange={(e) =>
                        updateFormData(
                          "location",
                          "lat",
                          e.target.value ? Number.parseFloat(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      placeholder="72.8656"
                      value={formData.location.lng || ""}
                      onChange={(e) =>
                        updateFormData(
                          "location",
                          "lng",
                          e.target.value ? Number.parseFloat(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timing & Pricing */}
          <TabsContent value="timing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Timing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.timings.startDate}
                        onChange={(e) => updateFormData("timings", "startDate", e.target.value)}
                        className={errors.startDate ? "border-red-500" : ""}
                      />
                      {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.timings.endDate}
                        onChange={(e) => updateFormData("timings", "endDate", e.target.value)}
                        className={errors.endDate ? "border-red-500" : ""}
                      />
                      {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dailyStart">Daily Start Time *</Label>
                      <Input
                        id="dailyStart"
                        type="time"
                        value={formData.timings.dailyStartTime}
                        onChange={(e) => updateFormData("timings", "dailyStartTime", e.target.value)}
                        className={errors.dailyStartTime ? "border-red-500" : ""}
                      />
                      {errors.dailyStartTime && <p className="text-sm text-red-500">{errors.dailyStartTime}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dailyEnd">Daily End Time *</Label>
                      <Input
                        id="dailyEnd"
                        type="time"
                        value={formData.timings.dailyEndTime}
                        onChange={(e) => updateFormData("timings", "dailyEndTime", e.target.value)}
                        className={errors.dailyEndTime ? "border-red-500" : ""}
                      />
                      {errors.dailyEndTime && <p className="text-sm text-red-500">{errors.dailyEndTime}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone *</Label>
                      <Select
                        value={formData.timings.timezone}
                        onValueChange={(value) => updateFormData("timings", "timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IST">IST (Indian Standard Time)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">EST</SelectItem>
                          <SelectItem value="PST">PST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select
                        value={formData.pricing.currency}
                        onValueChange={(value) => updateFormData("pricing", "currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
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
                      <Label htmlFor="general">General Price *</Label>
                      <Input
                        id="general"
                        type="number"
                        placeholder="2500"
                        value={formData.pricing.general || ""}
                        onChange={(e) => updateFormData("pricing", "general", Number.parseInt(e.target.value) || 0)}
                        className={errors.general ? "border-red-500" : ""}
                      />
                      {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student">Student Price</Label>
                      <Input
                        id="student"
                        type="number"
                        placeholder="1500"
                        value={formData.pricing.student || ""}
                        onChange={(e) =>
                          updateFormData(
                            "pricing",
                            "student",
                            e.target.value ? Number.parseInt(e.target.value) : undefined,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vip">VIP Price</Label>
                      <Input
                        id="vip"
                        type="number"
                        placeholder="5000"
                        value={formData.pricing.vip || ""}
                        onChange={(e) =>
                          updateFormData("pricing", "vip", e.target.value ? Number.parseInt(e.target.value) : undefined)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedVisitors">Expected Visitors *</Label>
                      <Input
                        id="expectedVisitors"
                        placeholder="10,000+"
                        value={formData.stats.expectedVisitors}
                        onChange={(e) => updateFormData("stats", "expectedVisitors", e.target.value)}
                        className={errors.expectedVisitors ? "border-red-500" : ""}
                      />
                      {errors.expectedVisitors && <p className="text-sm text-red-500">{errors.expectedVisitors}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exhibitors">Number of Exhibitors *</Label>
                      <Input
                        id="exhibitors"
                        placeholder="200+"
                        value={formData.stats.exhibitors}
                        onChange={(e) => updateFormData("stats", "exhibitors", e.target.value)}
                        className={errors.exhibitors ? "border-red-500" : ""}
                      />
                      {errors.exhibitors && <p className="text-sm text-red-500">{errors.exhibitors}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        placeholder="3 Days"
                        value={formData.stats.duration}
                        onChange={(e) => updateFormData("stats", "duration", e.target.value)}
                        className={errors.duration ? "border-red-500" : ""}
                      />
                      {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ageLimit">Age Limit *</Label>
                    <Input
                      id="ageLimit"
                      placeholder="18+ years"
                      value={formData.ageLimit}
                      onChange={(e) => updateTopLevelData("ageLimit", e.target.value)}
                      className={errors.ageLimit ? "border-red-500" : ""}
                    />
                    {errors.ageLimit && <p className="text-sm text-red-500">{errors.ageLimit}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dressCode">Dress Code *</Label>
                    <Input
                      id="dressCode"
                      placeholder="Business Casual"
                      value={formData.dressCode}
                      onChange={(e) => updateTopLevelData("dressCode", e.target.value)}
                      className={errors.dressCode ? "border-red-500" : ""}
                    />
                    {errors.dressCode && <p className="text-sm text-red-500">{errors.dressCode}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Event Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => updateTopLevelData("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Categories *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeCategory(category)}
                        >
                          {category} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add category"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const target = e.target as HTMLInputElement
                            if (target.value.trim()) {
                              addCategory(target.value.trim())
                              target.value = ""
                            }
                          }
                        }}
                        className={errors.categories ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add category"]') as HTMLInputElement
                          if (input?.value.trim()) {
                            addCategory(input.value.trim())
                            input.value = ""
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {errors.categories && <p className="text-sm text-red-500">{errors.categories}</p>}
                  </div>

                  <div>
                    <Label>Tags *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add tag"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const target = e.target as HTMLInputElement
                            if (target.value.trim()) {
                              addTag(target.value.trim())
                              target.value = ""
                            }
                          }
                        }}
                        className={errors.tags ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add tag"]') as HTMLInputElement
                          if (input?.value.trim()) {
                            addTag(input.value.trim())
                            input.value = ""
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media & Features */}
          <TabsContent value="media">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFilesUploaded={handleImagesUploaded}
                    onFilesRemoved={handleImagesRemoved}
                    maxFiles={10}
                    maxSizeMB={5}
                    allowedTypes={["image/*"]}
                    uploadPath="events/images"
                    accept="image/*"
                    className="mb-4"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Uploaded Images ({formData.images.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={`Event image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => handleImagesRemoved([image])}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFilesUploaded={handleVideosUploaded}
                    onFilesRemoved={handleVideosRemoved}
                    maxFiles={5}
                    maxSizeMB={50}
                    allowedTypes={["video/*"]}
                    uploadPath="events/videos"
                    accept="video/*"
                    className="mb-4"
                  />
                  {formData.videos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Uploaded Videos ({formData.videos.length})</h4>
                      <div className="space-y-2">
                        {formData.videos.map((video, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Video className="w-6 h-6 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium">{video.name}</p>
                                <p className="text-sm text-gray-500">{(video.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleVideosRemoved([video])}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Event Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => updateTopLevelData("featured", checked)}
                    />
                    <Label htmlFor="featured">Featured Event</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vip"
                      checked={formData.vip}
                      onCheckedChange={(checked) => updateTopLevelData("vip", checked)}
                    />
                    <Label htmlFor="vip">VIP Event</Label>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Additional features like featured items, exhibitors, and tourist attractions can be added after
                      creating the event.
                    </p>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {currentTab !== "basic" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const tabs = ["basic", "location", "timing", "details", "media"]
                  const currentIndex = tabs.indexOf(currentTab)
                  if (currentIndex > 0) {
                    setCurrentTab(tabs[currentIndex - 1])
                  }
                }}
              >
                Previous
              </Button>
            )}
            {currentTab !== "media" ? (
              <Button
                type="button"
                onClick={() => {
                  const tabs = ["basic", "location", "timing", "details", "media"]
                  const currentIndex = tabs.indexOf(currentTab)
                  if (currentIndex < tabs.length - 1) {
                    setCurrentTab(tabs[currentIndex + 1])
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
