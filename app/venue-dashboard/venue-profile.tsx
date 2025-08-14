"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Building2,
  MapPin,
  Upload,
  Edit,
  Save,
  Wifi,
  Car,
  Shield,
  Snowflake,
  Users,
  Camera,
  FileText,
  ExternalLink,
  AlertTriangle,
} from "lucide-react"

interface VenueData {
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
}

interface VenueProfileProps {
  venueData: VenueData
}

export default function VenueProfile({ venueData }: VenueProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    ...venueData,
    detailedDescription:
      "Grand Convention Center is Mumbai's premier event destination, featuring 8 versatile halls with capacities ranging from 50 to 2000 guests. Our state-of-the-art facilities include advanced AV systems, high-speed WiFi, ample parking, and 24/7 security. Located in the heart of the business district, we're easily accessible by public transport and offer comprehensive event management services.",
    googleMapLink: "https://maps.google.com/venue-location",
  })

  const [facilities, setFacilities] = useState([
    { id: "ac", name: "Air Conditioning", icon: Snowflake, checked: true },
    { id: "wifi", name: "High-Speed WiFi", icon: Wifi, checked: true },
    { id: "parking", name: "Parking Available", icon: Car, checked: true },
    { id: "security", name: "24/7 Security", icon: Shield, checked: true },
    { id: "catering", name: "In-house Catering", icon: Users, checked: true },
    { id: "av", name: "AV Equipment", icon: Camera, checked: true },
  ])

  const [spaces, setSpaces] = useState([
    { id: 1, name: "Grand Ballroom", capacity: 2000, type: "Main Hall" },
    { id: 2, name: "Executive Hall A", capacity: 500, type: "Conference Hall" },
    { id: 3, name: "Executive Hall B", capacity: 500, type: "Conference Hall" },
    { id: 4, name: "Meeting Room 1", capacity: 50, type: "Meeting Room" },
    { id: 5, name: "Meeting Room 2", capacity: 50, type: "Meeting Room" },
    { id: 6, name: "Meeting Room 3", capacity: 50, type: "Meeting Room" },
    { id: 7, name: "Outdoor Terrace", capacity: 300, type: "Outdoor Space" },
    { id: 8, name: "Exhibition Hall", capacity: 1500, type: "Exhibition Space" },
  ])

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const handleFacilityChange = (facilityId: string, checked: boolean) => {
    setFacilities(facilities.map((f) => (f.id === facilityId ? { ...f, checked } : f)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Venue Profile</h1>
        <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="flex items-center gap-2">
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue Logo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Venue Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={formData.logo || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {formData.venueName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue-name">Venue Name</Label>
              <Input
                id="venue-name"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-person">Contact Person</Label>
              <Input
                id="contact-person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location & Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="google-map">Google Map Link</Label>
              <div className="flex gap-2">
                <Input
                  id="google-map"
                  value={formData.googleMapLink}
                  onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
                  disabled={!isEditing}
                />
                {!isEditing && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={formData.googleMapLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Venue Photos</Label>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  Upload Photos
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Floor Plans</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Floor plans uploaded</p>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Update Floor Plans
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Venue Facilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {facilities.map((facility) => (
                <div key={facility.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={facility.id}
                    checked={facility.checked}
                    onCheckedChange={(checked) => handleFacilityChange(facility.id, checked as boolean)}
                    disabled={!isEditing}
                  />
                  <facility.icon className="w-4 h-4 text-gray-500" />
                  <Label htmlFor={facility.id} className="flex-1">
                    {facility.name}
                  </Label>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formData.maxCapacity}</div>
                  <div className="text-sm text-gray-600">Max Capacity</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formData.totalHalls}</div>
                  <div className="text-sm text-gray-600">Total Halls</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Short Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!isEditing}
              rows={3}
              placeholder="Brief description of your venue..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.detailedDescription}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
              disabled={!isEditing}
              rows={3}
              placeholder="Detailed description with facilities and services..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Halls & Spaces */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Halls & Meeting Spaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spaces.map((space) => (
              <div key={space.id} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{space.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Type: {space.type}</div>
                  <div>Capacity: {space.capacity} people</div>
                </div>
                <Badge variant="outline" className="mt-2">
                  {space.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Emergency & Safety */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Emergency & Safety Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Emergency Exit Plans</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Emergency exit plans uploaded</p>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Update Plans
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Safety Information</Label>
              <Textarea
                placeholder="Fire safety measures, emergency contacts, evacuation procedures..."
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div>
  )
}
