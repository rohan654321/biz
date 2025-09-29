"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Clock, DollarSign, Star, User, Building, Ticket, Globe, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  description: string
  shortDescription?: string
  status: string
  category?: string
  tags: string[]
  eventType: string[]
  isFeatured?: boolean
  isVIP?: boolean
  startDate: string
  endDate: string
  registrationStart: string
  registrationEnd: string
  timezone: string
  isVirtual: boolean
  virtualLink?: string
  address?: string
  location?: string
  city?: string
  state?: string
  country?: string
  maxAttendees?: number
  currentAttendees: number
  currency: string
  images: string[]
  bannerImage?: string
  thumbnailImage?: string
  isPublic: boolean
  requiresApproval: boolean
  allowWaitlist: boolean
  averageRating: number
  totalReviews: number
  organizer: {
    id: string
    firstName: string
    lastName: string
    email?: string
    avatar?: string
    organizationName?: string
    description?: string
  }
  venue?: {
    id: string
    venueName?: string
    venueAddress?: string
    venueCity?: string
    venueState?: string
    venueCountry?: string
    maxCapacity?: number
    amenities: string[]
    averageRating: number
  }
  ticketTypes: Array<{
    id: string
    name: string
    description?: string
    price: number
    earlyBirdPrice?: number
    earlyBirdEnd?: string
    quantity: number
    sold: number
    isActive: boolean
  }>
  speakerSessions: Array<{
    id: string
    title: string
    description: string
    sessionType: string
    duration: number
    startTime: string
    endTime: string
    room?: string
    speaker: {
      id: string
      firstName: string
      lastName: string
      avatar?: string
      bio?: string
      company?: string
      jobTitle?: string
    }
  }>
  availableTickets: number
  isAvailable: boolean
  registrationCount: number
  reviewCount: number
}

interface EventInfoProps {
  eventId: string
}

export function EventInfo({ eventId }: EventInfoProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch event")
        }
        const eventData = await response.json()
        setEvent(eventData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  if (loading) {
    return <div className="text-center py-8">Loading event details...</div>
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <p>Error loading event: {error}</p>
        </div>
      </Card>
    )
  }

  if (!event) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Event not found</p>
        </div>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden">
        {event.bannerImage && (
          <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 relative">
            <img
              src={event.bannerImage || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn("text-xs", getStatusColor(event.status))}>{event.status}</Badge>
                {event.isFeatured && <Badge variant="secondary">Featured</Badge>}
                {event.isVIP && <Badge variant="outline">VIP</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{event.title}</h1>
              {event.shortDescription && <p className="text-lg text-muted-foreground mb-4">{event.shortDescription}</p>}
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {event.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{event.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({event.reviewCount} reviews)</span>
                </div>
              )}
              {/* <Button size="lg" className="w-full lg:w-auto">
                <Ticket className="h-4 w-4 mr-2" />
                Register Now
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(event.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Attendees</p>
                    <p className="text-sm text-muted-foreground">
                      {event.currentAttendees} registered
                      {event.maxAttendees && ` / ${event.maxAttendees} max`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {event.isVirtual ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">{event.isVirtual ? "Virtual Event" : "Location"}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.isVirtual ? "Online" : `${event.city}, ${event.state}, ${event.country}`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          {/* Speakers */}
          {event.speakerSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Speakers & Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.speakerSessions.map((session) => (
                    <div key={session.id} className="flex gap-4 p-4 border rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.speaker.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {session.speaker.firstName[0]}
                          {session.speaker.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{session.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {session.speaker.firstName} {session.speaker.lastName}
                          </span>
                          {session.speaker.company && <span>{session.speaker.company}</span>}
                          <span>{session.duration} minutes</span>
                          <Badge variant="outline" className="text-xs">
                            {session.sessionType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Organizer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {event.organizer.firstName[0]}
                    {event.organizer.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </h4>
                  {event.organizer.organizationName && (
                    <p className="text-sm text-muted-foreground">{event.organizer.organizationName}</p>
                  )}
                  {event.organizer.description && (
                    <p className="text-xs text-muted-foreground mt-2">{event.organizer.description}</p>
                  )}
                  {event.organizer.email && (
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Mail className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Venue */}
          {event.venue && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Venue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold">{event.venue.venueName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.venue.venueAddress}, {event.venue.venueCity}, {event.venue.venueState}
                  </p>
                  {event.venue.maxCapacity && (
                    <p className="text-xs text-muted-foreground">Capacity: {event.venue.maxCapacity} people</p>
                  )}
                  {event.venue.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{event.venue.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tickets */}
          {event.ticketTypes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-medium">{ticket.name}</h5>
                        <span className="font-semibold">
                          {event.currency} {ticket.price}
                        </span>
                      </div>
                      {ticket.description && <p className="text-xs text-muted-foreground mb-2">{ticket.description}</p>}
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{ticket.quantity - ticket.sold} available</span>
                        <span>{ticket.sold} sold</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
