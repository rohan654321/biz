"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Mail, MapPin, Clock, IndianRupee, Wifi, Utensils, Car, Tag, Trash2 } from "lucide-react"
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
import Link from "next/link"

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
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{event.slug || "Tag Name will be updated by backend"}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{event.venue.venueAddress || "Location TBA"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const query = encodeURIComponent(event.venueAddress || "Location")
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

                <Button
                  variant="outline"
                  className="flex-1 border-blue-300 bg-transparent text-blue-600 hover:text-blue-700"
                  onClick={handleExhibitClick}
                >
                  Exhibit
                </Button>

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

                <Card className="shadow-md border border-gray-200 rounded-lg overflow-hidden">
                  <CardHeader className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {event.title || "Event Title"}
                    </CardTitle>
                    <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                      {event.description || "Event description not available."}
                    </p>
                  </CardHeader>

                  <CardContent className="px-6 py-4">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Highlights</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                        {event.highlights?.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        )) || (
                            <>
                              <li>Showcase and sample your favorite products.</li>
                              <li>Be visible to thousands of music lovers.</li>
                              <li>Enjoy trying high-end gadgets and accessories.</li>
                            </>
                          )}
                      </ul>
                    </div>

                    {/* Category Tags Section */}
                    {/* <div className="flex flex-wrap gap-2 mb-4">
                        {event.categories?.map((cat: string) => (
                          <span
                            key={cat}
                            className="bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium"
                          >
                            {cat}
                          </span>
                        )) || (
                            <>
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium">
                                Top 100 in Entertainment & Media
                              </span>
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium">
                                Display & Presentation
                              </span>
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 text-xs font-medium">
                                Variety of Products
                              </span>
                            </>
                          )}
                      </div> */}

                    {/* Listed In Section */}
                    <div>
                      <h3 className="font-semibold text-blue-700 mb-2">Listed In</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags?.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors duration-200"
                          >
                            #{tag}
                          </span>
                        )) || (
                            <>
                              <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                #Entertainment & Media
                              </span>
                              <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                #Headphone
                              </span>
                              <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                #Loudspeaker
                              </span>
                            </>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  {/* Timings / Schedule Section */}
                  <div >
                    <h3 className="font-semibold text-gray-800 mb-3">Timings</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <span className="font-medium">{formatDate(event.startDate)}</span>
                        {/* <span className="text-gray-500">(General)</span> */}
                      </li>
                      <li>
                        <span className="font-medium">{formatDate(event.endDate)}</span>
                        {/* <span className="text-gray-500">(General)</span> */}
                      </li>
                    </ul>
                    <p className="text-blue-600 text-xs font-medium mt-2 inline-block ">
                      {event.timezone}
                    </p>

                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-800 mb-1">Estimated Turnout</h3>
                      <p className="text-gray-700">{event.maxAttendees || "5000"} Visitors</p>
                      <p className="text-gray-700">130 Exhibitors</p>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-800 mb-1">Editions</h3>
                      <p className="text-gray-700">{event.edition || "2nd"}<span className="text-blue-600">  Editions</span></p>
                      {/* <a href="#" className="text-blue-600 text-xs font-medium hover:underline">
                        +7 more editions
                      </a> */}
                    </div>

                    {/* <div className="mt-4">
                      <h3 className="font-semibold text-gray-800 mb-1">Frequency</h3>
                      <p className="text-gray-700">Annual</p>
                    </div> */}
                  </div>

                  {/* Event Type / Official Links Section */}
                  <div>
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-1">Entry Fees</h3>
                      <p className="text-gray-700">{event.ticketTypes?.map((ticket: any) => `${ticket.name}: ₹${ticket.price}`).join(" | ")}</p>
                      {/* <a href="#" className="text-blue-600 text-xs font-medium hover:underline">
                        View Details
                      </a> */}
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-1">Event Type</h3>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-600 font-semibold">✓</span> {event.category}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-1">Official Links</h3>
                      <div className="flex gap-2">
                        <a
                          href={event.website}
                          className="px-3 py-1 border border-blue-200 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100"
                        >
                          Website
                        </a>
                        <a
                          href="#"
                          className="px-3 py-1 border border-pink-200 bg-pink-50 text-pink-700 rounded-md text-xs font-medium hover:bg-pink-100"
                        >
                          Contact
                        </a>
                      </div>
                    </div>

                    {/* <p className="text-xs text-gray-500 mt-4 hover:underline cursor-pointer">
                      Report Error
                    </p> */}
                  </div>
                </div>


                <Card className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b border-gray-100 pb-2">
                    <CardTitle className="text-gray-800 text-base font-semibold">Organizer</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
                    {/* Left Section: Organizer Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 flex items-center justify-center border border-gray-100 rounded overflow-hidden bg-white">
                        <Image
                          src={event.organizer?.avatar || "/public/image/Ellipse_72.png"}
                          alt="Organizer"
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {event.organizer?.firstName || "Organizer Name"}
                          </h3>
                          <span className="bg-blue-100 text-blue-700 text-[11px] font-medium px-2 py-[2px] rounded">
                            Top Rated
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          {event.organizer?.country || "USA"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {event.organizer?.upcomingEvents
                            ? `${event.organizer.upcomingEvents} Upcoming Events`
                            : "1 Upcoming Event"}{" "}
                          ·{" "}
                          {event.organizer?.followers
                            ? `${event.organizer.followers} Followers`
                            : "302 Followers"}
                        </p>
                      </div>
                    </div>

                    {/* Right Section: Button */}
                    <div className="flex flex-col items-center text-center">
                      <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow" onClick={handleVisitClick}>
                        Send Stall Book Request
                      </button>
                      {/* <p className="text-xs text-gray-500 mt-2">
                        Queries about the event?{" "}
                        <a href="#" className="text-blue-600 hover:underline font-medium">
                          Ask Organizer
                        </a>
                      </p> */}
                    </div>
                  </CardContent>
                </Card>


                <Card className="border border-gray-200 rounded-lg shadow-sm">
                  <CardHeader className="border-b border-gray-100 py-4">
                    <CardTitle className="text-gray-800 text-lg font-semibold">Venue Map & Directions</CardTitle>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">

                      {/* Map Image Section (left side) */}
                      <div className="w-full h-80 bg-gray-200 rounded-md mb-4 overflow-hidden">
                        {event?.venue?.location?.coordinates?.lat && event?.venue?.location?.coordinates?.lng ? (
                          <iframe
                            src={`https://www.google.com/maps?q=${event.venue.location.coordinates.lat},${event.venue.location.coordinates.lng}&z=15&output=embed`}
                            width="100%"
                            height="100%"
                            className="border-0"
                            loading="lazy"
                          ></iframe>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                            Map not available
                          </div>
                        )}
                      </div>

                      {/* Venue Details and Buttons (right side) */}
                      <div className="w-full md:w-1/3 flex flex-col justify-between space-y-4">

                        {/* Venue Info */}
                        <div>
                          <h3 className="font-semibold text-blue-700 text-base">{event?.venue?.venueName || "Venue Name Unavailable"}</h3>
                          <p className="text-gray-600 text-sm mt-1">{event?.venue?.venueAddress || "Address not provided"}</p>
                          <p className="text-gray-600 text-sm">{event?.venue?.venueZipCode || "Zip code not provided"}</p>
                          <p className="text-gray-600 text-sm">{event?.venue?.venueCountry || "Country not provided"}</p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-2">
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
                            onClick={() => {
                              const query = encodeURIComponent(
                                event?.venue?.venueAddress ||
                                event?.venue?.venueName ||
                                "Location not available"
                              )
                              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
                            }}
                          >
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                </Card>

                <AddReviewCard eventId={event.id} />
              </TabsContent>

              <TabsContent value="exhibitors">
                <ExhibitorsTab eventId={event.id} />
              </TabsContent>

              <TabsContent value="layout">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Layout Plan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center overflow-hidden">
                      {event?.layoutPlan ? (
                        <Image
                          src={event.layoutPlan.startsWith("http")
                            ? event.layoutPlan
                            : `/uploads/${event.layoutPlan}`} // adjust path if stored locally
                          alt="Event Layout Plan"
                          width={800}
                          height={600}
                          className="object-contain rounded-lg"
                        />
                      ) : (
                        <p className="text-gray-500">Floor plan will be displayed here</p>
                      )}
                    </div>
                  </CardContent>

                </Card>
              </TabsContent>

              
             <TabsContent value="brochure">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Brochure</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {event?.brochure ? (
                        <>
                          <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                            <iframe
                              src={`/api/events/${event.id}/brochure?action=view`}
                              className="w-full h-[600px]"
                              title="Event Brochure PDF"
                            />
                          </div>
                          <div className="flex justify-center gap-4">
                            <Button asChild size="lg" className="w-full sm:w-auto">
                              <a href={`/api/events/${event.id}/brochure?action=download`} download>
                                Download Brochure
                              </a>
                            </Button>
                            
                          </div>
                        </>
                      ) : (
                        <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                          <p className="text-gray-600">No brochure available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="venue">
                <Card className="border border-gray-200 rounded-lg shadow-sm">
                  <CardHeader className="border-b border-gray-100 py-4">
                    <CardTitle className="text-gray-800 text-lg font-semibold">Venue Map & Directions</CardTitle>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">

                      {/* Map Image Section (left side) */}
                      <div className="w-full h-80 bg-gray-200 rounded-md mb-4 overflow-hidden">
                        {event?.venue?.location?.coordinates?.lat && event?.venue?.location?.coordinates?.lng ? (
                          <iframe
                            src={`https://www.google.com/maps?q=${event.venue.location.coordinates.lat},${event.venue.location.coordinates.lng}&z=15&output=embed`}
                            width="100%"
                            height="100%"
                            className="border-0"
                            loading="lazy"
                          ></iframe>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                            Map not available
                          </div>
                        )}
                      </div>

                      {/* Venue Details and Buttons (right side) */}
                      <div className="w-full md:w-1/3 flex flex-col justify-between space-y-4">

                        {/* Venue Info */}
                        <div>
                          <h3 className="font-semibold text-blue-700 text-base">{event?.venue?.venueName || "Venue Name Unavailable"}</h3>
                          <p className="text-gray-600 text-sm mt-1">{event?.venue?.venueAddress || "Address not provided"}</p>
                          <p className="text-gray-600 text-sm">{event?.venue?.venueZipCode || "Zip code not provided"}</p>
                          <p className="text-gray-600 text-sm">{event?.venue?.venueCountry || "Country not provided"}</p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-2">
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
                            onClick={() => {
                              const query = encodeURIComponent(
                                event?.venue?.venueAddress ||
                                event?.venue?.venueName ||
                                "Location not available"
                              )
                              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
                            }}
                          >
                            Get Directions
                          </Button>
                        </div>
                      </div>
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
                  <Link href={`/organizer/${event.organizer.id}`}>
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
                  </Link>
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
            <Card className="hover:shadow-md transition-shadow border border-gray-200 rounded-lg h-60">
              <CardHeader className="pb-3">

              </CardHeader>
              <CardContent className="space-y-4">

              </CardContent>
            </Card>
            {/* Featured Hotels Card */}
            <Card className="hover:shadow-md transition-shadow border border-gray-200 rounded-lg">
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
                            className="object-cover"
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
            </Card>

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