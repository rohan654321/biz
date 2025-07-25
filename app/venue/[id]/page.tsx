"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Clock,
  AlertTriangle,
} from "lucide-react"
import {
  getVenueById,
  getEventsByVenue,
  postponeEvent,
  unpostponeEvent,
  isEventPostponed,
  getOriginalEventDates,
} from "@/lib/data/events"

export default function VenuePage() {
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSpace, setSelectedSpace] = useState("")

  // Generate calendar data for next 3 months
  const calendarData = useMemo(() => {
    const months = []
    const today = new Date()

    for (let i = 0; i < 3; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1)
      const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
      const firstDayOfWeek = month.getDay()

      const days = []

      // Add empty cells for days before month starts
      for (let j = 0; j < firstDayOfWeek; j++) {
        days.push(null)
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const isAvailable = venueId ? getVenueById(venueId)?.availability[dateStr] !== false : false

        // Check for events on this date
        const eventsOnDate = venueId
          ? getEventsByVenue(venueId).filter((event) => {
              const eventStart = new Date(event.timings.startDate)
              const eventEnd = new Date(event.timings.endDate)
              const currentDate = new Date(dateStr)
              return currentDate >= eventStart && currentDate <= eventEnd
            })
          : []

        const hasEvent = eventsOnDate.length > 0
        const hasPostponedEvent = eventsOnDate.some((event) => isEventPostponed(event.id))

        days.push({
          day,
          date: dateStr,
          isAvailable,
          hasEvent,
          hasPostponedEvent,
        })
      }

      months.push({
        name: month.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        days,
      })
    }

    return months
  }, [venueId])

  const venue = getVenueById(venueId)
  const venueEvents = getEventsByVenue(venueId)

  // Debug logging
  console.log("Venue ID:", venueId)
  console.log("Venue found:", venue)
  console.log("Venue events:", venueEvents)

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Venue Not Found</h1>
          <p className="text-gray-600 mb-4">The venue you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/events")}>Back to Events</Button>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
    }

    return `${start.toLocaleDateString("en-US", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}`
  }

  const handlePostponeEvent = (eventId: string) => {
    const success = postponeEvent(eventId, "Due to unforeseen circumstances")
    if (success) {
      // Force re-render by updating the page
      window.location.reload()
    }
  }

  const handleUnpostponeEvent = (eventId: string) => {
    // For demo purposes, set new dates
    const newStartDate = "2025-06-18"
    const newEndDate = "2025-06-19"
    const success = unpostponeEvent(eventId, newStartDate, newEndDate)
    if (success) {
      // Force re-render by updating the page
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={venue.images[currentImageIndex] || "/placeholder.svg"}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Image Navigation */}
        {venue.images.length > 1 && (
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
                  {venue.isVerified && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {venue.isPremium && <Badge className="bg-yellow-500 text-yellow-900">Premium</Badge>}
                </div>
                <div className="flex items-center text-white/90 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {venue.location.address}, {venue.location.city}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{venue.rating.average}</span>
                    <span className="ml-1">({venue.rating.count} reviews)</span>
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
        {venue.images.length > 1 && (
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            {/* <TabsTrigger value="calendar">Event Calendar</TabsTrigger> */}
            <TabsTrigger value="spaces">Meeting Spaces</TabsTrigger>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{venue.capacity.theater}</div>
                        <div className="text-sm text-gray-600">Theater</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{venue.capacity.banquet}</div>
                        <div className="text-sm text-gray-600">Banquet</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{venue.capacity.cocktail}</div>
                        <div className="text-sm text-gray-600">Cocktail</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{venue.capacity.classroom}</div>
                        <div className="text-sm text-gray-600">Classroom</div>
                      </div>
                    </div>

                    {/* Amenities */}
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
                  </CardContent>
                </Card>

                {/* Pricing Packages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Packages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {venue.pricing.packages.map((pkg, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-lg mb-2">{pkg.name}</h4>
                          <div className="text-2xl font-bold text-blue-600 mb-3">
                            {venue.pricing.currency}
                            {pkg.price.toLocaleString()}
                          </div>
                          <ul className="space-y-2">
                            {pkg.includes.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                          <Button className="w-full mt-4" variant={index === 1 ? "default" : "outline"}>
                            Select Package
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Events at This Venue */}
                {venueEvents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Events at This Venue</CardTitle>
                      <p className="text-sm text-gray-600">
                        {venueEvents.length} event{venueEvents.length > 1 ? "s" : ""} scheduled at {venue.name}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {venueEvents.map((event) => {
                          const isPostponed = isEventPostponed(event.id)
                          const originalDates = getOriginalEventDates(event.id)

                          return (
                            <div
                              key={event.id}
                              className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => router.push(`/events?search=${encodeURIComponent(event.title)}`)}
                            >
                              <Image
                                src={event.images?.[0]?.url || "/placeholder.svg"}
                                alt={event.title}
                                width={120}
                                height={80}
                                className="w-30 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-lg text-gray-900 mb-1">{event.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isPostponed ? (
                                      <Badge className="bg-orange-100 text-orange-800">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Postponed
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant={
                                          event.status === "upcoming"
                                            ? "default"
                                            : event.status === "live"
                                              ? "destructive"
                                              : "secondary"
                                        }
                                        className={
                                          event.status === "upcoming"
                                            ? "bg-green-100 text-green-800"
                                            : event.status === "live"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-gray-100 text-gray-800"
                                        }
                                      >
                                        {event.status}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {isPostponed && originalDates.startDate && originalDates.endDate ? (
                                      <span className="text-gray-400 line-through">
                                        {formatDateRange(originalDates.startDate, originalDates.endDate)}
                                      </span>
                                    ) : (
                                      <span className={isPostponed ? "text-gray-400" : ""}>
                                        {formatDate(event.timings.startDate)} - {formatDate(event.timings.endDate)}
                                      </span>
                                    )}
                                    {isPostponed && <span className="text-orange-600 font-medium ml-2">Postponed</span>}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    22 followers
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {event.categories.slice(0, 3).map((category, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {category}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {event.vip && <Badge className="bg-yellow-500 text-yellow-900 text-xs">VIP</Badge>}
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                      <span className="text-sm font-medium">{event.rating.average}</span>
                                    </div>
                                    <span className="text-sm font-medium text-blue-600">
                                      {event.pricing.currency}
                                      {event.pricing.general === 0 ? "Free" : event.pricing.general.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Postpone/Unpostpone Button */}
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    {isPostponed ? (
                                      <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm text-orange-600">
                                          {event.postponedReason || "Event postponed"}
                                        </span>
                                      </div>
                                    ) : (
                                      <div></div>
                                    )}
                                    <Button
                                      variant={isPostponed ? "default" : "outline"}
                                      size="sm"
                                      onClick={(e:any) => {
                                        e.stopPropagation()
                                        if (isPostponed) {
                                          handleUnpostponeEvent(event.id)
                                        } else {
                                          handlePostponeEvent(event.id)
                                        }
                                      }}
                                      className={isPostponed ? "bg-green-600 hover:bg-green-700" : ""}
                                    >
                                      {isPostponed ? "Set New Date" : "Postpone Event"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {venueEvents.length > 3 && (
                        <div className="mt-4 text-center">
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/events?venue=${encodeURIComponent(venue.name)}`)}
                          >
                            View All {venueEvents.length} Events
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{venue.contact.phone}</span>
                    </div>
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

                {/* Rating Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(venue.rating.breakdown).map(([category, rating]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="capitalize text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(rating / 5) * 100}%` }} />
                          </div>
                          <span className="text-sm font-medium">{rating}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Policies */}
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Cancellation</h4>
                      <p className="text-xs text-gray-600">{venue.policies.cancellation}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Parking</h4>
                      <p className="text-xs text-gray-600">{venue.policies.parking}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Accessibility</h4>
                      <p className="text-xs text-gray-600">{venue.policies.accessibility}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Address & Directions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="font-medium">{venue.location.address}</div>
                        <div className="text-gray-600">
                          {venue.location.city}, {venue.location.state} {venue.location.zipCode}
                        </div>
                        <div className="text-gray-600">{venue.location.country}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Transportation</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>• 5 minutes from Goregaon Railway Station</div>
                      <div>• Direct bus connectivity from major areas</div>
                      <div>• 30 minutes from Mumbai Airport</div>
                      <div>• Taxi and ride-sharing services available</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Nearby Landmarks</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>• Oberoi Mall - 2 km</div>
                      <div>• Mindspace Business Park - 3 km</div>
                      <div>• Film City - 5 km</div>
                      <div>• Powai Lake - 8 km</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Map View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>Interactive Map</p>
                      <p className="text-sm">Lat: {venue.location.coordinates.lat}</p>
                      <p className="text-sm">Lng: {venue.location.coordinates.lng}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Get Directions
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      View in Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Event Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Availability Calendar</CardTitle>
                <p className="text-sm text-gray-600">Green: Available • Red: Booked • Blue: Has Events</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {calendarData.map((month, monthIndex) => (
                    <div key={monthIndex} className="space-y-4">
                      <h3 className="font-semibold text-center">{month.name}</h3>
                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="p-2 font-medium text-gray-500">
                            {day}
                          </div>
                        ))}
                        {month.days.map((day, dayIndex) => (
                          <div key={dayIndex} className="aspect-square">
                            {day ? (
                              <button
                                className={`w-full h-full rounded text-xs font-medium transition-colors ${
                                  day.hasPostponedEvent
                                    ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed"
                                    : day.hasEvent
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                      : day.isAvailable
                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                        : "bg-red-100 text-red-800"
                                }`}
                                onClick={() => !day.hasPostponedEvent && setSelectedDate(day.date)}
                                disabled={day.hasPostponedEvent}
                              >
                                {day.day}
                              </button>
                            ) : (
                              <div />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upcoming Events */}
                {venueEvents.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                      {venueEvents.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(event.timings.startDate)} - {formatDate(event.timings.endDate)}
                            </p>
                          </div>
                          <Badge variant="secondary">{event.categories[0]}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meeting Spaces Tab */}
          <TabsContent value="spaces" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {venue.meetingSpaces.map((space) => (
                <Card key={space.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <Image
                        src={space.images[0] || "/placeholder.svg"}
                        alt={space.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{space.name}</h3>
                      <div className="space-y-2 mb-4">
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
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {space.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => setSelectedSpace(space.id)}
                        variant={selectedSpace === space.id ? "default" : "outline"}
                      >
                        {selectedSpace === space.id ? "Selected" : "Select Space"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedSpace && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Selected Space:</span>
                      <span className="font-medium">
                        {venue.meetingSpaces.find((s) => s.id === selectedSpace)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Hourly Rate:</span>
                      <span className="font-medium">
                        {venue.pricing.currency}
                        {venue.meetingSpaces.find((s) => s.id === selectedSpace)?.hourlyRate.toLocaleString()}
                      </span>
                    </div>
                    <Button className="w-full">Proceed to Booking</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>

                {venue.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {review.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{review.author}</h4>
                              <p className="text-sm text-gray-600">{review.eventType}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Review Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Rating</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{venue.rating.average}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(venue.rating.average) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{venue.rating.count} reviews</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rating Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = Math.floor(venue.rating.count * (stars === 5 ? 0.6 : stars === 4 ? 0.3 : 0.1))
                      const percentage = (count / venue.rating.count) * 100

                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-8">{stars}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
