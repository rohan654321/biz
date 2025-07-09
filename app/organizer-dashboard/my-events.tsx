"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Calendar, MapPin, Users, DollarSign, Eye, Edit, MoreHorizontal } from "lucide-react"

interface Event {
  id: number
  title: string
  date: string
  location: string
  status: string
  attendees: number
//   revenue: number
  registrations: number
  type: string
}

interface MyEventsProps {
  events: Event[]
}

export default function MyEvents({ events }: MyEventsProps) {
  const filterEventsByStatus = (status: string) => {
    if (status === "all") return events
    return events.filter((event) => event.status.toLowerCase() === status.toLowerCase())
  }

  const EventCard = ({ event }: { event: Event }) => (
    <Card key={event.id}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <Badge
                variant={event.status === "Active" ? "default" : event.status === "Planning" ? "secondary" : "outline"}
              >
                {event.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
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
                {event.registrations} registered
              </div>
              <div className="flex items-center gap-1">
                {/* <DollarSign className="w-4 h-4" />₹{(event.revenue / 100000).toFixed(1)}L revenue */}
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
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filterEventsByStatus("all").map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filterEventsByStatus("active").map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          {filterEventsByStatus("planning").map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {filterEventsByStatus("draft").map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
