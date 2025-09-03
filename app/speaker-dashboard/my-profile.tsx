"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save, X, Plus, Camera, MapPin, Mail, Phone, Linkedin, Globe } from "lucide-react"

type SpeakerProfile = {
  fullName: string
  designation: string
  company: string
  email: string
  phone: string
  linkedin: string
  website: string
  location: string
  bio: string
  speakingExperience: string
  // expertise?: string[]
}

export default function MyProfile({ speakerId }: { speakerId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<SpeakerProfile | null>(null)
  const [newExpertise, setNewExpertise] = useState("")

  // 🔹 Save profile (PUT request)
const handleSave = async () => {
  if (!profile) return
  try {
    setLoading(true)
    const response = await fetch(`/api/speakers/${speakerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to update speaker")
    }

    if (data.success) {
      setProfile(data.profile) // Use the profile returned by the backend
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } else {
      throw new Error(data.error || "Update failed")
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update profile",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}
  // 🔹 Fetch profile (GET request)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/speakers/${speakerId}`)
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        if (data.success) {
          setProfile(data.profile)
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadProfile()
  }, [speakerId])

  if (!profile) {
    return <p>Loading profile...</p>
  }

  return (
    <div className="space-y-6">
      {/* Header with edit/save button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center space-x-2"
          disabled={loading}
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </Button>
      </div>

      {/* Profile Picture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" />
                  <AvatarFallback className="text-2xl">
                    {profile.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{profile.fullName}</h3>
                <p className="text-gray-600">{profile.designation}</p>
                <p className="text-gray-500">{profile.company}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "fullName", label: "Full Name", value: profile.fullName },
                { id: "designation", label: "Designation", value: profile.designation },
                { id: "company", label: "Company/Institution", value: profile.company },
                { id: "location", label: "Location", value: profile.location, icon: <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> },
                { id: "email", label: "Email", value: profile.email, type: "email", icon: <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> },
                { id: "phone", label: "Phone", value: profile.phone, icon: <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> },
                { id: "linkedin", label: "LinkedIn", value: profile.linkedin, icon: <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> },
                { id: "website", label: "Website", value: profile.website, icon: <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <div className="relative">
                    {field.icon}
                    <Input
                      id={field.id}
                      type={field.type || "text"}
                      value={field.value || ""}
                      onChange={(e) => setProfile({ ...profile, [field.id]: e.target.value })}
                      disabled={!isEditing}
                      className={field.icon ? "pl-10" : ""}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio & Speaking Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Professional Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              rows={6}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Speaking Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={profile.speakingExperience}
              onChange={(e) => setProfile({ ...profile, speakingExperience: e.target.value })}
              disabled={!isEditing}
              rows={6}
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
