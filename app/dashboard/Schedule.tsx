"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  startDate: string // ISO string
  endDate: string   // ISO string
  category?: "personal" | "work" | "travel"
}

interface ScheduleProps {
  userId: string
}

export default function Schedule({ userId }: ScheduleProps) {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Fetch events
  useEffect(() => {
    fetch(`/api/users/${userId}/interested-events`)
      .then((res) => res.json())
      .then((data) => {
        const apiEvents = data.events || []

        const mappedEvents: Event[] = apiEvents.map((e: any) => ({
          id: e.id,
          title: e.title,
          startDate: e.startDate,
          endDate: e.endDate || e.startDate,
          category: e.category || "work", // default if not provided
        }))

        setEvents(mappedEvents)
      })
      .catch((error) => console.error("Error fetching events:", error))
  }, [userId])

  // Calendar dates
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => i + 1)

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Get events for a day
  const getDayEvents = (day: number) => {
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    return events.filter((e) => {
      const start = new Date(e.startDate)
      const end = new Date(e.endDate)
      return dayDate >= start && dayDate <= end
    })
  }

  // Colors per category
  const categoryColors: Record<NonNullable<Event["category"]>, string> = {
    personal: "bg-blue-200 text-blue-800",
    work: "bg-green-200 text-green-800",
    travel: "bg-yellow-200 text-yellow-800",
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={prevMonth}>←</Button>
        <h2 className="text-lg font-bold">
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </h2>
        <Button variant="outline" onClick={nextMonth}>→</Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-semibold">{d}</div>
        ))}

        {/* Empty slots before 1st day */}
        {Array(startOfMonth.getDay()).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {daysInMonth.map((day) => {
          const dayEvents = getDayEvents(day)
          return (
            <div
              key={day}
              className="border rounded-lg p-2 h-28 flex flex-col items-start overflow-hidden"
            >
              <span className="text-xs font-bold">{day}</span>
              <div className="flex flex-col gap-1 w-full mt-1">
                {dayEvents.map((e) => (
                  <span
                    key={e.id}
                    onClick={() => router.push(`/event/${e.id}`)}
                    className={`text-xs rounded px-1 truncate cursor-pointer ${categoryColors[e.category || "work"]}`}
                  >
                    {e.title}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
