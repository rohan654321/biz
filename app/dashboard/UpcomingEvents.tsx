"use client"

import { Event } from "./events-section"
import { Skeleton } from "@/components/ui/skeleton"

interface UpcomingEventsProps {
  events: Event[]
  userId?: string
  loading?: boolean
}

export function UpcomingEvents({ events, userId, loading }: UpcomingEventsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!events || events.length === 0) {
    return <p className="text-gray-500">No upcoming events.</p>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="p-4 border rounded-lg shadow-sm bg-green-50">
          <h3 className="font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-600">{event.shortDescription}</p>
          <p className="text-xs text-gray-500">
            {event.location} • {event.startDate}
          </p>
        </div>
      ))}
    </div>
  )
}
