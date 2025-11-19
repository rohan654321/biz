"use client"

import { useState, useEffect, JSX } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Phone,
  Mail,
  Globe,
  MoreHorizontal,
  RefreshCw,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MailOpen,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

// Types based on your Prisma schema
interface Venue {
  id: string
  venueName: string
  logo: string
  contactPerson: string
  email: string
  mobile: string
  address: string
  city: string
  state: string
  country: string
  website: string
  description: string
  maxCapacity: number
  totalHalls: number
  totalEvents: number
  activeBookings: number
  averageRating: number
  totalReviews: number
  amenities: string[]
  meetingSpaces: MeetingSpace[]
  isVerified: boolean
  isActive: boolean
  venueImages: string[]
  status?: "active" | "pending" | "suspended" | string
  createdAt?: string
  updatedAt?: string
  rejectionReason?: string
}

interface MeetingSpace {
  id: string
  name: string
  capacity: number
  area: number
  hourlyRate: number
  isAvailable: boolean
}

export default function VenueManagement() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [pendingVenues, setPendingVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingLoading, setPendingLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Fetch all venues
  const fetchVenues = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/venues")
      const result = await response.json()
      
      if (result.success) {
        setVenues(result.venues)
      } else {
        toast.error("Failed to fetch venues")
      }
    } catch (error) {
      console.error("Error fetching venues:", error)
      toast.error("Failed to load venues")
    } finally {
      setLoading(false)
    }
  }

  // Fetch pending venues
  const fetchPendingVenues = async () => {
    try {
      setPendingLoading(true)
      const response = await fetch("/api/admin/venues/pending")
      const result = await response.json()
      
      if (result.success) {
        setPendingVenues(result.venues)
      } else {
        toast.error("Failed to fetch pending venues")
      }
    } catch (error) {
      console.error("Error fetching pending venues:", error)
      toast.error("Failed to load pending venues")
    } finally {
      setPendingLoading(false)
    }
  }

  useEffect(() => {
    fetchVenues()
    fetchPendingVenues()
  }, [])

  // Filter venues based on search and status
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || venue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (
    venueId: string,
    newStatus: "active" | "pending" | "suspended"
  ) => {
    try {
      const response = await fetch(`/api/admin/venues/${venueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (response.ok) {
        setVenues(venues.map((venue) => 
          venue.id === venueId ? { ...venue, status: newStatus } : venue
        ))
        setPendingVenues(pendingVenues.filter(venue => venue.id !== venueId))
        toast.success(`Venue status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update venue status")
      }
    } catch (error) {
      console.error("Error updating venue status:", error)
      toast.error("Failed to update venue status")
    }
  }

  const handleVerificationToggle = async (venueId: string) => {
    try {
      const venue = venues.find(v => v.id === venueId)
      if (!venue) return

      const response = await fetch(`/api/admin/venues/${venueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...venue,
          isVerified: !venue.isVerified,
        }),
      })

      if (response.ok) {
        setVenues(venues.map((venue) => 
          venue.id === venueId ? { ...venue, isVerified: !venue.isVerified } : venue
        ))
        setPendingVenues(pendingVenues.filter(venue => venue.id !== venueId))
        toast.success(`Venue verification ${!venue.isVerified ? 'added' : 'removed'}`)
      } else {
        toast.error("Failed to update verification status")
      }
    } catch (error) {
      console.error("Error updating verification:", error)
      toast.error("Failed to update verification status")
    }
  }

  const handleApproveVenue = async (venueId: string) => {
    try {
      const response = await fetch("/api/admin/venues/pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venueId,
          action: "approve"
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPendingVenues(pendingVenues.filter(venue => venue.id !== venueId))
        fetchVenues() // Refresh the main venues list
        setIsApproveDialogOpen(false)
        toast.success("Venue approved successfully")
      } else {
        toast.error(result.error || "Failed to approve venue")
      }
    } catch (error) {
      console.error("Error approving venue:", error)
      toast.error("Failed to approve venue")
    }
  }

  const handleRejectVenue = async (venueId: string, reason: string) => {
    try {
      const response = await fetch("/api/admin/venues/pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venueId,
          action: "reject",
          reason
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPendingVenues(pendingVenues.filter(venue => venue.id !== venueId))
        setIsRejectDialogOpen(false)
        toast.success("Venue rejected successfully")
      } else {
        toast.error(result.error || "Failed to reject venue")
      }
    } catch (error) {
      console.error("Error rejecting venue:", error)
      toast.error("Failed to reject venue")
    }
  }

  const handleDeleteVenue = async (venueId: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return

    try {
      const response = await fetch(`/api/admin/venues/${venueId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setVenues(venues.filter((venue) => venue.id !== venueId))
        setPendingVenues(pendingVenues.filter(venue => venue.id !== venueId))
        toast.success("Venue deleted successfully")
      } else {
        toast.error("Failed to delete venue")
      }
    } catch (error) {
      console.error("Error deleting venue:", error)
      toast.error("Failed to delete venue")
    }
  }

  const handleAddVenue = async (formData: any) => {
    try {
      const response = await fetch("/api/admin/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setIsAddDialogOpen(false)
        fetchVenues()
        fetchPendingVenues()
        toast.success("Venue created successfully")
      } else {
        toast.error(result.error || "Failed to create venue")
      }
    } catch (error) {
      console.error("Error creating venue:", error)
      toast.error("Failed to create venue")
    }
  }

  const handleEditVenue = async (venueId: string, formData: any) => {
    try {
      const response = await fetch(`/api/admin/venues/${venueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setIsEditDialogOpen(false)
        fetchVenues()
        fetchPendingVenues()
        toast.success("Venue updated successfully")
      } else {
        toast.error(result.error || "Failed to update venue")
      }
    } catch (error) {
      console.error("Error updating venue:", error)
      toast.error("Failed to update venue")
    }
  }

  const getStatusBadge = (status: string = "active") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalVenues = venues.length
  const activeVenues = venues.filter((v) => v.status === "active").length
  const pendingVenuesCount = pendingVenues.length
  const verifiedVenues = venues.filter((v) => v.isVerified).length

  const refreshAll = () => {
    fetchVenues()
    fetchPendingVenues()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
          <p className="text-gray-600">Manage and monitor all venues on the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshAll}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </Button>
            </DialogTrigger>
            <AddVenueDialog 
              onAddVenue={handleAddVenue}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Venues</p>
                <p className="text-3xl font-bold text-gray-900">{totalVenues}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Venues</p>
                <p className="text-3xl font-bold text-green-600">{activeVenues}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingVenuesCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Venues</p>
                <p className="text-3xl font-bold text-purple-600">{verifiedVenues}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Venues ({totalVenues})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval ({pendingVenuesCount})
            {pendingVenuesCount > 0 && (
              <span className="ml-2 flex h-2 w-2 rounded-full bg-yellow-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Active Venues ({activeVenues})</TabsTrigger>
        </TabsList>

        {/* All Venues Tab */}
        <TabsContent value="all" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search venues by name, location, or contact..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Venues Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Venues ({filteredVenues.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <VenuesList
                venues={filteredVenues}
                onView={(venue) => {
                  setSelectedVenue(venue)
                  setIsViewDialogOpen(true)
                }}
                onEdit={(venue) => {
                  setSelectedVenue(venue)
                  setIsEditDialogOpen(true)
                }}
                onStatusChange={handleStatusChange}
                onVerificationToggle={handleVerificationToggle}
                onDelete={handleDeleteVenue}
                getStatusBadge={getStatusBadge}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approval Tab */}
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                Pending Approval ({pendingVenues.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              ) : pendingVenues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p>No pending venues for approval</p>
                </div>
              ) : (
                <PendingVenuesList
                  venues={pendingVenues}
                  onView={(venue) => {
                    setSelectedVenue(venue)
                    setIsViewDialogOpen(true)
                  }}
                  onApprove={(venue) => {
                    setSelectedVenue(venue)
                    setIsApproveDialogOpen(true)
                  }}
                  onReject={(venue) => {
                    setSelectedVenue(venue)
                    setIsRejectDialogOpen(true)
                  }}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Venues Tab */}
        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Venues ({activeVenues})</CardTitle>
            </CardHeader>
            <CardContent>
              <VenuesList
                venues={venues.filter(v => v.status === "active")}
                onView={(venue) => {
                  setSelectedVenue(venue)
                  setIsViewDialogOpen(true)
                }}
                onEdit={(venue) => {
                  setSelectedVenue(venue)
                  setIsEditDialogOpen(true)
                }}
                onStatusChange={handleStatusChange}
                onVerificationToggle={handleVerificationToggle}
                onDelete={handleDeleteVenue}
                getStatusBadge={getStatusBadge}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Venue Dialog */}
      <ViewVenueDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        venue={selectedVenue}
        getStatusBadge={getStatusBadge}
      />

      {/* Edit Venue Dialog */}
      <EditVenueDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        venue={selectedVenue}
        onSave={(formData) => selectedVenue && handleEditVenue(selectedVenue.id, formData)}
      />

      {/* Approve Venue Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <ThumbsUp className="w-5 h-5" />
              Approve Venue
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this venue? This will make it active and visible to users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => selectedVenue && handleApproveVenue(selectedVenue.id)}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Approve Venue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Venue Dialog */}
      <RejectVenueDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onReject={(reason) => selectedVenue && handleRejectVenue(selectedVenue.id, reason)}
        venueName={selectedVenue?.venueName}
      />
    </div>
  )
}

// Venues List Component
function VenuesList({ 
  venues, 
  onView, 
  onEdit, 
  onStatusChange, 
  onVerificationToggle, 
  onDelete, 
  getStatusBadge 
}: {
  venues: Venue[]
  onView: (venue: Venue) => void
  onEdit: (venue: Venue) => void
  onStatusChange: (venueId: string, status: "active" | "pending" | "suspended") => void
  onVerificationToggle: (venueId: string) => void
  onDelete: (venueId: string) => void
  getStatusBadge: (status: string) => JSX.Element
}) {
  if (venues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No venues found matching your criteria
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {venues.map((venue) => (
        <div key={venue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              {venue.logo ? (
                <img src={venue.logo} alt={venue.venueName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{venue.venueName}</h3>
                {venue.isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                {getStatusBadge(venue.status || "active")}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                {venue.city}, {venue.state}, {venue.country}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {venue.maxCapacity.toLocaleString()} capacity
                </div>
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  {venue.totalHalls} halls
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {venue.totalEvents} events
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  {venue.averageRating} ({venue.totalReviews})
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(venue)}
            >
              <Eye className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(venue)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Venue
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onVerificationToggle(venue.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {venue.isVerified ? "Remove Verification" : "Verify Venue"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onStatusChange(venue.id, (venue.status === "active" ? "suspended" : "active") as "active" | "pending" | "suspended")}
                >
                  {venue.status === "active" ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Suspend Venue
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate Venue
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(venue.id)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Venue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

// Pending Venues List Component
function PendingVenuesList({ 
  venues, 
  onView, 
  onApprove, 
  onReject, 
  getStatusBadge 
}: {
  venues: Venue[]
  onView: (venue: Venue) => void
  onApprove: (venue: Venue) => void
  onReject: (venue: Venue) => void
  getStatusBadge: (status: string) => JSX.Element
}) {
  return (
    <div className="space-y-4">
      {venues.map((venue) => (
        <div key={venue.id} className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              {venue.logo ? (
                <img src={venue.logo} alt={venue.venueName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{venue.venueName}</h3>
                {getStatusBadge(venue.status || "pending")}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                {venue.city}, {venue.state}, {venue.country}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {venue.maxCapacity.toLocaleString()} capacity
                </div>
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  {venue.totalHalls} halls
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {venue.email}
                </div>
              </div>
              {venue.createdAt && (
                <div className="text-xs text-gray-500 mt-1">
                  Submitted on {new Date(venue.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(venue)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => onApprove(venue)}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onReject(venue)}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// View Venue Dialog Component
function ViewVenueDialog({ 
  isOpen, 
  onClose, 
  venue, 
  getStatusBadge 
}: {
  isOpen: boolean
  onClose: () => void
  venue: Venue | null
  getStatusBadge: (status: string) => JSX.Element
}) {
  if (!venue) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {venue.venueName}
            {venue.isVerified && <CheckCircle className="w-5 h-5 text-green-500" />}
          </DialogTitle>
          <DialogDescription>Detailed venue information and statistics</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="amenities">Amenities & Spaces</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Contact Person</Label>
                <p className="text-sm text-gray-600">{venue.contactPerson}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm text-gray-600">{venue.city}, {venue.state}, {venue.country}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-gray-600">{venue.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Capacity</Label>
                <p className="text-sm text-gray-600">{venue.maxCapacity.toLocaleString()} people</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Meeting Spaces</Label>
                <p className="text-sm text-gray-600">{venue.totalHalls} halls</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">{getStatusBadge(venue.status || "active")}</div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-gray-600 mt-1">{venue.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{venue.mobile}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{venue.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <a 
                  href={venue.website ? `https://${venue.website}` : '#'} 
                  className="text-blue-600 hover:underline"
                  onClick={(e) => !venue.website && e.preventDefault()}
                >
                  {venue.website || 'No website'}
                </a>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{venue.totalEvents}</p>
                    <p className="text-sm text-gray-600">Total Events</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{venue.activeBookings}</p>
                    <p className="text-sm text-gray-600">Active Bookings</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{venue.averageRating}</p>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{venue.totalReviews}</p>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2">Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {venue.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2">Meeting Spaces</Label>
              <div className="space-y-2">
                {venue.meetingSpaces.map((space) => (
                  <div key={space.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{space.name}</p>
                      <p className="text-sm text-gray-600">
                        Capacity: {space.capacity} • Area: {space.area} sq.ft • ₹{space.hourlyRate}/hour
                      </p>
                    </div>
                    <Badge variant={space.isAvailable ? "default" : "secondary"}>
                      {space.isAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Edit Venue Dialog Component
function EditVenueDialog({ 
  isOpen, 
  onClose, 
  venue, 
  onSave 
}: {
  isOpen: boolean
  onClose: () => void
  venue: Venue | null
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    venueName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    website: "",
    description: "",
    maxCapacity: "",
    totalHalls: "",
    amenities: [] as string[],
    isVerified: false,
    status: "active",
  })

  useEffect(() => {
    if (venue) {
      setFormData({
        venueName: venue.venueName || "",
        contactPerson: venue.contactPerson || "",
        email: venue.email || "",
        mobile: venue.mobile || "",
        address: venue.address || "",
        city: venue.city || "",
        state: venue.state || "",
        country: venue.country || "",
        website: venue.website || "",
        description: venue.description || "",
        maxCapacity: venue.maxCapacity?.toString() || "",
        totalHalls: venue.totalHalls?.toString() || "",
        amenities: venue.amenities || [],
        isVerified: venue.isVerified || false,
        status: venue.status || "active",
      })
    }
  }, [venue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.venueName.trim() || !formData.contactPerson.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    onSave({
      ...formData,
      maxCapacity: parseInt(formData.maxCapacity) || 0,
      totalHalls: parseInt(formData.totalHalls) || 0,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
          <DialogDescription>Update venue information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-venueName">Venue Name</Label>
              <Input
                id="edit-venueName"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contactPerson">Contact Person</Label>
              <Input
                id="edit-contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-mobile">Mobile</Label>
              <Input
                id="edit-mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <Switch
                id="edit-verified"
                checked={formData.isVerified}
                onCheckedChange={(checked) => setFormData({ ...formData, isVerified: checked })}
              />
              <Label htmlFor="edit-verified">Verified Venue</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Reject Venue Dialog Component
function RejectVenueDialog({ 
  isOpen, 
  onClose, 
  onReject, 
  venueName 
}: {
  isOpen: boolean
  onClose: () => void
  onReject: (reason: string) => void
  venueName?: string
}) {
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reason.trim()) {
      onReject(reason)
      setReason("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <ThumbsDown className="w-5 h-5" />
            Reject Venue
          </DialogTitle>
          <DialogDescription>
            {venueName ? `Are you sure you want to reject "${venueName}"?` : "Are you sure you want to reject this venue?"} Please provide a reason for rejection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide the reason for rejecting this venue..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={!reason.trim()}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Reject Venue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add Venue Dialog Component
function AddVenueDialog({ onAddVenue, onClose }: { onAddVenue: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    venueName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    website: "",
    description: "",
    maxCapacity: "",
    totalHalls: "",
    amenities: [] as string[],
    isVerified: false,
    status: "active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddVenue({
      ...formData,
      maxCapacity: parseInt(formData.maxCapacity) || 0,
      totalHalls: parseInt(formData.totalHalls) || 0,
    })
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New Venue</DialogTitle>
        <DialogDescription>Add a new venue to the platform</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="venueName">Venue Name *</Label>
            <Input
              id="venueName"
              value={formData.venueName}
              onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Max Capacity</Label>
            <Input
              id="maxCapacity"
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalHalls">Total Halls</Label>
            <Input
              id="totalHalls"
              type="number"
              value={formData.totalHalls}
              onChange={(e) => setFormData({ ...formData, totalHalls: e.target.value })}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Switch
              id="isVerified"
              checked={formData.isVerified}
              onCheckedChange={(checked) => setFormData({ ...formData, isVerified: checked })}
            />
            <Label htmlFor="isVerified">Verified Venue</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Venue</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}