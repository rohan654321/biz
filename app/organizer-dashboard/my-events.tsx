"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Search,
  Plus,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  venue: string
  city: string
  address: string
  eventType: string
  generalPrice: number
  vipPrice: number
  premiumPrice: number
  images: string[]
  bannerImage?: string
  thumbnailImage?: string
  categories: string[]
  tags: string[]
  status?: "upcoming" | "ongoing" | "past"
  attendees?: number
  registrations?: number
  revenue?: number
  maxAttendees?: number
  isPublic?: boolean
}

interface MyEventsProps {
  organizerId: string
}

export default function MyEvents({ organizerId }: MyEventsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "ongoing" | "past">("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const defaultImage = "/herosection-images/test.jpeg"

  const calculateEventStatus = (startDate: string, endDate: string): "upcoming" | "ongoing" | "past" => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return "upcoming"
    if (now >= start && now <= end) return "ongoing"
    return "past"
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/organizers/${organizerId}/events`)
      if (response.ok) {
        const data = await response.json()
        const eventsWithStatus = data.events.map((event: Event) => ({
          ...event,
          status: calculateEventStatus(event.startDate, event.endDate),
          bannerImage: event.images && event.images.length > 0 ? event.images[0] : undefined,
          location: `${event.venue}, ${event.city}`,
          categories: event.categories || [],
          tags: event.tags || [],
        }))
        setEvents(eventsWithStatus)
        setFilteredEvents(eventsWithStatus)
      } else {
        toast({ title: "Error", description: "Failed to fetch events", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({ title: "Error", description: "Failed to fetch events", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (organizerId) fetchEvents()
  }, [organizerId])

  useEffect(() => {
    let filtered = events
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") filtered = filtered.filter((event) => event.status === statusFilter)
    if (typeFilter !== "all") filtered = filtered.filter((event) => event.eventType.toLowerCase() === typeFilter.toLowerCase())
    setFilteredEvents(filtered)
  }, [events, searchTerm, statusFilter, typeFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "default"
      case "ongoing": return "secondary"
      case "past": return "outline"
      default: return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "upcoming": return "Upcoming"
      case "ongoing": return "Ongoing"
      case "past": return "Past Event"
      default: return status
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      setLoading(true)
      const response = await fetch(`/api/organizers/${organizerId}/events/${eventId}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Event Deleted", description: "Event has been successfully deleted." })
        setEvents(events.filter((event) => event.id !== eventId))
      } else throw new Error("Failed to delete event")
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete event. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToEditPage = () => {
    router.push(`/organizer-dashboard/${organizerId}/editevent`)
  }

  const handleEditSpecificEvent = (eventId: string) => {
    router.push(`/organizer-dashboard/${organizerId}/editevent?id=${eventId}`)
  }

  const uniqueTypes = [...new Set(events.map((event) => event.eventType).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
          <p className="text-gray-600">Manage and track your events</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleNavigateToEditPage}
          >
            <Edit className="w-4 h-4" />
            Edit Events
          </Button>
          
          {/* <Link href={`/organizer-dashboard/${organizerId}/create-event`}>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Event
            </Button>
          </Link> */}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
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
          <div className="flex gap-2">
            {["all", "upcoming", "ongoing", "past"].map((status) => (
              <Button key={status} variant={statusFilter === status ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(status as typeof statusFilter)}>
                {status === "all" ? "All" : getStatusLabel(status)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events List - two cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow w-full">
            <div className="flex flex-col md:flex-row">
              {/* Image on left */}
              <div className="relative w-full md:w-1/3 h-48">
                <Image src={event.bannerImage || defaultImage} alt={event.title} fill className="object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge variant={getStatusColor(event.status || "upcoming")}>
                    {getStatusLabel(event.status || "upcoming")}
                  </Badge>
                </div>
              </div>

              {/* Content on right */}
              <CardContent className="p-6 flex-1">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-xl line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.venue}, {event.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees || 0} attendees</span>
                      {event.maxAttendees && <span className="text-gray-400">/ {event.maxAttendees}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatCurrency(event.generalPrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <Badge variant="outline">{event.eventType}</Badge>
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
                                <Image src={selectedEvent.bannerImage || defaultImage} alt={selectedEvent.title} fill className="object-cover" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Event Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Status:</span>
                                      <Badge variant={getStatusColor(selectedEvent.status || "upcoming")}>
                                        {getStatusLabel(selectedEvent.status || "upcoming")}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between"><span className="text-gray-600">Type:</span><span>{selectedEvent.eventType}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Start Date:</span><span>{formatDate(selectedEvent.startDate)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">End Date:</span><span>{formatDate(selectedEvent.endDate)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Location:</span><span className="text-right">{selectedEvent.venue}, {selectedEvent.city}</span></div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Pricing & Stats</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600">General:</span><span>{formatCurrency(selectedEvent.generalPrice)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">VIP:</span><span>{formatCurrency(selectedEvent.vipPrice)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Premium:</span><span>{formatCurrency(selectedEvent.premiumPrice)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Attendees:</span><span>{selectedEvent.attendees || 0}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Revenue:</span><span>{formatCurrency(selectedEvent.revenue || 0)}</span></div>
                                  </div>
                                </div>   
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                              </div>
                              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Tags</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedEvent.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline">{tag}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditSpecificEvent(event.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteEvent(event.id)} 
                        disabled={loading}
                        className="text-red-600 hover:text-red-800"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
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
            {/* <Link href={`/organizer-dashboard/${organizerId}/create-event`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </Button>
            </Link> */}
          </CardContent>
        </Card>
      )}
    </div>
  )
}