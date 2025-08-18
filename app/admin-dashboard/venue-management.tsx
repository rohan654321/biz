"use client"

import { useState } from "react"
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
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock venue data
const mockVenues = [
  {
    id: "1",
    name: "Grand Convention Center",
    location: "Mumbai, Maharashtra",
    address: "123 Business District, Andheri East, Mumbai 400069",
    capacity: 2500,
    rating: 4.8,
    reviewCount: 156,
    status: "active",
    verified: true,
    premium: true,
    totalEvents: 45,
    upcomingEvents: 8,
    revenue: 2500000,
    contact: {
      phone: "+91 98765 43210",
      email: "info@grandconvention.com",
      website: "www.grandconvention.com",
    },
    amenities: ["WiFi", "Parking", "Catering", "AV Equipment", "Air Conditioning"],
    spaces: 6,
    joinedDate: "2023-01-15",
    lastActive: "2024-01-18",
  },
  {
    id: "2",
    name: "Tech Hub Auditorium",
    location: "Bangalore, Karnataka",
    address: "456 Tech Park, Electronic City, Bangalore 560100",
    capacity: 800,
    rating: 4.6,
    reviewCount: 89,
    status: "active",
    verified: true,
    premium: false,
    totalEvents: 32,
    upcomingEvents: 5,
    revenue: 1200000,
    contact: {
      phone: "+91 87654 32109",
      email: "bookings@techhub.com",
      website: "www.techhub.com",
    },
    amenities: ["WiFi", "Projectors", "Sound System", "Recording Equipment"],
    spaces: 3,
    joinedDate: "2023-03-22",
    lastActive: "2024-01-17",
  },
  {
    id: "3",
    name: "Royal Palace Hotel",
    location: "Delhi, NCR",
    address: "789 Connaught Place, New Delhi 110001",
    capacity: 1500,
    rating: 4.4,
    reviewCount: 203,
    status: "pending",
    verified: false,
    premium: false,
    totalEvents: 0,
    upcomingEvents: 0,
    revenue: 0,
    contact: {
      phone: "+91 76543 21098",
      email: "events@royalpalace.com",
      website: "www.royalpalace.com",
    },
    amenities: ["Catering", "Valet Parking", "Decoration", "Photography"],
    spaces: 4,
    joinedDate: "2024-01-10",
    lastActive: "2024-01-16",
  },
  {
    id: "4",
    name: "Seaside Conference Hall",
    location: "Goa",
    address: "321 Beach Road, Panaji, Goa 403001",
    capacity: 600,
    rating: 4.2,
    reviewCount: 67,
    status: "suspended",
    verified: true,
    premium: false,
    totalEvents: 18,
    upcomingEvents: 0,
    revenue: 450000,
    contact: {
      phone: "+91 65432 10987",
      email: "info@seasideconf.com",
      website: "www.seasideconf.com",
    },
    amenities: ["Sea View", "Outdoor Space", "Catering", "Parking"],
    spaces: 2,
    joinedDate: "2023-06-08",
    lastActive: "2024-01-05",
  },
]

export default function VenueManagement() {
  const [venues, setVenues] = useState(mockVenues)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVenue, setSelectedVenue] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Filter venues based on search and status
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || venue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (venueId: string, newStatus: string) => {
    setVenues(venues.map((venue) => (venue.id === venueId ? { ...venue, status: newStatus } : venue)))
  }

  const handleVerificationToggle = (venueId: string) => {
    setVenues(venues.map((venue) => (venue.id === venueId ? { ...venue, verified: !venue.verified } : venue)))
  }

  const handleDeleteVenue = (venueId: string) => {
    setVenues(venues.filter((venue) => venue.id !== venueId))
  }

  const getStatusBadge = (status: string) => {
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
  const pendingVenues = venues.filter((v) => v.status === "pending").length
  const totalRevenue = venues.reduce((sum, venue) => sum + venue.revenue, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
          <p className="text-gray-600">Manage and monitor all venues on the platform</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Venue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Venue</DialogTitle>
              <DialogDescription>Add a new venue to the platform</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Venue Name</Label>
                <Input id="name" placeholder="Enter venue name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, State" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" placeholder="Complete address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" placeholder="Maximum capacity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Contact phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Contact email" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Venue description" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Venue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <p className="text-3xl font-bold text-yellow-600">{pendingVenues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-600">₹{(totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <Star className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search venues by name or location..."
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
          <CardTitle>Venues ({filteredVenues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVenues.map((venue) => (
              <div key={venue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{venue.name}</h3>
                      {venue.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {venue.premium && <Badge className="bg-yellow-500 text-yellow-900">Premium</Badge>}
                      {getStatusBadge(venue.status)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {venue.location}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {venue.capacity.toLocaleString()} capacity
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {venue.totalEvents} events
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {venue.rating} ({venue.reviewCount})
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedVenue(venue)
                      setIsViewDialogOpen(true)
                    }}
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedVenue(venue)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Venue
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleVerificationToggle(venue.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {venue.verified ? "Remove Verification" : "Verify Venue"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(venue.id, venue.status === "active" ? "suspended" : "active")}
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
                      <DropdownMenuItem onClick={() => handleDeleteVenue(venue.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Venue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Venue Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedVenue?.name}
              {selectedVenue?.verified && <CheckCircle className="w-5 h-5 text-green-500" />}
              {selectedVenue?.premium && <Badge className="bg-yellow-500 text-yellow-900">Premium</Badge>}
            </DialogTitle>
            <DialogDescription>Detailed venue information and statistics</DialogDescription>
          </DialogHeader>

          {selectedVenue && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-gray-600">{selectedVenue.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    <p className="text-sm text-gray-600">{selectedVenue.address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Capacity</Label>
                    <p className="text-sm text-gray-600">{selectedVenue.capacity.toLocaleString()} people</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Meeting Spaces</Label>
                    <p className="text-sm text-gray-600">{selectedVenue.spaces} spaces</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedVenue.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Joined Date</Label>
                    <p className="text-sm text-gray-600">{new Date(selectedVenue.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedVenue.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedVenue.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={`https://${selectedVenue.contact.website}`} className="text-blue-600 hover:underline">
                      {selectedVenue.contact.website}
                    </a>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedVenue.totalEvents}</p>
                        <p className="text-sm text-gray-600">Total Events</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedVenue.upcomingEvents}</p>
                        <p className="text-sm text-gray-600">Upcoming Events</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{selectedVenue.rating}</p>
                        <p className="text-sm text-gray-600">Average Rating</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{(selectedVenue.revenue / 100000).toFixed(1)}L
                        </p>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {selectedVenue.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Venue Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Venue</DialogTitle>
            <DialogDescription>Update venue information</DialogDescription>
          </DialogHeader>
          {selectedVenue && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Venue Name</Label>
                <Input id="edit-name" defaultValue={selectedVenue.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input id="edit-location" defaultValue={selectedVenue.location} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input id="edit-capacity" type="number" defaultValue={selectedVenue.capacity} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedVenue.status}>
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
                <Switch id="verified" defaultChecked={selectedVenue.verified} />
                <Label htmlFor="verified">Verified Venue</Label>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Switch id="premium" defaultChecked={selectedVenue.premium} />
                <Label htmlFor="premium">Premium Venue</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
