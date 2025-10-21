"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, Mail, Phone, MoreHorizontal, Users, Calendar, DollarSign, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Attendee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  jobTitle?: string
  avatar?: string
  event: {
    id: string
    title: string
    startDate: string
  }
  registration: {
    id: string
    status: string
    ticketType: string
    quantity: number
    totalAmount: number
    registeredAt: string
  }
}

interface AttendeesManagementProps {
  eventId: string
}

export default function ExhibitorManagement({ eventId }: AttendeesManagementProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const { toast } = useToast()

  // Stats
  const totalAttendees = attendees.length
  const confirmedAttendees = attendees.filter((a) => a.registration.status === "CONVERTED").length
  const newAttendees = attendees.filter((a) => a.registration.status === "NEW").length

  useEffect(() => {
    fetchAttendees()
  }, [eventId])

  useEffect(() => {
    filterAttendees()
  }, [attendees, searchTerm, selectedStatus])

  const fetchAttendees = async () => {
    try {
      setLoading(true)
      console.log('Fetching attendees for event:', eventId) // Debug log
      
      const response = await fetch(`/api/events/${eventId}/exhibitors`)
      if (!response.ok) throw new Error("Failed to fetch attendees")

      const data = await response.json()
      console.log('API Response:', data) // Debug log

      if (data.success && data.attendeeLeads) {
        // Transform the lead data to match your frontend expectations
        const transformedAttendees = data.attendeeLeads.map((lead: any) => ({
          id: lead.id,
          firstName: lead.user.firstName,
          lastName: lead.user.lastName,
          email: lead.user.email,
          phone: lead.user.phone,
          company: lead.user.company,
          jobTitle: lead.user.jobTitle,
          avatar: lead.user.avatar,
          event: {
            id: lead.event.id,
            title: lead.event.title,
            startDate: lead.event.startDate,
          },
          registration: {
            id: lead.id,
            status: lead.status,
            ticketType: lead.notes || "General Admission",
            quantity: 1,
            totalAmount: 0, // You might want to add pricing logic
            registeredAt: lead.createdAt,
          },
        }))

        console.log('Transformed attendees:', transformedAttendees) // Debug log
        setAttendees(transformedAttendees)
      } else {
        throw new Error(data.error || "No attendees found")
      }
    } catch (error) {
      console.error("Error fetching attendees:", error)
      toast({
        title: "Error",
        description: "Failed to load attendees data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAttendees = () => {
    let filtered = attendees

    if (searchTerm) {
      filtered = filtered.filter(
        (attendee) =>
          `${attendee.firstName} ${attendee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((attendee) => attendee.registration.status === selectedStatus)
    }

    setFilteredAttendees(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONVERTED":
        return "bg-green-100 text-green-800"
      case "NEW":
        return "bg-blue-100 text-blue-800"
      case "CONTACTED":
        return "bg-yellow-100 text-yellow-800"
      case "QUALIFIED":
        return "bg-purple-100 text-purple-800"
      case "FOLLOW_UP":
        return "bg-orange-100 text-orange-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "CONVERTED":
        return "Confirmed"
      case "NEW":
        return "New"
      case "CONTACTED":
        return "Contacted"
      case "QUALIFIED":
        return "Qualified"
      case "FOLLOW_UP":
        return "Follow Up"
      case "REJECTED":
        return "Rejected"
      default:
        return status
    }
  }

  const exportAttendees = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Job Title", "Status", "Registration Date"],
      ...filteredAttendees.map((attendee) => [
        `${attendee.firstName} ${attendee.lastName}`,
        attendee.email,
        attendee.phone || "",
        attendee.company || "",
        attendee.jobTitle || "",
        getStatusDisplayName(attendee.registration.status),
        new Date(attendee.registration.registeredAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendees-${eventId}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Export Successful",
      description: "Attendees data has been exported to CSV",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading attendees...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendees Management</h1>
          <p className="text-gray-600">Manage and track your event attendees</p>
        </div>
        <Button onClick={exportAttendees} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold">{totalAttendees}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold">{confirmedAttendees}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">New Leads</p>
              <p className="text-2xl font-bold">{newAttendees}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search attendees by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CONVERTED">Confirmed</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendees ({filteredAttendees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={attendee.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {attendee.firstName[0]}
                          {attendee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {attendee.firstName} {attendee.lastName}
                        </p>
                        {attendee.jobTitle && <p className="text-xs text-gray-500">{attendee.jobTitle}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{attendee.email}</p>
                      {attendee.phone && <p className="text-sm text-gray-600">{attendee.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(attendee.registration.status)}>
                      {getStatusDisplayName(attendee.registration.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{attendee.company || "N/A"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{new Date(attendee.registration.registeredAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(attendee.registration.registeredAt).toLocaleTimeString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        {/* {attendee.phone && (
                          <DropdownMenuItem>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </DropdownMenuItem>
                        )} */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {attendees.length === 0 
                  ? "No attendees have registered for this event yet." 
                  : "No attendees found matching your criteria."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}