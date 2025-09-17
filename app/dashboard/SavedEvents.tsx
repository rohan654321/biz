"use client"

import { useEffect, useState } from "react"
import { Event } from "./events-section"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"

interface SavedEventsProps {
  userId?: string
}

export function SavedEvents({ userId }: SavedEventsProps) {
    const { data: session, status } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
    // Use session user ID if no userId prop is provided
  const targetUserId = userId || session?.user?.id

  useEffect(() => {
    if (!userId) return
    fetchSavedEvents()
  }, [userId])

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
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!events.length) {
    return <p className="text-gray-500">No saved events found.</p>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="p-4 border rounded-lg shadow-sm bg-gray-100"
        >
          <h3 className="font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-600">{event.shortDescription}</p>
          <p className="text-xs text-gray-500">
            {event.location} • {new Date(event.startDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}
