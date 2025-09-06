"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Users, DollarSign, Edit, Trash2, Eye, Search, Plus, Loader2 } from "lucide-react"
import Image from "next/image"

interface Event {
  id: number
  title: string
  description: string
  date: string
  startDate: string
  endDate: string
  location: string
  status: string
  attendees: number
  registrations: number
  revenue: number
  currency?: string // added optional currency
  type: string
  maxAttendees?: number
  isVirtual: boolean
  bannerImage?: string
  thumbnailImage?: string
  isPublic: boolean
}

interface MyEventsProps {
  events: Event[]
}

export default function MyEvents({ events: initialEvents }: MyEventsProps) {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Update events when props change
  useEffect(() => {
    setEvents(initialEvents)
    setFilteredEvents(initialEvents)
  }, [initialEvents])

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status.toLowerCase() === statusFilter.toLowerCase())
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((event) => event.type.toLowerCase() === typeFilter.toLowerCase())
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, statusFilter, typeFilter])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "planning":
        return "secondary"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD", // default to USD if missing
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDeleteEvent = async (eventId: number) => {
    try {
      setLoading(true)
      // API call to delete event would go here
      toast({
        title: "Event Deleted",
        description: "Event has been successfully deleted.",
      })
      setEvents(events.filter((event) => event.id !== eventId))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const uniqueTypes = [...new Set(events.map((event) => event.type))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
          <p className="text-gray-600">Manage and track your events</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Event
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={event.bannerImage || event.thumbnailImage || "/placeholder.svg?height=200&width=400"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} attendees</span>
                    {event.maxAttendees && <span className="text-gray-400">/ {event.maxAttendees}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(event.revenue, event.currency)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <Badge variant="outline">{event.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(event)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedEvent?.title}</DialogTitle>
                        </DialogHeader>
                        {selectedEvent && (
                          <div className="space-y-4">
                            <div className="relative h-64 rounded-lg overflow-hidden">
                              <Image
                                src={selectedEvent.bannerImage || "/placeholder.svg?height=300&width=600"}
                                alt={selectedEvent.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Event Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <Badge variant={getStatusColor(selectedEvent.status)}>{selectedEvent.status}</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span>{selectedEvent.type}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Start Date:</span>
                                    <span>{formatDate(selectedEvent.startDate)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">End Date:</span>
                                    <span>{formatDate(selectedEvent.endDate)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Location:</span>
                                    <span className="text-right">{selectedEvent.location}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Statistics</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Attendees:</span>
                                    <span>{selectedEvent.attendees}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Registrations:</span>
                                    <span>{selectedEvent.registrations}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Revenue:</span>
                                    <span>{formatCurrency(selectedEvent.revenue, selectedEvent.currency)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Max Capacity:</span>
                                    <span>{selectedEvent.maxAttendees || "Unlimited"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Public:</span>
                                    <span>{selectedEvent.isPublic ? "Yes" : "No"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)} disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first event"}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
