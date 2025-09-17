"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Phone, Mail, Building, Loader2 } from "lucide-react"
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
  scheduledAt: string // Changed from appointmentDate/appointmentTime to scheduledAt
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel appointment")
      }

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      })

      fetchAppointments() // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

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

  if (appointments.length === 0) {
    return (
      <div className="text-center p-8">
        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Yet</h3>
        <p className="text-gray-600">You haven't scheduled any meetings with exhibitors yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Appointments</h2>
        <Badge variant="secondary">{appointments.length} Total</Badge>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={appointment.exhibitorAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {appointment.exhibitorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{appointment.exhibitorName}</CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {appointment.exhibitorCompany}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formatDateTime(appointment.scheduledAt).date}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formatDateTime(appointment.scheduledAt).time}</span>
                </div>
                {appointment.boothNumber && (
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Booth {appointment.boothNumber}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{appointment.exhibitorEmail}</span>
                </div>
              </div>

              {appointment.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{appointment.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                {appointment.status === "pending" || appointment.status === "confirmed" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelAppointment(appointment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Cancel Appointment
                  </Button>
                ) : null}

                {appointment.exhibitorPhone && (
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                )}

                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
