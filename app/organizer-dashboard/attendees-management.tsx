"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Download, MessageSquare, MoreHorizontal, CheckCircle, AlertCircle } from "lucide-react"

interface Attendee {
  id: number
  name: string
  email: string
  event: string
  registrationDate: string
  status: string
  ticketType: string
  avatar: string
}

interface AttendeesManagementProps {
  attendees: Attendee[]
}

export default function AttendeesManagement({ attendees }: AttendeesManagementProps) {
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
                {attendees.map((attendee) => (
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
}
