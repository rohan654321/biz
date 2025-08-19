"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

// Mock data for speakers
const mockSpeakers = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    title: "AI Research Director",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    expertise: ["Artificial Intelligence", "Machine Learning", "Data Science"],
    bio: "Dr. Sarah Johnson is a leading expert in AI research with over 15 years of experience in machine learning and data science.",
    rating: 4.8,
    totalSessions: 24,
    upcomingSessions: 3,
    totalEarnings: 45000,
    status: "active",
    verified: true,
    joinedDate: "2023-01-15",
    website: "https://sarahjohnson.ai",
    socialMedia: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnsonai",
    },
    speakingFee: 5000,
    availability: "available",
    languages: ["English", "Spanish"],
    experience: "15+ years",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    title: "Blockchain Developer",
    company: "CryptoTech Solutions",
    location: "New York, NY",
    expertise: ["Blockchain", "Cryptocurrency", "Smart Contracts"],
    bio: "Michael Chen is a blockchain pioneer with extensive experience in cryptocurrency and smart contract development.",
    rating: 4.6,
    totalSessions: 18,
    upcomingSessions: 2,
    totalEarnings: 32000,
    status: "active",
    verified: true,
    joinedDate: "2023-03-20",
    website: "https://michaelchen.dev",
    socialMedia: {
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchendev",
    },
    speakingFee: 4000,
    availability: "available",
    languages: ["English", "Mandarin"],
    experience: "10+ years",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=40&width=40&text=ER",
    title: "UX Design Lead",
    company: "Design Studio Pro",
    location: "Austin, TX",
    expertise: ["UX Design", "Product Design", "Design Thinking"],
    bio: "Emily Rodriguez is a creative UX designer with a passion for creating user-centered digital experiences.",
    rating: 4.9,
    totalSessions: 31,
    upcomingSessions: 5,
    totalEarnings: 58000,
    status: "active",
    verified: true,
    joinedDate: "2022-11-10",
    website: "https://emilyrodriguez.design",
    socialMedia: {
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      twitter: "https://twitter.com/emilyuxdesign",
    },
    speakingFee: 3500,
    availability: "busy",
    languages: ["English", "Spanish"],
    experience: "12+ years",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40&text=DK",
    title: "Cybersecurity Expert",
    company: "SecureNet Systems",
    location: "Seattle, WA",
    expertise: ["Cybersecurity", "Network Security", "Ethical Hacking"],
    bio: "David Kim is a cybersecurity expert specializing in network security and ethical hacking practices.",
    rating: 4.7,
    totalSessions: 22,
    upcomingSessions: 1,
    totalEarnings: 38000,
    status: "pending",
    verified: false,
    joinedDate: "2023-06-05",
    website: "https://davidkim.security",
    socialMedia: {
      linkedin: "https://linkedin.com/in/davidkim",
      twitter: "https://twitter.com/davidkimsec",
    },
    speakingFee: 4500,
    availability: "available",
    languages: ["English", "Korean"],
    experience: "8+ years",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    phone: "+1 (555) 567-8901",
    avatar: "/placeholder.svg?height=40&width=40&text=LT",
    title: "Marketing Strategist",
    company: "Growth Marketing Co.",
    location: "Chicago, IL",
    expertise: ["Digital Marketing", "Growth Hacking", "Content Strategy"],
    bio: "Lisa Thompson is a marketing strategist with expertise in digital marketing and growth hacking techniques.",
    rating: 4.5,
    totalSessions: 16,
    upcomingSessions: 4,
    totalEarnings: 28000,
    status: "inactive",
    verified: true,
    joinedDate: "2023-02-28",
    website: "https://lisathompson.marketing",
    socialMedia: {
      linkedin: "https://linkedin.com/in/lisathompson",
      twitter: "https://twitter.com/lisagrowth",
    },
    speakingFee: 3000,
    availability: "unavailable",
    languages: ["English"],
    experience: "9+ years",
  },
]

