"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
//   DollarSign,
  Star,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Download,
  Plus,
} from "lucide-react"

// Mock exhibitor data
const mockExhibitors = [
  {
    id: "1",
    companyName: "TechCorp Solutions",
    contactPerson: "John Smith",
    email: "john@techcorp.com",
    phone: "+1-555-0123",
    website: "https://techcorp.com",
    industry: "Technology",
    location: "San Francisco, CA",
    status: "active",
    verified: true,
    joinDate: "2023-01-15",
    eventsParticipated: 12,
    totalProducts: 25,
    revenue: 125000,
    rating: 4.8,
    avatar: "/placeholder.svg?height=40&width=40&text=TC",
    description: "Leading provider of enterprise software solutions",
    specialties: ["Software", "AI/ML", "Cloud Services"],
    certifications: ["ISO 9001", "SOC 2", "GDPR Compliant"],
  },
  {
    id: "2",
    companyName: "Green Energy Inc",
    contactPerson: "Sarah Johnson",
    email: "sarah@greenenergy.com",
    phone: "+1-555-0124",
    website: "https://greenenergy.com",
    industry: "Energy",
    location: "Austin, TX",
    status: "pending",
    verified: false,
    joinDate: "2023-11-20",
    eventsParticipated: 3,
    totalProducts: 8,
    revenue: 45000,
    rating: 4.2,
    avatar: "/placeholder.svg?height=40&width=40&text=GE",
    description: "Sustainable energy solutions for the future",
    specialties: ["Solar", "Wind", "Battery Storage"],
    certifications: ["Energy Star", "LEED Certified"],
  },
  {
    id: "3",
    companyName: "MedDevice Pro",
    contactPerson: "Dr. Michael Chen",
    email: "michael@meddevice.com",
    phone: "+1-555-0125",
    website: "https://meddevice.com",
    industry: "Healthcare",
    location: "Boston, MA",
    status: "suspended",
    verified: true,
    joinDate: "2022-08-10",
    eventsParticipated: 18,
    totalProducts: 42,
    revenue: 280000,
    rating: 4.6,
    avatar: "/placeholder.svg?height=40&width=40&text=MD",
    description: "Advanced medical devices and diagnostics",
    specialties: ["Diagnostics", "Surgical Tools", "Monitoring"],
    certifications: ["FDA Approved", "CE Marked", "ISO 13485"],
  },
]

export default function ExhibitorManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [selectedExhibitor, setSelectedExhibitor] = useState(null)

  // Filter exhibitors based on search and filters
  const filteredExhibitors = mockExhibitors.filter((exhibitor) => {
    const matchesSearch =
      exhibitor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibitor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibitor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || exhibitor.status === statusFilter
    const matchesIndustry = industryFilter === "all" || exhibitor.industry === industryFilter

    return matchesSearch && matchesStatus && matchesIndustry
  })

  // Calculate statistics
  const stats = {
    total: mockExhibitors.length,
    active: mockExhibitors.filter((e) => e.status === "active").length,
    pending: mockExhibitors.filter((e) => e.status === "pending").length,
    suspended: mockExhibitors.filter((e) => e.status === "suspended").length,
    verified: mockExhibitors.filter((e) => e.verified).length,
    totalRevenue: mockExhibitors.reduce((sum, e) => sum + e.revenue, 0),
    avgRating: mockExhibitors.reduce((sum, e) => sum + e.rating, 0) / mockExhibitors.length,
  }

  const getStatusColor = (status:any) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status:any) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "suspended":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exhibitor Management</h1>
          <p className="text-gray-600">Manage exhibitor accounts, approvals, and performance</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Exhibitor
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exhibitors">Exhibitors</TabsTrigger>
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exhibitors</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Exhibitors</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.active / stats.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Across all exhibitors</p>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exhibitor Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stats.active}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(stats.active / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stats.pending}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Suspended</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stats.suspended}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(stats.suspended / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">TechCorp Solutions approved</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New exhibitor registration</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Green Energy Inc pending review</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">MedDevice Pro suspended</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exhibitors Tab */}
        <TabsContent value="exhibitors" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search exhibitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Energy">Energy</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exhibitors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExhibitors.map((exhibitor) => (
              <Card key={exhibitor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={exhibitor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{exhibitor.companyName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{exhibitor.companyName}</CardTitle>
                        <CardDescription>{exhibitor.contactPerson}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(exhibitor.status)}>
                      {getStatusIcon(exhibitor.status)}
                      <span className="ml-1 capitalize">{exhibitor.status}</span>
                    </Badge>
                    {exhibitor.verified && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{exhibitor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{exhibitor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{exhibitor.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{exhibitor.eventsParticipated}</div>
                      <div className="text-xs text-gray-500">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{exhibitor.totalProducts}</div>
                      <div className="text-xs text-gray-500">Products</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{exhibitor.rating}</span>
                    </div>
                    <div className="text-sm font-medium text-green-600">${exhibitor.revenue.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Technology</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Healthcare</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Energy</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Others</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Average Event Participation</span>
                    <span className="font-medium">11 events</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Products per Exhibitor</span>
                    <span className="font-medium">25 products</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Revenue</span>
                    <span className="font-medium">$150K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium">4.5/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Exhibitor Directory
                </CardTitle>
                <CardDescription>Complete list of all exhibitors with contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Download CSV</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Report
                </CardTitle>
                <CardDescription>Exhibitor performance metrics and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>

            {/* <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Revenue Report
                </CardTitle>
                <CardDescription>Revenue breakdown by exhibitor and industry</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Download PDF</Button>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
