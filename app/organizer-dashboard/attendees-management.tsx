"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Mail, Phone, Building, Download, MessageSquare, Eye, UserCheck, UserX, Users } from "lucide-react"

interface Attendee {
  id: number
  name: string
  email: string
  phone: string
  company: string
  avatar: string
  event: string
  eventDate: string
  registrationDate: string
  status: string
  ticketType: string
  quantity: number
  totalAmount: number
}

interface AttendeesManagementProps {
  attendees: Attendee[]
}

export default function AttendeesManagement({ attendees: initialAttendees }: AttendeesManagementProps) {
  const { toast } = useToast()
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees)
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>(initialAttendees)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)

  // Update attendees when props change
  useEffect(() => {
    setAttendees(initialAttendees)
    setFilteredAttendees(initialAttendees)
  }, [initialAttendees])

  // Filter attendees based on search and filters
  useEffect(() => {
    let filtered = attendees

    if (searchTerm) {
      filtered = filtered.filter(
        (attendee) =>
          attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.event.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((attendee) => attendee.status.toLowerCase() === statusFilter.toLowerCase())
    }

    if (eventFilter !== "all") {
      filtered = filtered.filter((attendee) => attendee.event === eventFilter)
    }

    setFilteredAttendees(filtered)
  }, [attendees, searchTerm, statusFilter, eventFilter])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "waitlisted":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleStatusChange = async (attendeeId: number, newStatus: string) => {
    try {
      // API call to update attendee status would go here
      setAttendees(
        attendees.map((attendee) => (attendee.id === attendeeId ? { ...attendee, status: newStatus } : attendee)),
      )
      toast({
        title: "Status Updated",
        description: `Attendee status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendee status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportAttendees = () => {
    // Export functionality would go here
    toast({
      title: "Export Started",
      description: "Attendee data is being exported. You'll receive a download link shortly.",
    })
  }

  const uniqueEvents = [...new Set(attendees.map((attendee) => attendee.event))]

  const stats = {
    total: attendees.length,
    confirmed: attendees.filter((a) => a.status.toLowerCase() === "confirmed").length,
    pending: attendees.filter((a) => a.status.toLowerCase() === "pending").length,
    cancelled: attendees.filter((a) => a.status.toLowerCase() === "cancelled").length,
    totalRevenue: attendees.reduce((sum, a) => sum + a.totalAmount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendee Management</h2>
          <p className="text-gray-600">Manage and communicate with your event attendees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAttendees}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Attendees</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search attendees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {uniqueEvents.map((event) => (
                  <SelectItem key={event} value={event}>
                    {event}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendees ({filteredAttendees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
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
                    <div className="text-sm text-gray-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {attendee.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {attendee.company}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{attendee.event}</div>
                    <div className="text-sm text-gray-600">{formatDate(attendee.eventDate)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(attendee.totalAmount)}</div>
                    <div className="text-sm text-gray-600">
                      {attendee.quantity} ticket{attendee.quantity > 1 ? "s" : ""}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(attendee.status)}>{attendee.status}</Badge>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAttendee(attendee)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Attendee Details</DialogTitle>
                        </DialogHeader>
                        {selectedAttendee && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={selectedAttendee.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {selectedAttendee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">{selectedAttendee.name}</h3>
                                <p className="text-gray-600">{selectedAttendee.company}</p>
                                <Badge variant={getStatusColor(selectedAttendee.status)} className="mt-1">
                                  {selectedAttendee.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium mb-3">Contact Information</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{selectedAttendee.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{selectedAttendee.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{selectedAttendee.company}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-3">Registration Details</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Event:</span>
                                    <span className="text-sm font-medium">{selectedAttendee.event}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Event Date:</span>
                                    <span className="text-sm">{formatDate(selectedAttendee.eventDate)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Registered:</span>
                                    <span className="text-sm">{formatDate(selectedAttendee.registrationDate)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Ticket Type:</span>
                                    <span className="text-sm">{selectedAttendee.ticketType}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Quantity:</span>
                                    <span className="text-sm">{selectedAttendee.quantity}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total Amount:</span>
                                    <span className="text-sm font-medium">
                                      {formatCurrency(selectedAttendee.totalAmount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => handleStatusChange(selectedAttendee.id, "Confirmed")}
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Confirm
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleStatusChange(selectedAttendee.id, "Cancelled")}
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                              <Button variant="outline">
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Select
                      value={attendee.status.toLowerCase()}
                      onValueChange={(value) => handleStatusChange(attendee.id, value)}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="waitlisted">Waitlisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || eventFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Attendees will appear here once people register for your events"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
