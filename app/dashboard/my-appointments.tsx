"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  Calendar as CalendarIcon,
  CalendarDays,
  Mail,
  Phone,
  Building2,
  Search,
  Filter,
  Trash2,
  Loader2,
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
}

interface MyAppointmentsProps {
  userId: string
}

export function MyAppointments({ userId }: MyAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [userId])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/users/${userId}/appointments`)
      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }
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

  // Fixed stats calculation
  const stats = useMemo(() => {
    const now = new Date();
    
    const pending = appointments.filter(
      (a) => a.status.toLowerCase() === "pending"
    ).length;

    const confirmed = appointments.filter(
      (a) => a.status.toLowerCase() === "confirmed" && 
             new Date(a.scheduledAt) >= now
    ).length;

    const completed = appointments.filter(
      (a) => a.status.toLowerCase() === "completed" || 
             (a.status.toLowerCase() === "confirmed" && 
              new Date(a.scheduledAt) < now)
    ).length;

    const cancelled = appointments.filter(
      (a) => a.status.toLowerCase() === "cancelled"
    ).length;

    return {
      total: appointments.length,
      pending,
      confirmed,
      completed,
      cancelled,
    };
  }, [appointments]);

  // --- Helpers ---
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }
  }

  const getEffectiveStatus = (appointment: Appointment) => {
    const now = new Date()
    if (
      appointment.status === "confirmed" &&
      new Date(appointment.scheduledAt) < now
    ) {
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Appointments Yet
        </h3>
        <p className="text-gray-600">
          You haven't scheduled any meetings with exhibitors yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "border-blue-300 hover:border-blue-500",
          },
          {
            label: "Pending",
            value: stats.pending,
            color: "border-yellow-300 hover:border-yellow-500",
          },
          {
            label: "Confirmed",
            value: stats.confirmed,
            color: "border-green-300 hover:border-green-500",
          },
          {
            label: "Completed",
            value: stats.completed,
            color: "border-gray-300 hover:border-gray-500",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`border-2 transition-colors ${stat.color}`}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search appointments..." className="pl-8" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" /> Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Appointment Cards */}
        <div className="md:col-span-2 space-y-6">
          {appointments.map((appointment) => {
            const effectiveStatus = getEffectiveStatus(appointment)
            return (
              <Card
                key={appointment.id}
                className="hover:shadow-md transition"
              >
                <CardContent className="flex flex-col gap-4 p-6">
                  {/* Header Row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {appointment.exhibitorName}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Building2 className="h-4 w-4" />{" "}
                        {appointment.exhibitorCompany}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Mail className="h-4 w-4" />{" "}
                        {appointment.exhibitorEmail}
                      </div>
                      {appointment.exhibitorPhone && (
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <Phone className="h-4 w-4" />{" "}
                          {appointment.exhibitorPhone}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <CalendarDays className="h-4 w-4" />{" "}
                        {formatDateTime(appointment.scheduledAt).date} –{" "}
                        {formatDateTime(appointment.scheduledAt).time}
                      </div>
                    </div>
                    {(effectiveStatus === "pending" ||
                      effectiveStatus === "confirmed") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cancelAppointment(appointment.id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    )}
                  </div>

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {appointment.notes}
                      </p>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">
                      {effectiveStatus}
                    </Badge>
                    {appointment.boothNumber && (
                      <Badge variant="outline">
                        Booth {appointment.boothNumber}
                      </Badge>
                    )}
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