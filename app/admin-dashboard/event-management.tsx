"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  Edit,
  MoreHorizontal,
  Building2,
  Calendar,
  MapPin,
  Users,
  Star,
  Crown,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  organizer: string
  organizerId: string
  date: string
  endDate: string
  location: string
  venue: string
  status: "Approved" | "Pending Review" | "Flagged" | "Rejected" | "Draft"
  attendees: number
  maxCapacity: number
  revenue: number
  ticketPrice: number
  category: string
  featured: boolean
  vip: boolean
  priority: "High" | "Medium" | "Low"
  description: string
  tags: string[]
  createdAt: string
  lastModified: string
  views: number
  registrations: number
  rating: number
  reviews: number
  image: string
  promotionBudget: number
  socialShares: number
}

// Edit Event Component
function EditEventForm({ 
  event, 
  onSave, 
  onCancel 
}: { 
  event: Event
  onSave: (updatedEvent: Event) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Event>(event)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Prepare data for API
      const updateData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        endDate: formData.endDate,
        status: formData.status,
        maxCapacity: formData.maxCapacity,
        featured: formData.featured,
        vip: formData.vip,
        category: formData.category,
        tags: formData.tags,
        venue: formData.venue,
        location: formData.location,
        organizer: formData.organizer,
        ticketPrice: formData.ticketPrice,
      }

      console.log("Sending update data:", updateData)

      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to update event")
      }
      
      console.log("Update successful:", result)
      
      // Make sure we're passing the formatted event back
      if (result.event) {
        onSave(result.event)
      } else {
        throw new Error("No event data returned from server")
      }
    } catch (error) {
      console.error("Error updating event:", error)
      alert(error instanceof Error ? error.message : "Failed to update event")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Event</h1>
          <p className="text-gray-600">Update event details</p>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Enter organizer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Start Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter event location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Enter venue name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Event["status"]) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                    <SelectItem value="Flagged">Flagged</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Ticket Price (₹)</Label>
                <Input
                  id="ticketPrice"
                  type="number"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: Number(e.target.value) })}
                  placeholder="Enter ticket price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Max Capacity</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                  placeholder="Enter maximum capacity"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured">Featured Event</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vip"
                  checked={formData.vip}
                  onChange={(e) => setFormData({ ...formData, vip: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="vip">VIP Event</Label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Event List Component
function EventList({
  events,
  searchTerm,
  selectedStatus,
  selectedCategory,
  activeTab,
  eventCounts,
  onEdit,
  onStatusChange,
  onFeatureToggle,
  onVipToggle,
  onDelete,
  onPromote,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onTabChange,
}: {
  events: Event[]
  searchTerm: string
  selectedStatus: string
  selectedCategory: string
  activeTab: string
  eventCounts: any
  onEdit: (event: Event) => void
  onStatusChange: (eventId: string, status: Event["status"]) => void
  onFeatureToggle: (eventId: string, current: boolean) => void
  onVipToggle: (eventId: string, current: boolean) => void
  onDelete: (eventId: string) => void
  onPromote: (event: Event) => void
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onCategoryFilterChange: (value: string) => void
  onTabChange: (value: string) => void
}) {
  const getFilteredEventsByTab = (tab: string) => {
    const filteredEvents = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        selectedStatus === "all" ||
        event.status.toLowerCase().replace(" ", "") === selectedStatus
      const matchesCategory =
        selectedCategory === "all" ||
        event.category.toLowerCase() === selectedCategory
      return matchesSearch && matchesStatus && matchesCategory
    })

    switch (tab) {
      case "pending":
        return filteredEvents.filter((e) => e.status === "Pending Review")
      case "approved":
        return filteredEvents.filter((e) => e.status === "Approved")
      case "flagged":
        return filteredEvents.filter((e) => e.status === "Flagged")
      case "featured":
        return filteredEvents.filter((e) => e.featured)
      case "vip":
        return filteredEvents.filter((e) => e.vip)
      default:
        return filteredEvents
    }
  }

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "Approved":
        return "default"
      case "Pending Review":
        return "secondary"
      case "Flagged":
        return "destructive"
      case "Rejected":
        return "destructive"
      case "Draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events or organizers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pendingreview">Pending Review</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="exhibition">Exhibition</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Events ({eventCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({eventCounts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({eventCounts.approved})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({eventCounts.flagged})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({eventCounts.featured})</TabsTrigger>
          <TabsTrigger value="vip">VIP ({eventCounts.vip})</TabsTrigger>
        </TabsList>

        {["all", "pending", "approved", "flagged", "featured", "vip"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {getFilteredEventsByTab(tab).map((event) => (
              <div key={event.id} className="hover:shadow-md transition-shadow border-2 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
                          {event.featured && (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Star className="w-3 h-3 mr-1" /> Featured
                            </Badge>
                          )}
                          {event.vip && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Crown className="w-3 h-3 mr-1" /> VIP
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
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
                            {event.attendees}/{event.maxCapacity}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onStatusChange(event.id, event.status === "Approved" ? "Pending Review" : "Approved")}>
                            <Edit className="w-4 h-4 mr-2" />
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onFeatureToggle(event.id, event.featured)}>
                            <Star className="w-4 h-4 mr-2" />
                            {event.featured ? "Remove Featured" : "Make Featured"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onVipToggle(event.id, event.vip)}>
                            <Crown className="w-4 h-4 mr-2" />
                            {event.vip ? "Remove VIP" : "Make VIP"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onPromote(event)}>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Promote Event
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact Organizer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => onDelete(event.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const router = useRouter()

  // Fetch from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/admin/events")
        const data = await res.json()
        setEvents(data.events || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Handle actions
  const handleStatusChange = async (eventId: string, newStatus: Event["status"]) => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      
      const result = await res.json()
      
      if (!res.ok) throw new Error(result.error || "Failed to update status")
      
      // Use the formatted event from the response
      setEvents((prev) => prev.map((e) => (e.id === eventId ? result.event : e)))
    } catch (error) {
      console.error("Failed to update event status:", error)
      alert("Failed to update event status")
    }
  }

  const handleFeatureToggle = async (eventId: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !current }),
      })
      
      const result = await res.json()
      
      if (!res.ok) throw new Error("Failed to toggle featured")
      
      setEvents((prev) => prev.map((e) => (e.id === eventId ? result.event : e)))
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    }
  }

  const handleVipToggle = async (eventId: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vip: !current }),
      })
      
      const result = await res.json()
      
      if (!res.ok) throw new Error("Failed to toggle VIP")
      
      setEvents((prev) => prev.map((e) => (e.id === eventId ? result.event : e)))
    } catch (error) {
      console.error("Failed to toggle VIP:", error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, { 
        method: "DELETE" 
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to delete event")
      }
      
      console.log("Delete successful:", result)
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (error) {
      console.error("Failed to delete event:", error)
      alert(error instanceof Error ? error.message : "Failed to delete event")
    }
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsEditing(true)
  }

  const handleSaveEvent = (updatedEvent: Event) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
    setIsEditing(false)
    setSelectedEvent(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setSelectedEvent(null)
  }

  const eventCounts = {
    all: events.length,
    approved: events.filter((e) => e.status === "Approved").length,
    pending: events.filter((e) => e.status === "Pending Review").length,
    flagged: events.filter((e) => e.status === "Flagged").length,
    featured: events.filter((e) => e.featured).length,
    vip: events.filter((e) => e.vip).length,
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-500">Loading events...</p>
      </div>
    )

  // Show edit form when editing
  if (isEditing && selectedEvent) {
    return (
      <EditEventForm
        event={selectedEvent}
        onSave={handleSaveEvent}
        onCancel={handleCancelEdit}
      />
    )
  }

  // Show event list when not editing
  return (
    <EventList
      events={events}
      searchTerm={searchTerm}
      selectedStatus={selectedStatus}
      selectedCategory={selectedCategory}
      activeTab={activeTab}
      eventCounts={eventCounts}
      onEdit={handleEditEvent}
      onStatusChange={handleStatusChange}
      onFeatureToggle={handleFeatureToggle}
      onVipToggle={handleVipToggle}
      onDelete={handleDeleteEvent}
      onPromote={(event) => {
        setSelectedEvent(event)
        setIsPromoteDialogOpen(true)
      }}
      onSearchChange={setSearchTerm}
      onStatusFilterChange={setSelectedStatus}
      onCategoryFilterChange={setSelectedCategory}
      onTabChange={setActiveTab}
    />
  )
}