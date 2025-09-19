"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar as CalendarIcon, MapPin, Plus, Heart, Filter, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

/**
 * Full EventsSection component
 * - Fetches interested events for the current user (or provided userId)
 * - Supports date range filtering via a calendar + date inputs
 * - Renders timeline-style list of events
 * - Shows role badge (Visitor / Exhibitor) using `leadType`
 * - Timeline dot color changes by leadType
 * - Handles loading and error states
 *
 * Paste this file in your React/Next.js component folder and adjust imports if needed.
 */

/* ---------- Types ---------- */
export interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  location?: string
  city?: string
  state?: string
  status?: "pending" | "confirmed" | "rejected" | string
  type?: string
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
  leadType?: "visitor" | "exhibitor" | string
  contactedAt?: string
  followUpDate?: string
  leadNotes?: string
  currentRegistrations?: number
  maxAttendees?: number
}

/* ---------- Props ---------- */
interface EventsSectionProps {
  userId?: string
}

/* ---------- Helpers ---------- */
const DEFAULT_IMAGE = "/image/download2.jpg"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

// Choose dot color based on leadType (visitor / exhibitor / unknown)
const timelineDotClass = (leadType?: string) => {
  if (!leadType) return "bg-gray-400"
  if (leadType === "exhibitor") return "bg-green-600"
  if (leadType === "visitor") return "bg-blue-600"
  return "bg-gray-600"
}

// Choose badge variant or classes for role display
const roleBadgeProps = (leadType?: string) => {
  if (leadType === "exhibitor") {
    return { label: "Exhibitor", classes: "bg-green-100 text-green-800 border-green-200" }
  }
  if (leadType === "visitor") {
    return { label: "Visitor", classes: "bg-blue-100 text-blue-800 border-blue-200" }
  }
  return { label: "Participant", classes: "bg-gray-100 text-gray-800 border-gray-200" }
}

// Status pill classes
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

