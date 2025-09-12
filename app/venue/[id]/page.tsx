"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react"

interface Venue {
  id: string
  name: string
  description: string
  manager: {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    isVerified: boolean
    bio?: string
    website?: string
  }
  location: {
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  capacity: {
    total: number
    halls: number
  }
  pricing: {
    basePrice: number
    currency: string
  }
  stats: {
    averageRating: number
    totalReviews: number
    activeBookings: number
  }
  amenities: string[]
  images: string[]
  videos?: string[]
  floorPlans?: string[]
  virtualTour?: string
  meetingSpaces: Array<{
    id: string
    name: string
    capacity: number
    area: number
    hourlyRate: number
    isAvailable: boolean
  }>
  reviews: Array<{
    id: string
    rating: number
    title: string
    comment: string
    author: string
    authorAvatar?: string
    createdAt: string
  }>
  bookings: Array<{
    id: string
    startDate: string
    endDate: string
    status: string
    totalAmount: number
    currency: string
    purpose: string
  }>
  events: Array<{
    id: string
    title: string
    description: string
    startDate: string
    endDate: string
    status: string
    images: string[]
    capacity: {
      max: number
      current: number
    }
    organizer?: {
      name: string
      organization: string
    }
  }>
  organizer?: {
    id: string
    name: string
    organization: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

interface VenueResponse {
  success: boolean
  data: Venue
}

export default function VenueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string

  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (venueId) {
      fetchVenue()
    }
  }, [venueId])

  const fetchVenue = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/venue-manager/${venueId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: VenueResponse = await response.json()

      if (data.success && data.data) {
        setVenue(data.data)
        setError(null)
      } else {
        setError("Venue not found")
      }
    } catch (err) {
      setError("Error loading venue details")
      console.error("Error fetching venue:", err)
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (venue && venue.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % venue.images.length)
    }
  }

  const prevImage = () => {
    if (venue && venue.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getCurrentImage = () => {
    if (!venue || !venue.images || venue.images.length === 0) {
      return "/placeholder.svg?height=400&width=800&text=No+Image+Available"
    }
    const currentImage = venue.images[currentImageIndex]
    return currentImage || "/placeholder.svg?height=400&width=800&text=No+Image+Available"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading venue details...</p>
        </div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Venue Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The venue you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/venues")}>Back to Venues</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => router.push("/venues")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Venues
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image src={getCurrentImage() || "/placeholder.svg"} alt={venue.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Image Navigation */}
        {venue.images && venue.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Venue Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-white">{venue.name}</h1>
                  {venue.manager.isVerified && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-white/90 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {venue.location.address}
                    {venue.location.city && `, ${venue.location.city}`}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{venue.stats.averageRating.toFixed(1)}</span>
                    <span className="ml-1">({venue.stats.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-1" />
                    <span>Up to {venue.capacity.total.toLocaleString()} guests</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Book Now</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        {venue.images && venue.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {venue.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spaces">Meeting Spaces</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Venue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed mb-6">{venue.description}</p>

                    {/* Capacity Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{venue.capacity.total}</div>
                        <div className="text-sm text-gray-600">Total Capacity</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{venue.capacity.halls}</div>
                        <div className="text-sm text-gray-600">Meeting Halls</div>
                      </div>
                    </div>

                    {/* Amenities */}
                    {venue.amenities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {venue.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-700">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Manager Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Manager</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={venue.manager.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {venue.manager.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{venue.manager.name}</h3>
                          {venue.manager.isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-gray-600">Venue Manager</p>
                      </div>
                    </div>
                    {venue.manager.bio && <p className="text-sm text-gray-600">{venue.manager.bio}</p>}
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {venue.contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span>{venue.contact.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{venue.contact.email}</span>
                    </div>
                    {venue.contact.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <a href={venue.contact.website} className="text-blue-600 hover:underline">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {venue.pricing.currency}
                        {venue.pricing.basePrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Base price per day</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Meeting Spaces Tab */}
          <TabsContent value="spaces" className="space-y-6">
            {venue.meetingSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venue.meetingSpaces.map((space) => (
                  <Card key={space.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {space.name}
                        <Badge variant={space.isAvailable ? "default" : "secondary"}>
                          {space.isAvailable ? "Available" : "Booked"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Capacity</span>
                        <span className="font-medium">{space.capacity} people</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Area</span>
                        <span className="font-medium">{space.area} sq ft</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Hourly Rate</span>
                        <span className="font-medium text-blue-600">
                          {venue.pricing.currency}
                          {space.hourlyRate.toLocaleString()}
                        </span>
                      </div>
                      <Button className="w-full" disabled={!space.isAvailable}>
                        {space.isAvailable ? "Book Space" : "Not Available"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting spaces available</h3>
                <p className="text-gray-600">This venue doesn't have any meeting spaces configured.</p>
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
              <p className="text-gray-600">This venue doesn't have any upcoming events.</p>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to review this venue!</p>
              <Button className="mt-4">Write a Review</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
