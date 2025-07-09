"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Plus, MoreHorizontal } from "lucide-react"
import { upcomingEvents } from "@/lib/mock-data"

export function EventsSection() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          {/* <TabsTrigger value="speaking">Speaking</TabsTrigger> */}
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <Badge
                        variant={
                          event.status === "Registered"
                            ? "default"
                            : event.status === "Speaking"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="past">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No past events to display.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="speaking">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Fitness Fest 2025</h3>
                    <Badge variant="destructive">Speaking</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      August 04-06, 2025
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Bangalore Sports Complex
                    </div>
                    <Badge variant="outline">Festival</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
