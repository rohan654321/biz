"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Download,
  Users,
  Eye,
  Building2,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  BarChart3,
} from "lucide-react"

interface AnalyticsData {
  registrationData: Array<{ month: string; registrations: number }>
  eventTypeData: Array<{ name: string; value: number; color: string }>
}

interface Event {
  id: number
  title: string
  date: string
  location: string
  status: string
  attendees: number
  revenue: number
  registrations: number
  type: string
}

interface AnalyticsDashboardProps {
  analyticsData: AnalyticsData
  events: Event[]
}

export default function AnalyticsDashboard({ analyticsData, events }: AnalyticsDashboardProps) {
  const [selectedEvent, setSelectedEvent] = useState("1")
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")

  // Mock lead generation data for selected event
  const leadData = {
    totalLeads: 1247,
    qualifiedLeads: 892,
    hotLeads: 234,
    conversionRate: 18.7,
    leadSources: [
      { name: "Website", value: 45, color: "#3B82F6" },
      { name: "Social Media", value: 28, color: "#10B981" },
      { name: "Email Campaign", value: 15, color: "#F59E0B" },
      { name: "Referrals", value: 12, color: "#EF4444" },
    ],
    dailyLeads: [
      { date: "Dec 1", leads: 45, qualified: 32 },
      { date: "Dec 2", leads: 52, qualified: 38 },
      { date: "Dec 3", leads: 38, qualified: 28 },
      { date: "Dec 4", leads: 65, qualified: 48 },
      { date: "Dec 5", leads: 58, qualified: 42 },
      { date: "Dec 6", leads: 72, qualified: 55 },
      { date: "Dec 7", leads: 68, qualified: 51 },
    ],
  }

  // Mock visitor data
  const visitorData = {
    totalVisitors: 15420,
    uniqueVisitors: 12350,
    returningVisitors: 3070,
    averageSessionDuration: "4m 32s",
    bounceRate: 24.5,
    pageViews: 45680,
    visitorFlow: [
      { hour: "9 AM", visitors: 120 },
      { hour: "10 AM", visitors: 280 },
      { hour: "11 AM", visitors: 450 },
      { hour: "12 PM", visitors: 380 },
      { hour: "1 PM", visitors: 320 },
      { hour: "2 PM", visitors: 420 },
      { hour: "3 PM", visitors: 520 },
      { hour: "4 PM", visitors: 480 },
      { hour: "5 PM", visitors: 350 },
      { hour: "6 PM", visitors: 180 },
    ],
    deviceBreakdown: [
      { device: "Desktop", percentage: 52, color: "#3B82F6" },
      { device: "Mobile", percentage: 35, color: "#10B981" },
      { device: "Tablet", percentage: 13, color: "#F59E0B" },
    ],
    topPages: [
      { page: "/event-details", views: 8420, duration: "5m 12s" },
      { page: "/speakers", views: 6230, duration: "3m 45s" },
      { page: "/schedule", views: 4850, duration: "2m 38s" },
      { page: "/registration", views: 3920, duration: "6m 22s" },
      { page: "/venue", views: 2180, duration: "1m 55s" },
    ],
  }

  // Mock exhibitor data
  const exhibitorData = {
    totalExhibitors: 156,
    confirmedExhibitors: 142,
    pendingExhibitors: 14,
    premiumBooths: 45,
    standardBooths: 97,
    totalBoothRevenue: 2850000,
    exhibitorEngagement: [
      { category: "Technology", count: 42, engagement: 85 },
      { category: "Healthcare", count: 38, engagement: 78 },
      { category: "Manufacturing", count: 35, engagement: 82 },
      { category: "Finance", count: 28, engagement: 76 },
      { category: "Education", count: 13, engagement: 88 },
    ],
    boothSizes: [
      { size: "3x3m", count: 65, revenue: 975000 },
      { size: "6x3m", count: 42, revenue: 1260000 },
      { size: "6x6m", count: 28, revenue: 1680000 },
      { size: "9x6m", count: 21, revenue: 1890000 },
    ],
    exhibitorLeads: [
      {
        id: 1,
        company: "TechCorp Solutions",
        contact: "Rajesh Kumar",
        email: "rajesh@techcorp.in",
        phone: "+91 98765 43210",
        booth: "A-15",
        category: "Technology",
        leads: 45,
        status: "Hot",
      },
      {
        id: 2,
        company: "HealthFirst Medical",
        contact: "Dr. Priya Sharma",
        email: "priya@healthfirst.com",
        phone: "+91 87654 32109",
        booth: "B-22",
        category: "Healthcare",
        leads: 38,
        status: "Warm",
      },
      {
        id: 3,
        company: "Manufacturing Plus",
        contact: "Amit Patel",
        email: "amit@mfgplus.in",
        phone: "+91 76543 21098",
        booth: "C-08",
        category: "Manufacturing",
        leads: 52,
        status: "Hot",
      },
    ],
  }

  const selectedEventData = events.find((event) => event.id.toString() === selectedEvent)

  const handleDownloadReport = (reportType: string) => {
    // Mock download functionality
    console.log(`Downloading ${reportType} report for event ${selectedEventData?.title}`)
    // In real implementation, this would generate and download the actual report
  }

  const { registrationData, eventTypeData } = analyticsData

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Analytics</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedEventData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedEventData.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {selectedEventData.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {selectedEventData.location}
              </span>
              <Badge variant={selectedEventData.status === "Active" ? "default" : "secondary"}>
                {selectedEventData.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Lead Generation</TabsTrigger>
          <TabsTrigger value="visitors">Visitor Analytics</TabsTrigger>
          <TabsTrigger value="exhibitors">Exhibitor Data</TabsTrigger>
          <TabsTrigger value="reports">Download Reports</TabsTrigger> 
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold">{leadData.totalLeads.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                    <p className="text-2xl font-bold">{visitorData.totalVisitors.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+18% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exhibitors</p>
                    <p className="text-2xl font-bold">{exhibitorData.totalExhibitors}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+8% from last event</p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold">{leadData.conversionRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+2.3% from last month</p>
              </CardContent>
            </Card> */}
          </div>

          {/* Registration Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      label={({ name, percent }) => `${name} ${percent?(percent * 100).toFixed(0):'0'}%`}
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
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          {/* Lead Generation Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-3xl font-bold text-blue-600">{leadData.totalLeads}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Qualified Leads</p>
                  <p className="text-3xl font-bold text-green-600">{leadData.qualifiedLeads}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                  <p className="text-3xl font-bold text-red-600">{leadData.hotLeads}</p>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{leadData.conversionRate}%</p>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Lead Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Lead Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={leadData.dailyLeads}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="qualified"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadData.leadSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${percent?(percent * 100).toFixed(0):"0"}%`}
                    >
                      {leadData.leadSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-6">
          {/* Visitor Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-3xl font-bold text-blue-600">{visitorData.totalVisitors.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                  <p className="text-3xl font-bold text-green-600">{visitorData.uniqueVisitors.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                  <p className="text-3xl font-bold text-purple-600">{visitorData.averageSessionDuration}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                  <p className="text-3xl font-bold text-orange-600">{visitorData.bounceRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visitor Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Visitor Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={visitorData.visitorFlow}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={visitorData.deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                      label={({ device, percentage }) => `${device} ${percentage}%`}
                    >
                      {visitorData.deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitorData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-gray-600">Avg. Duration: {page.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{page.views.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exhibitors" className="space-y-6">
          {/* Exhibitor Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Exhibitors</p>
                  <p className="text-3xl font-bold text-blue-600">{exhibitorData.totalExhibitors}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">{exhibitorData.confirmedExhibitors}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Premium Booths</p>
                  <p className="text-3xl font-bold text-purple-600">{exhibitorData.premiumBooths}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Booth Revenue</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ₹{(exhibitorData.totalBoothRevenue / 100000).toFixed(1)}L
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exhibitor Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exhibitor Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exhibitorData.exhibitorEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booth Size Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exhibitorData.boothSizes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                       name === "revenue" && value !== undefined
                       ? `₹${(value / 100000).toFixed(1)}L`
                       : value,
                       name,
                      ]}
                    />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Exhibitors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Exhibitors by Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exhibitorData.exhibitorLeads.map((exhibitor) => (
                  <div key={exhibitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{exhibitor.company.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{exhibitor.company}</p>
                        <p className="text-sm text-gray-600">{exhibitor.contact}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {exhibitor.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {exhibitor.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant={exhibitor.status === "Hot" ? "destructive" : "secondary"}>
                          {exhibitor.status}
                        </Badge>
                        <span className="font-bold">{exhibitor.leads} leads</span>
                      </div>
                      <p className="text-sm text-gray-600">Booth: {exhibitor.booth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Analytics Reports</CardTitle>
              <p className="text-sm text-gray-600">
                Generate and download comprehensive reports for {selectedEventData?.title}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Lead Generation Report</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Complete lead data with contact information, sources, and qualification status
                    </p>
                    <Button onClick={() => handleDownloadReport("leads")} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 hover:border-green-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Visitor Analytics Report</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Detailed visitor behavior, traffic sources, and engagement metrics
                    </p>
                    <Button onClick={() => handleDownloadReport("visitors")} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Building2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Exhibitor Data Report</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Exhibitor contact details, booth information, and lead generation data
                    </p>
                    <Button onClick={() => handleDownloadReport("exhibitors")} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Excel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Performance Summary</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Executive summary with key metrics and performance indicators
                    </p>
                    <Button onClick={() => handleDownloadReport("summary")} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 hover:border-red-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Attendee List</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Complete attendee database with registration details and preferences
                    </p>
                    <Button onClick={() => handleDownloadReport("attendees")} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Complete Analytics</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Comprehensive report including all analytics data and insights
                    </p>
                    <Button onClick={() => handleDownloadReport("complete")} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download ZIP
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Report Generation Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Reports are generated in real-time with the latest data</li>
                  <li>• All personal data is anonymized according to privacy regulations</li>
                  <li>• Reports include data for the selected time range: {selectedTimeRange}</li>
                  <li>• Large reports may take a few minutes to generate</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
