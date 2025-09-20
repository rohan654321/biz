"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Calendar as CalendarIcon,
  CalendarDays,
  Mail,
  Phone,
  Building2,
  Search,
  Trash2,
  Loader2, // ✅ Import fixed
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: string
  exhibitorId: string
  exhibitorName: string
  exhibitorCompany: string
  exhibitorEmail: string
  exhibitorPhone?: string
  exhibitorAvatar?: string
  boothNumber?: string
  scheduledAt: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  createdAt: string
  eventTitle?: string
  eventStartDate?: string
  eventEndDate?: string
}

interface MyAppointmentsProps {
  userId: string
}

export function MyAppointments({ userId }: MyAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [userId])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/users/${userId}/appointments`)
      if (!response.ok) throw new Error("Failed to fetch appointments")
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (err) {
      setError("Failed to load appointments")
      console.error("Error fetching appointments:", err)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      })
      if (!response.ok) throw new Error("Failed to cancel appointment")

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      })

      fetchAppointments()
    } catch {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // --- Stats with expiry check ---
  const stats = useMemo(() => {
    const now = new Date()
    const pending = appointments.filter((a) => a.status === "pending").length
    const confirmed = appointments.filter(
      (a) => a.status === "confirmed" && new Date(a.scheduledAt) >= now
    ).length
    const completed = appointments.filter(
      (a) => a.status === "completed" || (a.status === "confirmed" && new Date(a.scheduledAt) < now)
    ).length
    return { total: appointments.length, pending, confirmed, completed }
  }, [appointments])

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : "N/A"

  const getEffectiveStatus = (appointment: Appointment) => {
    const now = new Date()
    if (appointment.status === "confirmed" && new Date(appointment.scheduledAt) < now) {
      return "completed"
    }
    return appointment.status
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchAppointments} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  // --- Empty state ---
  if (appointments.length === 0) {
    return (
      <div className="text-center p-8">
        <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Yet</h3>
        <p className="text-gray-600">You haven't scheduled any meetings with exhibitors yet.</p>
      </div>
    )
  }

  // --- Filtered appointments ---
  const filteredAppointments = appointments.filter((a) =>
    a.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: stats.total, color: "border-blue-300 hover:border-blue-500" },
          { label: "Pending", value: stats.pending, color: "border-yellow-300 hover:border-yellow-500" },
          { label: "Confirmed", value: stats.confirmed, color: "border-green-300 hover:border-green-500" },
          { label: "Completed", value: stats.completed, color: "border-gray-300 hover:border-gray-500" },
        ].map((stat) => (
          <Card key={stat.label} className={`border-2 transition-colors ${stat.color}`}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by event..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Appointment Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="md:col-span-2 space-y-6">
    {filteredAppointments.map((appointment) => {
      const effectiveStatus = getEffectiveStatus(appointment)
      return (
        <Card
          key={appointment.id}
          className="transition-shadow hover:shadow-xl rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Event Badge */}
          {appointment.eventTitle && (
            <div className="bg-blue-50 text-blue-800 px-3 py-1 font-semibold text-sm w-fit rounded-br-xl">
              {appointment.eventTitle}
            </div>
          )}

          <CardContent className="flex flex-col gap-4 p-6">
            {/* Header: Exhibitor */}
            <div className="flex items-center gap-4">
              {appointment.exhibitorAvatar ? (
                <img
                  src={appointment.exhibitorAvatar}
                  alt={appointment.exhibitorName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {appointment.exhibitorName[0] || "?"}
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{appointment.exhibitorName}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Building2 className="w-4 h-4" /> {appointment.exhibitorCompany || "N/A"}
                </p>
              </div>

              {(effectiveStatus === "pending" || effectiveStatus === "confirmed") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="self-start"
                  onClick={() => cancelAppointment(appointment.id)}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              )}
            </div>

            {/* Contact & Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {appointment.exhibitorEmail}
              </div>
              {appointment.exhibitorPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {appointment.exhibitorPhone}
                </div>
              )}
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {formatDate(appointment.eventStartDate)} – {formatDate(appointment.eventEndDate)}
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm mt-2">{appointment.notes}</div>
            )}

            {/* Status & Booth */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge
                variant="outline"
                className={`capitalize ${
                  effectiveStatus === "confirmed"
                    ? "border-green-500 text-green-600"
                    : effectiveStatus === "pending"
                    ? "border-yellow-500 text-yellow-600"
                    : effectiveStatus === "cancelled"
                    ? "border-red-500 text-red-600"
                    : "border-gray-400 text-gray-600"
                }`}
              >
                {effectiveStatus}
              </Badge>
              {appointment.boothNumber && <Badge variant="outline">Booth {appointment.boothNumber}</Badge>}
            </div>
          </CardContent>
        </Card>
      )
    })}
  </div>
</div>

    </div>
  )
}
