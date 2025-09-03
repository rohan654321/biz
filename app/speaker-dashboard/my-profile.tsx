"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save, X, Plus, Camera, MapPin, Mail, Phone, Linkedin, Globe } from "lucide-react"

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "John Smith",
    designation: "Senior Technology Architect",
    company: "TechCorp Solutions",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/johnsmith",
    website: "johnsmith.tech",
    location: "San Francisco, CA",
    bio: "Experienced technology leader with 15+ years in enterprise software development. Passionate about cloud architecture, AI/ML, and digital transformation. Regular speaker at tech conferences worldwide.",
    expertise: ["Cloud Architecture", "AI/ML", "Digital Transformation", "Enterprise Software", "DevOps"],
    speakingExperience: "50+ conferences, 200+ sessions delivered globally",
  })

  const [newExpertise, setNewExpertise] = useState("")

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const addExpertise = () => {
    if (newExpertise.trim()) {
      setProfile({
        ...profile,
        expertise: [...profile.expertise, newExpertise.trim()],
      })
      setNewExpertise("")
    }
  }

  const removeExpertise = (index: number) => {
    setProfile({
      ...profile,
      expertise: profile.expertise.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="flex items-center space-x-2">
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" />
                  <AvatarFallback className="text-2xl">JS</AvatarFallback>
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

        {/* Contact Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={profile.designation}
                  onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Institution</Label>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="linkedin"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio & Experience */}
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

      {/* Expertise/Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Expertise & Topics of Interest</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.expertise.map((topic, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{topic}</span>
                {isEditing && (
                  <button onClick={() => removeExpertise(index)} className="ml-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex space-x-2">
              <Input
                placeholder="Add new expertise topic"
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addExpertise()}
              />
              <Button onClick={addExpertise} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
