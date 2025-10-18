"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Mail, MapPin, Clock, IndianRupee, Wifi, Utensils, Car, Tag } from "lucide-react"
import EventHero from "@/components/event-hero"
import EventImageGallery from "@/components/event-image-gallery"
import { Plus } from "lucide-react"
import { Share2 } from "lucide-react"
import { Bookmark } from "lucide-react"
import { useEffect, useState } from "react"
import ExhibitorsTab from "./exhibitors-tab"
import SpeakersTab from "./speakers-tab"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import AddReviewCard from "@/components/AddReviewCard"

interface EventPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventPage({ params }: EventPageProps) {
  // ALL useState calls must be at the top, before any conditional logic
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [featuredHotels, setFeaturedHotels] = useState<any[]>([])
  const [hotelsLoading, setHotelsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        setError(null)

        const resolvedParams = await params
        const eventId = resolvedParams.id

        const res = await fetch(`/api/events/${eventId}`)

        if (!res.ok) {
          if (res.status === 404) {
            setError("Event not found")
            return
          }
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()

        console.log("API Response:", data)

        setEvent(data)
        setAverageRating(data.averageRating || 0)
        setTotalReviews(data.reviewCount || 0)
      } catch (err) {
        console.error("Error fetching event:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params])

  // Check if event is saved on load and get user role
  useEffect(() => {
    if (event?.id && session?.user?.id) {
      checkIfSaved()
      checkUserRole()
    }
  }, [event?.id, session?.user?.id])

  const checkIfSaved = async () => {
    try {
      const response = await fetch(`/api/events/${event.id}/save`)
      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.isSaved)
      }
    } catch (error) {
      console.error("Error checking saved status:", error)
    }
  }

  const checkUserRole = () => {
    // Get user role from session
    if (session?.user) {
      const userWithRole = session.user as any
      setUserRole(userWithRole.role || null)
    }
  }

  const handleSaveEvent = async () => {
    if (!session) {
      alert("Please log in to save events")
      router.push("/login")
      return
    }

    setSaving(true)
    try {
      const method = isSaved ? "DELETE" : "POST"
      const response = await fetch(`/api/events/${event.id}/save`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setIsSaved(!isSaved)
        toast({
          title: isSaved ? "Event removed" : "Event saved",
          description: isSaved ? "Event removed from your saved list" : "Event added to your saved events",
        })
      }
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleVisitClick = async () => {
    if (!session) {
      alert("Authentication Required\nPlease log in to express interest in this event")
      router.push("/login")
      return
    }

    try {
      const response = await fetch(`/api/events/${event.id}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "attendee",
          userId: session.user.id,
          eventId: event.id,
        }),
      })

      if (response.ok) {
        alert("Your visit request has been sent to the organizer successfully!")
      } else {
        throw new Error("Failed to record interest")
      }
    } catch (error) {
      alert("Failed to record your interest. Please try again.")
    }
  }

  const handleExhibitClick = async () => {
    if (!session) {
      alert("Authentication Required\nPlease log in to express interest in exhibiting")
      router.push("/login")
      return
    }

    try {
      const response = await fetch(`/api/events/${event.id}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "exhibitor",
          userId: session.user.id,
          eventId: event.id,
        }),
      })

      if (response.ok) {
        alert("Your exhibition request has been sent to the organizer successfully!")
      } else {
        throw new Error("Failed to record interest")
      }
    } catch (error) {
      alert("Failed to record your interest. Please try again.")
    }
  }

