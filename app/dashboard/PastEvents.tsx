"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Calendar as CalendarIcon, MapPin } from "lucide-react"
import { Event } from "./events-section" // reusing Event type
import { TicketType } from "@prisma/client"

/* ---------- Helpers ---------- */
const DEFAULT_IMAGE = "/image/download2.jpg"
const DEFAULT_ADDRESS = "Address not specified"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

// Dot color
const timelineDotClass = (leadType?: string) => {
  if (!leadType) return "bg-gray-400"
  if (leadType === "exhibitor") return "bg-green-600"
  if (leadType === "visitor") return "bg-blue-600"
  return "bg-gray-600"
}

// Status pill
const statusPillClass = (status?: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-50 text-green-800 border-green-100"
    case "pending":
      return "bg-yellow-50 text-yellow-800 border-yellow-100"
    case "rejected":
      return "bg-red-50 text-red-800 border-red-100"
    default:
      return "bg-gray-50 text-gray-700 border-gray-100"
  }
}

const formatTicketPrice = (ticketTypes: TicketType[]) => {
  if (!ticketTypes || ticketTypes.length === 0) return "Free"

  // Find the cheapest active ticket
  const activeTickets = ticketTypes.filter((ticket) => ticket.isActive)
  if (activeTickets.length === 0) return "N/A"

  const cheapestTicket = activeTickets.reduce((min, ticket) => {
    const price =
      ticket.earlyBirdPrice && new Date() < new Date(ticket.earlyBirdEnd || "") ? ticket.earlyBirdPrice : ticket.price
    const minPrice =
      min.earlyBirdPrice && new Date() < new Date(min.earlyBirdEnd || "") ? min.earlyBirdPrice : min.price
    return price < minPrice ? ticket : min
  })

  const currentPrice =
    cheapestTicket.earlyBirdPrice && new Date() < new Date(cheapestTicket.earlyBirdEnd || "")
      ? cheapestTicket.earlyBirdPrice
      : cheapestTicket.price

  if (currentPrice === 0) return "Free"
  return `$${currentPrice.toFixed(2)}`
}

// Helper function to get address with fallback
const getEventAddress = (event: Event) => {
  if (event.address && event.address.trim() !== "") return event.address
  if (event.location && event.location.trim() !== "") return event.location
  if (event.city && event.state) return `${event.city}, ${event.state}`
  if (event.city) return event.city
  if (event.state) return event.state
  return DEFAULT_ADDRESS
}

/* ---------- Component ---------- */
interface PastEventsProps {
  userId?: string
}

export function PastEvents({ userId }: PastEventsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const targetUserId = userId || session?.user?.id

  useEffect(() => {
    if (!targetUserId) return
    fetchPastEvents()
  }, [targetUserId])

  const fetchPastEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users/${targetUserId}/interested-events`)
      if (!res.ok) throw new Error("Failed to fetch past events")
      const data = await res.json()

      const events: Event[] = data?.events || []
      
      // Debug: Log all events and their dates
      console.log('=== DEBUG: All events from API ===')
      events.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`)
        console.log(`   Start: ${event.startDate}`)
        console.log(`   End: ${event.endDate}`)
        console.log(`   End Date Object: ${new Date(event.endDate)}`)
        console.log(`   Today: ${new Date()}`)
        console.log(`   Is Past: ${new Date(event.endDate) < new Date()}`)
        console.log('---')
      })

      // Get today's date at start of day (midnight) for accurate comparison
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Filter events that ended before today
      const pastOnly = events.filter((ev) => {
        if (!ev.endDate) return false
        
        // Create date object for event end date at start of day
        const eventEndDate = new Date(ev.endDate)
        eventEndDate.setHours(0, 0, 0, 0)
        
        return eventEndDate < today
      })

      console.log(`Filtered ${pastOnly.length} past events from ${events.length} total events`)

      setPastEvents(
        pastOnly.map((ev) => ({
          ...ev,
          startDate: ev.startDate ? new Date(ev.startDate).toISOString() : new Date().toISOString(),
          endDate: ev.endDate ? new Date(ev.endDate).toISOString() : new Date(ev.startDate || new Date()).toISOString(),
        }))
      )
    } catch (err) {
      console.error("Error fetching past events:", err)
      setPastEvents([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (!pastEvents.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 mb-4">No past events found.</p>
          <Button variant="outline" onClick={() => router.push("/event")}>
            Browse Events
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative border-l-2 border-gray-200 ml-6">
        {pastEvents.map((event) => (
          <div key={event.id} className="mb-10 ml-6 relative">
            {/* Timeline Dot */}
            <span
              className={`absolute -left-[35px] flex items-center justify-center w-5 h-5 rounded-full ring-4 ring-white ${timelineDotClass(
                event.leadType
              )}`}
            />

            {/* Date Heading */}
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {formatDate(event.startDate)} – {formatDate(event.endDate)}
            </p>

            {/* Event Card */}
            <div className="flex w-full border border-gray-200 bg-white rounded-lg hover:shadow-md transition-shadow overflow-hidden">
              {/* Left Image Section */}
              <div className="w-40 h-32 flex-shrink-0">
                <img
                  src={event.thumbnailImage || event.bannerImage || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop"}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-4xl mt-6 ml-2"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.src = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop"
                  }}
                />
              </div>

              {/* Main Content Section */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  {/* Left Content */}
                  <div className="flex-1">
                    {/* Category Badge */}
                    <div className="mb-2">
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        {event.category || "Event"}
                      </span>
                    </div>

                    {/* Title and Main Content */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h2>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                          {event.shortDescription || event.description || "No description available"}
                        </p>

                        {/* Location and Date */}
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{getEventAddress(event)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>
                              {formatDate(event.startDate)} - {formatDate(event.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Icon */}
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-50 rounded-lg ml-6 flex-shrink-0">
                        <span className="text-2xl">🎟️</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Stats Section */}
                  <div className="ml-8 flex flex-col items-end">
                    {/* Expected Visitors and Exhibitors */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between gap-8">
                        <span className="text-gray-500 whitespace-nowrap">Expected Visitors</span>
                        <span className="font-semibold text-gray-900 text-right min-w-[40px]">
                          {event.expectedExhibitors || event.maxAttendees || "200"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-gray-500 whitespace-nowrap">Exptd Exhibitors</span>
                        <span className="font-semibold text-gray-900 text-right min-w-[40px]">
                          {event.expectedExhibitors || "200"}
                        </span>
                      </div>
                    </div>

                    {/* Entry Fee */}
                    <div className="text-center">
                      <span className="text-xl font-bold text-pink-500 block">
                        {formatTicketPrice(event.ticketTypes as unknown as TicketType[])}
                      </span>
                      <span className="text-gray-500 text-sm">Entry Fee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PastEvents