"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Calendar as CalendarIcon, MapPin } from "lucide-react"
import { Event } from "./events-section" // reusing Event type

/* ---------- Helpers ---------- */
const DEFAULT_IMAGE = "/image/download2.jpg"

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
      const pastOnly = events.filter((ev) => new Date(ev.endDate) < new Date())

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
      {/* <h1 className="text-3xl font-bold text-gray-900">Past Events</h1> */}

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
            <Card className="flex w-full border border-gray-200 bg-[#F9FAFB] rounded-lg hover:shadow-md transition-shadow">
              <div className="flex grid-2">
                {/* Image */}
                <div className="w-40 h-28 flex-shrink-0">
                  <img
                    src={event.thumbnailImage || DEFAULT_IMAGE}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-l-lg"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      if (!target.src.endsWith(DEFAULT_IMAGE)) {
                        target.src = DEFAULT_IMAGE
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

                    {/* Status Pill */}
                    {event.leadStatus && (
                      <span
                        className={`text-[11px] px-2 py-1 rounded border ${statusPillClass(
                          event.leadStatus
                        )}`}
                      >
                        {event.leadStatus}
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
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
        ))}
      </div>
    </div>
  )
}

export default PastEvents
