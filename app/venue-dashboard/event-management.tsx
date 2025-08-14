"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  CalendarIcon,
  MapPin,
  Users,
  Phone,
  Mail,
  Building,
  Clock,
  Search,
  Download,
  Eye,
  MessageSquare,
} from "lucide-react"

export default function EventManagement() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Mock events data
  const upcomingEvents = [
    {
      id: 1,
      eventName: "Global Tech Conference 2025",
      organizer: {
        name: "TechEvents India",
        contact: "Rajesh Kumar",
        email: "rajesh@techevents.com",
        phone: "+91 98765 43210",
      },
      date: "March 15-17, 2025",
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      hall: "Grand Ballroom",
      expectedAttendees: 1500,
      status: "Confirmed",
      setupTime: "March 14, 2025 - 6:00 PM",
      eventType: "Conference",
      paymentStatus: "Paid",
    },
    {
      id: 2,
      eventName: "Healthcare Innovation Summit",
      organizer: {
        name: "MedTech Solutions",
        contact: "Dr. Priya Sharma",
        email: "priya@medtech.com",
        phone: "+91 87654 32109",
      },
      date: "April 22-24, 2025",
      startTime: "08:30 AM",
      endTime: "05:30 PM",
      hall: "Executive Hall A + B",
      expectedAttendees: 800,
      status: "Confirmed",
      setupTime: "April 21, 2025 - 4:00 PM",
      eventType: "Summit",
      paymentStatus: "Paid",
    },
    {
      id: 3,
      eventName: "Annual Sales Meeting",
      organizer: {
        name: "Corporate Solutions Ltd",
        contact: "Amit Patel",
        email: "amit@corpsol.com",
        phone: "+91 76543 21098",
      },
      date: "March 28, 2025",
      startTime: "10:00 AM",
      endTime: "04:00 PM",
      hall: "Meeting Room 1 + 2",
      expectedAttendees: 80,
      status: "Pending Confirmation",
      setupTime: "March 28, 2025 - 9:00 AM",
      eventType: "Corporate Meeting",
      paymentStatus: "Pending",
    },
  ]

  const pastEvents = [
    {
      id: 4,
      eventName: "AI & Machine Learning Expo",
      organizer: {
        name: "AI India",
        contact: "Sneha Reddy",
        email: "sneha@aiindia.com",
        phone: "+91 65432 10987",
      },
      date: "January 10-12, 2025",
      hall: "Grand Ballroom + Exhibition Hall",
      attendees: 2200,
      status: "Completed",
      eventType: "Exhibition",
      rating: 4.8,
      feedback: "Excellent venue facilities and support staff",
    },
    {
      id: 5,
      eventName: "Startup Pitch Competition",
      organizer: {
        name: "Startup Hub",
        contact: "Karan Singh",
        email: "karan@startuphub.com",
        phone: "+91 54321 09876",
      },
      date: "December 15, 2024",
      hall: "Executive Hall A",
      attendees: 350,
      status: "Completed",
      eventType: "Competition",
      rating: 4.6,
      feedback: "Great acoustics and lighting setup",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500"
      case "Pending Confirmation":
        return "bg-yellow-500"
      case "Completed":
        return "bg-blue-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-600 bg-green-50"
      case "Pending":
        return "text-yellow-600 bg-yellow-50"
      case "Overdue":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const EventCard = ({ event, isPast = false }: { event: any; isPast?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{event.eventName}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {event.organizer.name}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Contact: {event.organizer.contact}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {event.organizer.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {event.organizer.phone}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
            {!isPast && event.paymentStatus && (
              <Badge variant="outline" className={getPaymentStatusColor(event.paymentStatus)}>
                {event.paymentStatus}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Date</span>
            </div>
            <p className="text-gray-600">{event.date}</p>
          </div>

          {!isPast && (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="font-medium">Time</span>
              </div>
              <p className="text-gray-600">
                {event.startTime} - {event.endTime}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Hall</span>
            </div>
            <p className="text-gray-600">{event.hall}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Attendees</span>
            </div>
            <p className="text-gray-600">{isPast ? event.attendees : event.expectedAttendees} people</p>
          </div>
        </div>

        {!isPast && event.setupTime && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Setup Time:</span>
              <span className="text-blue-700">{event.setupTime}</span>
            </div>
          </div>
        )}

        {isPast && event.rating && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm mb-1">
              <span className="font-medium text-green-800">Rating: {event.rating}/5</span>
            </div>
            <p className="text-green-700 text-sm">{event.feedback}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Eye className="w-4 h-4" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <MessageSquare className="w-4 h-4" />
            Contact Organizer
          </Button>
          {!isPast && (
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Contract
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Events
          </Button>
          <Button className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</div>
            <div className="text-gray-600">Upcoming Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {upcomingEvents.filter((e) => e.status === "Confirmed").length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {upcomingEvents.filter((e) => e.paymentStatus === "Pending").length}
            </div>
            <div className="text-gray-600">Pending Payment</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{pastEvents.length}</div>
            <div className="text-gray-600">Past Events</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search events by name, organizer, or contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending Confirmation</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} isPast={true} />
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Events for {selectedDate?.toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Global Tech Conference 2025</h4>
                    <p className="text-sm text-gray-600">09:00 AM - 06:00 PM • Grand Ballroom</p>
                    <p className="text-sm text-gray-600">Organizer: TechEvents India</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Product Launch Event</h4>
                    <p className="text-sm text-gray-600">07:00 PM - 10:00 PM • Executive Hall A</p>
                    <p className="text-sm text-gray-600">Organizer: Innovation Corp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
