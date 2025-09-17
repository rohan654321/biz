"use client"

import { useEffect, useState } from "react"
import { Event } from "./events-section"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"

interface PastEventsProps {
  userId?: string
}

export function PastEvents({ userId }: PastEventsProps) {
    const { data: session, status } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

   const targetUserId = userId || session?.user?.id

  useEffect(() => {
    if (!userId) return
    fetchPastEvents()
  }, [userId])

  const fetchPastEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${targetUserId}/interested-events`)
      if (!response.ok) throw new Error("Failed to fetch past events")
      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      console.error("Error fetching past events:", err)
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
    return <p className="text-gray-500">No past events.</p>
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
