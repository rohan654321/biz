"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  MapPin,
  Download,
  CreditCard,
  FileText,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Building,
} from "lucide-react"

interface EventParticipationProps {
  exhibitorId: string
}

interface Event {
  id: string
  eventId: string
  eventName: string
  date: string
  endDate: string
  venue: string
  boothSize: string
  boothNumber: string
  paymentStatus: string
  setupTime?: string
  dismantleTime?: string
  passes: number
  passesUsed: number
  invoiceAmount: number
  status: string
  specialRequests?: string
  organizer?: {
    id: string
    firstName: string
    lastName: string
    company: string
  }
}

export default function EventParticipation({ exhibitorId }: EventParticipationProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (exhibitorId && exhibitorId !== "undefined") {
      fetchEvents()
    }
  }, [exhibitorId])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/events/exhibitors/${exhibitorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()

      if (data.success && data.data?.events) {
        const transformedEvents = data.data.events.map((eventData: any) => ({
          id: eventData.booth.id,
          eventId: eventData.event.id,
          eventName: eventData.event.title,
          date: new Date(eventData.event.startDate).toLocaleDateString(),
          endDate: new Date(eventData.event.endDate).toLocaleDateString(),
          venue: eventData.event.venue?.name || "TBD",
          boothSize: eventData.booth.size || "Standard",
          boothNumber: eventData.booth.boothNumber || "TBD",
          paymentStatus: eventData.booth.paymentStatus || "PENDING",
          setupTime: eventData.event.setupTime,
          dismantleTime: eventData.event.dismantleTime,
          passes: eventData.booth.passes || 2,
          passesUsed: eventData.booth.passesUsed || 0,
          invoiceAmount: eventData.booth.price || 0,
          status: eventData.event.status,
          specialRequests: eventData.booth.specialRequests,
          organizer: eventData.event.organizer
            ? {
                id: eventData.event.organizer.id,
                firstName: eventData.event.organizer.firstName,
                lastName: eventData.event.organizer.lastName,
                company: eventData.event.organizer.company || "",
              }
            : undefined,
        }))
        setEvents(transformedEvents)
      } else {
        setEvents([])
      }
    } catch (err) {
      console.error("Error fetching events:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const upcomingEvents = events.filter((event) => event.status === "PUBLISHED" && new Date(event.endDate) > new Date())

  const pastEvents = events.filter((event) => event.status === "COMPLETED" || new Date(event.endDate) <= new Date())

  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{event.eventName}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {event.date} - {event.endDate}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.venue}
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Booth: {event.boothNumber} ({event.boothSize})
              </div>
            </div>
          </div>
          <Badge
            variant={event.paymentStatus === "PAID" ? "default" : "destructive"}
            className={event.paymentStatus === "PAID" ? "bg-green-500" : ""}
          >
            {event.paymentStatus === "PAID" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {event.paymentStatus}
          </Badge>
        </div>

        {!isPast && event.setupTime && event.dismantleTime && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Setup:</span>
              </div>
              <p className="text-gray-600 ml-6">{event.setupTime}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="font-medium">Dismantle:</span>
              </div>
              <p className="text-gray-600 ml-6">{event.dismantleTime}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-600">{event.passes}</div>
            <div className="text-gray-600">Total Passes</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-600">{event.passesUsed}</div>
            <div className="text-gray-600">Used Passes</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="font-semibold text-purple-600">₹{(event.invoiceAmount / 1000).toFixed(0)}K</div>
            <div className="text-gray-600">Invoice Amount</div>
          </div>
          {isPast && (
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-semibold text-orange-600">45</div>
              <div className="text-gray-600">Leads Generated</div>
            </div>
          )}
        </div>

        {event.specialRequests && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Special Requests:</p>
            <p className="text-sm text-gray-600">{event.specialRequests}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <FileText className="w-4 h-4" />
            Exhibitor Manual
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Invoice
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Users className="w-4 h-4" />
            Passes
          </Button>
          {!isPast && event.paymentStatus === "PENDING" && (
            <Button size="sm" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <CreditCard className="w-4 h-4" />
              Pay Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchEvents}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Participation</h1>
        <Button className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Register for New Event
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No upcoming events</h3>
                <p className="text-gray-500">Register for events to see them here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => <EventCard key={event.id} event={event} isPast={true} />)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No past events</h3>
                <p className="text-gray-500">Your completed events will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <FileText className="w-6 h-6" />
              <span>Download Manual</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <MapPin className="w-6 h-6" />
              <span>Booth Location</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <Users className="w-6 h-6" />
              <span>Request Passes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <Download className="w-6 h-6" />
              <span>Download Invoice</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
