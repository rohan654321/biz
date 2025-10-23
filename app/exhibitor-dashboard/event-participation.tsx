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

interface Booth {
  id: string
  eventId: string
  exhibitorId: string
  spaceId: string
  spaceReference: string
  boothNumber: string
  companyName: string
  description: string
  additionalPower: number
  compressedAir: number
  setupRequirements: {
    requirements: string
  }
  specialRequests: string
  totalCost: number
  currency: string
  status: string
  createdAt: string
  updatedAt: string
  exhibitor: any
  event: {
    id: string
    title: string
    description: string
    shortDescription: string
    slug: string
    status: string
    category: string
    startDate: string
    endDate: string
    registrationStart: string
    registrationEnd: string
    timezone: string
    venueId: string
    isVirtual: boolean
    maxAttendees: number | null
    currentAttendees: number
    currency: string
    organizer: {
      id: string
      firstName: string
      lastName: string
      company: string
    }
    venue: {
      id: string
      venueName: string
      venueDescription: string
      venueAddress: string
    }
  }
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
  currency: string
  organizer?: {
    id: string
    firstName: string
    lastName: string
    company: string
  }
  // Add raw date fields for proper comparison
  rawStartDate: string
  rawEndDate: string
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
      console.log("EventParticipation - API Response:", data)

      if (data.success && data.booths) {
        const transformedEvents = data.booths.map((booth: Booth) => ({
          id: booth.id,
          eventId: booth.event.id,
          eventName: booth.event.title,
          date: new Date(booth.event.startDate).toLocaleDateString(),
          endDate: new Date(booth.event.endDate).toLocaleDateString(),
          venue: booth.event.venue?.venueName || booth.event.venue?.venueAddress || "TBD",
          boothSize: "Standard",
          boothNumber: booth.boothNumber,
          paymentStatus: booth.status === "BOOKED" ? "PAID" : "PENDING",
          setupTime: "2 hours before event",
          dismantleTime: "1 hour after event",
          passes: 2,
          passesUsed: 0,
          invoiceAmount: booth.totalCost,
          currency: booth.currency,
          status: booth.event.status,
          specialRequests: booth.specialRequests,
          organizer: booth.event.organizer
            ? {
                id: booth.event.organizer.id,
                firstName: booth.event.organizer.firstName,
                lastName: booth.event.organizer.lastName,
                company: booth.event.organizer.company || "",
              }
            : undefined,
          // Store raw dates for proper comparison
          rawStartDate: booth.event.startDate,
          rawEndDate: booth.event.endDate,
        }))
        console.log("EventParticipation - Transformed events:", transformedEvents)
        setEvents(transformedEvents)
      } else {
        console.log("EventParticipation - No booths found")
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

  // Get current date for comparison (UTC to avoid timezone issues)
  const currentDate = new Date()
  console.log("EventParticipation - Current date:", currentDate.toISOString())

  // Upcoming events: events that haven't ended yet
  const upcomingEvents = events.filter((event) => {
    try {
      const eventEndDate = new Date(event.rawEndDate)
      const isUpcoming = eventEndDate > currentDate
      console.log(`Event: ${event.eventName}, Raw End: ${event.rawEndDate}, Parsed End: ${eventEndDate.toISOString()}, Is Upcoming: ${isUpcoming}`)
      return isUpcoming
    } catch (error) {
      console.error(`Error parsing date for event ${event.eventName}:`, error)
      return false
    }
  })

  // Past events: events that have ended
  const pastEvents = events.filter((event) => {
    try {
      const eventEndDate = new Date(event.rawEndDate)
      const isPast = eventEndDate <= currentDate
      console.log(`Event: ${event.eventName}, Raw End: ${event.rawEndDate}, Parsed End: ${eventEndDate.toISOString()}, Is Past: ${isPast}`)
      return isPast
    } catch (error) {
      console.error(`Error parsing date for event ${event.eventName}:`, error)
      return false
    }
  })

  console.log("EventParticipation - All events:", events.length)
  console.log("EventParticipation - Upcoming events:", upcomingEvents.length)
  console.log("EventParticipation - Past events:", pastEvents.length)
  console.log("EventParticipation - Upcoming events names:", upcomingEvents.map(e => e.eventName))
  console.log("EventParticipation - Past events names:", pastEvents.map(e => e.eventName))

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
            <div className="font-semibold text-purple-600">
              {event.currency === "USD" ? "$" : "₹"}{event.invoiceAmount}
            </div>
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