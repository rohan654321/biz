"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Users,
  BarChart3,
  DollarSign,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Edit,
  MapPin,
  Eye,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function OrganizerDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Mock organizer data
  const organizerData = {
    name: "EventCorp India",
    email: "contact@eventcorp.in",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    website: "www.eventcorp.in",
    description:
      "Professional Event Management Company specializing in trade shows, conferences, and corporate events.",
    avatar: "/placeholder.svg?height=120&width=120&text=EC",
    totalEvents: 45,
    activeEvents: 8,
    totalAttendees: 12500,
    totalRevenue: 2850000,
  }

  // Mock dashboard stats
  const dashboardStats = [
    {
      title: "Total Events",
      value: "45",
      change: "+12%",
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Active Events",
      value: "8",
      change: "+3",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Total Attendees",
      value: "12.5K",
      change: "+18%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Revenue",
      value: "₹28.5L",
      change: "+25%",
      trend: "up",
      icon: DollarSign,
    },
  ]

  // Mock events data
  const myEvents = [
    {
      id: 1,
      title: "Global Precision Expo 2025",
      date: "June 11-13, 2025",
      location: "Chennai Trade Centre",
      status: "Active",
      attendees: 2500,
      revenue: 850000,
      registrations: 2800,
      type: "Exhibition",
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      date: "July 20-22, 2025",
      location: "Mumbai Convention Center",
      status: "Planning",
      attendees: 1200,
      revenue: 450000,
      registrations: 1500,
      type: "Conference",
    },
    {
      id: 3,
      title: "Healthcare Expo 2025",
      date: "August 15-17, 2025",
      location: "Delhi Exhibition Center",
      status: "Draft",
      attendees: 0,
      revenue: 0,
      registrations: 0,
      type: "Exhibition",
    },
  ]

  // Mock attendees data
  const attendeesData = [
    {
      id: 1,
      name: "Ramesh Sharma",
      email: "ramesh@company.com",
      event: "Global Precision Expo 2025",
      registrationDate: "2024-12-15",
      status: "Confirmed",
      ticketType: "VIP",
      avatar: "/placeholder.svg?height=40&width=40&text=RS",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@techsolutions.com",
      event: "Tech Innovation Summit",
      registrationDate: "2024-12-20",
      status: "Pending",
      ticketType: "General",
      avatar: "/placeholder.svg?height=40&width=40&text=PP",
    },
    {
      id: 3,
      name: "Arjun Reddy",
      email: "arjun@healthcare.in",
      event: "Healthcare Expo 2025",
      registrationDate: "2024-12-22",
      status: "Confirmed",
      ticketType: "Student",
      avatar: "/placeholder.svg?height=40&width=40&text=AR",
    },
  ]

  // Mock analytics data
  const registrationData = [
    { month: "Jan", registrations: 120 },
    { month: "Feb", registrations: 180 },
    { month: "Mar", registrations: 250 },
    { month: "Apr", registrations: 320 },
    { month: "May", registrations: 280 },
    { month: "Jun", registrations: 450 },
  ]

  const revenueData = [
    { month: "Jan", revenue: 85000 },
    { month: "Feb", revenue: 125000 },
    { month: "Mar", revenue: 180000 },
    { month: "Apr", revenue: 220000 },
    { month: "May", revenue: 195000 },
    { month: "Jun", revenue: 285000 },
  ]

  const eventTypeData = [
    { name: "Exhibitions", value: 45, color: "#3B82F6" },
    { name: "Conferences", value: 30, color: "#10B981" },
    { name: "Workshops", value: 15, color: "#F59E0B" },
    { name: "Seminars", value: 10, color: "#EF4444" },
  ]

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      id: "dashboard",
    },
    {
      title: "My Events",
      icon: Calendar,
      id: "events",
    },
    {
      title: "Create Event",
      icon: Plus,
      id: "create-event",
    },
    {
      title: "Attendees",
      icon: Users,
      id: "attendees",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      id: "analytics",
    },
    {
      title: "Revenue",
      icon: DollarSign,
      id: "revenue",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      id: "messages",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {organizerData.name}</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Event
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {stat.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <stat.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.date}</p>
                        </div>
                        <Badge
                          variant={
                            event.status === "Active"
                              ? "default"
                              : event.status === "Planning"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                      <Plus className="w-6 h-6" />
                      Create Event
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                      <Users className="w-6 h-6" />
                      Manage Attendees
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                      <BarChart3 className="w-6 h-6" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                      <MessageSquare className="w-6 h-6" />
                      Send Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "events":
        return (
          <div className="space-y-6">
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
                {myEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <Badge
                              variant={
                                event.status === "Active"
                                  ? "default"
                                  : event.status === "Planning"
                                    ? "secondary"
                                    : "outline"
                              }
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
                              <DollarSign className="w-4 h-4" />₹{(event.revenue / 100000).toFixed(1)}L revenue
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
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )

      case "create-event":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="Enter event title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exhibition">Exhibition</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your event" rows={4} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input id="venue" placeholder="Event venue" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="general-price">General Ticket Price</Label>
                    <Input id="general-price" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vip-price">VIP Ticket Price</Label>
                    <Input id="vip-price" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-price">Student Ticket Price</Label>
                    <Input id="student-price" type="number" placeholder="0" />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="bg-transparent">
                    Save as Draft
                  </Button>
                  <Button>Publish Event</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "attendees":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Attendees</h1>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search attendees..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Attendee</th>
                        <th className="text-left p-4 font-medium">Event</th>
                        <th className="text-left p-4 font-medium">Registration Date</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Ticket Type</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendeesData.map((attendee) => (
                        <tr key={attendee.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={attendee.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {attendee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{attendee.name}</div>
                                <div className="text-sm text-gray-600">{attendee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{attendee.event}</td>
                          <td className="p-4 text-sm">{attendee.registrationDate}</td>
                          <td className="p-4">
                            <Badge
                              variant={attendee.status === "Confirmed" ? "default" : "secondary"}
                              className="flex items-center gap-1 w-fit"
                            >
                              {attendee.status === "Confirmed" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {attendee.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{attendee.ticketType}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registration Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Registration Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="registrations" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Event Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }:any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {eventTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="registrations" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "revenue":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Revenue</h1>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">₹28.5L</p>
                      <p className="text-sm text-green-600">+25% from last month</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold">₹4.2L</p>
                      <p className="text-sm text-green-600">+15% from last month</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average per Event</p>
                      <p className="text-2xl font-bold">₹6.3L</p>
                      <p className="text-sm text-green-600">+8% from last quarter</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value:any) => [`₹${(value / 1000).toFixed(0)}K`, "Revenue"]} />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "messages":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <Button>New Message</Button>
            </div>

            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600">Message functionality coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Organization Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" defaultValue={organizerData.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Email</Label>
                    <Input id="org-email" type="email" defaultValue={organizerData.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-phone">Phone</Label>
                    <Input id="org-phone" defaultValue={organizerData.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-website">Website</Label>
                    <Input id="org-website" defaultValue={organizerData.website} />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              {/* Event Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-approve Registrations</div>
                      <div className="text-sm text-gray-600">Automatically approve event registrations</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Send email updates to attendees</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Public Profile</div>
                      <div className="text-sm text-gray-600">Make your organizer profile public</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Public
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  return (
    <SidebarProvider >
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={organizerData.avatar || "/placeholder.svg"} />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{organizerData.name}</div>
                <div className="text-sm text-gray-600">Event Organizer</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Organizer Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={organizerData.avatar || "/placeholder.svg"} />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
