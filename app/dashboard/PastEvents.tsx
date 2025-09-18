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
  const [pastEvents, setPastEvents] = useState<Event[]>([])

  const targetUserId = userId || session?.user?.id

  useEffect(() => {
    if (!targetUserId) return
    fetchPastEvents()
  }, [targetUserId])

  const fetchPastEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${targetUserId}/interested-events`)
      if (!response.ok) throw new Error("Failed to fetch past events")
      const data = await response.json()
      
      // Filter for past events only
      const pastEventsData = (data.events || []).filter((event: Event) => 
        new Date(event.startDate) < new Date()
      )
      
      setEvents(data.events || [])
      setPastEvents(pastEventsData)
    } catch (err) {
      console.error("Error fetching past events:", err)
      setEvents([])
      setPastEvents([])
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

  if (!pastEvents.length) {
    return <p className="text-gray-500">No past events.</p>
  }

  return (
    <div className="space-y-4">
      {pastEvents.map((event) => (
        <div
          key={event.id}
          className="p-4 border rounded-lg shadow-sm bg-gray-100"
        >
          <h3 className="font-semibold">{event.title}</h3>
          {event.shortDescription && (
            <p className="text-sm text-gray-600">{event.shortDescription}</p>
          )}
          <p className="text-xs text-gray-500">
            {event.location || "No location"} • {new Date(event.startDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}