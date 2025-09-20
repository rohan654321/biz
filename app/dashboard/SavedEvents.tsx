"use client"

import { useEffect, useState } from "react"
import { Event } from "./events-section"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Calendar as CalendarIcon, MapPin, Bookmark } from "lucide-react"

/* ---------- Helpers (same as EventsSection) ---------- */
const DEFAULT_IMAGE = "/image/download2.jpg"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

export function SavedEvents({ userId }: { userId?: string }) {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const targetUserId = userId || session?.user?.id

  useEffect(() => {
    if (!targetUserId) return
    fetchSavedEvents()
  }, [targetUserId])

  const fetchSavedEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${targetUserId}/saved-events`)
      if (!response.ok) throw new Error("Failed to fetch saved events")
      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      console.error("Error fetching saved events:", err)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!events.length) {
    return <p className="text-gray-500">No saved events found.</p>
  }

  return (
    <div className="relative border-l-2 border-gray-200 ml-6">
      {events.map((event) => (
        <div key={event.id} className="mb-10 ml-6 relative">
          {/* Timeline Dot (blue since it's Saved) */}
          <span className="absolute -left-[35px] flex items-center justify-center w-5 h-5 rounded-full ring-4 ring-white bg-gray-600" />

          {/* Date Heading */}
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {formatDate(event.startDate)} – {formatDate(event.endDate || event.startDate)}
          </p>

          {/* Event Card */}
          <Card className="flex w-full border border-gray-200 bg-[#FFF6F6] rounded-lg hover:shadow-md transition-shadow">
            <div className="flex">
              {/* Thumbnail */}
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
                    <h3 className="text-base font-semibold text-blue-700">
                      {event.title}
                    </h3>

                    <p className="text-xs text-gray-600">
                      {formatDate(event.startDate)} – {formatDate(event.endDate || event.startDate)}
                    </p>

                    <p className="text-xs text-blue-600">
                      {event.location || event.city || "Online"}
                    </p>

                    {event.shortDescription && (
                      <p className="text-xs text-gray-700 mt-1 line-clamp-1">
                        {event.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Status pill for Saved */}
                  <span className="text-[11px] px-2 py-1 rounded border bg-purple-50 text-purple-800 border-purple-200">
                    Saved
                  </span>
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
                  <div className="flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5 text-purple-600" />
                    <span>Saved Event</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
