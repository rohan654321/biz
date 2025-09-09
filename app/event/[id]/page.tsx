"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Phone, Mail, MapPin, Clock, IndianRupee } from "lucide-react"
import { notFound } from "next/navigation"
import EventHero from "@/components/event-hero"
import EventImageGallery from "@/components/event-image-gallery"
import { Plus } from "lucide-react"
import { Share2 } from "lucide-react"
import { Bookmark } from "lucide-react"
import { useEffect, useState } from "react"
import ExhibitorsTab from "./exhibitors-tab"
import SpeakersTab from "./speakers-tab"

interface EventPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        setError(null)
        
        // Await the params Promise to get the actual id
        const resolvedParams = await params
        const eventId = resolvedParams.id
        
        // ✅ FIXED: Call the correct endpoint for single event
        const res = await fetch(`/api/events/${eventId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('Event not found')
            return
          }
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json();
        
        // ✅ FIXED: Your API returns { event: ... }, not { events: [...] }
        setEvent(data.event);

      } catch (err) {
        console.error('Error fetching event:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvent()
  }, [params])

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

  const followers = Array(6).fill({
    name: "Ramesh S",
    company: "Mobile Technology",
    location: "Chennai, India",
    imageUrl: "/placeholder.svg?height=80&width=80&text=Profile",
  })

  // ✅ FIXED: Format dates properly
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <EventHero event={event} />
       
       {/* Event Details Section */}
      <div className=" max-w-7xl mx-auto py-4">
        <div className="bg-white rounded-sm  p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Event Title and Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{event.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                {/* ✅ FIXED: Use actual event data */}
                <span>{event.address || event.location || 'Location TBA'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Get Directions
                </Button>
                  <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">4.5</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pr-4 lg:pr-4">
              <p className="text-center text-gray-700 font-medium">Interested in this Event ?</p>
              <div className="flex gap-3 ">
                <Button variant="outline" className="flex-1 border-gray-300 bg-transparent">
                  Visit
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 ">
                  Exhibit</Button>
              </div>
              
            </div>
          </div>
        </div>
       </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="about" className="w-full">
              {/* Enhanced Tab Navigation */}
              <div className="bg-white rounded-lg mb-6 shadow-sm border border-gray-200">
                <TabsList className="grid w-full grid-cols-9 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="exhibitors"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Exhibitors
                  </TabsTrigger>
                  <TabsTrigger
                    value="space-cost"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Space Cost
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Layout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="brochure"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Brochure
                  </TabsTrigger>
                  <TabsTrigger
                    value="venue"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Venue
                  </TabsTrigger>
                  <TabsTrigger
                    value="speakers"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Speakers
                  </TabsTrigger>
                  <TabsTrigger
                    value="organizer"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Organizer
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Review
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="space-y-6">
                {/* Enhanced Image Gallery with Carousel */}
                <EventImageGallery images={event.images || [event.bannerImage].filter(Boolean)} />

                {/* Event Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      About the Event
                      <Badge variant="secondary" className="text-xs">
                        {event.category || 'General'}
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

                {/* Listed In Section */}
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
                      )) || (
                        <p className="text-gray-500">No tags available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
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
                        <span className="font-semibold text-blue-600">
                          {formatDate(event.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-semibold text-blue-600">
                          {formatDate(event.endDate)}
                        </span>
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
                        <span className="font-semibold text-blue-600">
                          {formatDate(event.registrationStart)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Registration End:</span>
                        <span className="font-semibold text-blue-600">
                          {formatDate(event.registrationEnd)}
                        </span>
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
                      <CardTitle>Event Type</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-gray-700">
                        {event.isVirtual ? 'Virtual Event' : 'Physical Event'}
                      </p>
                      {event.isVirtual && event.virtualLink && (
                        <a 
                          href={event.virtualLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mt-2 block"
                        >
                          Join Virtual Event
                        </a>
                      )}
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg pb-4">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
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

                {/* Organizer Section */}
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
                            {event.organizer?.firstName || 'Event Organizer'}
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

                {/* Venue Map */}
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-blue-50 to-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                        <p className="text-gray-700 font-medium">Event Venue</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.location || 'Venue details will be updated soon'}
                        </p>
                        {event.address && (
                          <p className="text-xs text-gray-500 mt-1">{event.address}</p>
                        )}
                        <Button className="mt-3" size="sm">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

              {/* Other tabs remain the same... */}
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
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">{event.venue?.firstName || 'Venue Name'}</h4>
                        <p className="text-gray-600">{event.address || 'Address not available'}</p>
                        <p className="text-gray-600">
                          {event.city && event.state ? `${event.city}, ${event.state}` : 'Location TBA'}
                        </p>
                        {event.country && (
                          <p className="text-gray-600">{event.country}</p>
                        )}
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
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={event.organizer?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg">
                          {event.organizer?.firstName?.charAt(0) || 'O'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{event.organizer?.firstName || 'Event Organizer'}</h4>
                        <p className="text-gray-600 mb-3">Professional event organizer and manager</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-green-600" />
                            <span>{event.organizer?.email || 'Contact via platform'}</span>
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
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-xl">4.5</span>
                      </div>
                      <span className="text-gray-600">out of 5 stars</span>
                    </div>
                    <p className="text-gray-600">Event reviews will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Featured Items */}
            <Card className="hover:shadow-md transition-shadow border-r-2  rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">Featured Hotels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">No featured hotels available.</p>
              </CardContent>
            </Card>

            {/* Featured Travel Partners */}
            <Card className="hover:shadow-md transition-shadow border-r-2 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">Featured Travel Partners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">No travel partners available.</p>
              </CardContent>
            </Card>

            {/* Places to Visit */}
            <Card className="hover:shadow-md transition-shadow border-r-2 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">Places to Visit in {event.city || 'the area'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">No tourist attractions available.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}