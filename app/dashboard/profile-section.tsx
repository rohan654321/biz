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
  Loader2,
  BriefcaseBusiness,
  Building2,
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
import Link from "next/link"

interface ProfileSectionProps {
  userData: UserData
  organizerId: string
  onUpdate: (data: Partial<UserData>) => void
}

const INTEREST_OPTIONS = [
  "Conference",
  "Automation",
  "Education Training",
  "Medical & Pharma",
  "IT & Technology",
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
  companyIndustry: string   // 👈 NEW
  linkedin: string
  twitter: string
  instagram: string
  interests: string[]
}

interface Event {
  tags: any
  id: string
  title: string
  description: string
  date: string
  organizer?: string
}

export function ProfileSection({ organizerId, userData, onUpdate }: ProfileSectionProps) {
  const initialFormData: FormData = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    phone: userData?.phone || "",
    bio: userData?.bio || "",
    website: userData?.website || "",
    company: userData?.company || "",
    jobTitle: userData?.jobTitle || "",
    companyIndustry: userData?.companyIndustry || "", // 👈 NEW
    linkedin: userData?.linkedin || "",
    twitter: userData?.twitter || "",
    instagram: userData?.instagram || "",
    interests: userData?.interests || [],
  }


  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [localUserData, setLocalUserData] = useState<UserData>(userData)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userData?.interests || [])
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([])

  // Filter events based on interests
  const filteredEvents = selectedInterests.length > 0
    ? events.filter((event) =>
      event.tags?.some((tag: string) => selectedInterests.includes(tag))
    )
    : events

  // Shuffle function
  const shuffleEvents = useCallback(() => {
    if (filteredEvents.length <= 10) {
      // If less than or equal to 10 events, show them all
      setDisplayedEvents(filteredEvents)
    } else {
      // Shuffle and take 10 random events
      const shuffled = [...filteredEvents].sort(() => Math.random() - 0.5)
      setDisplayedEvents(shuffled.slice(0, 10))
    }
  }, [filteredEvents])


  // Run on mount & when filteredEvents changes
  useEffect(() => {
    shuffleEvents()
  }, [filteredEvents.length])

  // Auto shuffle every 3 minutes
  useEffect(() => {
    if (filteredEvents.length > 10) {
      const interval = setInterval(() => {
        shuffleEvents()
      }, 180000) // 3 minutes

      return () => clearInterval(interval)
    }
  }, [filteredEvents.length])




  useEffect(() => {
    setLocalUserData(userData)
  }, [userData])

  useEffect(() => {
    setFormData({
      firstName: localUserData?.firstName || "",
      lastName: localUserData?.lastName || "",
      phone: localUserData?.phone || "",
      bio: localUserData?.bio || "",
      website: localUserData?.website || "",
      company: localUserData?.company || "",
      companyIndustry: userData?.companyIndustry || "",
      jobTitle: localUserData?.jobTitle || "",
      linkedin: localUserData?.linkedin || "",
      twitter: localUserData?.twitter || "",
      instagram: localUserData?.instagram || "",
      interests: localUserData?.interests || [],
    })
    setSelectedInterests(localUserData?.interests || [])
  }, [localUserData])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      const response = await fetch(`/api/users/${localUserData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      const { user: updatedUser } = await response.json()
      setLocalUserData(prev => ({ ...prev, ...updatedUser }))
      setSelectedInterests(updatedUser.interests || [])
      onUpdate(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      setSaveError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }, [formData, localUserData.id, onUpdate])

  const handleCancel = useCallback(() => {
    setFormData({
      firstName: localUserData?.firstName || "",
      lastName: localUserData?.lastName || "",
      phone: localUserData?.phone || "",
      bio: localUserData?.bio || "",
      website: localUserData?.website || "",
      company: localUserData?.company || "",
      companyIndustry: userData?.companyIndustry || "",
      jobTitle: localUserData?.jobTitle || "",
      linkedin: localUserData?.linkedin || "",
      twitter: localUserData?.twitter || "",
      instagram: localUserData?.instagram || "",
      interests: localUserData?.interests || [],
    })
    setIsEditing(false)
    setSaveError(null)
  }, [localUserData])

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoadingEvents(true)
        const res = await fetch(`/api/events/recent`)
        if (!res.ok) throw new Error("Failed to fetch events")
        const data = await res.json()
        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching recent events:", err)
        setEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2" disabled={isSaving}>
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save</>}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2" disabled={isSaving}>
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        )}
      </div>

      {saveError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{saveError}</div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={localUserData.avatar || "/image/Ellipse 72.png"} />
                <AvatarFallback className="text-2xl">
                  {localUserData.firstName?.[0]}
                  {localUserData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{localUserData.firstName} {localUserData.lastName}</h2>
                <p className="text-gray-600">{localUserData.jobTitle || (localUserData.role === "ATTENDEE" ? "Visitor" : localUserData.role)}</p>
                {localUserData.isVerified && <Badge variant="secondary" className="mt-1">Verified</Badge>}
              </div>
            </div>

            {/* Social links */}
            {!isEditing ? (
              <div className="flex justify-center gap-3 mb-6">
                <a href={localUserData.linkedin || "#"} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white">
                  <Linkedin size={18} />
                </a>
                <a href={localUserData.twitter || "#"} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-400 hover:bg-sky-500 text-white">
                  <Twitter size={18} />
                </a>
                <a href={localUserData.instagram || "#"} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 text-white">
                  <Instagram size={18} />
                </a>
                <a href={localUserData.website || "#"} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white">
                  <Globe size={18} />
                </a>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <div>
                  <Label>LinkedIn</Label>
                  <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                </div>
              </div>
            )}
          </CardContent>

          <CardHeader className="pb-3">
            <CardTitle>Detailed Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Contact Number</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                  </div>
                  <div>
                    <Label>Interests</Label>
                    <Select
                      onValueChange={(value) => {
                        if (!formData.interests.includes(value)) {
                          setFormData({ ...formData, interests: [...formData.interests, value] })
                        }
                      }}
                    >
                      <div>
                        <Label>Company Field</Label>
                        <Input
                          value={formData.companyIndustry}
                          onChange={(e) =>
                            setFormData({ ...formData, companyIndustry: e.target.value })
                          }
                          placeholder="e.g. Fintech, Education, Healthcare"
                        />
                      </div>

                      <SelectTrigger>
                        <SelectValue placeholder="Select interest" />
                      </SelectTrigger>
                      <SelectContent>
                        {INTEREST_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {formData.interests.map((int, idx) => (
                        <Badge key={idx} variant="secondary" className="cursor-pointer"
                          onClick={() => setFormData({ ...formData, interests: formData.interests.filter((i) => i !== int) })}>
                          {int} ✕
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <span className="font-medium">Email Address</span>
                  <span className="ml-auto">{localUserData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <span className="font-medium">Contact Number</span>
                  <span className="ml-auto">{localUserData.phone || "9999879543"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-500" />
                  <span className="font-medium">Position</span>
                  <span className="ml-auto">{localUserData.jobTitle || "CEO & Co-Founder"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-500" />
                  <span className="font-medium">Company</span>
                  <span className="ml-auto">{localUserData.company || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness size={16} className="text-gray-500" />
                  <span className="font-medium">Industry</span>
                  <span className="ml-auto">{localUserData.companyIndustry || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon size={16} className="text-gray-500" />
                  <span className="font-medium">Interests</span>
                  <div className="ml-auto flex gap-2 flex-wrap">
                    {(localUserData.interests && localUserData.interests.length > 0
                      ? localUserData.interests
                      : ["Conference", "Automation"]).map((int, idx) => (
                        <Badge key={idx} variant="secondary">{int}</Badge>
                      ))}
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-4">
                  <UserIcon size={16} className="text-gray-500 mt-1" />
                  <div>
                    <span className="font-medium block mb-1">Bio</span>
                    <p className="text-gray-700">
                      {localUserData.bio ||
                        "The world's deposit sourcing has a commitment to reducing foreign prices at the Paris for Bagnette Collection Centre in Paris, France."}
                    </p>
                  </div>

                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Side */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats */}
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
                <p className="text-sm">{localUserData._count?.eventsAttended || 40} events</p>
              </div>
            </Card>
            <Card className="bg-red-300 h-32 flex items-center justify-center">
              <div className="text-center p-4">
                <UserIcon className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold">Connections</h3>
                <p className="text-sm">{localUserData._count?.connections || 3320} total</p>
              </div>
            </Card>
          </div>

          {/* Calendar + Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="h-[500px]"> {/* 👈 Set fixed height */}
              <DynamicCalendar className="h-full w-full" /> {/* 👈 Stretch calendar */}
            </div>

            {/* Interested Events */}
            <Card className="h-[500px] flex flex-col"> {/* 👈 Same height as calendar */}
              <CardHeader className="pb-3">
                <CardTitle>Interested Events</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {loadingEvents ? (
                  <p className="text-gray-500 text-sm">Loading events...</p>
                ) : displayedEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No events found</p>
                ) : (
                  displayedEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/event/${event.id}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                      <p className="font-semibold text-sm truncate">{event.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toLocaleDateString()}{" "}
                        {event.organizer && `• ${event.organizer}`}
                      </p>
                    </Link>
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