  useEffect(() => {
    async function loadFeaturedHotels() {
      if (!event?.id) return
      setHotelsLoading(true)
      const demo: any[] = [
        {
          id: "demo-1",
          name: "Kanazawa Grand Inn Hotel",
          rating: 4.8,
          reviews: 1257,
          locationNote: "Excellent Location",
          price: 48,
          priceNote: "28%",
          dealLabel: "Deal",
          badgeText: "20% OFF",
          image: "/city/c2.jpg",
          amenities: ["Free Wifi", "Food", "Parking"],
        },
      ]
      try {
        const res = await fetch(`/api/featured-hotels?eventId=${event.id}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load hotels")
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedHotels(data)
        } else {
          setFeaturedHotels(demo)
        }
      } catch (err) {
        console.log("[v0] featured hotels fetch failed, using demo:", (err as Error).message)
        setFeaturedHotels(demo)
      } finally {
        setHotelsLoading(false)
      }
    }
    loadFeaturedHotels()
  }, [event?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading event: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Event not found</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Determine if Exhibit button should be shown - ONLY for EXHIBITOR role
  const showExhibitButton = userRole === 'EXHIBITOR'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <EventHero event={event} />

      <div className="max-w-7xl mx-auto py-4">
        <div className="bg-white rounded-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Tag Name will be updated by backend</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{event.address || event.location || "Location TBA"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const query = encodeURIComponent(event.address || event.location || "Location")
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Get Directions
                  </Button>

                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">
                      {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}
                    </span>
                    {totalReviews > 0 && (
                      <span className="ml-1 text-sm text-gray-500">
                        ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEvent}
                    disabled={saving}
                    className={isSaved ? "text-blue-600" : ""}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: event.title,
                            text: "Check out this event!",
                            url: window.location.href,
                          })
                          .catch((err) => console.error("Error sharing:", err))
                      } else {
                        alert("Sharing is not supported in this browser.")
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-center text-gray-700 font-medium">Interested in this Event ?</p>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button variant="outline" className="flex-1 border-gray-300 bg-transparent" onClick={handleVisitClick}>
                  Visit
                </Button>
                
                {/* Only show Exhibit button for users with EXHIBITOR role */}
                {showExhibitButton && (
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-300 bg-transparent text-blue-600 hover:text-blue-700"
                    onClick={handleExhibitClick}
                  >
                    Exhibit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Left Side */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="about" className="w-full">
              <div className="bg-white rounded-lg mb-6 shadow-sm border border-gray-200">
                <TabsList className="grid w-full grid-cols-9 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="exhibitors"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    Exhibitors
                  </TabsTrigger>
                  <TabsTrigger
                    value="space-cost"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    Space Cost
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    Layout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="brochure"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    Brochure
                  </TabsTrigger>
                  <TabsTrigger
                    value="venue"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    Venue
                  </TabsTrigger>
                  <TabsTrigger
                    value="speakers"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    Speakers
                  </TabsTrigger>
                  <TabsTrigger
                    value="organizer"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    Organizer
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate"
                  >
                    Review
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="space-y-6">
                <EventImageGallery images={event.images || [event.bannerImage].filter(Boolean)} />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      About the Event
                      <Badge variant="secondary" className="text-xs">
                        {event.category || "General"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>
                    {event.shortDescription && (
                      <p className="text-gray-600 mb-4 font-medium">{event.shortDescription}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Listed In</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {event.tags?.map((tag: string) => (
                        <button
                          key={tag}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                        >
                          #{tag}
                        </button>
                      )) || <p className="text-gray-500">No tags available</p>}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Event Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-semibold text-blue-600">{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-semibold text-blue-600">{formatDate(event.endDate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Timezone:</span>
                        <span className="font-semibold text-blue-600">{event.timezone}</span>
                      </div>
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-blue-600" />
                        Registration Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Registration Start:</span>
                        <span className="font-semibold text-blue-600">{formatDate(event.registrationStart)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Registration End:</span>
                        <span className="font-semibold text-blue-600">{formatDate(event.registrationEnd)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={event.isRegistrationOpen ? "default" : "secondary"}>
                          {event.isRegistrationOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Event Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Event Type:</span>
                        <span className="font-semibold text-blue-600">
                          {event.isVirtual ? "Virtual Event" : "Physical Event"}
                        </span>
                      </div>
                      {event.isVirtual && event.virtualLink && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Virtual Link:</span>
                          <a
                            href={event.virtualLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            Join Virtual Event
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg pb-4">
                    <CardHeader>
                      <CardTitle>Capacity</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {event.maxAttendees ? (
                          <>
                            <p className="text-gray-700">Max Attendees: {event.maxAttendees}</p>
                            {event.spotsRemaining !== null && (
                              <p className="text-gray-700">Spots Remaining: {event.spotsRemaining}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-700">Unlimited capacity</p>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </div>

                <Card className="border border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900 text-base">Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 flex items-center justify-center">
                        <Image
                          src={event.organizer?.avatar || "/placeholder.svg?height=96&width=96&text=Organizer"}
                          alt="Organizer"
                          width={96}
                          height={96}
                          className="object-contain rounded shadow-sm"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-blue-900 text-sm">
                            {event.organizer?.firstName || "Event Organizer"}
                          </h3>
                          <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">Professional Event Organizer</p>
                        <p className="text-sm text-blue-900 mt-1">Contact for more details</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{event.venue?.company}</h4>
                        {event.venue?.bio && <p className="text-gray-600 text-sm">{event.venue.bio}</p>}
                        <p className="text-gray-500">{event.venue?.location}</p>
                        {event.venue?.website && (
                          <a
                            href={event.venue.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {event.venue.website}
                          </a>
                        )}
                      </div>

                      {event.venue?.amenities?.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Amenities</h5>
                          <div className="flex flex-wrap gap-2">
                            {event.venue.amenities.map((amenity: any, idx: any) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <AddReviewCard eventId={event.id} />
              </TabsContent>

              <TabsContent value="exhibitors">
                <ExhibitorsTab eventId={event.id} />
              </TabsContent>

              <TabsContent value="space-cost">
                <Card>
                  <CardHeader>
                    <CardTitle>Exhibition Space Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.exhibitionSpaces?.length > 0 ? (
                      event.exhibitionSpaces.map((space: any, index: any) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border"
                        >
                          <div>
                            <span className="font-medium">{space.name}</span>
                            <p className="text-sm text-gray-600">{space.description}</p>
                            <p className="text-xs text-gray-500">
                              Minimum area: {space.minArea} {space.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg text-blue-600">
                              {event.currency} {space.basePrice.toLocaleString()}
                            </span>
                            {space.pricePerSqm > 0 && (
                              <p className="text-sm text-gray-600">
                                + {event.currency} {space.pricePerSqm}/{space.unit}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No exhibition space information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600">Floor plan will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brochure">
                <Card>
                  <CardHeader>
                    <CardTitle>Brochure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600">Brochure will be displayed here</p>
                    </div>
                  </CardContent>
                  <button className="mx-5 mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                    Download Brochure
                  </button>
                </Card>
              </TabsContent>

              <TabsContent value="venue">
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{event.venue?.company}</h4>
                        {event.venue?.bio && <p className="text-gray-600 text-sm">{event.venue.bio}</p>}
                        <p className="text-gray-500">{event.venue?.location}</p>
                        {event.venue?.website && (
                          <a
                            href={event.venue.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {event.venue.website}
                          </a>
                        )}
                      </div>

                      {event.venue?.amenities?.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Amenities</h5>
                          <div className="flex flex-wrap gap-2">
                            {event.venue.amenities.map((amenity: any, idx: any) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="speakers">
                <SpeakersTab eventId={event.id} />
              </TabsContent>

              <TabsContent value="organizer">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={event.organizer?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg">
                          {event.organizer?.firstName?.charAt(0) || "O"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{event.organizer?.firstName || "Event Organizer"}</h4>
                        <p className="text-gray-600 mb-3">Professional event organizer and manager</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-green-600" />
                            <span>{event.organizer?.email || "Contact via platform"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddReviewCard eventId={event.id} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Right Side */}
          <div className="w-full lg:w-80 xl:w-96 space-y-6 flex-shrink-0">
            {/* Featured Hotels Card */}
            <div className="hover:shadow-md  transition-shadow border border-gray-200 rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Featured Hotels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotelsLoading ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 text-sm">Loading featured hotels…</p>
                  </div>
                ) : featuredHotels.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 text-sm">No featured hotels available.</p>
                  </div>
                ) : (
                  featuredHotels.map((h: any) => (
                    <div
                      key={h.id}
                      className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Image Section */}
                        <div className="sm:w-1/3 relative h-40 sm:h-32">
                          <Image
                            src={h.image || "/placeholder.svg?height=128&width=200"}
                            alt={h.name || "Featured Hotel"}
                            fill
                            className="object-cover m-2"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                          {h.badgeText && (
                            <span className="absolute bottom-2 left-2 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                              {h.badgeText}
                            </span>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="sm:w-2/3 p-3">
                          <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                  {h.name}
                                </h3>
                                
                                {/* Rating and Location */}
                                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{(h.rating ?? 0).toFixed(1)}</span>
                                  <span>({(h.reviews || 0).toLocaleString()})</span>
                                  <span className="mx-1">•</span>
                                  <span className="truncate">{h.locationNote || "Excellent Location"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {h.amenities?.includes("Free Wifi") || h.amenities?.includes("wifi") ? (
                                <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600">
                                  <Wifi className="h-3 w-3" />
                                  WiFi
                                </span>
                              ) : null}
                              {h.amenities?.includes("Food") || h.amenities?.includes("food") ? (
                                <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600">
                                  <Utensils className="h-3 w-3" />
                                  Food
                                </span>
                              ) : null}
                              {h.amenities?.includes("Parking") || h.amenities?.includes("parking") ? (
                                <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600">
                                  <Car className="h-3 w-3" />
                                  Parking
                                </span>
                              ) : null}
                            </div>

                            {/* Price and Booking */}
                            <div className="flex items-center justify-between gap-2 mt-auto">
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                                  {h.dealLabel || "Deal"}
                                </span>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-lg font-bold text-gray-900">
                                    {h.currency || "$"}{h.price}
                                  </span>
                                  <span className="text-xs text-gray-500 hidden sm:inline">
                                    {h.priceNote || "28% less than usual"}
                                  </span>
                                </div>
                              </div>
                              
                              <Button 
                                className="rounded-full bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 text-xs font-medium whitespace-nowrap flex-shrink-0"
                                size="sm"
                              >
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </div>

            {/* Featured Travel Partners */}
            <Card className="hover:shadow-md transition-shadow border border-gray-200 rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Featured Travel Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm">No travel partners available.</p>
                </div>
              </CardContent>
            </Card>

            {/* Places to Visit */}
            <Card className="hover:shadow-md transition-shadow border border-gray-200 rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Places to Visit in {event.city || "the area"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm">No tourist attractions available.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}