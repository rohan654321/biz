"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Flag,
  Activity,
  Settings,
  BarChart3,
  Download,
} from "lucide-react"

interface DashboardOverviewProps {
  systemStats?: Array<{
    title: string
    value: string
    change: string
    trend: "up" | "down"
    icon: any
    color: string
  }>
}

export default function DashboardOverview({ systemStats }: DashboardOverviewProps) {
  const defaultStats = [
    {
      title: "Total Users",
      value: "45,231",
      change: "+12%",
      trend: "up" as const,
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Events",
      value: "1,247",
      change: "+8%",
      trend: "up" as const,
      icon: Calendar,
      color: "green",
    },
    {
      title: "Event Organizers",
      value: "892",
      change: "+15%",
      trend: "up" as const,
      icon: Building2,
      color: "purple",
    },
    {
      title: "Platform Revenue",
      value: "₹2.4Cr",
      change: "+25%",
      trend: "up" as const,
      icon: DollarSign,
      color: "yellow",
    },
  ]

  const stats = systemStats || defaultStats

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
          {/* <Button className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            System Health
          </Button> */}
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
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

      {/* Quick Actions */}
      {/* <Card>
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
      </Card> */}
    </div>
  )
}
