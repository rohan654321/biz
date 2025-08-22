"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Star,
  Share2,
  Award,
  Building,
  CheckCircle,
  ExternalLink,
  Edit,
  Camera,
  Plus,
  X,
  Save,
  Upload,
} from "lucide-react"

interface OrganizerInfoProps {
  organizerData: {
    name: string
    email: string
    phone: string
    location: string
    website: string
    description: string
    avatar: string
    totalEvents: number
    activeEvents: number
    totalAttendees: number
    totalRevenue: number
  }
  dashboardStats: any[]
  myEvents: any[]
}

export default function OrganizerInfo({ organizerData, dashboardStats, myEvents }: OrganizerInfoProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  // Editable organizer data state
  const [editableData, setEditableData] = useState({
    name: organizerData.name,
    email: organizerData.email,
    phone: organizerData.phone,
    location: organizerData.location,
    website: organizerData.website,
    description: organizerData.description,
    avatar: organizerData.avatar,
    founded: "2018",
    headquarters: "Mumbai, India",
    specialties: ["Corporate Events", "Trade Shows", "Conferences", "Exhibitions"],
    certifications: ["ISO 9001:2015", "Event Management Certified", "Safety Compliance"],
    achievements: [
      "Best Event Management Company 2023",
      "Excellence in Customer Service Award",
      "Top 10 Event Organizers in India",
      "Sustainability in Events Recognition",
    ],
  })

  // Form states for adding new items
  const [newSpecialty, setNewSpecialty] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const [newAchievement, setNewAchievement] = useState("")

  // Calculate organizer statistics
  const stats = {
    totalEvents: myEvents.length,
    upcomingEvents: myEvents.filter((event) => event.status === "Active" || event.status === "Planning").length,
    completedEvents: myEvents.filter((event) => event.status === "Completed").length,
    featuredEvents: myEvents.filter((event) => event.type === "Exhibition").length,
    avgRating: 4.5,
    totalFollowers: 1250,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const handleSave = () => {
    // Here you would typically save to your backend/database
    console.log("Saving organizer data:", editableData)
    setIsEditing(false)
    setEditingSection(null)
    // Show success message
  }

  const handleCancel = () => {
    // Reset to original data
    setEditableData({
      name: organizerData.name,
      email: organizerData.email,
      phone: organizerData.phone,
      location: organizerData.location,
      website: organizerData.website,
      description: organizerData.description,
      avatar: organizerData.avatar,
      founded: "2018",
      headquarters: "Mumbai, India",
      specialties: ["Corporate Events", "Trade Shows", "Conferences", "Exhibitions"],
      certifications: ["ISO 9001:2015", "Event Management Certified", "Safety Compliance"],
      achievements: [
        "Best Event Management Company 2023",
        "Excellence in Customer Service Award",
        "Top 10 Event Organizers in India",
        "Sustainability in Events Recognition",
      ],
    })
    setIsEditing(false)
    setEditingSection(null)
  }

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setEditableData({
        ...editableData,
        specialties: [...editableData.specialties, newSpecialty.trim()],
      })
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (index: number) => {
    setEditableData({
      ...editableData,
      specialties: editableData.specialties.filter((_, i) => i !== index),
    })
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setEditableData({
        ...editableData,
        certifications: [...editableData.certifications, newCertification.trim()],
      })
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    setEditableData({
      ...editableData,
      certifications: editableData.certifications.filter((_, i) => i !== index),
    })
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setEditableData({
        ...editableData,
        achievements: [...editableData.achievements, newAchievement.trim()],
      })
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setEditableData({
      ...editableData,
      achievements: editableData.achievements.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Organizer Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={editableData.avatar || "/placeholder.svg"} alt={editableData.name} />
                <AvatarFallback className="text-2xl font-bold bg-white text-blue-600">
                  {editableData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 bg-white text-blue-600 hover:bg-blue-50 rounded-full p-2"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                    <DialogDescription>Upload a new profile picture for your organization.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Upload Picture</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Organizer Info */}
            <div className="flex-1">
              {isEditing && editingSection === "basic" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Organization Name
                    </Label>
                    <Input
                      id="name"
                      value={editableData.name}
                      onChange={(e) => setEditableData({ ...editableData, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={editableData.description}
                      onChange={(e) => setEditableData({ ...editableData, description: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-white">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={editableData.phone}
                        onChange={(e) => setEditableData({ ...editableData, phone: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={editableData.email}
                        onChange={(e) => setEditableData({ ...editableData, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="headquarters" className="text-white">
                        Headquarters
                      </Label>
                      <Input
                        id="headquarters"
                        value={editableData.headquarters}
                        onChange={(e) => setEditableData({ ...editableData, headquarters: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-white">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={editableData.website}
                        onChange={(e) => setEditableData({ ...editableData, website: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{editableData.name}</h1>
                    <Badge className="bg-yellow-500 text-yellow-900">Verified</Badge>
                  </div>
                  <p className="text-xl text-blue-100 mb-4">{editableData.description}</p>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{editableData.headquarters}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{editableData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{editableData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a href={editableData.website} className="hover:text-white transition-colors">
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {isEditing && editingSection === "basic" ? (
                <>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setIsEditing(true)
                      setEditingSection("basic")
                    }}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                   
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section
      <div className="bg-white rounded-lg border">
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalFollowers}</div>
              <div className="text-sm text-gray-600">Total Followers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">{stats.avgRating}</span>
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.featuredEvents}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{editableData.founded}</div>
              <div className="text-sm text-gray-600">Founded</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">My Events ({stats.totalEvents})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Highlights */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        About {editableData.name}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(true)
                          setEditingSection("about")
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    {isEditing && editingSection === "about" ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editableData.description}
                          onChange={(e) => setEditableData({ ...editableData, description: e.target.value })}
                          rows={4}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleSave} size="sm">
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">{editableData.description}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Events</h3>
                    <div className="space-y-4">
                      {myEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-20 h-15 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">4.5</span>
                            </div>
                            <Badge variant={event.status === "Active" ? "default" : "secondary"}>{event.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={() => setActiveTab("events")}>
                        View All Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Specialties */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Specialties</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(true)
                          setEditingSection("specialties")
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {editableData.specialties.map((specialty, index) => (
                        <div key={index} className="relative group">
                          <Badge variant="secondary" className="pr-6">
                            {specialty}
                          </Badge>
                          {isEditing && editingSection === "specialties" && (
                            <button
                              onClick={() => removeSpecialty(index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && editingSection === "specialties" && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new specialty"
                            value={newSpecialty}
                            onChange={(e) => setNewSpecialty(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
                          />
                          <Button onClick={addSpecialty} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} size="sm">
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Achievements
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(true)
                          setEditingSection("achievements")
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mb-4">
                      {editableData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2 group">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 flex-1">{achievement}</span>
                          {isEditing && editingSection === "achievements" && (
                            <button
                              onClick={() => removeAchievement(index)}
                              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && editingSection === "achievements" && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new achievement"
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                          />
                          <Button onClick={addAchievement} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} size="sm">
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Certifications</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(true)
                          setEditingSection("certifications")
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mb-4">
                      {editableData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2 group">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600 flex-1">{cert}</span>
                          {isEditing && editingSection === "certifications" && (
                            <button
                              onClick={() => removeCertification(index)}
                              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && editingSection === "certifications" && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new certification"
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addCertification()}
                          />
                          <Button onClick={addCertification} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} size="sm">
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">My Events</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Total: {myEvents.length} events</span>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-blue-600" />
                      </div>
                      <Badge className="absolute top-3 left-3 bg-blue-500 text-white">{event.type}</Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h4>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">4.5</span>
                          <span className="text-sm text-gray-500">(125)</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">₹{event.revenue.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant={event.status === "Active" ? "default" : "secondary"}>{event.status}</Badge>
                        <span className="text-sm text-gray-600">{event.attendees} attendees</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Company Information</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(true)
                        setEditingSection("company")
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  {isEditing && editingSection === "company" ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="founded">Founded</Label>
                        <Input
                          id="founded"
                          value={editableData.founded}
                          onChange={(e) => setEditableData({ ...editableData, founded: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="headquarters">Headquarters</Label>
                        <Input
                          id="headquarters"
                          value={editableData.headquarters}
                          onChange={(e) => setEditableData({ ...editableData, headquarters: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={editableData.website}
                          onChange={(e) => setEditableData({ ...editableData, website: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Founded</label>
                        <p className="text-gray-900">{editableData.founded}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Headquarters</label>
                        <p className="text-gray-900">{editableData.headquarters}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Website</label>
                        <a
                          href={editableData.website}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {editableData.website}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact</label>
                        <div className="space-y-1">
                          <p className="text-gray-900">{editableData.phone}</p>
                          <p className="text-gray-900">{editableData.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Event Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Events Organized</span>
                      <span className="font-semibold">{stats.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Upcoming Events</span>
                      <span className="font-semibold">{stats.upcomingEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Events</span>
                      <span className="font-semibold">{stats.completedEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Featured Events</span>
                      <span className="font-semibold">{stats.featuredEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Followers</span>
                      <span className="font-semibold">{stats.totalFollowers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{stats.avgRating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Full Description</h3>
                <p className="text-gray-600 leading-relaxed">{editableData.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Profile Settings</h3>
              <p className="text-gray-600 mb-4">Manage your profile information and preferences.</p>
              <Button>Edit Profile Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
