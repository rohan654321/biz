"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Building2, Upload, Edit, Save, Facebook, Twitter, Linkedin, Instagram, Camera } from "lucide-react"

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

export default function CompanyInfo({ exhibitorData, onUpdate }: CompanyInfoProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState(exhibitorData)
  const [categories, setCategories] = useState<string[]>(["Technology", "Software", "AI/ML"])

  useEffect(() => {
    setFormData(exhibitorData)
  }, [exhibitorData])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "image")

      const response = await fetch("/api/upload/cloudinary", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.url) {
        // Update local state
        setFormData((prev) => ({ ...prev, avatar: data.url }))

        // Save to database immediately
        await onUpdate({ avatar: data.url })

        toast({
          title: "Success",
          description: "Avatar updated successfully",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await onUpdate(formData)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Company information updated successfully",
      })
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

  if (loading && !formData) {
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
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {formData.firstName?.[0]}
                    {formData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-4 right-1/2 translate-x-16 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    {uploading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </label>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
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
      </div>
    </div>
  )
}
