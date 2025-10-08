"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Building,
  Mail,
  Phone,
  MapPin,
  Users,
  Star,
  Plus,
  Trash2,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Accessibility,
  Camera,
  Mic,
  Projector,
  Shield,
  Zap,
  Home,
  Globe,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Venue {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  venueName?: string
  venueDescription?: string
  venueAddress?: string
  city?: string
  state?: string
  country?: string
  maxCapacity?: number
  totalHalls?: number
  averageRating?: number
  totalReviews?: number
  amenities: string[]
  basePrice?: number
}

interface MeetingSpace {
  name: string
  capacity: number
  area: number
  hourlyRate: number
  features: string[]
}

interface AddVenueProps {
  organizerId: string
  onVenueChange?: (venueData: {
    venueId?: string
    venueName: string
    venueAddress: string
    city: string
    state?: string
    country?: string
  }) => void
}

export default function AddVenue({ organizerId, onVenueChange }: AddVenueProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVenueId, setSelectedVenueId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("existing")
  const { toast } = useToast()

  // New venue form state
  const [newVenue, setNewVenue] = useState({
    // Manager Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Venue Information
    venueName: "",
    venueDescription: "",
    website: "",
    maxCapacity: "",
    totalHalls: "",
    basePrice: "",

    // Address Information
    venueAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",

    // Amenities
    amenities: [] as string[],
  })

  // Meeting spaces state
  const [meetingSpaces, setMeetingSpaces] = useState<MeetingSpace[]>([
    {
      name: "",
      capacity: 0,
      area: 0,
      hourlyRate: 0,
      features: [],
    },
  ])

  const availableAmenities = [
    { name: "WiFi", icon: Wifi },
    { name: "Parking", icon: Car },
    { name: "Catering", icon: Utensils },
    { name: "Coffee", icon: Coffee },
    { name: "Accessibility", icon: Accessibility },
    { name: "Photography", icon: Camera },
    { name: "Audio System", icon: Mic },
    { name: "Projector", icon: Projector },
    { name: "Security", icon: Shield },
    { name: "Power Backup", icon: Zap },
    { name: "Air Conditioning", icon: Home },
    { name: "Internet", icon: Globe },
  ]

  const spaceFeatures = [
    "Projector",
    "Audio System",
    "WiFi",
    "Air Conditioning",
    "Natural Light",
    "Whiteboard",
    "Flip Chart",
    "Video Conferencing",
    "Stage",
    "Podium",
    "Microphone",
    "Lighting Control",
  ]

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/venues")
      if (response.ok) {
        const data = await response.json()
        setVenues(data.venues || [])
      }
    } catch (error) {
      console.error("Error fetching venues:", error)
    }
  }

  const filteredVenues = venues.filter((venue) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      venue.venueName?.toLowerCase().includes(searchLower) ||
      `${venue.firstName} ${venue.lastName}`.toLowerCase().includes(searchLower) ||
      venue.email.toLowerCase().includes(searchLower) ||
      venue.city?.toLowerCase().includes(searchLower) ||
      venue.venueAddress?.toLowerCase().includes(searchLower)
    )
  })

  const handleVenueSelect = (venueId: string) => {
    setSelectedVenueId(venueId)

    if (onVenueChange) {
      const selectedVenue = venues.find((v) => v.id === venueId)
      if (selectedVenue) {
        onVenueChange({
          venueId: selectedVenue.id,
          venueName: selectedVenue.venueName || `${selectedVenue.firstName} ${selectedVenue.lastName}'s Venue`,
          venueAddress: selectedVenue.venueAddress || "Address not provided",
          city: selectedVenue.city || "City not provided",
          state: selectedVenue.state,
          country: selectedVenue.country,
        })

        toast({
          title: "Venue Selected",
          description: `${selectedVenue.venueName || "Venue"} has been added to your event.`,
        })
      }
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setNewVenue((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const addMeetingSpace = () => {
    setMeetingSpaces((prev) => [
      ...prev,
      {
        name: "",
        capacity: 0,
        area: 0,
        hourlyRate: 0,
        features: [],
      },
    ])
  }

  const removeMeetingSpace = (index: number) => {
    setMeetingSpaces((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMeetingSpace = (index: number, field: keyof MeetingSpace, value: any) => {
    setMeetingSpaces((prev) => prev.map((space, i) => (i === index ? { ...space, [field]: value } : space)))
  }

  const toggleSpaceFeature = (spaceIndex: number, feature: string) => {
    setMeetingSpaces((prev) =>
      prev.map((space, i) =>
        i === spaceIndex
          ? {
              ...space,
              features: space.features.includes(feature)
                ? space.features.filter((f) => f !== feature)
                : [...space.features, feature],
            }
          : space,
      ),
    )
  }

  const handleCreateVenue = async () => {
    if (!newVenue.firstName || !newVenue.lastName || !newVenue.email || !newVenue.venueName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/venue-manager/${organizerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueName: newVenue.venueName,
          logo: "",
          contactPerson: `${newVenue.firstName} ${newVenue.lastName}`,
          email: newVenue.email,
          mobile: newVenue.phone,
          address: newVenue.venueAddress,
          website: newVenue.website,
          description: newVenue.venueDescription,
          maxCapacity: newVenue.maxCapacity ? Number.parseInt(newVenue.maxCapacity) : 0,
          totalHalls: newVenue.totalHalls ? Number.parseInt(newVenue.totalHalls) : 0,
          activeBookings: 0,
          averageRating: 0,
          totalReviews: 0,
          amenities: newVenue.amenities,
          meetingSpaces: meetingSpaces.filter((space) => space.name.trim() !== ""),
        }),
      })

      if (response.ok) {
        const responseData = await response.json()

        toast({
          title: "Success",
          description: "Venue created and added to your event.",
        })

        if (onVenueChange) {
          onVenueChange({
            venueId: responseData.venueId || responseData.id,
            venueName: newVenue.venueName,
            venueAddress: newVenue.venueAddress || "Address not provided",
            city: newVenue.city || "City not provided",
            state: newVenue.state,
            country: newVenue.country,
          })
        }

        // Reset form
        setNewVenue({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          venueName: "",
          venueDescription: "",
          website: "",
          maxCapacity: "",
          totalHalls: "",
          basePrice: "",
          venueAddress: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          amenities: [],
        })
        setMeetingSpaces([
          {
            name: "",
            capacity: 0,
            area: 0,
            hourlyRate: 0,
            features: [],
          },
        ])

        // Refresh venues list and switch to existing tab
        fetchVenues()
        setActiveTab("existing")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create venue")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create venue.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Add Venue to Event
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select an existing venue or create a new one. The selected venue will be used when you publish the event.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Select Existing Venue</TabsTrigger>
              <TabsTrigger value="new">Create New Venue</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-6">
              {/* Search Venues */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search venues by name, manager, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {selectedVenueId && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Venue selected! This venue will be used when you publish the event.
                  </span>
                </div>
              )}

              {/* Venues List */}
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {filteredVenues.map((venue) => (
                  <Card
                    key={venue.id}
                    className={`cursor-pointer transition-all ${
                      selectedVenueId === venue.id
                        ? "ring-2 ring-green-500 bg-green-50 shadow-md"
                        : "hover:bg-gray-50 hover:shadow-sm"
                    }`}
                    onClick={() => handleVenueSelect(venue.id!)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={venue.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {venue.firstName[0]}
                            {venue.lastName[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                {venue.venueName || `${venue.firstName} ${venue.lastName}'s Venue`}
                                {selectedVenueId === venue.id && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Managed by {venue.firstName} {venue.lastName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {venue.email}
                            </div>
                            {venue.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {venue.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {venue.city}, {venue.state}
                            </div>
                          </div>

                          {venue.venueDescription && (
                            <p className="text-sm text-gray-600 line-clamp-2">{venue.venueDescription}</p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {venue.maxCapacity && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Up to {venue.maxCapacity} guests
                              </div>
                            )}
                            {venue.totalHalls && (
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {venue.totalHalls} halls
                              </div>
                            )}
                            {venue.averageRating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {venue.averageRating} ({venue.totalReviews} reviews)
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {venue.amenities.slice(0, 4).map((amenity) => (
                              <Badge key={amenity} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {venue.amenities.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{venue.amenities.length - 4} more
                              </Badge>
                            )}
                          </div>

                          {venue.basePrice && (
                            <div className="text-lg font-semibold text-blue-600">${venue.basePrice}/day</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new" className="space-y-6">
              {/* Create New Venue Form */}
              <div className="space-y-8">
                {/* Manager Information */}
                {/* <div>
                  <h3 className="text-lg font-semibold mb-4">Venue Manager Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newVenue.firstName}
                        onChange={(e) => setNewVenue({ ...newVenue, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={newVenue.lastName}
                        onChange={(e) => setNewVenue({ ...newVenue, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newVenue.email}
                        onChange={(e) => setNewVenue({ ...newVenue, email: e.target.value })}
                        placeholder="john.doe@venue.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newVenue.phone}
                        onChange={(e) => setNewVenue({ ...newVenue, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Venue Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Venue Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="venueName">Venue Name *</Label>
                      <Input
                        id="venueName"
                        value={newVenue.venueName}
                        onChange={(e) => setNewVenue({ ...newVenue, venueName: e.target.value })}
                        placeholder="Grand Convention Center"
                      />
                    </div>

                    <div>
                      <Label htmlFor="venueDescription">Description</Label>
                      <Textarea
                        id="venueDescription"
                        value={newVenue.venueDescription}
                        onChange={(e) => setNewVenue({ ...newVenue, venueDescription: e.target.value })}
                        placeholder="Describe the venue, its features, and what makes it special..."
                        rows={4}
                      />
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={newVenue.website}
                          onChange={(e) => setNewVenue({ ...newVenue, website: e.target.value })}
                          placeholder="https://venue.com"
                        />
                      </div> */}

                      {/* <div>
                        <Label htmlFor="maxCapacity">Max Capacity</Label>
                        <Input
                          id="maxCapacity"
                          type="number"
                          value={newVenue.maxCapacity}
                          onChange={(e) => setNewVenue({ ...newVenue, maxCapacity: e.target.value })}
                          placeholder="500"
                        />
                      </div> */}

                      {/* <div>
                        <Label htmlFor="totalHalls">Total Halls</Label>
                        <Input
                          id="totalHalls"
                          type="number"
                          value={newVenue.totalHalls}
                          onChange={(e) => setNewVenue({ ...newVenue, totalHalls: e.target.value })}
                          placeholder="3"
                        />
                      </div> */}
                    </div>

                    <div>
                      <Label htmlFor="basePrice">Base Price (per day)</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        value={newVenue.basePrice}
                        onChange={(e) => setNewVenue({ ...newVenue, basePrice: e.target.value })}
                        placeholder="1500.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="venueAddress">Street Address</Label>
                      <Input
                        id="venueAddress"
                        value={newVenue.venueAddress}
                        onChange={(e) => setNewVenue({ ...newVenue, venueAddress: e.target.value })}
                        placeholder="123 Convention Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newVenue.city}
                          onChange={(e) => setNewVenue({ ...newVenue, city: e.target.value })}
                          placeholder="San Francisco"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          value={newVenue.state}
                          onChange={(e) => setNewVenue({ ...newVenue, state: e.target.value })}
                          placeholder="California"
                        />
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={newVenue.country}
                          onChange={(e) => setNewVenue({ ...newVenue, country: e.target.value })}
                          placeholder="United States"
                        />
                      </div>

                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={newVenue.postalCode}
                          onChange={(e) => setNewVenue({ ...newVenue, postalCode: e.target.value })}
                          placeholder="94102"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {/* <div>
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {availableAmenities.map((amenity) => {
                      const IconComponent = amenity.icon
                      return (
                        <div key={amenity.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity.name}
                            checked={newVenue.amenities.includes(amenity.name)}
                            onCheckedChange={() => handleAmenityToggle(amenity.name)}
                          />
                          <Label htmlFor={amenity.name} className="flex items-center gap-2 cursor-pointer">
                            <IconComponent className="w-4 h-4" />
                            {amenity.name}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </div> */}

                {/* Meeting Spaces */}
                {/* <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Meeting Spaces</h3>
                    <Button onClick={addMeetingSpace} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Space
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {meetingSpaces.map((space, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Meeting Space {index + 1}</h4>
                          {meetingSpaces.length > 1 && (
                            <Button
                              onClick={() => removeMeetingSpace(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label>Space Name</Label>
                            <Input
                              value={space.name}
                              onChange={(e) => updateMeetingSpace(index, "name", e.target.value)}
                              placeholder="Conference Room A"
                            />
                          </div>

                          <div>
                            <Label>Capacity</Label>
                            <Input
                              type="number"
                              value={space.capacity}
                              onChange={(e) =>
                                updateMeetingSpace(index, "capacity", Number.parseInt(e.target.value) || 0)
                              }
                              placeholder="50"
                            />
                          </div>

                          <div>
                            <Label>Area (sq ft)</Label>
                            <Input
                              type="number"
                              value={space.area}
                              onChange={(e) => updateMeetingSpace(index, "area", Number.parseInt(e.target.value) || 0)}
                              placeholder="500"
                            />
                          </div>

                          <div>
                            <Label>Hourly Rate ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={space.hourlyRate}
                              onChange={(e) =>
                                updateMeetingSpace(index, "hourlyRate", Number.parseFloat(e.target.value) || 0)
                              }
                              placeholder="100.00"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">Features</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {spaceFeatures.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${index}-${feature}`}
                                  checked={space.features.includes(feature)}
                                  onCheckedChange={() => toggleSpaceFeature(index, feature)}
                                />
                                <Label htmlFor={`${index}-${feature}`} className="text-sm cursor-pointer">
                                  {feature}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div> */}

                <div className="flex justify-end">
                  <Button onClick={handleCreateVenue} disabled={loading}>
                    {loading ? "Creating..." : "Create Venue"}
                  </Button>
                </div>
              {/* </div> */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
