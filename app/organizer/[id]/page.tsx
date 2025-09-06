"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Star,
  Share2,
  Heart,
  Award,
  Building,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

interface Organizer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  location: string
  website: string
  description: string
  avatar: string
  totalEvents: number
  activeEvents: number
  totalAttendees: number
  totalRevenue: number
  founded: string
  teamSize: string
  headquarters: string
  specialties: string[]
  achievements: string[]
  certifications: string[]
  organizationName: string
  businessEmail: string
  businessPhone: string
  businessAddress: string
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  startDate: string
  endDate: string
  location: string
  status: string
  attendees: number
  registrations: number
  revenue: number
  type: string
  maxAttendees: number
  isVirtual: boolean
  bannerImage?: string
  thumbnailImage?: string
  isPublic: boolean
}

export default function OrganizerPage() {
  const params = useParams()
  const router = useRouter()
  const organizerId = params.id as string

  const [activeTab, setActiveTab] = useState("overview")
  const [currentPage, setCurrentPage] = useState(1)
  const [organizer, setOrganizer] = useState<Organizer | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const eventsPerPage = 6

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setLoading(true)

        // Fetch organizer details
        const organizerResponse = await fetch(`/api/organizers/${organizerId}`)
        if (!organizerResponse.ok) {
          throw new Error("Organizer not found")
        }
        const organizerData = await organizerResponse.json()
        setOrganizer(organizerData.organizer)

        // Fetch organizer events
        const eventsResponse = await fetch(`/api/organizers/${organizerId}/events`)
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          setEvents(eventsData.events || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load organizer")
      } finally {
        setLoading(false)
      }
    }

    if (organizerId) {
      fetchOrganizerData()
    }
  }, [organizerId])

  // Calculate organizer statistics
  const stats = useMemo(() => {
    if (!organizer || !events)
      return {
        totalEvents: 0,
        avgRating: 0,
        upcomingEvents: 0,
        completedEvents: 0,
        featuredEvents: 0,
      }

    const totalEvents = events.length
    const avgRating = 4.5 // placeholder since we don't have ratings in the API yet
    const upcomingEvents = events.filter((event) => event.status === "Active").length
    const completedEvents = events.filter((event) => event.status === "Completed").length
    const featuredEvents = 0 // placeholder

    return {
      totalEvents,
      avgRating,
      upcomingEvents,
      completedEvents,
      featuredEvents,
    }
  }, [organizer, events])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Organizer...</h1>
          <p className="text-gray-600">Please wait while we fetch the organizer details.</p>
        </div>
      </div>
    )
  }

  if (error || !organizer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Organizer Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The organizer you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/organizers")}>Back to Organizers</Button>
        </div>
      </div>
    )
  }

  // Pagination for events
  const totalPages = Math.ceil(events.length / eventsPerPage)
  const paginatedEvents = events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#002C71] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Organizer Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={organizer.avatar || "/placeholder.svg"} alt={organizer.name} />
                <AvatarFallback className="text-2xl font-bold bg-white text-blue-600">
                  {organizer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Organizer Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{organizer.name}</h1>
                <Badge className="bg-yellow-500 text-yellow-900">Verified</Badge>
              </div>
              <p className="text-xl text-blue-100 mb-4">{organizer.description}</p>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{organizer.headquarters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{organizer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{organizer.email}</span>
                </div>
                {organizer.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a href={organizer.website} className="hover:text-white transition-colors">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{organizer.totalEvents}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{organizer.activeEvents}</div>
              <div className="text-sm text-gray-600">Active Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{organizer.totalAttendees}</div>
              <div className="text-sm text-gray-600">Total Attendees</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">{stats.avgRating}</span>
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.featuredEvents}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{organizer.founded}</div>
              <div className="text-sm text-gray-600">Founded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events ({stats.totalEvents})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Highlights */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      About {organizer.organizationName}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{organizer.description}</p>
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Events</h3>
                    <div className="space-y-4">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Image
                            src={event.bannerImage || "/placeholder.svg?height=60&width=80"}
                            alt={event.title}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(event.startDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">4.5</span>
                            </div>
                            <Badge variant={event.status === "Active" ? "default" : "secondary"}>{event.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={() => setActiveTab("events")}>
                        View All Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Specialties */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {organizer.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements
                    </h3>
                    <div className="space-y-2">
                      {organizer.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                    <div className="space-y-2">
                      {organizer.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">All Events by {organizer.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing {paginatedEvents.length} of {events.length} events
                </span>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={event.bannerImage || "/placeholder.svg?height=200&width=400"}
                        alt={event.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-3 right-3 bg-blue-500 text-white">{event.type}</Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h4>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(event.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">4.5</span>
                          <span className="text-sm text-gray-500">(12)</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{event.attendees} attendees</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-sm ${
                        currentPage === page ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Founded</label>
                      <p className="text-gray-900">{organizer.founded}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Headquarters</label>
                      <p className="text-gray-900">{organizer.headquarters}</p>
                    </div>
                    {organizer.website && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Website</label>
                        <a href={organizer.website} className="text-blue-600 hover:underline flex items-center gap-1">
                          {organizer.website}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact</label>
                      <div className="space-y-1">
                        <p className="text-gray-900">{organizer.phone}</p>
                        <p className="text-gray-900">{organizer.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Event Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Events Organized</span>
                      <span className="font-semibold">{organizer.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Events</span>
                      <span className="font-semibold">{organizer.activeEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Attendees</span>
                      <span className="font-semibold">{organizer.totalAttendees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold">${organizer.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Size</span>
                      <span className="font-semibold">{organizer.teamSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{stats.avgRating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Full Description</h3>
                <p className="text-gray-600 leading-relaxed">{organizer.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Reviews Coming Soon</h3>
              <p className="text-gray-600">We're working on adding event reviews and ratings from attendees.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
