"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Plus, MoreHorizontal, Users } from "lucide-react"

interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  venue?: {
    name: string
    location: {
      city: string
    }
  }
  status: string
  type: string
  description?: string
  attendeeCount?: number
}

interface EventsSectionProps {
  userId: string
}

export function EventsSection({ userId }: EventsSectionProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserEvents()
  }, [userId])

  const fetchUserEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${userId}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()
      setEvents(data.events)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const upcomingEvents = events.filter((event) => new Date(event.startDate) > new Date())
  const pastEvents = events.filter((event) => new Date(event.endDate) < new Date())
  const organizedEvents = events.filter((event) => event.status === "organized")

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchUserEvents}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Register for Event
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
          <TabsTrigger value="organized">Organized ({organizedEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge variant="default">{event.status}</Badge>
                      </div>
                      {event.description && <p className="text-gray-600 mb-3 text-sm">{event.description}</p>}
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.startDate).toLocaleDateString()} -{" "}
                          {new Date(event.endDate).toLocaleDateString()}
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.venue.name}, {event.venue.location.city}
                          </div>
                        )}
                        {event.attendeeCount && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.attendeeCount} attendees
                          </div>
                        )}
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">No upcoming events found.</p>
                <Button className="mt-4">Browse Events</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      {event.description && <p className="text-gray-600 mb-3 text-sm">{event.description}</p>}
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.venue.name}, {event.venue.location.city}
                          </div>
                        )}
                        {event.attendeeCount && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.attendeeCount} attendees
                          </div>
                        )}
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600">No past events found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="organized">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-2">No organized events found.</p>
              <p className="text-sm text-gray-500 mb-4">Upgrade to an organizer account to create and manage events.</p>
              <Button variant="outline">Upgrade Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
