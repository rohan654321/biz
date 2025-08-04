"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Clock, CalendarIcon, CheckCircle, X, Eye, Phone, Mail, Building } from "lucide-react"

export default function AppointmentScheduling() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  // Mock appointment data
  const appointments = [
    {
      id: 1,
      visitorName: "Arjun Mehta",
      visitorEmail: "arjun@techstart.com",
      visitorPhone: "+91 98765 43210",
      company: "TechStart Solutions",
      designation: "CTO",
      requestedDate: "2025-01-18",
      requestedTime: "14:00",
      duration: "30 minutes",
      purpose: "Discuss AI platform integration for our existing systems",
      status: "Pending",
      priority: "High",
      profileViews: 15,
      previousMeetings: 0,
    },
    {
      id: 2,
      visitorName: "Kavya Singh",
      visitorEmail: "kavya@innovate.in",
      visitorPhone: "+91 87654 32109",
      company: "Innovate India",
      designation: "Product Manager",
      requestedDate: "2025-01-19",
      requestedTime: "11:30",
      duration: "45 minutes",
      purpose: "Product demo and pricing discussion for cloud security suite",
      status: "Approved",
      priority: "Medium",
      profileViews: 8,
      previousMeetings: 1,
    },
    {
      id: 3,
      visitorName: "Rohit Kumar",
      visitorEmail: "rohit@manufacturing.co",
      visitorPhone: "+91 76543 21098",
      company: "Manufacturing Co",
      designation: "IT Head",
      requestedDate: "2025-01-20",
      requestedTime: "16:00",
      duration: "60 minutes",
      purpose: "Comprehensive solution discussion for enterprise mobile app development",
      status: "Approved",
      priority: "High",
      profileViews: 22,
      previousMeetings: 2,
    },
    {
      id: 4,
      visitorName: "Priya Sharma",
      visitorEmail: "priya@retail.com",
      visitorPhone: "+91 65432 10987",
      company: "Retail Solutions",
      designation: "Operations Manager",
      requestedDate: "2025-01-17",
      requestedTime: "10:00",
      duration: "30 minutes",
      purpose: "Quick overview of analytics solutions for retail business",
      status: "Completed",
      priority: "Low",
      profileViews: 5,
      previousMeetings: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500"
      case "Approved":
        return "bg-green-500"
      case "Completed":
        return "bg-blue-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{appointment.visitorName}</h3>
              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
              <Badge variant="outline" className={getPriorityColor(appointment.priority)}>
                {appointment.priority}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {appointment.company} • {appointment.designation}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {appointment.visitorEmail}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {appointment.visitorPhone}
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {appointment.requestedDate} at {appointment.requestedTime} ({appointment.duration})
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Appointment Details - {appointment.visitorName}</DialogTitle>
                </DialogHeader>
                {selectedAppointment && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Visitor Profile Views</label>
                        <p className="text-gray-600">{selectedAppointment.profileViews} views</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Previous Meetings</label>
                        <p className="text-gray-600">{selectedAppointment.previousMeetings} meetings</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Meeting Purpose</label>
                      <p className="text-gray-600 mt-1">{selectedAppointment.purpose}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Meeting Notes</label>
                      <Textarea placeholder="Add meeting notes or preparation points..." className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select value={selectedAppointment.status}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Reschedule Date</label>
                        <input type="date" className="w-full p-2 border rounded" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Meeting Purpose:</p>
          <p className="text-sm text-gray-600">{appointment.purpose}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-600">{appointment.profileViews}</div>
            <div className="text-gray-600">Profile Views</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-semibold text-green-600">{appointment.previousMeetings}</div>
            <div className="text-gray-600">Previous Meetings</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="font-semibold text-purple-600">{appointment.duration}</div>
            <div className="text-gray-600">Duration</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Requested: {appointment.requestedDate} at {appointment.requestedTime}
          </div>
          <div className="flex items-center gap-2">
            {appointment.status === "Pending" && (
              <>
                <Button size="sm" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Clock className="w-4 h-4" />
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
                >
                  <X className="w-4 h-4" />
                  Decline
                </Button>
              </>
            )}
            {appointment.status === "Approved" && (
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Clock className="w-4 h-4" />
                Reschedule
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Visitor Appointment Scheduling</h1>
        <Button className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          Calendar View
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{appointments.length}</div>
            <div className="text-gray-600">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {appointments.filter((a) => a.status === "Pending").length}
            </div>
            <div className="text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {appointments.filter((a) => a.status === "Approved").length}
            </div>
            <div className="text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {appointments.filter((a) => a.status === "Completed").length}
            </div>
            <div className="text-gray-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    </div>
  )
}
