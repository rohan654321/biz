"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, Clock, IndianRupee, Upload, X, Plus, Eye, Save, Send } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface SpaceCost {
  type: string
  description: string
  pricePerSqm?: number
  minArea?: number
  pricePerUnit?: number
  unit?: string
  isFixed: boolean
}

interface TicketType {
  name: string;
  price: number;
  currency?: string;
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
  groupPrice: number

  // Event Details
  highlights: string[]
  tags: string[]
  dressCode: string
  ageLimit: string
  featured: boolean
  vip: boolean

  // Space Costs
  spaceCosts: SpaceCost[]

  ticketTypes: TicketType[];

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

  // Additional Fields
  ageRestriction: string
  accessibility: string
  parking: string
  publicTransport: string
  foodBeverage: string
  wifi: string
  photography: string
  recording: string
  liveStreaming: string
  socialMedia: string
  networking: string
  certificates: string
  materials: string
  followUp: string
}

interface ValidationErrors {
  title?: string
  description?: string
  eventType?: string
  startDate?: string
  endDate?: string
  venue?: string
  city?: string
  address?: string
  tags?: string
}

export default function CreateEvent({ organizerId }: { organizerId: string }) {
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const { toast } = useToast()
  const [showValidationErrors, setShowValidationErrors] = useState(false)
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
    groupPrice: 0,
    highlights: [],
    tags: [],
    dressCode: "Business Casual",
    ageLimit: "18+",
    featured: false,
    vip: false,
    ticketTypes: [],
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
    ageRestriction: "",
    accessibility: "",
    parking: "",
    publicTransport: "",
    foodBeverage: "",
    wifi: "",
    photography: "",
    recording: "",
    liveStreaming: "",
    socialMedia: "",
    networking: "",
    certificates: "",
    materials: "",
    followUp: "",
  })

  const [showHotelModal, setShowHotelModal] = useState(false)
  const [showPartnerModal, setShowPartnerModal] = useState(false)
  const [showAttractionModal, setShowAttractionModal] = useState(false)
  const [currentHotel, setCurrentHotel] = useState({ name: "", category: "", rating: 5, image: "" })
  const [currentPartner, setCurrentPartner] = useState({
    name: "",
    category: "",
    rating: 5,
    image: "",
    description: "",
  })
  const [currentAttraction, setCurrentAttraction] = useState({
    name: "",
    category: "",
    rating: 5,
    image: "",
    description: "",
  })

  const [newHighlight, setNewHighlight] = useState("")
  const [newTag, setNewTag] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isPublishing, setIsPublishing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const brochureInputRef = useRef<HTMLInputElement>(null)
  const layoutPlanInputRef = useRef<HTMLInputElement>(null)

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

  const calculateCompletionPercentage = () => {
    const requiredFields = [
      formData.title,
      formData.description,
      formData.eventType,
      formData.startDate,
      formData.endDate,
      formData.venue,
      formData.city,
      formData.address,
    ]

    const optionalFields = [
      formData.categories.length > 0,
      formData.highlights.length > 0,
      formData.tags.length > 0,
      formData.generalPrice > 0,
      formData.images.length > 0,
    ]

    const requiredCompleted = requiredFields.filter((field) => field && field.toString().trim() !== "").length
    const optionalCompleted = optionalFields.filter(Boolean).length

    // Required fields are worth 80%, optional fields 20%
    const requiredPercentage = (requiredCompleted / requiredFields.length) * 80
    const optionalPercentage = (optionalCompleted / optionalFields.length) * 20

    return Math.round(requiredPercentage + optionalPercentage)
  }

  useEffect(() => {
    setCompletionPercentage(calculateCompletionPercentage())
  }, [formData])

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    try {
      const eventData = {
        ...formData,
        status: "DRAFT",
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        ticketTypes: [
          { name: "General", price: formData.generalPrice, currency: formData.currency },
          { name: "Student", price: formData.studentPrice, currency: formData.currency },
          { name: "VIP", price: formData.vipPrice, currency: formData.currency },
        ].filter((ticket) => ticket.price > 0),
      }

      const response = await fetch(`/api/organizers/${organizerId}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to save draft")
      }

      const result = await response.json()
      toast({
        title: "Draft Saved",
        description: "Your event draft has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublishEvent = async () => {
    const newValidationErrors: ValidationErrors = {}

    // Basic Info - all fields required
    if (!formData.title.trim()) newValidationErrors.title = "Title is required for publishing"
    if (!formData.description.trim()) newValidationErrors.description = "Description is required for publishing"
    if (!formData.eventType.trim()) newValidationErrors.eventType = "Event type is required for publishing"
    if (!formData.startDate.trim()) newValidationErrors.startDate = "Start date is required for publishing"
    if (!formData.endDate.trim()) newValidationErrors.endDate = "End date is required for publishing"
    if (!formData.venue.trim()) newValidationErrors.venue = "Venue is required for publishing"
    if (!formData.city.trim()) newValidationErrors.city = "City is required for publishing"
    if (!formData.address.trim()) newValidationErrors.address = "Address is required for publishing"

    // Event Details - only tags required
    if (formData.tags.length === 0) newValidationErrors.tags = "Event tags & keywords are required for publishing"

    setValidationErrors(newValidationErrors)

    if (Object.keys(newValidationErrors).length > 0) {
      return
    }

    setIsPublishing(true)
    try {
      // 🔥 FIX: Transform spaceCosts to exhibitionSpaces format - corrected mapping
      const exhibitionSpaces = formData.spaceCosts
        .filter(cost => cost.type.trim() !== "") // Only include spaces with names
        .map(cost => {
          // Map space types to enum values - fixed logic
          let spaceType;
          const spaceName = cost.type?.toLowerCase() || '';

          if (spaceName.includes('shell space') || spaceName.includes('standard booth')) {
            spaceType = 'SHELL_SPACE';
          } else if (spaceName.includes('raw space')) {
            spaceType = 'RAW_SPACE';
          } else if (spaceName.includes('2 side open')) {
            spaceType = 'TWO_SIDE_OPEN';
          } else if (spaceName.includes('3 side open')) {
            spaceType = 'THREE_SIDE_OPEN';
          } else if (spaceName.includes('4 side open')) {
            spaceType = 'FOUR_SIDE_OPEN';
          } else if (spaceName.includes('mezzanine')) {
            spaceType = 'MEZZANINE';
          } else if (spaceName.includes('additional power')) {
            spaceType = 'ADDITIONAL_POWER';
          } else if (spaceName.includes('compressed air')) {
            spaceType = 'COMPRESSED_AIR';
          } else {
            spaceType = 'CUSTOM';
          }

          return {
            spaceType: spaceType,
            name: cost.type,
            description: cost.description || '',
            area: cost.minArea || 0,
            dimensions: cost.minArea ? `${cost.minArea} sq.m` : '',
            location: null,
            basePrice: cost.pricePerSqm || cost.pricePerUnit || 0,
            pricePerSqm: cost.pricePerSqm || null,
            minArea: cost.minArea || null,
            pricePerUnit: cost.pricePerUnit || null,
            unit: cost.unit || null,
            currency: formData.currency,
            powerIncluded: false,
            additionalPowerRate: cost.type.toLowerCase().includes('power') ? (cost.pricePerUnit || 0) : null,
            compressedAirRate: cost.type.toLowerCase().includes('air') ? (cost.pricePerUnit || 0) : null,
            isFixed: cost.isFixed || false,
            isAvailable: true,
            maxBooths: null,
            bookedBooths: 0,
            setupRequirements: null,
          };
        })

      // Transform form data to match backend expectations
      const eventData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.description.substring(0, 200),
        category: formData.eventType,
        tags: formData.tags,
        startDate: formData.startDate,
        endDate: formData.endDate,
        registrationStart: formData.startDate,
        registrationEnd: formData.endDate,
        timezone: formData.timezone,
        isVirtual: false,
        address: formData.address,
        location: formData.venue,
        city: formData.city,
        state: "",
        country: "India",
        venue: formData.venue,
        currency: formData.currency,
        bannerImage: formData.images[0] || null,
        thumbnailImage: formData.images[0] || null,
        isPublic: true,
        requiresApproval: false,
        allowWaitlist: false,
        status: "published",
        featured: formData.featured,
        vip: formData.vip,
        // 🔥 CRITICAL: Send exhibition spaces with correct structure
        exhibitionSpaces: exhibitionSpaces,
        eventType: [formData.eventType],
        maxAttendees: null,
        // Include ticket pricing
       ticketTypes: [
        {
          name: "General",
          description: "General admission ticket",
          price: formData.generalPrice,
          quantity: 1000,
          isActive: formData.generalPrice > 0
        },
        {
          name: "Student", 
          description: "Student discount ticket",
          price: formData.studentPrice,
          quantity: 500,
          isActive: formData.studentPrice > 0
        },
        {
          name: "VIP",
          description: "VIP access ticket", 
          price: formData.vipPrice,
          quantity: 100,
          isActive: formData.vipPrice > 0
        }
      ].filter(ticket => ticket.isActive),
    }


      console.log("[v0] Publishing event with transformed data:", eventData)
      console.log("[v0] Exhibition spaces being sent:", exhibitionSpaces)

      const response = await fetch(`/api/organizers/${organizerId}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      console.log("[v0] Response status:", response.status)
      const responseData = await response.json()
      console.log("[v0] Response data:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to publish event")
      }

      toast({
        title: "Success",
        description: "Event created successfully with exhibition spaces",
      })

      // Reset form after successful submission
      setFormData({
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
        groupPrice: 0,
        highlights: [],
        tags: [],
        dressCode: "Business Casual",
        ageLimit: "18+",
        featured: false,
        vip: false,
        ticketTypes:[],
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
        ageRestriction: "",
        accessibility: "",
        parking: "",
        publicTransport: "",
        foodBeverage: "",
        wifi: "",
        photography: "",
        recording: "",
        liveStreaming: "",
        socialMedia: "",
        networking: "",
        certificates: "",
        materials: "",
        followUp: "",
      })
      setValidationErrors({})
    } catch (error) {
      console.error("[v0] Error publishing event:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish event",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, result],
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleBrochureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, brochure: file.name }))
    }
  }

  const handleLayoutPlanUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, layoutPlan: file.name }))
    }
  }

  const handleAddHotel = () => {
    setShowHotelModal(true)
  }

  const handleAddPartner = () => {
    setShowPartnerModal(true)
  }

  const handleAddAttraction = () => {
    setShowAttractionModal(true)
  }

  const handleImageUploadModal = (file: File, type: "hotel" | "partner" | "attraction") => {
    const imageUrl = URL.createObjectURL(file)
    if (type === "hotel") {
      setCurrentHotel((prev) => ({ ...prev, image: imageUrl }))
    } else if (type === "partner") {
      setCurrentPartner((prev) => ({ ...prev, image: imageUrl }))
    } else if (type === "attraction") {
      setCurrentAttraction((prev) => ({ ...prev, image: imageUrl }))
    }
  }

  const saveHotel = () => {
    if (currentHotel.name && currentHotel.category) {
      setFormData((prev) => ({
        ...prev,
        featuredHotels: [...(prev.featuredHotels || []), currentHotel],
      }))
      setCurrentHotel({ name: "", category: "", rating: 5, image: "" })
      setShowHotelModal(false)
    }
  }

  const savePartner = () => {
    if (currentPartner.name && currentPartner.category && currentPartner.description) {
      setFormData((prev) => ({
        ...prev,
        travelPartners: [...(prev.travelPartners || []), currentPartner],
      }))
      setCurrentPartner({ name: "", category: "", rating: 5, image: "", description: "" })
      setShowPartnerModal(false)
    }
  }

  const saveAttraction = () => {
    if (currentAttraction.name && currentAttraction.category && currentAttraction.description) {
      setFormData((prev) => ({
        ...prev,
        touristAttractions: [...(prev.touristAttractions || []), currentAttraction],
      }))
      setCurrentAttraction({ name: "", category: "", rating: 5, image: "", description: "" })
      setShowAttractionModal(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Form Completion</span>
          <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {completionPercentage < 80 ? "Complete required fields to publish your event" : "Ready to publish!"}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <p className="text-gray-600">Fill in the details to create your event</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Draft"}
          </Button>
          {/* Fixed publish button to use isPublishing state */}
          <Button onClick={handlePublishEvent} disabled={isPublishing || completionPercentage < 80}>
            <Send className="w-4 h-4 mr-2" />
            {isPublishing ? "Publishing..." : "Publish Event"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Space</TabsTrigger>
          <TabsTrigger value="media">Media & Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                All fields in this section are required for publishing your event.
              </p>
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
                  {showValidationErrors && (!formData.title || formData.title.trim() === "") && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
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
                  {showValidationErrors && (!formData.eventType || formData.eventType.trim() === "") && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
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
                  {showValidationErrors && (!formData.description || formData.description.trim() === "") && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
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
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                  {showValidationErrors && (!formData.startDate || formData.startDate.trim() === "") && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                  {showValidationErrors && (!formData.endDate || formData.endDate.trim() === "") && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
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
                  {showValidationErrors && (!formData.venue || formData.venue.trim() === "") && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                  />
                  {showValidationErrors && (!formData.city || formData.city.trim() === "") && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
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
                  {showValidationErrors && (!formData.address || formData.address.trim() === "") && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
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
              <p className="text-sm text-muted-foreground">
                Only Event Tags & Keywords are required for publishing in this section.
              </p>
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
              <CardTitle>Event Tags & Keywords *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Event Tags & Keywords *</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(index)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tags (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  {showValidationErrors && formData.tags.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">This field is required for publishing</p>
                  )}
                </div>
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
                    type="number"
                    placeholder="0"
                    value={formData.generalPrice === 0 ? "" : formData.generalPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        generalPrice: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="studentPrice">Student Price</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.studentPrice === 0 ? "" : formData.studentPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        studentPrice: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="vipPrice">VIP Price</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.vipPrice === 0 ? "" : formData.vipPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vipPrice: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                    }
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
                                  value={cost.pricePerSqm === 0 ? "" : cost.pricePerSqm}
                                  onChange={(e) => updateSpaceCost(index, "pricePerSqm", Number(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Minimum Area (sq.m)</Label>
                              <Input
                                type="number"
                                value={cost.minArea === 0 ? "" : cost.minArea}
                                onChange={(e) => updateSpaceCost(index, "minArea", Number(e.target.value) || 0)}
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <input
            type="file"
            ref={brochureInputRef}
            onChange={handleBrochureUpload}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <input
            type="file"
            ref={layoutPlanInputRef}
            onChange={handleLayoutPlanUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Event Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Choose Images
                </Button>
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
                    value={formData.brochure || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brochure: e.target.value }))}
                    placeholder="Upload brochure"
                    readOnly
                  />
                  <Button variant="outline" onClick={() => brochureInputRef.current?.click()}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Layout Plan</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={formData.layoutPlan || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, layoutPlan: e.target.value }))}
                    placeholder="Upload layout plan"
                    readOnly
                  />
                  <Button variant="outline" onClick={() => layoutPlanInputRef.current?.click()}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
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

      {showHotelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Hotel</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hotel-name">Hotel Name</Label>
                <Input
                  id="hotel-name"
                  value={currentHotel.name}
                  onChange={(e) => setCurrentHotel((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter hotel name"
                />
              </div>
              <div>
                <Label htmlFor="hotel-category">Category</Label>
                <Input
                  id="hotel-category"
                  value={currentHotel.category}
                  onChange={(e) => setCurrentHotel((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Luxury, Budget, Business"
                />
              </div>
              <div>
                <Label htmlFor="hotel-rating">Rating</Label>
                <Input
                  id="hotel-rating"
                  type="number"
                  min="1"
                  max="5"
                  value={currentHotel.rating}
                  onChange={(e) => setCurrentHotel((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="hotel-image">Hotel Image</Label>
                <Input
                  id="hotel-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUploadModal(file, "hotel")
                  }}
                />
                {currentHotel.image && (
                  <img
                    src={currentHotel.image || "/placeholder.svg"}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowHotelModal(false)}>
                Cancel
              </Button>
              <Button onClick={saveHotel}>Add Hotel</Button>
            </div>
          </div>
        </div>
      )}

      {showPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Travel Partner</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="partner-name">Partner Name</Label>
                <Input
                  id="partner-name"
                  value={currentPartner.name}
                  onChange={(e) => setCurrentPartner((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter partner name"
                />
              </div>
              <div>
                <Label htmlFor="partner-category">Category</Label>
                <Input
                  id="partner-category"
                  value={currentPartner.category}
                  onChange={(e) => setCurrentPartner((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Airlines, Car Rental, Tours"
                />
              </div>
              <div>
                <Label htmlFor="partner-rating">Rating</Label>
                <Input
                  id="partner-rating"
                  type="number"
                  min="1"
                  max="5"
                  value={currentPartner.rating}
                  onChange={(e) => setCurrentPartner((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="partner-description">Description</Label>
                <textarea
                  id="partner-description"
                  className="w-full p-2 border rounded"
                  value={currentPartner.description}
                  onChange={(e) => setCurrentPartner((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter partner description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="partner-image">Partner Image</Label>
                <Input
                  id="partner-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUploadModal(file, "partner")
                  }}
                />
                {currentPartner.image && (
                  <img
                    src={currentPartner.image || "/placeholder.svg"}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowPartnerModal(false)}>
                Cancel
              </Button>
              <Button onClick={savePartner}>Add Partner</Button>
            </div>
          </div>
        </div>
      )}

      {showAttractionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Tourist Attraction</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="attraction-name">Attraction Name</Label>
                <Input
                  id="attraction-name"
                  value={currentAttraction.name}
                  onChange={(e) => setCurrentAttraction((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter attraction name"
                />
              </div>
              <div>
                <Label htmlFor="attraction-category">Category</Label>
                <Input
                  id="attraction-category"
                  value={currentAttraction.category}
                  onChange={(e) => setCurrentAttraction((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Museum, Park, Monument"
                />
              </div>
              <div>
                <Label htmlFor="attraction-rating">Rating</Label>
                <Input
                  id="attraction-rating"
                  type="number"
                  min="1"
                  max="5"
                  value={currentAttraction.rating}
                  onChange={(e) => setCurrentAttraction((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="attraction-description">Description</Label>
                <textarea
                  id="attraction-description"
                  className="w-full p-2 border rounded"
                  value={currentAttraction.description}
                  onChange={(e) => setCurrentAttraction((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter attraction description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="attraction-image">Attraction Image</Label>
                <Input
                  id="attraction-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUploadModal(file, "attraction")
                  }}
                />
                {currentAttraction.image && (
                  <img
                    src={currentAttraction.image || "/placeholder.svg"}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAttractionModal(false)}>
                Cancel
              </Button>
              <Button onClick={saveAttraction}>Add Attraction</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
