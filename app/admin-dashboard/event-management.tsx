"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Building2,
  Calendar,
  MapPin,
  Users,
  Star,
  Crown,
  TrendingUp,
  DollarSign,
  Search,
  Plus,
  Trash2,
  Flag,
  Target,
  BarChart3,
  MessageSquare,
  Share2,
  Clock,
} from "lucide-react"

interface Event {
  id: number
  title: string
  organizer: string
  organizerId: number
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

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

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
  const handleStatusChange = async (eventId: number, newStatus: Event["status"]) => {
    try {
      await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e)))
    } catch (error) {
      console.error("Failed to update event status:", error)
    }
  }

  const handleFeatureToggle = async (eventId: number, current: boolean) => {
    try {
      await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !current }),
      })
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, featured: !current } : e)))
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    }
  }

  const handleVipToggle = async (eventId: number, current: boolean) => {
    try {
      await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vip: !current }),
      })
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, vip: !current } : e)))
    } catch (error) {
      console.error("Failed to toggle VIP:", error)
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" })
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (error) {
      console.error("Failed to delete event:", error)
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

  const getPriorityColor = (priority: Event["priority"]) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  // Search and Filters
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

  const eventCounts = {
    all: events.length,
    approved: events.filter((e) => e.status === "Approved").length,
    pending: events.filter((e) => e.status === "Pending Review").length,
    flagged: events.filter((e) => e.status === "Flagged").length,
    featured: events.filter((e) => e.featured).length,
    vip: events.filter((e) => e.vip).length,
  }

  const getFilteredEventsByTab = (tab: string) => {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-500">Loading events...</p>
      </div>
    )

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                          {/* <span className={`text-xs font-medium ${getPriorityColor(event.priority)}`}>
                            {event.priority} Priority
                          </span> */}
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

                        {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600">
                            <DollarSign className="w-4 h-4" />₹{(event.revenue / 1000).toFixed(0)}K
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Eye className="w-4 h-4" />
                            {event.views} views
                          </div>
                          <div className="flex items-center gap-1 text-purple-600">
                            <Target className="w-4 h-4" />
                            {event.registrations} reg.
                          </div>
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="w-4 h-4" />
                            {event.rating}/5 ({event.reviews})
                          </div>
                          <div className="flex items-center gap-1 text-pink-600">
                            <Share2 className="w-4 h-4" />
                            {event.socialShares} shares
                          </div>
                        </div> */}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsAnalyticsDialogOpen(true)
                        }}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
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
                          <DropdownMenuItem onClick={() => handleFeatureToggle(event.id, event.featured)}>
                            <Star className="w-4 h-4 mr-2" />
                            {event.featured ? "Remove Featured" : "Make Featured"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVipToggle(event.id, event.vip)}>
                            <Crown className="w-4 h-4 mr-2" />
                            {event.vip ? "Remove VIP" : "Make VIP"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event)
                              setIsPromoteDialogOpen(true)
                            }}
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Promote Event
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact Organizer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteEvent(event.id)}>
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