/* ---------- Component ---------- */
export function EventsSection({ userId }: EventsSectionProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([])
  const [interestedLoading, setInterestedLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // date range filter state
  const [dateFilter, setDateFilter] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [showCalendarFilter, setShowCalendarFilter] = useState(false)

  const targetUserId = userId || session?.user?.id

  useEffect(() => {
    if (status === "loading") return
    if (!targetUserId) {
      setError("User not authenticated")
      setInterestedLoading(false)
      return
    }
    fetchInterestedEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, status])

  // Fetch interested events from API
  const fetchInterestedEvents = async () => {
    if (!targetUserId) return
    try {
      setInterestedLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${targetUserId}/interested-events`)
      if (!response.ok) {
        const text = await response.text().catch(() => "")
        throw new Error(text || "Failed to fetch interested events")
      }

      const data = await response.json()

      // API might return `events` or raw array
      const events: Event[] = data?.events || data || []

      // Normalize date strings (ensure ISO-like string)
      const normalized = events.map((ev) => ({
        ...ev,
        startDate: ev.startDate ? new Date(ev.startDate).toISOString() : new Date().toISOString(),
        endDate: ev.endDate ? new Date(ev.endDate).toISOString() : new Date(ev.startDate || new Date()).toISOString(),
      }))

      setInterestedEvents(normalized)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setInterestedEvents([])
    } finally {
      setInterestedLoading(false)
    }
  }

  // Clear date filter
  const clearDateFilter = () => setDateFilter({ from: undefined, to: undefined })

  // Filter events by date range; inclusive of start/end overlap
  const filterEventsByDate = (events: Event[]) => {
    if (!dateFilter.from && !dateFilter.to) return events
    return events.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      const eventEndDate = new Date(event.endDate || event.startDate)

      // If only from is set
      if (dateFilter.from && !dateFilter.to) {
        return eventEndDate >= dateFilter.from
      }

      // If only to is set
      if (!dateFilter.from && dateFilter.to) {
        return eventStartDate <= dateFilter.to
      }

      // Both from & to present -> check overlap
      if (dateFilter.from && dateFilter.to) {
        const from = dateFilter.from
        const to = dateFilter.to
        return eventStartDate <= to && eventEndDate >= from
      }

      return true
    })
  }

  const filteredEvents = filterEventsByDate(interestedEvents)

  /* ---------- UI: Loading / Error States ---------- */
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

  /* ---------- Render ---------- */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Interested Events</h1>
        <Button onClick={() => router.push("/event")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Find Events
        </Button>
      </div>

      {/* Calendar Filter Section */}
      <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Filter by Date</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalendarFilter(!showCalendarFilter)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showCalendarFilter ? "Hide Filter" : "Show Filter"}
          </Button>
        </div>

        {showCalendarFilter && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Calendar
                mode="range"
                selected={{ from: dateFilter.from, to: dateFilter.to }}
                onSelect={(range) => {
                  setDateFilter({ from: range?.from, to: range?.to })
                }}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-date">From Date</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={dateFilter.from ? format(dateFilter.from, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    setDateFilter((prev) => ({ ...prev, from: date }))
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-date">To Date</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={dateFilter.to ? format(dateFilter.to, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    setDateFilter((prev) => ({ ...prev, to: date }))
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={clearDateFilter}
                  className="flex items-center gap-2"
                  disabled={!dateFilter.from && !dateFilter.to}
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </Button>
                <Button variant="default" onClick={() => setShowCalendarFilter(false)}>
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs (only All for now) */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Events ({filteredEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {filteredEvents.length > 0 ? (
            <div className="relative border-l-2 border-gray-200 ml-6">
              {filteredEvents.map((event) => {
                const defaultImage = DEFAULT_IMAGE
                const role = roleBadgeProps(event.leadType)
                return (
                  <div key={event.id} className="mb-10 ml-6 relative">
                    {/* Timeline Dot (color by role) */}
                    <span
                      className={`absolute -left-[13px] flex items-center justify-center w-5 h-5 rounded-full ring-4 ring-white ${timelineDotClass(
                        event.leadType
                      )}`}
                    />

                    {/* Date Heading */}
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      {formatDate(event.startDate)} – {formatDate(event.endDate)}
                    </p>

                    {/* Event Card */}
                    <Card className="flex w-full border border-gray-200 bg-[#FFF6F6] rounded-lg hover:shadow-md transition-shadow">
                      {/* Image */}
                      <div className="flex grid-2">
                        <div className="w-40 h-28 flex-shrink-0">
                          <img
                            src={event.thumbnailImage || defaultImage}
                            alt={event.title}
                            className="w-full h-full object-cover rounded-l-lg"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement
                              if (!target.src.endsWith(defaultImage)) {
                                target.src = defaultImage
                              }
                            }}
                          />
                        </div>

                        {/* Event Info */}
                        <div className="flex flex-col justify-center p-4 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3
                                onClick={() => router.push(`/event/${event.id}`)}
                                className="text-base font-semibold text-blue-700 hover:underline cursor-pointer"
                              >
                                {event.title}
                              </h3>

                              <p className="text-xs text-gray-600">
                                {formatDate(event.startDate)} – {formatDate(event.endDate)}
                              </p>

                              <p className="text-xs text-blue-600">
                                {event.location ||
                                  `${event.city || ""}${event.state ? `, ${event.state}` : ""}`}
                              </p>

                              {event.description && (
                                <p className="text-xs text-gray-700 mt-1 line-clamp-1">
                                  {event.description}
                                </p>
                              )}
                            </div>

                            {/* Right side: Status pill */}
                            <div className="flex flex-col items-end gap-2">
                              {event.leadType && (
                                <span
                                  className={`text-[11px] px-2 py-1 rounded border ${statusPillClass(
                                    event.leadType
                                  )}`}
                                >
                                  {event.leadType}
                                </span>
                              )}
                              {/* Role badge */}
                              {/* <span className={`text-[11px] px-2 py-1 rounded border ${role.classes}`}>
                                {role.label}
                              </span> */}
                            </div>
                          </div>

                          {/* Optional meta row */}
                          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{event.city || event.location || "Online"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">
                  {dateFilter.from || dateFilter.to ? "No events match your filter criteria." : "No interested events yet."}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" onClick={() => router.push("/event")}>
                    Find Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EventsSection
