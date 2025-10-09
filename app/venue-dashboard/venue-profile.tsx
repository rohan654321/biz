"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Star, Users, Camera, Plus, Edit, Trash2, CheckCircle, Upload, Save, MapPin } from "lucide-react"

interface VenueData {
  id: string
  venueName: string
  logo: string
  contactPerson: string
  email: string
  mobile: string
  address: string
  website: string
  description: string
  maxCapacity: number
  totalHalls: number
  totalEvents: number
  activeBookings: number
  averageRating: number
  totalReviews: number
  amenities: string[]
  meetingSpaces: any[]
}

interface VenueProfileProps {
  venueData: VenueData
}

export default function VenueProfile({ venueData }: VenueProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<VenueData | null>(null)

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(`/api/venue-manager/${venueData.id}`)
        const data = await res.json()
        if (data.success) {
          const venue = data.user?.venue || data.venue
          setProfileData(venue)
          setAmenities(venue?.amenities || []) // ✅ sync
          setMeetingSpaces(venue?.meetingSpaces || [])
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchVenue()
  }, [venueData.id])

  const [images, setImages] = useState([
    "/placeholder.svg?height=300&width=400&text=Main+Hall",
    "/placeholder.svg?height=300&width=400&text=Conference+Room",
    "/placeholder.svg?height=300&width=400&text=Banquet+Hall",
    "/placeholder.svg?height=300&width=400&text=Reception+Area",
  ])

  const [amenities, setAmenities] = useState([
    "Free WiFi",
    "Parking Available",
    "Air Conditioning",
    "Audio/Visual Equipment",
    "Catering Services",
    "Security",
    "Wheelchair Accessible",
    "Stage/Platform",
  ])

  const [meetingSpaces, setMeetingSpaces] = useState([
    {
      id: "1",
      name: "Grand Ballroom",
      capacity: 500,
      area: 5000,
      hourlyRate: 15000,
      features: ["Stage", "A/V Equipment", "Dance Floor", "Bar Area"],
    },
    {
      id: "2",
      name: "Conference Hall A",
      capacity: 100,
      area: 1200,
      hourlyRate: 5000,
      features: ["Projector", "Whiteboard", "Conference Table", "WiFi"],
    },
    {
      id: "3",
      name: "Meeting Room B",
      capacity: 25,
      area: 400,
      hourlyRate: 2000,
      features: ["TV Screen", "Conference Phone", "Whiteboard"],
    },
  ])

  const [newAmenity, setNewAmenity] = useState("")
  const [newSpace, setNewSpace] = useState({
    name: "",
    capacity: "",
    area: "",
    hourlyRate: "",
    features: "",
  })

  const handleSave = async () => {
    if (!profileData) return

    try {
      const res = await fetch(`/api/venue-manager/${venueData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData,
          amenities, // ✅ push updated amenities too
        }),
      })

      const data = await res.json()

      if (data.success) {
        setProfileData(data.venue) // refresh with server response
        setIsEditing(false)
      } else {
        console.error("Failed to update venue:", data.error)
      }
    } catch (err) {
      console.error("Error updating venue:", err)
    }
  }

  const handleAddAmenity = async () => {
    if (!newAmenity.trim()) return

    try {
      const updated = [...amenities, newAmenity.trim()]

      const res = await fetch(`/api/venue-manager/${venueData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData,
          amenities: updated,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setAmenities(data.venue.amenities) // refresh from DB response
        setProfileData(data.venue)
        setNewAmenity("")
      } else {
        console.error("Failed to add amenity:", data.error)
      }
    } catch (err) {
      console.error("Error adding amenity:", err)
    }
  }

  const handleRemoveAmenity = async (index: number) => {
    const updatedAmenities = amenities.filter((_, i) => i !== index)

    try {
      const res = await fetch(`/api/venue-manager/${venueData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          amenities: updatedAmenities,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setAmenities(data.venue.amenities)
        setProfileData(data.venue)
      } else {
        console.error("Failed to remove amenity:", data.error)
      }
    } catch (err) {
      console.error("Error removing amenity:", err)
    }
  }

  const handleAddSpace = async () => {
    if (!newSpace.name.trim()) return

    const updatedSpaces = [
      ...meetingSpaces,
      {
        id: Date.now().toString(),
        name: newSpace.name,
        capacity: Number(newSpace.capacity),
        area: Number(newSpace.area),
        hourlyRate: Number(newSpace.hourlyRate),
        features: newSpace.features.split(",").map((f) => f.trim()),
      },
    ]

    try {
      const res = await fetch(`/api/venue-manager/${venueData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          meetingSpaces: updatedSpaces,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMeetingSpaces(data.venue.meetingSpaces)
        setProfileData(data.venue)
        setNewSpace({ name: "", capacity: "", area: "", hourlyRate: "", features: "" })
      } else {
        console.error("Failed to add space:", data.error)
      }
    } catch (err) {
      console.error("Error adding space:", err)
    }
  }

  const handleRemoveSpace = async (id: string) => {
    const updatedSpaces = meetingSpaces.filter((space) => space.id !== id)

    try {
      const res = await fetch(`/api/venue-manager/${venueData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          meetingSpaces: updatedSpaces,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMeetingSpaces(data.venue.meetingSpaces)
        setProfileData(data.venue)
      } else {
        console.error("Failed to remove space:", data.error)
      }
    } catch (err) {
      console.error("Error removing space:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Venue Profile</h1>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="spaces">Meeting Spaces</TabsTrigger>
          <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
          <TabsTrigger value="location">Location & Maps</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue-name">Venue Name</Label>
                      {isEditing ? (
                        <Input
                          id="venue-name"
                          value={profileData?.venueName}
                          onChange={(e) =>
                            setProfileData({
                              ...(profileData ?? {}),
                              venueName: e.target.value,
                            } as VenueData)
                          }
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{profileData?.venueName}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-person">Contact Person</Label>
                      {isEditing ? (
                        <Input
                          id="contact-person"
                          value={profileData?.contactPerson}
                          onChange={(e) =>
                            setProfileData(
                              (prev) =>
                                ({
                                  ...(prev ?? {}),
                                  contactPerson: e.target.value,
                                }) as VenueData,
                            )
                          }
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{profileData?.contactPerson}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData?.email}
                          onChange={(e) =>
                            setProfileData(
                              (prev) =>
                                ({
                                  ...(prev ?? {}),
                                  email: e.target.value,
                                }) as VenueData,
                            )
                          }
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{profileData?.email}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile</Label>
                      {isEditing ? (
                        <Input
                          id="mobile"
                          value={profileData?.mobile}
                          onChange={(e) =>
                            setProfileData(
                              (prev) =>
                                ({
                                  ...(prev ?? {}),
                                  mobile: e.target.value,
                                }) as VenueData,
                            )
                          }
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{profileData?.mobile}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      {isEditing ? (
                        <Input
                          id="website"
                          value={profileData?.website}
                          onChange={(e) =>
                            setProfileData(
                              (prev) =>
                                ({
                                  ...(prev ?? {}),
                                  website: e.target.value,
                                }) as VenueData,
                            )
                          }
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{profileData?.website}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={profileData?.address}
                          onChange={(e) =>
                            setProfileData(
                              (prev) =>
                                ({
                                  ...(prev ?? {}),
                                  address: e.target.value,
                                }) as VenueData,
                            )
                          }
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{profileData?.address}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        rows={4}
                        value={profileData?.description}
                        onChange={(e) =>
                          setProfileData(
                            (prev) =>
                              ({
                                ...(prev ?? {}),
                                description: e.target.value,
                              }) as VenueData,
                          )
                        }
                        placeholder="Describe your venue, its unique features, and what makes it special..."
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded min-h-[100px]">{profileData?.description}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Capacity Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">500</div>
                      <div className="text-sm text-gray-600">Theater Style</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">300</div>
                      <div className="text-sm text-gray-600">Banquet Style</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">400</div>
                      <div className="text-sm text-gray-600">Cocktail Style</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">150</div>
                      <div className="text-sm text-gray-600">Classroom Style</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Venue Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Venue Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Events</span>
                    <span className="font-semibold">{venueData.totalEvents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Bookings</span>
                    <span className="font-semibold">{venueData.activeBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Halls</span>
                    <span className="font-semibold">{venueData.totalHalls}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max Capacity</span>
                    <span className="font-semibold">{venueData?.maxCapacity?.toLocaleString?.() ?? "N/A"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Rating */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Rating</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{venueData.averageRating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(venueData.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{venueData.totalReviews} reviews</p>
                </CardContent>
              </Card>

              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Business License</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Safety Compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Insurance Coverage</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Venue Images
              </CardTitle>
              <p className="text-sm text-gray-600">Upload high-quality images to showcase your venue</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Venue image ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Images</h3>
                <p className="text-gray-600 mb-4">Drag and drop images here, or click to select files</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Amenities Tab */}
        <TabsContent value="amenities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Venue Amenities</CardTitle>
              <p className="text-sm text-gray-600">Manage the amenities and features available at your venue</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{amenity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add new amenity..."
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddAmenity()}
                />
                <Button onClick={handleAddAmenity}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meeting Spaces Tab */}
        <TabsContent value="spaces" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Spaces</CardTitle>
              <p className="text-sm text-gray-600">Manage individual spaces within your venue</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {meetingSpaces?.map((space) => (
                  <div key={space.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{space.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSpace(space.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{space.capacity} people</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-medium">{space.area} sq ft</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hourly Rate:</span>
                        <span className="font-medium text-blue-600">₹{space.hourlyRate.toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {space.features?.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Space Form */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Add New Meeting Space</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Space name"
                    value={newSpace.name}
                    onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
                  />
                  <Input
                    placeholder="Capacity (people)"
                    type="number"
                    value={newSpace.capacity}
                    onChange={(e) => setNewSpace({ ...newSpace, capacity: e.target.value })}
                  />
                  <Input
                    placeholder="Area (sq ft)"
                    type="number"
                    value={newSpace.area}
                    onChange={(e) => setNewSpace({ ...newSpace, area: e.target.value })}
                  />
                  <Input
                    placeholder="Hourly rate (₹)"
                    type="number"
                    value={newSpace.hourlyRate}
                    onChange={(e) => setNewSpace({ ...newSpace, hourlyRate: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Features (comma separated)"
                  value={newSpace.features}
                  onChange={(e) => setNewSpace({ ...newSpace, features: e.target.value })}
                  className="mb-4"
                />
                <Button onClick={handleAddSpace}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Space
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location & Maps Tab */}
        <TabsContent value="location" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Google Maps Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Google Maps Location
                </CardTitle>
                <p className="text-sm text-gray-600">Manage your venue's location and map visibility</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-maps-url">Google Maps Embed URL</Label>
                  {isEditing ? (
                    <Input
                      id="google-maps-url"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      defaultValue="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.8!2d72.8406!3d19.1796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEwJzQ4LjAiTiA3MsKwNTAnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890123"
                    />
                  ) : (
                    <div className="aspect-video rounded-lg overflow-hidden border">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.8!2d72.8406!3d19.1796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEwJzQ4LjAiTiA3MsKwNTAnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890123"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Venue Location"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    {isEditing ? (
                      <Input id="latitude" placeholder="19.1796" defaultValue="19.1796" />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">19.1796</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    {isEditing ? (
                      <Input id="longitude" placeholder="72.8406" defaultValue="72.8406" />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">72.8406</div>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() =>
                        window.open("https://www.google.com/maps/dir/?api=1&destination=19.1796,72.8406", "_blank")
                      }
                    >
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => window.open("https://maps.google.com/?q=19.1796,72.8406", "_blank")}
                    >
                      View in Maps
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-address">Full Address</Label>
                  {isEditing ? (
                    <Textarea id="full-address" rows={3} defaultValue={profileData?.address} />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded min-h-[80px]">{profileData?.address}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input id="city" defaultValue="Mumbai" />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">Mumbai</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Input id="state" defaultValue="Maharashtra" />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">Maharashtra</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipcode">ZIP Code</Label>
                    {isEditing ? (
                      <Input id="zipcode" defaultValue="400001" />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">400001</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    {isEditing ? (
                      <Input id="country" defaultValue="India" />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">India</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Floor Plans Management */}
        <TabsContent value="floorplan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Floor Plans Management
              </CardTitle>
              <p className="text-sm text-gray-600">Upload and manage floor plans for different levels of your venue</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ground Floor Plan */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Ground Floor</h3>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="relative aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden group">
                    <Image
                      src="/placeholder.svg?height=300&width=300&text=Ground+Floor+Plan"
                      alt="Ground Floor Plan"
                      fill
                      className="object-contain p-4"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary">
                            <Upload className="w-4 h-4 mr-2" />
                            Replace
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Main Hall:</span>
                      <span className="font-medium">500 capacity</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reception:</span>
                      <span className="font-medium">100 capacity</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Area:</span>
                      <span className="font-medium">5,000 sq ft</span>
                    </div>
                  </div>
                </div>

                {/* First Floor Plan */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">First Floor</h3>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="relative aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden group">
                    <Image
                      src="/placeholder.svg?height=300&width=300&text=First+Floor+Plan"
                      alt="First Floor Plan"
                      fill
                      className="object-contain p-4"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary">
                            <Upload className="w-4 h-4 mr-2" />
                            Replace
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conference Halls:</span>
                      <span className="font-medium">200 capacity</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meeting Rooms:</span>
                      <span className="font-medium">75 capacity</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Area:</span>
                      <span className="font-medium">3,000 sq ft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New Floor Plan */}
              {isEditing && (
                <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Floor Plan</h3>
                  <p className="text-gray-600 mb-4">Upload floor plans for additional levels or outdoor spaces</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Floor Plan
                  </Button>
                </div>
              )}

              {/* Floor Plan Legend */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-3">Floor Plan Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Available Spaces</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Booked Areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Common Areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Emergency Exits</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
