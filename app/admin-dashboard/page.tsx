"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  AreaChart,
  Area,
} from "recharts"
import {
  Shield,
  Users,
  Calendar,
  Building2,
  BarChart3,
  DollarSign,
  FileText,
  Settings,
  Bell,
  Search,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserCheck,
  UserX,
  Activity,
  Database,
  MapPin,
  Flag,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Mock admin data
  const adminData = {
    name: "Admin User",
    email: "admin@bztradefairs.com",
    role: "Super Administrator",
    avatar: "/placeholder.svg?height=120&width=120&text=Admin",
  }

  // Mock system stats
  const systemStats = [
    {
      title: "Total Users",
      value: "45,231",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Events",
      value: "1,247",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "green",
    },
    {
      title: "Event Organizers",
      value: "892",
      change: "+15%",
      trend: "up",
      icon: Building2,
      color: "purple",
    },
    {
      title: "Platform Revenue",
      value: "₹2.4Cr",
      change: "+25%",
      trend: "up",
      icon: DollarSign,
      color: "yellow",
    },
  ]

  // Mock users data
  const usersData = [
    {
      id: 1,
      name: "Ramesh Sharma",
      email: "ramesh@company.com",
      role: "Attendee",
      status: "Active",
      joinDate: "2024-01-15",
      lastLogin: "2024-12-20",
      events: 12,
      avatar: "/placeholder.svg?height=40&width=40&text=RS",
    },
    {
      id: 2,
      name: "EventCorp India",
      email: "contact@eventcorp.in",
      role: "Organizer",
      status: "Active",
      joinDate: "2023-08-10",
      lastLogin: "2024-12-22",
      events: 45,
      avatar: "/placeholder.svg?height=40&width=40&text=EC",
    },
    {
      id: 3,
      name: "Priya Patel",
      email: "priya@techsolutions.com",
      role: "Attendee",
      status: "Suspended",
      joinDate: "2024-03-22",
      lastLogin: "2024-12-18",
      events: 8,
      avatar: "/placeholder.svg?height=40&width=40&text=PP",
    },
  ]

  // Mock events data for admin oversight
  const eventsData = [
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

  // Mock analytics data
  const userGrowthData = [
    { month: "Jan", users: 35000, organizers: 650 },
    { month: "Feb", users: 37500, organizers: 680 },
    { month: "Mar", users: 39200, organizers: 720 },
    { month: "Apr", users: 41800, organizers: 750 },
    { month: "May", users: 43500, organizers: 820 },
    { month: "Jun", users: 45231, organizers: 892 },
  ]

  const revenueData = [
    { month: "Jan", revenue: 1850000, commission: 185000 },
    { month: "Feb", revenue: 2100000, commission: 210000 },
    { month: "Mar", revenue: 1950000, commission: 195000 },
    { month: "Apr", revenue: 2300000, commission: 230000 },
    { month: "May", revenue: 2150000, commission: 215000 },
    { month: "Jun", revenue: 2400000, commission: 240000 },
  ]

  const eventCategoryData = [
    { name: "Exhibitions", value: 45, color: "#3B82F6" },
    { name: "Conferences", value: 30, color: "#10B981" },
    { name: "Workshops", value: 15, color: "#F59E0B" },
    { name: "Seminars", value: 10, color: "#EF4444" },
  ]

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: Shield,
      id: "dashboard",
    },
    {
      title: "User Management",
      icon: Users,
      id: "users",
    },
    {
      title: "Event Management",
      icon: Calendar,
      id: "events",
    },
    {
      title: "Organizers",
      icon: Building2,
      id: "organizers",
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
      title: "Reports",
      icon: FileText,
      id: "reports",
    },
    {
      title: "Content Management",
      icon: Database,
      id: "content",
    },
    {
      title: "System Settings",
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
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">System overview and key metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
                <Button className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  System Health
                </Button>
              </div>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemStats.map((stat, index) => (
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
                      <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">New event approved</p>
                        <p className="text-sm text-gray-600">Global Precision Expo 2025 - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">New organizer registered</p>
                        <p className="text-sm text-gray-600">TechEvents Ltd - 4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Flag className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Event flagged for review</p>
                        <p className="text-sm text-gray-600">Suspicious Event - 6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Server Status</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Payment Gateway</span>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email Service</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage Usage</span>
                      <span className="text-sm text-gray-600">68% (2.1TB / 3TB)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <Users className="w-6 h-6" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <Calendar className="w-6 h-6" />
                    Review Events
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <BarChart3 className="w-6 h-6" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <Settings className="w-6 h-6" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
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
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
                <TabsTrigger value="organizers">Organizers</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left p-4 font-medium">User</th>
                            <th className="text-left p-4 font-medium">Role</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Join Date</th>
                            <th className="text-left p-4 font-medium">Last Login</th>
                            <th className="text-left p-4 font-medium">Events</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersData.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-gray-600">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant={user.role === "Organizer" ? "default" : "secondary"}>{user.role}</Badge>
                              </td>
                              <td className="p-4">
                                <Badge
                                  variant={user.status === "Active" ? "default" : "destructive"}
                                  className="flex items-center gap-1 w-fit"
                                >
                                  {user.status === "Active" ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <XCircle className="w-3 h-3" />
                                  )}
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm">{user.joinDate}</td>
                              <td className="p-4 text-sm">{user.lastLogin}</td>
                              <td className="p-4 text-sm">{user.events}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    {user.status === "Active" ? (
                                      <UserX className="w-4 h-4 text-red-500" />
                                    ) : (
                                      <UserCheck className="w-4 h-4 text-green-500" />
                                    )}
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
              </TabsContent>
            </Tabs>
          </div>
        )

      case "events":
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

      case "organizers":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Organizer Management</h1>
              <Button>Approve New Organizers</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold">892</h3>
                  <p className="text-gray-600">Total Organizers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold">847</h3>
                  <p className="text-gray-600">Verified</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-yellow-100 rounded-full w-fit mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold">45</h3>
                  <p className="text-gray-600">Pending Review</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Organizer management interface would be implemented here...</p>
              </CardContent>
            </Card>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                      <Area type="monotone" dataKey="organizers" stackId="1" stroke="#10B981" fill="#10B981" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Event Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={eventCategoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                       label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : "0"}%`}
                      >
                        {eventCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="organizers" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "revenue":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Revenue Management</h1>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export Financial Report
              </Button>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">₹2.4Cr</p>
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
                      <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                      <p className="text-2xl font-bold">₹24L</p>
                      <p className="text-sm text-green-600">10% commission rate</p>
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
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold">₹40L</p>
                      <p className="text-sm text-green-600">+15% from last month</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                      <p className="text-2xl font-bold">₹8.5L</p>
                      <p className="text-sm text-yellow-600">To 45 organizers</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Commission Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${(Number(value) / 100000).toFixed(1)}L`, ""]} />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                    <Bar dataKey="commission" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )

      case "reports":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">User Report</h3>
                      <p className="text-sm text-gray-600">User activity and engagement</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Event Report</h3>
                      <p className="text-sm text-gray-600">Event performance metrics</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Financial Report</h3>
                      <p className="text-sm text-gray-600">Revenue and commission data</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "content":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>

            <Tabs defaultValue="categories" className="w-full">
              <TabsList>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="featured">Featured Content</TabsTrigger>
                <TabsTrigger value="banners">Banners</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
              </TabsList>

              <TabsContent value="categories">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button>Add New Category</Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {["Exhibitions", "Conferences", "Workshops", "Seminars", "Trade Shows", "Networking"].map(
                          (category) => (
                            <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="font-medium">{category}</span>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="featured">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">Featured content management interface...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">User Registration</div>
                      <div className="text-sm text-gray-600">Allow new user registrations</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Event Auto-Approval</div>
                      <div className="text-sm text-gray-600">Automatically approve new events</div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Send system email notifications</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                    <Input id="commission-rate" type="number" defaultValue="10" />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Require 2FA for admin accounts</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Session Timeout</div>
                      <div className="text-sm text-gray-600">Auto-logout inactive sessions</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                    <Input id="session-duration" type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                    <Input id="max-login-attempts" type="number" defaultValue="5" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-gateway">Payment Gateway</Label>
                    <Select defaultValue="razorpay">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="razorpay">Razorpay</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="payu">PayU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">INR (₹)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payout-schedule">Payout Schedule</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Email Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" defaultValue="smtp.gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" type="number" defaultValue="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input id="from-email" type="email" defaultValue="noreply@bztradefairs.com" />
                  </div>
                  <Button>Test Email Configuration</Button>
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={adminData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-red-600 text-white">SA</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{adminData.name}</div>
                <div className="text-sm text-gray-600">{adminData.role}</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Super Admin Panel</SidebarGroupLabel>
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
                <AvatarImage src={adminData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-red-600 text-white">SA</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
