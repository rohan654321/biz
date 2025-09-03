"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Upload,
  Edit,
  Save,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Plus,
} from "lucide-react"

interface ExhibitorData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  jobTitle?: string
  bio?: string
  website?: string
  linkedin?: string
  twitter?: string
  avatar?: string
  location?: any
}

interface CompanyInfoProps {
  exhibitorId: string
  exhibitorData: ExhibitorData
  onUpdate: (data: Partial<ExhibitorData>) => void
}

export default function CompanyInfo({  exhibitorData, onUpdate }: CompanyInfoProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(exhibitorData)
  const [categories, setCategories] = useState<string[]>(["Technology", "Software", "AI/ML"])

  useEffect(() => {
    setFormData(exhibitorData)
  }, [exhibitorData])

  const handleSave = async () => {
    try {
      setLoading(true)
      await onUpdate(formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating company info:", error)
      toast({
        title: "Error",
        description: "Failed to update company information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = (newCategory: string) => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
    }
  }

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove))
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/company", color: "text-blue-600" },
    { name: "LinkedIn", icon: Linkedin, url: formData.linkedin || "", color: "text-blue-700" },
    { name: "Twitter", icon: Twitter, url: formData.twitter || "", color: "text-blue-400" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/company", color: "text-pink-600" },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Company Information</h1>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-2"
          disabled={loading}
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Logo & Banner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Logo & Banner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {formData.firstName?.[0]}
                  {formData.lastName?.[0]}
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
              <Label>Company Banner</Label>
              <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                {formData.company || "Company Name"}
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  Upload Banner
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={formData.company || ""}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                value={formData.jobTitle || ""}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="website"
                  value={formData.website || ""}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialLinks.map((social) => (
              <div key={social.name} className="flex items-center gap-3">
                <social.icon className={`w-5 h-5 ${social.color}`} />
                <div className="flex-1">
                  <Input
                    value={social.url}
                    disabled={!isEditing}
                    placeholder={`${social.name} URL`}
                    onChange={(e) => {
                      if (social.name === "LinkedIn") {
                        setFormData({ ...formData, linkedin: e.target.value })
                      } else if (social.name === "Twitter") {
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Product Categories & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Categories / Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  {isEditing && (
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveCategory(category)}
                    />
                  )}
                </Badge>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add new category"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddCategory(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add new category"]') as HTMLInputElement
                    if (input) {
                      handleAddCategory(input.value)
                      input.value = ""
                    }
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={6}
              placeholder="Describe your company, products, and services..."
            />
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
