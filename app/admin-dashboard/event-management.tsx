"use client"

import { useState } from "react"
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

interface EventManagementProps {
  events?: Event[]
}

export default function EventManagement({ events }: EventManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const defaultEvents: Event[] = [
    {
      id: 1,
      title: "Global Precision Expo 2025",
      organizer: "EventCorp India",
      organizerId: 101,
      date: "June 11, 2025",
      endDate: "June 13, 2025",
      location: "Chennai, Tamil Nadu",
      venue: "Chennai Trade Centre",
      status: "Approved",
      attendees: 2500,
      maxCapacity: 3000,
      revenue: 850000,
      ticketPrice: 1500,
      category: "Exhibition",
      featured: true,
      vip: true,
      priority: "High",
      description:
        "India's largest precision engineering exhibition showcasing cutting-edge manufacturing technologies.",
      tags: ["Manufacturing", "Technology", "B2B", "Industrial"],
      createdAt: "2024-12-15",
      lastModified: "2025-01-10",
      views: 15420,
      registrations: 2847,
      rating: 4.8,
      reviews: 234,
      image: "/placeholder.svg?height=200&width=300",
      promotionBudget: 50000,
      socialShares: 1250,
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      organizer: "TechEvents Ltd",
      organizerId: 102,
      date: "July 20, 2025",
      endDate: "July 22, 2025",
      location: "Mumbai, Maharashtra",
      venue: "Mumbai Convention Center",
      status: "Approved",
      attendees: 1200,
      maxCapacity: 1500,
      revenue: 450000,
      ticketPrice: 2500,
      category: "Conference",
      featured: true,
      vip: false,
      priority: "High",
      description: "Premier technology conference bringing together industry leaders and innovators.",
      tags: ["Technology", "Innovation", "Startups", "AI"],
      createdAt: "2024-11-20",
      lastModified: "2025-01-08",
      views: 8930,
      registrations: 1456,
      rating: 4.6,
      reviews: 89,
      image: "/placeholder.svg?height=200&width=300",
      promotionBudget: 35000,
      socialShares: 890,
    },
    {
      id: 3,
      title: "Healthcare Innovation Forum",
      organizer: "MedTech Solutions",
      organizerId: 103,
      date: "August 15, 2025",
      endDate: "August 17, 2025",
      location: "Bangalore, Karnataka",
      venue: "Bangalore International Exhibition Centre",
      status: "Pending Review",
      attendees: 0,
      maxCapacity: 2000,
      revenue: 0,
      ticketPrice: 3000,
      category: "Healthcare",
      featured: false,
      vip: true,
      priority: "Medium",
      description: "Exploring the future of healthcare through innovative technologies and solutions.",
      tags: ["Healthcare", "Innovation", "Medical", "Technology"],
      createdAt: "2025-01-05",
      lastModified: "2025-01-15",
      views: 2340,
      registrations: 234,
      rating: 0,
      reviews: 0,
      image: "/placeholder.svg?height=200&width=300",
      promotionBudget: 25000,
      socialShares: 156,
    },
    {
      id: 4,
      title: "Suspicious Event",
      organizer: "Unknown Organizer",
      organizerId: 999,
      date: "September 10, 2025",
      endDate: "September 12, 2025",
      location: "Unknown Location",
      venue: "Unknown Venue",
      status: "Flagged",
      attendees: 0,
      maxCapacity: 500,
      revenue: 0,
      ticketPrice: 500,
      category: "Other",
      featured: false,
      vip: false,
      priority: "Low",
      description: "Suspicious event with incomplete information and verification issues.",
      tags: ["Flagged", "Review Required"],
      createdAt: "2025-01-12",
      lastModified: "2025-01-16",
      views: 45,
      registrations: 0,
      rating: 0,
      reviews: 0,
      image: "/placeholder.svg?height=200&width=300",
      promotionBudget: 0,
      socialShares: 0,
    },
    {
      id: 5,
      title: "Digital Marketing Masterclass",
      organizer: "Marketing Pros Academy",
      organizerId: 104,
      date: "October 5, 2025",
      endDate: "October 7, 2025",
      location: "Delhi, NCR",
      venue: "India Expo Centre",
      status: "Approved",
      attendees: 800,
      maxCapacity: 1000,
      revenue: 320000,
      ticketPrice: 1800,
      category: "Workshop",
      featured: false,
      vip: true,
      priority: "Medium",
      description: "Comprehensive digital marketing workshop for professionals and entrepreneurs.",
      tags: ["Marketing", "Digital", "Workshop", "Business"],
      createdAt: "2024-10-15",
      lastModified: "2025-01-14",
      views: 5670,
      registrations: 923,
      rating: 4.7,
      reviews: 156,
      image: "/placeholder.svg?height=200&width=300",
      promotionBudget: 20000,
      socialShares: 445,
    },
  ]

  const eventsData = events || defaultEvents

  // Filter events based on search and filters
  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || event.status.toLowerCase().replace(" ", "") === selectedStatus
    const matchesCategory = selectedCategory === "all" || event.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Get event counts by status
  const eventCounts = {
    all: eventsData.length,
    approved: eventsData.filter((e) => e.status === "Approved").length,
    pending: eventsData.filter((e) => e.status === "Pending Review").length,
    flagged: eventsData.filter((e) => e.status === "Flagged").length,
    featured: eventsData.filter((e) => e.featured).length,
    vip: eventsData.filter((e) => e.vip).length,
  }

  const handleStatusChange = (eventId: number, newStatus: Event["status"]) => {
    console.log(`Changing event ${eventId} status to ${newStatus}`)
    // Update the event status in your data/state management
    // This would typically involve an API call
  }

  const handleFeatureToggle = (eventId: number) => {
    console.log(`Toggling featured status for event ${eventId}`)
    // Toggle featured status in your data/state management
  }

  const handleVipToggle = (eventId: number) => {
    console.log(`Toggling VIP status for event ${eventId}`)
    // Toggle VIP status in your data/state management
  }

  const handleDeleteEvent = (eventId: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      console.log(`Deleting event ${eventId}`)
      // Delete event from your data/state management
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

  // Filter events based on active tab
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{eventCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{eventCounts.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{eventCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Flagged</p>
                <p className="text-2xl font-bold">{eventCounts.flagged}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{eventCounts.featured}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">VIP Events</p>
                <p className="text-2xl font-bold">{eventCounts.vip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Events Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Events ({eventCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({eventCounts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({eventCounts.approved})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({eventCounts.flagged})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({eventCounts.featured})</TabsTrigger>
          <TabsTrigger value="vip">VIP ({eventCounts.vip})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {getFilteredEventsByTab("all").map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
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
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {event.vip && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Crown className="w-3 h-3 mr-1" />
                            VIP
                          </Badge>
                        )}
                        <span className={`text-xs font-medium ${getPriorityColor(event.priority)}`}>
                          {event.priority} Priority
                        </span>
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

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event)
                        setIsAnalyticsDialogOpen(true)
                      }}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
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

                    {event.status === "Pending Review" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleStatusChange(event.id, "Approved")}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleStatusChange(event.id, "Rejected")}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleFeatureToggle(event.id)}>
                          <Star className="w-4 h-4 mr-2" />
                          {event.featured ? "Remove Featured" : "Make Featured"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVipToggle(event.id)}>
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
                        <DropdownMenuItem>
                          <Flag className="w-4 h-4 mr-2" />
                          Flag Event
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Other tab contents would filter the events accordingly */}
        <TabsContent value="pending" className="space-y-4">
          {getFilteredEventsByTab("pending").map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.organizer}</p>
                      <p className="text-sm text-gray-500">
                        {event.date} • {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(event.id, "Approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(event.id, "Rejected")}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {getFilteredEventsByTab("approved").map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.organizer}</p>
                      <p className="text-sm text-gray-500">
                        {event.date} • {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(event.id, "Approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(event.id, "Rejected")}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          {getFilteredEventsByTab("flagged").map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.organizer}</p>
                      <p className="text-sm text-gray-500">
                        {event.date} • {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(event.id, "Approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(event.id, "Rejected")}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          {getFilteredEventsByTab("featured").map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.organizer}</p>
                      <p className="text-sm text-gray-500">
                        {event.date} • {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(event.id, "Approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(event.id, "Rejected")}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="vip" className="space-y-4">
          {getFilteredEventsByTab("vip").map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.organizer}</p>
                      <p className="text-sm text-gray-500">
                        {event.date} • {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(event.id, "Approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(event.id, "Rejected")}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        {/* Similar structure for other tabs */}
      </Tabs>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details and settings</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" defaultValue={selectedEvent.title} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={selectedEvent.category.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exhibition">Exhibition</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Start Date</Label>
                  <Input id="date" type="date" defaultValue="2025-06-11" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" defaultValue="2025-06-13" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue={selectedEvent.location} />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input id="venue" defaultValue={selectedEvent.venue} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="capacity">Max Capacity</Label>
                  <Input id="capacity" type="number" defaultValue={selectedEvent.maxCapacity} />
                </div>
                <div>
                  <Label htmlFor="ticketPrice">Ticket Price (₹)</Label>
                  <Input id="ticketPrice" type="number" defaultValue={selectedEvent.ticketPrice} />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue={selectedEvent.priority.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={selectedEvent.description} />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="featured" defaultChecked={selectedEvent.featured} className="rounded" />
                  <Label htmlFor="featured">Featured Event</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="vip" defaultChecked={selectedEvent.vip} className="rounded" />
                  <Label htmlFor="vip">VIP Event</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promote Event Dialog */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Promote Event</DialogTitle>
            <DialogDescription>Boost event visibility and reach more attendees</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedEvent.title}</h4>
                <p className="text-sm text-gray-600">
                  {selectedEvent.date} • {selectedEvent.location}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Promotion Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Homepage Banner</p>
                      <p className="text-sm text-gray-600">Featured on homepage for 7 days</p>
                    </div>
                    <p className="font-bold">₹15,000</p>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Category Featured</p>
                      <p className="text-sm text-gray-600">Top of category listings for 14 days</p>
                    </div>
                    <p className="font-bold">₹8,000</p>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Campaign</p>
                      <p className="text-sm text-gray-600">Send to 10,000+ targeted users</p>
                    </div>
                    <p className="font-bold">₹12,000</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPromoteDialogOpen(false)}>Start Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Analytics</DialogTitle>
            <DialogDescription>Detailed performance metrics and insights</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold">{selectedEvent.views.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Registrations</p>
                        <p className="text-2xl font-bold">{selectedEvent.registrations.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold">₹{(selectedEvent.revenue / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-2xl font-bold">{selectedEvent.rating}/5</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversion Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>View to Registration Rate</span>
                        <span className="font-bold">
                          {((selectedEvent.registrations / selectedEvent.views) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration to Attendance</span>
                        <span className="font-bold">
                          {((selectedEvent.attendees / selectedEvent.registrations) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacity Utilization</span>
                        <span className="font-bold">
                          {((selectedEvent.attendees / selectedEvent.maxCapacity) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Social Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Social Shares</span>
                        <span className="font-bold">{selectedEvent.socialShares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reviews</span>
                        <span className="font-bold">{selectedEvent.reviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Promotion Budget</span>
                        <span className="font-bold">₹{selectedEvent.promotionBudget.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsAnalyticsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
