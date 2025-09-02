"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  companyName: string
  logo: string
  contactPerson: string
  email: string
  mobile: string
  website: string
  categories: string[]
  description: string
}

interface CompanyInfoProps {
  exhibitorData: ExhibitorData
}

export default function CompanyInfo({ exhibitorData }: CompanyInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
 const [formData, setFormData] = useState<ExhibitorData>({
  companyName: exhibitorData?.companyName || "",
  logo: exhibitorData?.logo || "",
  contactPerson: exhibitorData?.contactPerson || "",
  email: exhibitorData?.email || "",
  mobile: exhibitorData?.mobile || "",
  website: exhibitorData?.website || "",
  categories: exhibitorData?.categories || [],
  description: exhibitorData?.description || "",
})

  const [newCategory, setNewCategory] = useState("")

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/techcorp", color: "text-blue-600" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/techcorp", color: "text-blue-700" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/techcorp", color: "text-blue-400" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/techcorp", color: "text-pink-600" },
  ]

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory.trim()],
      })
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (categoryToRemove: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((cat) => cat !== categoryToRemove),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Company Information</h1>
        <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="flex items-center gap-2">
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
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
                <AvatarImage src={formData.logo || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {formData.companyName
                    ? formData.companyName.split(" ").map((n) => n[0]).join("")
                    : "EX"}
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
                {formData.companyName}
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
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
              <Label htmlFor="mobile">Mobile</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
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
                  value={formData.website}
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
                  <Input value={social.url} disabled={!isEditing} placeholder={`${social.name} URL`} />
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
              {formData.categories.map((category) => (
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
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <Button onClick={handleAddCategory} size="sm">
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!isEditing}
              rows={6}
              placeholder="Describe your company, products, and services..."
            />
          </CardContent>
        </Card>
      </div>

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
