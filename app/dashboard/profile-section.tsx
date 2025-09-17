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
import { UserData } from "@/types/user"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProfileSectionProps {
  userData: UserData
  organizerId: string
  onUpdate: (data: Partial<UserData>) => void
}

const INTEREST_OPTIONS = [
  "Confirence",
  "Automation",
  "Education Training",
  "Medical & Pharma",
  "It & Technology",
  "Banking & Finance",
  "Business Services",
]

interface FormData {
  firstName: string
  lastName: string
  phone: string
  bio: string
  website: string
  company: string
  jobTitle: string
  linkedin: string
  twitter: string
  instagram: string
  interests: string[]
}
interface Event {
  id: string
  title: string
  description: string
  date: string
  organizer?: string
}
export function ProfileSection({ organizerId, userData, onUpdate }: ProfileSectionProps) {
  const initialFormData: FormData = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone || "",
    bio: userData.bio || "",
    website: userData.website || "",
    company: userData.company || "",
    jobTitle: userData.jobTitle || "",
    linkedin: userData.linkedin || "",
    twitter: userData.twitter || "",
    instagram: userData.instagram || "",
    interests: userData.interests || [],
  }

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
    const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)

  useEffect(() => {
    setFormData(initialFormData)
  }, [userData])

  const handleSave = useCallback(() => {
    onUpdate(formData)
    setIsEditing(false)
  }, [formData, onUpdate])

  const handleCancel = useCallback(() => {
    setFormData(initialFormData)
    setIsEditing(false)
  }, [userData])

  const inboxMessages = [1, 2, 3, 4]
 // Fetch interested events
// In ProfileSection component
// In ProfileSection component
useEffect(() => {
  async function fetchEvents() {
    try {
      setLoadingEvents(true)
      // Fetch from the general events endpoint
      const res = await fetch(`/api/events/recent`)
      
      if (!res.ok) throw new Error("Failed to fetch events")
      
      const data = await res.json()

      // Ensure events is always an array
      if (Array.isArray(data)) {
        setEvents(data)
      } else {
        setEvents([])
      }
    } catch (err) {
      console.error("Error fetching recent events:", err)
      setEvents([])
    } finally {
      setLoadingEvents(false)
    }
  }

  fetchEvents()
}, []) // Empty dependency array since we're not depending on user data
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
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

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card (Left) */}
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
                <p className="text-gray-600">
                  {userData.jobTitle || userData.role}
                </p>
                {userData.isVerified && (
                  <Badge variant="secondary" className="mt-1">
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Social Links */}
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
          </CardContent>

          <CardHeader className="pb-3">
            <CardTitle>Detailed Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {isEditing ? (
              <>
                {/* Editable fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Contact Number</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, jobTitle: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Interests</Label>
                    <Select
                      onValueChange={(value) => {
                        if (!formData.interests.includes(value)) {
                          setFormData({
                            ...formData,
                            interests: [...formData.interests, value],
                          })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select interest" />
                      </SelectTrigger>
                      <SelectContent>
                        {INTEREST_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {formData.interests.map((int, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              interests: formData.interests.filter(
                                (i) => i !== int
                              ),
                            })
                          }
                        >
                          {int} ✕
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </>
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
                  <span className="ml-auto">
                    {userData.phone || "9999879543"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-500" />
                  <span className="font-medium">Position</span>
                  <span className="ml-auto">
                    {userData.jobTitle || "CEO & Co-Founder"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon size={16} className="text-gray-500" />
                  <span className="font-medium">Interests</span>
                  <div className="ml-auto flex gap-2 flex-wrap">
                    {(userData.interests && userData.interests.length > 0
                      ? userData.interests
                      : ["Conference", "Automation"]
                    ).map((int, idx) => (
                      <Badge key={idx} variant="secondary">
                        {int}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-4">
                  <UserIcon size={16} className="text-gray-500 mt-1" />
                  <div>
                    <span className="font-medium block mb-1">Bio</span>
                    <p className="text-gray-700">
                      {userData.bio ||
                        "The world's deposit sourcing has a commitment to reducing foreign prices at the Paris for Bagnette Collection Centre in Paris, France. Organised by Moura Frankfurt France & S.E."}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right side content (Stats + Calendar + Inbox) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-sm">
                  {userData._count?.eventsAttended || 40} events
                </p>
              </div>
            </Card>
            <Card className="bg-red-300 h-32 flex items-center justify-center">
              <div className="text-center p-4">
                <UserIcon className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">Connections</h3>
                <p className="text-sm">
                  {userData._count?.connections || 3320} total
                </p>
              </div>
            </Card>
          </div>

          {/* Calendar + Inbox */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DynamicCalendar />
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Interested Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingEvents ? (
                  <p className="text-gray-500 text-sm">Loading events...</p>
                ) : events.length === 0 ? (
                  <p className="text-gray-500 text-sm">No events found</p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                      <p className="font-semibold text-sm truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toLocaleDateString()}{" "}
                        {event.organizer && `• ${event.organizer}`}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
