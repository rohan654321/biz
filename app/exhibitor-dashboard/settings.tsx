"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Globe,
  Trash2,
  Save,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Users,
  FileText,
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
}

export default function ExhibitorSettings({ exhibitorId }: { exhibitorId: string }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [exhibitorData, setExhibitorData] = useState<ExhibitorData | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    leadNotifications: true,
    appointmentReminders: true,
    promotionalEmails: false,
    weeklyReports: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showContactInfo: true,
    allowDirectMessages: true,
    showInDirectory: true,
    dataSharing: false,
  })

  const [accountSettings, setAccountSettings] = useState({
    language: "english",
    timezone: "asia/kolkata",
    currency: "inr",
    dateFormat: "dd/mm/yyyy",
  })

  // Fetch exhibitor data on component mount
  useEffect(() => {
    const fetchExhibitorData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/exhibitors/${exhibitorId}`)
        if (!response.ok) throw new Error("Failed to fetch exhibitor data")

        const data = await response.json()
        if (data.success) {
          setExhibitorData(data.exhibitor)
        }
      } catch (error) {
        console.error("Error fetching exhibitor data:", error)
        toast({
          title: "Error",
          description: "Failed to load exhibitor data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (exhibitorId) {
      fetchExhibitorData()
    }
  }, [exhibitorId, toast])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match!",
        variant: "destructive",
      })
      return
    }
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long!",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/exhibitors/${exhibitorId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) throw new Error("Failed to update password")

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Success",
        description: "Password updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value,
    })
  }

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: value,
    })
  }

  const handleAccountChange = (key: string, value: string) => {
    setAccountSettings({
      ...accountSettings,
      [key]: value,
    })
  }

  const handleSaveSettings = (section: string) => {
    // In a real app, this would save to the backend
    toast({
      title: "Success",
      description: `${section} settings updated successfully!`,
    })
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`/api/exhibitors/${exhibitorId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete account")

      toast({
        title: "Account Deletion",
        description: "Account deletion request submitted. You will receive a confirmation email.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    }
  }

  // Add loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!exhibitorData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">No exhibitor data found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Password & Security */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card> */}

      {/* Notification Preferences */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-600">Receive updates and alerts via email</div>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-600">Receive push notifications on your device</div>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-gray-600">Receive SMS alerts for urgent matters</div>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Event Reminders</div>
                <div className="text-sm text-gray-600">Get reminders for upcoming events</div>
              </div>
              <Switch
                checked={notificationSettings.eventReminders}
                onCheckedChange={(checked) => handleNotificationChange("eventReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">New Lead Alerts</div>
                <div className="text-sm text-gray-600">Get notified when you receive new leads</div>
              </div>
              <Switch
                checked={notificationSettings.leadNotifications}
                onCheckedChange={(checked) => handleNotificationChange("leadNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Appointment Reminders</div>
                <div className="text-sm text-gray-600">Receive reminders for scheduled appointments</div>
              </div>
              <Switch
                checked={notificationSettings.appointmentReminders}
                onCheckedChange={(checked) => handleNotificationChange("appointmentReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Promotional Emails</div>
                <div className="text-sm text-gray-600">Receive promotional content and offers</div>
              </div>
              <Switch
                checked={notificationSettings.promotionalEmails}
                onCheckedChange={(checked) => handleNotificationChange("promotionalEmails", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Weekly Reports</div>
                <div className="text-sm text-gray-600">Receive weekly performance reports</div>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
              />
            </div>
          </div>

          <Button onClick={() => handleSaveSettings("Notification")}>Save Preferences</Button>
        </CardContent>
      </Card> */}

      {/* Privacy & Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile Visibility
              </Label>
              <Select
                value={privacySettings.profileVisibility}
                onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can view your profile</SelectItem>
                  <SelectItem value="registered">Registered Users Only</SelectItem>
                  <SelectItem value="private">Private - By invitation only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Show Contact Information</div>
                <div className="text-sm text-gray-600">Display your contact details publicly</div>
              </div>
              <Switch
                checked={privacySettings.showContactInfo}
                onCheckedChange={(checked) => handlePrivacyChange("showContactInfo", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Direct Messages</div>
                <div className="text-sm text-gray-600">Let other users send you direct messages</div>
              </div>
              <Switch
                checked={privacySettings.allowDirectMessages}
                onCheckedChange={(checked) => handlePrivacyChange("allowDirectMessages", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Show in Directory</div>
                <div className="text-sm text-gray-600">Include your profile in public directories</div>
              </div>
              <Switch
                checked={privacySettings.showInDirectory}
                onCheckedChange={(checked) => handlePrivacyChange("showInDirectory", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Data Sharing</div>
                <div className="text-sm text-gray-600">Share analytics data to improve our services</div>
              </div>
              <Switch
                checked={privacySettings.dataSharing}
                onCheckedChange={(checked) => handlePrivacyChange("dataSharing", checked)}
              />
            </div>
          </div>

          <Button onClick={() => handleSaveSettings("Privacy")}>Save Privacy Settings</Button>
        </CardContent>
      </Card>

      {/* Account Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Language
                </Label>
                <Select
                  value={accountSettings.language}
                  onValueChange={(value) => handleAccountChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timezone
                </Label>
                <Select
                  value={accountSettings.timezone}
                  onValueChange={(value) => handleAccountChange("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia/kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="america/new_york">America/New_York (EST)</SelectItem>
                    <SelectItem value="europe/london">Europe/London (GMT)</SelectItem>
                    <SelectItem value="asia/tokyo">Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Currency
                </Label>
                <Select
                  value={accountSettings.currency}
                  onValueChange={(value) => handleAccountChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">INR (₹)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Format
                </Label>
                <Select
                  value={accountSettings.dateFormat}
                  onValueChange={(value) => handleAccountChange("dateFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={() => handleSaveSettings("Account")}>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div>
              <div className="font-medium text-red-600">Delete Account</div>
              <div className="text-sm text-gray-600">
                Permanently delete your account and all associated data
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}