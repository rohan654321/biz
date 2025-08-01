"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
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
import { Eye, Download, Users, TrendingUp, FileText } from "lucide-react"

export default function AnalyticsReports() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock analytics data
  const overviewStats = {
    totalProfileViews: 1850,
    brochureDownloads: 456,
    leadsGenerated: 89,
    visitorEngagement: 67.5,
  }

  const profileViewsData = [
    { date: "Jan 10", views: 45 },
    { date: "Jan 11", views: 52 },
    { date: "Jan 12", views: 38 },
    { date: "Jan 13", views: 61 },
    { date: "Jan 14", views: 48 },
    { date: "Jan 15", views: 73 },
    { date: "Jan 16", views: 56 },
    { date: "Jan 17", views: 69 },
    { date: "Jan 18", views: 82 },
    { date: "Jan 19", views: 74 },
  ]

  const brochureDownloadsData = [
    { name: "AI Platform Brochure", downloads: 156, percentage: 34.2 },
    { name: "Security Suite Overview", downloads: 123, percentage: 27.0 },
    { name: "Mobile App Features", downloads: 89, percentage: 19.5 },
    { name: "Technical Specifications", downloads: 67, percentage: 14.7 },
    { name: "Pricing Guide", downloads: 21, percentage: 4.6 },
  ]

  const leadSourceData = [
    { name: "Profile Views", value: 45, color: "#3B82F6" },
    { name: "Brochure Downloads", value: 28, color: "#10B981" },
    { name: "Product Inquiries", value: 16, color: "#F59E0B" },
    { name: "Appointment Requests", value: 11, color: "#EF4444" },
  ]

  const engagementData = [
    { metric: "Profile Views", current: 1850, previous: 1420, change: 30.3 },
    { metric: "Brochure Downloads", current: 456, previous: 389, change: 17.2 },
    { metric: "Product Inquiries", current: 89, previous: 76, change: 17.1 },
    { metric: "Appointment Bookings", current: 23, previous: 18, change: 27.8 },
  ]

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile-views">Profile Views</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profile Views</p>
                    <p className="text-2xl font-bold">{overviewStats.totalProfileViews.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Brochure Downloads</p>
                    <p className="text-2xl font-bold">{overviewStats.brochureDownloads}</p>
                  </div>
                  <Download className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+22% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Leads Generated</p>
                    <p className="text-2xl font-bold">{overviewStats.leadsGenerated}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+18% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold">{overviewStats.visitorEngagement}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+8% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Views Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={profileViewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
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
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
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

        <TabsContent value="profile-views" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Profile Views</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={profileViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{overviewStats.totalProfileViews}</div>
                <div className="text-gray-600">Total Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(overviewStats.totalProfileViews / 30)}
                </div>
                <div className="text-gray-600">Daily Average</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.max(...profileViewsData.map((d) => d.views))}
                </div>
                <div className="text-gray-600">Peak Day</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brochure Download Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brochureDownloadsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.downloads} downloads</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <div className="text-sm font-medium">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{overviewStats.brochureDownloads}</div>
                <div className="text-gray-600">Total Downloads</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{brochureDownloadsData.length}</div>
                <div className="text-gray-600">Active Brochures</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((overviewStats.brochureDownloads / overviewStats.totalProfileViews) * 100)}%
                </div>
                <div className="text-gray-600">Download Rate</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{item.metric}</div>
                      <div className={`text-sm font-medium ${item.change > 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Current Period</div>
                        <div className="text-2xl font-bold text-blue-600">{item.current.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Previous Period</div>
                        <div className="text-xl font-semibold text-gray-500">{item.previous.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
