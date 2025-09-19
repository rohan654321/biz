// app/dashboard/exhibitor-schedule.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AppointmentEvent {
  id: string
  title: string
  date: string // ISO format
  status: "pending" | "confirmed" | "cancelled" | "completed"
}

interface ExhibitorScheduleProps {
  userId: string
}

export function ExhibitorSchedule({ userId }: ExhibitorScheduleProps) {
  const [events, setEvents] = useState<AppointmentEvent[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetch(`/api/users/${userId}/appointments`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.appointments || []).map((a: any) => ({
          id: a.id,
          title: a.exhibitorName,
          date: a.scheduledAt,
          status: a.status,
        }))
        setEvents(formatted)
      })
  }, [userId])

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => i + 1)

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

  const getDayEvents = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split("T")[0]
    
    // FIX: Add validation to prevent the error
    return events.filter((e) => e && e.date && e.date.startsWith(dateStr))
  }

  const statusColors: Record<AppointmentEvent["status"], string> = {
    pending: "bg-yellow-200 text-yellow-800",
    confirmed: "bg-green-200 text-green-800",
    cancelled: "bg-red-200 text-red-800",
    completed: "bg-gray-200 text-gray-800",
  }

  return (
    <div className="p-4">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={prevMonth}>←</Button>
        <h2 className="text-lg font-bold">
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </h2>
        <Button variant="outline" onClick={nextMonth}>→</Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-semibold">{d}</div>
        ))}

        {/* Empty cells for first week */}
        {Array(startOfMonth.getDay()).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {daysInMonth.map((day) => {
          const dayEvents = getDayEvents(day)
          return (
            <div
              key={day}
              className="border rounded-lg p-2 h-32 flex flex-col items-start overflow-hidden hover:bg-gray-50 transition"
            >
              {/* Day number */}
              <span className="text-xs font-bold">{day}</span>

              {/* Events in this day */}
              <div className="flex flex-col gap-1 mt-1 w-full overflow-y-auto">
                {dayEvents.length > 0 ? (
                  dayEvents.map((e) => (
                    e && e.id ? ( // FIX: Add validation here too
                      <Badge
                        key={e.id}
                        className={`text-xs truncate ${statusColors[e.status] || "bg-gray-200 text-gray-800"} w-full`}
                      >
                        {e.title}
                      </Badge>
                    ) : null
                  ))
                ) : (
                  <span className="text-[10px] text-gray-400 mt-1">No events</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}