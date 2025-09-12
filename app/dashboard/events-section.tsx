"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, Plus, Users, Heart, Eye, Store, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  location?: string
  city?: string
  state?: string
  status: string
  type: string
  description?: string
  shortDescription?: string
  bannerImage?: string
  thumbnailImage?: string
  organizer?: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    company?: string
  }
  leadId?: string
  leadStatus?: string
  leadType?: string
  contactedAt?: string
  followUpDate?: string
  leadNotes?: string
  currentRegistrations?: number
  maxAttendees?: number
}

interface EventsSectionProps {
  userId?: string
}

export function EventsSection({ userId }: EventsSectionProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([])
  const [interestedLoading, setInterestedLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use session user ID if no userId prop is provided
  const targetUserId = userId || session?.user?.id

  useEffect(() => {
    if (status === "loading") return
    if (!targetUserId) {
      setError("User not authenticated")
      setInterestedLoading(false)
      return
    }
    fetchInterestedEvents()
  }, [targetUserId, status])

  const fetchInterestedEvents = async () => {
    if (!targetUserId) return

    try {
      setInterestedLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${targetUserId}/interested-events`)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You need to be logged in to view this information")
        }
        if (response.status === 403) {
          throw new Error("You don't have permission to view these events")
        }
        throw new Error(`Failed to fetch interested events: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.events && Array.isArray(data.events)) {
        setInterestedEvents(data.events)
      } else {
        console.error("Unexpected data structure:", data)
        setInterestedEvents([])
      }
    } catch (err) {
      console.error("Error fetching interested events:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setInterestedLoading(false)
    }
  }

  const getLeadBadgeVariant = (status: string) => {
    switch (status) {
      case "NEW": return "default"
      case "CONTACTED": return "secondary"
      case "QUALIFIED": return "outline"
      case "CONVERTED": return "secondary"
      case "FOLLOW_UP": return "outline"
      case "REJECTED": return "destructive"
      default: return "outline"
    }
  }

  const getLeadIcon = (type: string) => {
    switch (type) {
      case "ATTENDEE": return <Eye className="w-4 h-4" />
      case "EXHIBITOR": return <Store className="w-4 h-4" />
      case "SPEAKER": return <Users className="w-4 h-4" />
      case "SPONSOR": return <Heart className="w-4 h-4" />
      case "PARTNER": return <MessageCircle className="w-4 h-4" />
      default: return <Heart className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date()
  }

  if (status === "loading" || interestedLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Interested Events</h1>
        <Button
          onClick={() => router.push("/event")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Find Events
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        {/* <TabsList>
          <TabsTrigger value="all">
            All Interests ({interestedEvents.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({interestedEvents.filter(e => isUpcoming(e.startDate)).length})
          </TabsTrigger>
          <TabsTrigger value="followup">
            Follow-up ({interestedEvents.filter(e => e.followUpDate && new Date(e.followUpDate) >= new Date()).length})
          </TabsTrigger>
        </TabsList> */}

        <TabsContent value="all" className="space-y-4">
          {interestedEvents.length > 0 ? (
            interestedEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge variant={getLeadBadgeVariant(event.leadStatus || "NEW")}>
                          {event.leadStatus}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getLeadIcon(event.leadType || "ATTENDEE")}
                          {event.leadType}
                        </Badge>
                        {isUpcoming(event.startDate) && (
                          <Badge variant="secondary">Upcoming</Badge>
                        )}
                      </div>

                      {event.shortDescription && (
                        <p className="text-gray-600 mb-3 text-sm">{event.shortDescription}</p>
                      )}

                      <div className="flex items-center gap-4 text-gray-600 text-sm mb-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(event.startDate)} - {formatDate(event.endDate)}
                        </div>

                        {(event.location || event.city) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location || `${event.city}${event.state ? `, ${event.state}` : ''}`}
                          </div>
                        )}

                        <Badge variant="outline">{event.type}</Badge>
                      </div>

                      {event.organizer && (
                        <div className="text-sm text-gray-600 mb-2">
                          Organized by: {event.organizer.firstName} {event.organizer.lastName}
                          {event.organizer.company && ` (${event.organizer.company})`}
                        </div>
                      )}

                      {event.followUpDate && new Date(event.followUpDate) >= new Date() && (
                        <div className="mt-2 text-sm text-orange-600 font-medium">
                          Follow up: {formatDate(event.followUpDate)}
                        </div>
                      )}

                      {event.contactedAt && (
                        <div className="mt-1 text-sm text-gray-500">
                          Contacted: {formatDate(event.contactedAt)}
                        </div>
                      )}

                      {event.leadNotes && (
                        <div className="mt-2 text-sm text-gray-600 italic">
                          Notes: {event.leadNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/event/${event.id}`)}
                      >
                        View Event
                      </Button>

                      <Button variant="ghost" size="sm">
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">No interested events yet.</p>
                <p className="text-sm text-gray-500">
                  Visit event pages and click "I'm Interested" to track events here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {interestedEvents.filter(e => isUpcoming(e.startDate)).map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Same card content as above */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <Badge variant="secondary">Upcoming</Badge>
                      <Badge variant={getLeadBadgeVariant(event.leadStatus || "NEW")}>
                        {event.leadStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(event.startDate)}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Event</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="followup" className="space-y-4">
          {interestedEvents.filter(e => e.followUpDate && new Date(e.followUpDate) >= new Date()).map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Follow-up Due
                      </Badge>
                    </div>
                    <div className="text-sm text-orange-600 font-medium mb-2">
                      Follow up: {event.followUpDate && formatDate(event.followUpDate)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Contact</Button>
                    <Button variant="ghost" size="sm">Mark Done</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}