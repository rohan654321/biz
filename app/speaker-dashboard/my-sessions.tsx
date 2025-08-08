"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Video, Mic, Monitor, Coffee } from "lucide-react"

export function MySessions() {
  const [filter, setFilter] = useState("all")

  const sessions = [
    {
      id: 1,
      eventName: "TechConf 2024",
      sessionTitle: "The Future of Cloud Architecture",
      date: "2024-03-15",
      time: "10:00 AM - 11:00 AM",
      location: "Main Hall A",
      duration: "60 minutes",
      format: "Keynote",
      status: "confirmed",
      attendees: 450,
      coSpeakers: [],
      description: "Exploring emerging trends in cloud architecture and their impact on enterprise systems.",
    },
    {
      id: 2,
      eventName: "AI Summit 2024",
      sessionTitle: "Machine Learning in Production",
      date: "2024-03-22",
      time: "2:00 PM - 3:30 PM",
      location: "Workshop Room B",
      duration: "90 minutes",
      format: "Workshop",
      status: "confirmed",
      attendees: 120,
      coSpeakers: [
        { name: "Sarah Johnson", company: "DataTech Inc" },
        { name: "Mike Chen", company: "ML Solutions" },
      ],
      description: "Hands-on workshop covering best practices for deploying ML models in production environments.",
    },
    {
      id: 3,
      eventName: "DevOps Days",
      sessionTitle: "Scaling DevOps Culture",
      date: "2024-04-05",
      time: "11:30 AM - 12:30 PM",
      location: "Conference Hall C",
      duration: "60 minutes",
      format: "Panel Discussion",
      status: "pending",
      attendees: 200,
      coSpeakers: [
        { name: "Alex Rodriguez", company: "CloudOps Pro" },
        { name: "Lisa Wang", company: "DevScale" },
      ],
      description: "Panel discussion on building and scaling DevOps culture in large organizations.",
    },
    {
      id: 4,
      eventName: "Innovation Week",
      sessionTitle: "Digital Transformation Strategies",
      date: "2024-04-18",
      time: "9:00 AM - 10:00 AM",
      location: "Auditorium",
      duration: "60 minutes",
      format: "Fireside Chat",
      status: "awaiting_approval",
      attendees: 300,
      coSpeakers: [],
      description: "Intimate conversation about successful digital transformation initiatives.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "awaiting_approval":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Keynote":
        return <Mic className="h-4 w-4" />
      case "Workshop":
        return <Monitor className="h-4 w-4" />
      case "Panel Discussion":
        return <Users className="h-4 w-4" />
      case "Fireside Chat":
        return <Coffee className="h-4 w-4" />
      default:
        return <Video className="h-4 w-4" />
    }
  }

  const filteredSessions = sessions.filter((session) => {
    if (filter === "all") return true
    return session.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Sessions</h2>
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All ({sessions.length})
          </Button>
          <Button
            variant={filter === "confirmed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("confirmed")}
          >
            Confirmed ({sessions.filter((s) => s.status === "confirmed").length})
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
            Pending ({sessions.filter((s) => s.status === "pending").length})
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-900">{session.sessionTitle}</h3>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-lg text-blue-600 font-medium">{session.eventName}</p>
                  <p className="text-gray-600">{session.description}</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  {getFormatIcon(session.format)}
                  <span className="text-sm font-medium">{session.format}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{session.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{session.attendees} expected attendees</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>

              {session.coSpeakers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Co-Speakers:</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.coSpeakers.map((speaker, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {speaker.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{speaker.name}</p>
                          <p className="text-xs text-gray-500">{speaker.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">
              {filter === "all" ? "You don't have any speaking sessions yet." : `No ${filter} sessions found.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
