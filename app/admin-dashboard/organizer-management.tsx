"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Building2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Download,
  MoreHorizontal,
  Ban,
  CheckCheck,
  Clock,
  TrendingUp,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for organizers
const organizersData = [
  {
    id: 1,
    name: "TechEvents Pro",
    email: "contact@techevents.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    status: "active",
    joinDate: "2024-01-15",
    totalEvents: 24,
    totalRevenue: 450000,
    rating: 4.8,
    avatar: "/placeholder.svg?height=40&width=40&text=TE",
    category: "Technology",
    description: "Leading technology event organizer specializing in conferences and workshops",
    documents: ["GST Certificate", "PAN Card", "Business License"],
    lastActive: "2024-01-10",
  },
  {
    id: 2,
    name: "Business Summit India",
    email: "info@businesssummit.in",
    phone: "+91 87654 32109",
    location: "Delhi, NCR",
    status: "pending",
    joinDate: "2024-01-12",
    totalEvents: 0,
    totalRevenue: 0,
    rating: 0,
    avatar: "/placeholder.svg?height=40&width=40&text=BS",
    category: "Business",
    description: "Corporate event management company focusing on business conferences",
    documents: ["GST Certificate", "PAN Card"],
    lastActive: "2024-01-12",
  },
  {
    id: 3,
    name: "Healthcare Connect",
    email: "admin@healthcareconnect.org",
    phone: "+91 76543 21098",
    location: "Bangalore, Karnataka",
    status: "active",
    joinDate: "2023-11-20",
    totalEvents: 18,
    totalRevenue: 320000,
    rating: 4.6,
    avatar: "/placeholder.svg?height=40&width=40&text=HC",
    category: "Healthcare",
    description: "Medical conference and healthcare event organizer",
    documents: ["GST Certificate", "PAN Card", "Business License", "Medical Association Certificate"],
    lastActive: "2024-01-08",
  },
  {
    id: 4,
    name: "EduFest Organizers",
    email: "hello@edufest.edu",
    phone: "+91 65432 10987",
    location: "Pune, Maharashtra",
    status: "suspended",
    joinDate: "2023-08-10",
    totalEvents: 12,
    totalRevenue: 180000,
    rating: 3.9,
    avatar: "/placeholder.svg?height=40&width=40&text=EF",
    category: "Education",
    description: "Educational event management specializing in academic conferences",
    documents: ["GST Certificate", "PAN Card"],
    lastActive: "2023-12-15",
  },
  {
    id: 5,
    name: "Creative Arts Hub",
    email: "contact@creativearts.in",
    phone: "+91 54321 09876",
    location: "Chennai, Tamil Nadu",
    status: "pending",
    joinDate: "2024-01-08",
    totalEvents: 0,
    totalRevenue: 0,
    rating: 0,
    avatar: "/placeholder.svg?height=40&width=40&text=CA",
    category: "Arts & Culture",
    description: "Art exhibitions and cultural event organizer",
    documents: ["PAN Card"],
    lastActive: "2024-01-08",
  },
]

export default function OrganizerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrganizer, setSelectedOrganizer] = useState<any>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve")
  const [approvalMessage, setApprovalMessage] = useState("")

  // Filter organizers based on search and status
  const filteredOrganizers = organizersData.filter((organizer) => {
    const matchesSearch =
      organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organizer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || organizer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: organizersData.length,
    active: organizersData.filter((o) => o.status === "active").length,
    pending: organizersData.filter((o) => o.status === "pending").length,
    suspended: organizersData.filter((o) => o.status === "suspended").length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Ban className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleApproval = (organizer: any, action: "approve" | "reject") => {
    setSelectedOrganizer(organizer)
    setApprovalAction(action)
    setShowApprovalDialog(true)
  }

  const submitApproval = () => {
    // Here you would implement the actual approval/rejection logic
    console.log(`${approvalAction} organizer:`, selectedOrganizer.id, "Message:", approvalMessage)
    setShowApprovalDialog(false)
    setApprovalMessage("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between ">
        <h1 className="text-3xl font-bold text-gray-900">Organizer Management</h1>
        <div className="flex gap-2 ">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <CheckCheck className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
            <p className="text-gray-600">Total Organizers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold">{stats.active}</h3>
            <p className="text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-yellow-100 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold">{stats.pending}</h3>
            <p className="text-gray-600">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold">{stats.suspended}</h3>
            <p className="text-gray-600">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="w-auto max-w-300">
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <div className="flex- relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search organizers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organizers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizers.map((organizer) => (
                  <TableRow key={organizer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={organizer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{organizer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{organizer.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {organizer.location}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {organizer.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {organizer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{organizer.category}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(organizer.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {organizer.totalEvents}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />₹{organizer.totalRevenue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {organizer.rating || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {organizer.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproval(organizer, "approve")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleApproval(organizer, "reject")}>
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Organizer Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={organizer.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{organizer.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-semibold">{organizer.name}</h3>
                                  <p className="text-gray-600">{organizer.category}</p>
                                  {getStatusBadge(organizer.status)}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Contact Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center">
                                      <Mail className="w-4 h-4 mr-2" />
                                      {organizer.email}
                                    </div>
                                    <div className="flex items-center">
                                      <Phone className="w-4 h-4 mr-2" />
                                      {organizer.phone}
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-2" />
                                      {organizer.location}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Performance Metrics</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-2" />
                                      {organizer.totalEvents} Events
                                    </div>
                                    <div className="flex items-center">
                                      <DollarSign className="w-4 h-4 mr-2" />₹{organizer.totalRevenue.toLocaleString()}{" "}
                                      Revenue
                                    </div>
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 mr-2" />
                                      {organizer.rating || "N/A"} Rating
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-sm text-gray-600">{organizer.description}</p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Submitted Documents</h4>
                                <div className="flex flex-wrap gap-2">
                                  {organizer.documents.map((doc, index) => (
                                    <Badge key={index} variant="outline">
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="text-sm text-gray-500">
                                <p>Joined: {new Date(organizer.joinDate).toLocaleDateString()}</p>
                                <p>Last Active: {new Date(organizer.lastActive).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="w-4 h-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            {organizer.status === "active" && (
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend Account
                              </DropdownMenuItem>
                            )}
                            {organizer.status === "suspended" && (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Reactivate Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{approvalAction === "approve" ? "Approve Organizer" : "Reject Organizer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to {approvalAction} <strong>{selectedOrganizer?.name}</strong>?
            </p>
            <div>
              <label className="block text-sm font-medium mb-2">
                {approvalAction === "approve" ? "Approval Message (Optional)" : "Rejection Reason"}
              </label>
              <Textarea
                placeholder={
                  approvalAction === "approve"
                    ? "Welcome message for the organizer..."
                    : "Please provide a reason for rejection..."
                }
                value={approvalMessage}
                onChange={(e) => setApprovalMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={submitApproval}
                className={approvalAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
                variant={approvalAction === "reject" ? "destructive" : "default"}
              >
                {approvalAction === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
