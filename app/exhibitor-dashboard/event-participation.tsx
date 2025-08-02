"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Download,
  CreditCard,
  FileText,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Building,
} from "lucide-react"

export default function EventParticipation() {
  const [activeTab, setActiveTab] = useState("upcoming")

  // Mock event participation data
  const upcomingEvents = [
    {
      id: 1,
      eventName: "Global Tech Expo 2025",
      date: "March 15-17, 2025",
      venue: "Mumbai Convention Center",
      boothSize: "3m x 3m",
      boothNumber: "A-45",
      paymentStatus: "Paid",
      setupTime: "March 14, 2025 - 2:00 PM to 6:00 PM",
      dismantleTime: "March 17, 2025 - 6:00 PM to 10:00 PM",
      passes: 5,
      passesUsed: 2,
      invoiceAmount: 45000,
    },
    {
      id: 2,
      eventName: "Healthcare Innovation Summit",
      date: "April 22-24, 2025",
      venue: "Delhi Exhibition Center",
      boothSize: "6m x 3m",
      boothNumber: "B-12",
      paymentStatus: "Pending",
      setupTime: "April 21, 2025 - 1:00 PM to 5:00 PM",
      dismantleTime: "April 24, 2025 - 5:00 PM to 9:00 PM",
      passes: 8,
      passesUsed: 0,
      invoiceAmount: 75000,
    },
  ]

  const pastEvents = [
    {
      id: 3,
      eventName: "AI & Machine Learning Conference",
      date: "January 10-12, 2025",
      venue: "Bangalore Tech Park",
      boothSize: "3m x 3m",
      boothNumber: "C-28",
      paymentStatus: "Paid",
      passes: 5,
      passesUsed: 5,
      invoiceAmount: 35000,
      leadsGenerated: 45,
      visitors: 120,
    },
  ]

  const EventCard = ({ event, isPast = false }: { event: any; isPast?: boolean }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{event.eventName}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {event.date}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.venue}
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Booth: {event.boothNumber} ({event.boothSize})
              </div>
            </div>
          </div>
          <Badge
            variant={event.paymentStatus === "Paid" ? "default" : "destructive"}
            className={event.paymentStatus === "Paid" ? "bg-green-500" : ""}
          >
            {event.paymentStatus === "Paid" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {event.paymentStatus}
          </Badge>
        </div>

        {!isPast && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Setup:</span>
              </div>
              <p className="text-gray-600 ml-6">{event.setupTime}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="font-medium">Dismantle:</span>
              </div>
              <p className="text-gray-600 ml-6">{event.dismantleTime}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-600">{event.passes}</div>
            <div className="text-gray-600">Total Passes</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-600">{event.passesUsed}</div>
            <div className="text-gray-600">Used Passes</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="font-semibold text-purple-600">₹{(event.invoiceAmount / 1000).toFixed(0)}K</div>
            <div className="text-gray-600">Invoice Amount</div>
          </div>
          {isPast && (
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-semibold text-orange-600">{event.leadsGenerated}</div>
              <div className="text-gray-600">Leads Generated</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <FileText className="w-4 h-4" />
            Exhibitor Manual
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Invoice
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Users className="w-4 h-4" />
            Passes
          </Button>
          {!isPast && event.paymentStatus === "Pending" && (
            <Button size="sm" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <CreditCard className="w-4 h-4" />
              Pay Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Participation</h1>
        <Button className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Register for New Event
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

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
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <FileText className="w-6 h-6" />
              <span>Download Manual</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <MapPin className="w-6 h-6" />
              <span>Booth Location</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <Users className="w-6 h-6" />
              <span>Request Passes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <Download className="w-6 h-6" />
              <span>Download Invoice</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
