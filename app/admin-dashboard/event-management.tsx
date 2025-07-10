"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Building2,
  Calendar,
  MapPin,
  Users,
} from "lucide-react"

interface Event {
  id: number
  title: string
  organizer: string
  date: string
  location: string
  status: string
  attendees: number
  revenue: number
  category: string
  featured: boolean
}

interface EventManagementProps {
  events?: Event[]
}

export default function EventManagement({ events }: EventManagementProps) {
  const defaultEvents: Event[] = [
    {
      id: 1,
      title: "Global Precision Expo 2025",
      organizer: "EventCorp India",
      date: "June 11-13, 2025",
      location: "Chennai Trade Centre",
      status: "Approved",
      attendees: 2500,
      revenue: 850000,
      category: "Exhibition",
      featured: true,
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      organizer: "TechEvents Ltd",
      date: "July 20-22, 2025",
      location: "Mumbai Convention Center",
      status: "Pending Review",
      attendees: 1200,
      revenue: 450000,
      category: "Conference",
      featured: false,
    },
    {
      id: 3,
      title: "Suspicious Event",
      organizer: "Unknown Organizer",
      date: "August 15-17, 2025",
      location: "Unknown Venue",
      status: "Flagged",
      attendees: 0,
      revenue: 0,
      category: "Other",
      featured: false,
    },
  ]

  const eventsData = events || defaultEvents

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {eventsData.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <Badge
                        variant={
                          event.status === "Approved"
                            ? "default"
                            : event.status === "Pending Review"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {event.status}
                      </Badge>
                      {event.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {event.organizer}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.attendees} attendees
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {event.status === "Pending Review" && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
