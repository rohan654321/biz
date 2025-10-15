"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, BarChart3, MessageSquare, TrendingUp, TrendingDown } from "lucide-react"

interface DashboardStats {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: any
}

interface Event {
  id: number
  title: string
  date: string
  location: string
  status: string
  attendees: number
  registrations: number
  type: string
}

interface DashboardOverviewProps {
  organizerId: string
  organizerName: string
  dashboardStats: DashboardStats[]
  recentEvents: Event[]
  onCreateEventClick: () => void
  onManageAttendeesClick: () => void
  onViewAnalyticsClick: () => void
  onSendMessageClick: () => void
}


export default function DashboardOverview({
  organizerName,
  dashboardStats,
  recentEvents,
  onCreateEventClick,
  onManageAttendeesClick,
  onViewAnalyticsClick,
  onSendMessageClick
}: DashboardOverviewProps) {

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {organizerName}</p>
        </div>
        
        <Button
          onClick={onCreateEventClick}   // <-- call parent to switch section
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 cursor-pointer" />
          Create New Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats
        .filter((stat) => stat.title !== "Revenue") 
        .map((stat, index) => (
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
              {recentEvents.slice(0, 3).map((event) => (
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
              <Button
                onClick={onCreateEventClick} // <-- same callback
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
              >
                <Plus className="w-6 h-6" />
                Create Event
              </Button>
             <Button
  onClick={onManageAttendeesClick}
  variant="outline"
  className="h-20 flex flex-col gap-2 bg-transparent"
>
  <Users className="w-6 h-6" />
  Manage Attendees
</Button>
<Button
  onClick={onViewAnalyticsClick}
  variant="outline"
  className="h-20 flex flex-col gap-2 bg-transparent"
>
  <BarChart3 className="w-6 h-6" />
  View Analytics
</Button>
<Button
  onClick={onSendMessageClick}
  variant="outline"
  className="h-20 flex flex-col gap-2 bg-transparent"
>
  <MessageSquare className="w-6 h-6" />
  Send Messages
</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
