"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  X,
  Briefcase,
  User as UserIcon,
  Linkedin,
  Twitter,
  Instagram,
  Calendar,
  CalendarDays,
} from "lucide-react"
import { DynamicCalendar } from "@/components/DynamicCalendar"

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: string
  bio?: string
  website?: string
  linkedin?: string
  twitter?: string
  instagram?: string
  company?: string
  jobTitle?: string
  location?: string
  isVerified: boolean
  createdAt: string
  lastLogin?: string
  _count?: {
    eventsAttended: number
    eventsOrganized: number
    connections: number
  }
}

interface ProfileSectionProps {
  userData: UserData
  onUpdate: (data: Partial<UserData>) => void
}

export function ProfileSection({ userData, onUpdate }: ProfileSectionProps) {
  // Initialize form data only once with useMemo to prevent recreation on every render
  const initialFormData = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone || "",
    bio: userData.bio || "",
    website: userData.website || "",
    company: userData.company || "",
    jobTitle: userData.jobTitle || "",
    location: userData.location || "",
    linkedin: userData.linkedin || "",
    twitter: userData.twitter || "",
    instagram: userData.instagram || "",
  }

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  // Update form data only when userData changes
  useEffect(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || "",
      bio: userData.bio || "",
      website: userData.website || "",
      company: userData.company || "",
      jobTitle: userData.jobTitle || "",
      location: userData.location || "",
      linkedin: userData.linkedin || "",
      twitter: userData.twitter || "",
      instagram: userData.instagram || "",
    })
  }, [userData]) // Only run when userData changes

  const handleSave = useCallback(() => {
    onUpdate(formData)
    setIsEditing(false)
  }, [formData, onUpdate])

  const handleCancel = useCallback(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || "",
      bio: userData.bio || "",
      website: userData.website || "",
      company: userData.company || "",
      jobTitle: userData.jobTitle || "",
      location: userData.location || "",
      linkedin: userData.linkedin || "",
      twitter: userData.twitter || "",
      instagram: userData.instagram || "",
    })
    setIsEditing(false)
  }, [userData])

  // Memoize calendar data to prevent recreation on every render
  const calendarData = [
    { week: 26, days: [8, 9, 10, 11, 12, 13, 14] },
    { week: 27, days: [15, 16, 17, 18, 19, 20, 21] },
    { week: 28, days: [22, 23, 24, 25, 26, 27, 28] },
    { week: 29, days: [29, 30, 31, 1, 2, 3, 4] },
  ]

  // Memoize inbox messages
  const inboxMessages = [1, 2, 3, 4]

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Top section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {userData.firstName[0]}
                  {userData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-gray-600">{userData.jobTitle || userData.role}</p>
                {userData.isVerified && (
                  <Badge variant="secondary" className="mt-1">
                    Verified
                  </Badge>
                )} 
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-3 mb-6">
              <a
                href={userData.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={userData.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-400 hover:bg-sky-500 text-white"
              >
                <Twitter size={18} />
              </a>
              <a
                href={userData.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href={userData.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white"
              >
                <Globe size={18} />
              </a>
            </div>
            
            {/* <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-semibold text-lg">
                  {userData._count?.connections || 3320}
                </div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-semibold text-lg">
                  {userData._count?.eventsAttended || 40}
                </div>
                <div className="text-sm text-gray-600">Events</div>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-yellow-200 h-32 flex items-center justify-center">
            <div className="text-center p-4">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Upcoming Events</h3>
              <p className="text-sm">5 events this month</p>
            </div>
          </Card>
          <Card className="bg-blue-200 h-32 flex items-center justify-center">
            <div className="text-center p-4">
              <CalendarDays className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Events</h3>
              <p className="text-sm">{userData._count?.eventsAttended || 40} events</p>
            </div>
          </Card>
  <Card className="bg-red-300 h-32 flex items-center justify-center">
  <div className="text-center p-4">
    <UserIcon className="w-8 h-8 mx-auto mb-2" />
    <h3 className="font-semibold">Connections</h3>
    <p className="text-sm">{userData._count?.connections || 3320} total</p>
  </div>
</Card>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Detailed Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Position</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, jobTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <span className="font-medium">Email Address</span>
                  <span className="ml-auto">{userData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <span className="font-medium">Contact Number</span>
                  <span className="ml-auto">{userData.phone || "9999879543"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-500" />
                  <span className="font-medium">Position</span>
                  <span className="ml-auto">{userData.jobTitle || "CEO & Co-Founder"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="font-medium">Location</span>
                  <span className="ml-auto">{userData.location || "San Francisco, CA"}</span>
                </div>
                <div className="flex items-start gap-2 mt-4">
                  <UserIcon size={16} className="text-gray-500 mt-1" />
                  <div>
                    <span className="font-medium block mb-1">Bio</span>
                    <p className="text-gray-700">
                      {userData.bio || "The world's deposit sourcing has a commitment to reducing foreign prices at the Paris for Bagnette Collection Centre in Paris, France. Organised by Moura Frankfurt France & S.E."}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        {/* <Card>
          <CardHeader className="pb-3">
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm mb-4 flex justify-between items-center">
              <span className="font-medium">July 2023</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">&lt;</Button>
                <Button variant="outline" size="sm">&gt;</Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="font-medium text-gray-500 py-1">{day}</div>
              ))}
            </div>
            
            {calendarData.map((week) => (
              <div key={week.week} className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
                {week.days.map((day, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${day === 27 ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card> */}
        <DynamicCalendar/>
        {/* Inbox */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inboxMessages.map((msg) => (
              <div
                key={msg}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">Rajesh Kumar</p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    Depth is not for any major activities but also facilitates sales of products and services that are required to be sold.
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}