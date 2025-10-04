"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Mail, Bell, Shield, User, Globe } from "lucide-react"

interface SpeakerSettingsProps {
  speakerId: string
}

interface SpeakerData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  website?: string
  twitter?: string
  linkedin?: string
  company?: string
  jobTitle?: string
  location?: string
  expertise?: string[]
  hourlyRate?: number
  currency?: string
  isAvailableForHire: boolean
}

export function SpeakerSettings({ speakerId }: SpeakerSettingsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Experienced keynote speaker specializing in technology and innovation.",
    website: "https://johndoe.com",
    twitter: "@johndoe",
    linkedin: "linkedin.com/in/johndoe",
    company: "Tech Innovations Inc",
    jobTitle: "Chief Technology Officer",
    location: "San Francisco, CA",
    expertise: ["Technology", "Innovation", "Leadership"],
    hourlyRate: 500,
    currency: "USD"
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    eventInvitations: true,
    connectionRequests: "everyone",
    profileVisibility: "public",
    showHourlyRate: false,
    availableForHire: true
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30
  })

  const handleProfileSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesSave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Preferences updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSecuritySave = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Security settings updated!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Speaker Settings</h1>
      </div>

      {/* <div className="grid gap-6 lg:grid-cols-2"> */}
        {/* Profile Information */}
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Change Photo
                </Button>
                <p className="text-sm text-gray-600">JPG, GIF or PNG. Max size 5MB.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={profileData.jobTitle}
                onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profileData.company}
                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself and your speaking experience..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={profileData.twitter}
                  onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleProfileSave} disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card> */}

        {/* Notification Preferences */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive event updates via email</div>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-gray-600">Receive push notifications</div>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Marketing Emails</div>
                  <div className="text-sm text-gray-600">Receive promotional content</div>
                </div>
                <Switch
                  checked={preferences.marketingEmails}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, marketingEmails: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Event Invitations</div>
                  <div className="text-sm text-gray-600">Get notified about new speaking opportunities</div>
                </div>
                <Switch
                  checked={preferences.eventInvitations}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, eventInvitations: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Available for Hire</div>
                  <div className="text-sm text-gray-600">Show that you're available for speaking engagements</div>
                </div>
                <Switch
                  checked={preferences.availableForHire}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, availableForHire: checked })}
                />
              </div>
            </div>

            <Button onClick={handlePreferencesSave} disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </CardContent>
        </Card> */}

        {/* Privacy & Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Privacy & Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={preferences.profileVisibility}
                  onValueChange={(value) => setPreferences({ ...preferences, profileVisibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="connections">Connections Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Connection Requests</Label>
                <Select
                  value={preferences.connectionRequests}
                  onValueChange={(value) => setPreferences({ ...preferences, connectionRequests: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="mutual">Mutual Connections</SelectItem>
                    <SelectItem value="none">No One</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Show Hourly Rate</div>
                  <div className="text-sm text-gray-600">Display your hourly rate on your profile</div>
                </div>
                <Switch
                  checked={preferences.showHourlyRate}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, showHourlyRate: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Change Password</div>
                  <div className="text-sm text-gray-600">Update your account password</div>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Add an extra layer of security</div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                >
                  {security.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Session Timeout</div>
                  <div className="text-sm text-gray-600">Auto-logout after inactivity</div>
                </div>
                <Select
                  value={security.sessionTimeout.toString()}
                  onValueChange={(value) => setSecurity({ ...security, sessionTimeout: parseInt(value) })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Active Sessions</div>
                  <div className="text-sm text-gray-600">Manage your active login sessions</div>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
              <div>
                <div className="font-medium text-red-600">Delete Account</div>
                <div className="text-sm text-red-500">Permanently delete your account and data</div>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>

            <Button onClick={handleSecuritySave} disabled={loading}>
              {loading ? "Saving..." : "Save Security Settings"}
            </Button>
          </CardContent>
        </Card>
      {/* </div> */}
    </div>
  )
}