export default function SpeakerManagement() {
  const [speakers, setSpeakers] = useState(mockSpeakers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSpeaker, setSelectedSpeaker] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Filter speakers based on search and status
  const filteredSpeakers = speakers.filter((speaker) => {
    const matchesSearch =
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || speaker.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const totalSpeakers = speakers.length
  const activeSpeakers = speakers.filter((s) => s.status === "active").length
  const pendingSpeakers = speakers.filter((s) => s.status === "pending").length
  const totalRevenue = speakers.reduce((sum, speaker) => sum + speaker.totalEarnings, 0)

  const handleStatusChange = (speakerId: string, newStatus: string) => {
    setSpeakers(speakers.map((speaker) => (speaker.id === speakerId ? { ...speaker, status: newStatus } : speaker)))
  }

  const handleVerificationToggle = (speakerId: string) => {
    setSpeakers(
      speakers.map((speaker) => (speaker.id === speakerId ? { ...speaker, verified: !speaker.verified } : speaker)),
    )
  }

  const handleDeleteSpeaker = (speakerId: string) => {
    setSpeakers(speakers.filter((speaker) => speaker.id !== speakerId))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "busy":
        return <Badge className="bg-orange-100 text-orange-800">Busy</Badge>
      case "unavailable":
        return <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
      default:
        return <Badge variant="secondary">{availability}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Speaker Management</h1>
          <p className="text-gray-600">Manage speakers, applications, and performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Speaker
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Speaker</DialogTitle>
              <DialogDescription>Add a new speaker to the platform</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter speaker name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input id="title" placeholder="Enter job title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Speaking Fee ($)</Label>
                <Input id="fee" type="number" placeholder="Enter speaking fee" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea id="bio" placeholder="Enter speaker biography" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                <Input id="expertise" placeholder="e.g., AI, Machine Learning, Data Science" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Speaker</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Speakers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpeakers}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Speakers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSpeakers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeSpeakers / totalSpeakers) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSpeakers}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Speaker Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search speakers by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Speakers List */}
          <div className="space-y-4">
            {filteredSpeakers.map((speaker) => (
              <div
                key={speaker.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={speaker.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {speaker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{speaker.name}</h3>
                      {speaker.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {getStatusBadge(speaker.status)}
                      {getAvailabilityBadge(speaker.availability)}
                    </div>
                    <p className="text-gray-600 mb-1">
                      {speaker.title} at {speaker.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {speaker.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {speaker.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {speaker.totalSessions} sessions
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />${speaker.speakingFee.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSpeaker(speaker)
                      setIsViewDialogOpen(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
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
                          setSelectedSpeaker(speaker)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Speaker
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleVerificationToggle(speaker.id)}>
                        {speaker.verified ? (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Remove Verification
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify Speaker
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(speaker.id, speaker.status === "active" ? "inactive" : "active")
                        }
                      >
                        {speaker.status === "active" ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Speaker
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the speaker and remove their
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSpeaker(speaker.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredSpeakers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No speakers found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Speaker Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Speaker Details</DialogTitle>
          </DialogHeader>
          {selectedSpeaker && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedSpeaker.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {selectedSpeaker.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{selectedSpeaker.name}</h2>
                      {selectedSpeaker.verified && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {getStatusBadge(selectedSpeaker.status)}
                    </div>
                    <p className="text-lg text-gray-600 mb-2">{selectedSpeaker.title}</p>
                    <p className="text-gray-600 mb-4">{selectedSpeaker.company}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedSpeaker.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedSpeaker.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{selectedSpeaker.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={selectedSpeaker.website} className="text-blue-600 hover:underline">
                          Website
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Biography</h3>
                    <p className="text-gray-600">{selectedSpeaker.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpeaker.expertise.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600">Experience</h4>
                      <p className="font-semibold">{selectedSpeaker.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-600">Speaking Fee</h4>
                      <p className="font-semibold">${selectedSpeaker.speakingFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-600">Languages</h4>
                      <p className="font-semibold">{selectedSpeaker.languages.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{selectedSpeaker.totalSessions}</div>
                      <p className="text-sm text-gray-600">Total Sessions</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{selectedSpeaker.upcomingSessions}</div>
                      <p className="text-sm text-gray-600">Upcoming Sessions</p>
                    </CardContent>
                  </Card>
                    {/* <Card>
                        <CardContent className="p-4">
                        <div className="text-2xl font-bold">{selectedSpeaker.rating}</div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                        </CardContent>
                    </Card> */}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Sessions</h3>
                  {/* Mock session data */}
                  {[1, 2, 3].map((session) => (
                    <div key={session} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">AI in Healthcare Summit</h4>
                        <p className="text-sm text-gray-600">March 15, 2024 • 2:00 PM - 3:00 PM</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="earnings" className="space-y-4">
                {/* <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">${selectedSpeaker.totalEarnings.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">${(selectedSpeaker.totalEarnings / 12).toFixed(0)}</div>
                      <p className="text-sm text-gray-600">Monthly Average</p>
                    </CardContent>
                  </Card>
                </div> */}

                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Payments</h3>
                  {/* Mock payment data */}
                  {[1, 2, 3].map((payment) => (
                    <div key={payment} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Payment for AI Summit Session</h4>
                        <p className="text-sm text-gray-600">March 20, 2024</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$5,000</div>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{selectedSpeaker.rating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedSpeaker.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">Based on {selectedSpeaker.totalSessions} sessions</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Reviews</h3>
                  {/* Mock review data */}
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">March 15, 2024</span>
                      </div>
                      <p className="text-gray-700">
                        "Excellent presentation on AI applications in healthcare. Very knowledgeable and engaging
                        speaker."
                      </p>
                      <p className="text-sm text-gray-600 mt-2">- Event Organizer</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Speaker Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Speaker</DialogTitle>
            <DialogDescription>Update speaker information</DialogDescription>
          </DialogHeader>
          {selectedSpeaker && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" defaultValue={selectedSpeaker.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" defaultValue={selectedSpeaker.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" defaultValue={selectedSpeaker.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Professional Title</Label>
                <Input id="edit-title" defaultValue={selectedSpeaker.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input id="edit-company" defaultValue={selectedSpeaker.company} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input id="edit-location" defaultValue={selectedSpeaker.location} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fee">Speaking Fee ($)</Label>
                <Input id="edit-fee" type="number" defaultValue={selectedSpeaker.speakingFee} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedSpeaker.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-bio">Biography</Label>
                <Textarea id="edit-bio" defaultValue={selectedSpeaker.bio} />
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
