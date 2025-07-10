"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  UserX,
  UserCheck,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  joinDate: string
  lastLogin: string
  events: number
  avatar?: string
}

interface UserManagementProps {
  users?: User[]
}

export default function UserManagement({ users }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const defaultUsers: User[] = [
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

  const usersData = users || defaultUsers

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
}
