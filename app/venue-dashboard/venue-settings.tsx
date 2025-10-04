"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Settings,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Globe,
  Trash2,
  Save,
  AlertTriangle,
  Building,
  Calendar,
  DollarSign,
  Globe as GlobeIcon,
  Clock,
} from "lucide-react"

interface VenueData {
  venueName: string
  logo: string
  contactPerson: string
  email: string
  mobile: string
  address: string
  website: string
  description: string
  maxCapacity: number
  totalHalls: number
  totalEvents: number
  activeBookings: number
  averageRating: number
  totalReviews: number
}

interface VenueSettingsProps {
  venueData: VenueData
  onUpdate: (data: Partial<VenueData>) => void
}

export default function VenueSettings({ venueData, onUpdate }: VenueSettingsProps) {
  const { toast } = useToast()
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
    bookingAlerts: true,
    paymentNotifications: true,
    reviewNotifications: true,
    maintenanceReminders: true,
    marketingEmails: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    venueVisibility: "public",
    showContactInfo: true,
    allowDirectBookings: true,
    showInDirectory: true,
    dataSharing: false,
  })

  const [businessSettings, setBusinessSettings] = useState({
    timezone: "asia/kolkata",
    currency: "inr",
    language: "english",
    dateFormat: "dd/mm/yyyy",
    businessHours: {
      start: "09:00",
      end: "22:00",
    },
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
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
    // Handle password update
    console.log("Password update submitted")
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    toast({
      title: "Success",
      description: "Password updated successfully!",
    })
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

  const handleBusinessChange = (key: string, value: string) => {
    setBusinessSettings({
      ...businessSettings,
      [key]: value,
    })
  }

  const handleBusinessHoursChange = (field: "start" | "end", value: string) => {
    setBusinessSettings({
      ...businessSettings,
      businessHours: {
        ...businessSettings.businessHours,
        [field]: value,
      },
    })
  }

  const handleSaveSettings = (section: string) => {
    // In a real app, this would save to the backend
    toast({
      title: "Success",
      description: `${section} settings updated successfully!`,
    })
  }

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Account deletion requested")
    toast({
      title: "Request Submitted",
      description: "Account deletion request submitted. You will receive a confirmation email.",
    })
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
        <CardContent className="space-y-4">
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
                <div className="text-sm text-gray-600">Receive booking updates via email</div>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-600">Receive push notifications for new bookings</div>
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
                <div className="font-medium">New Booking Alerts</div>
                <div className="text-sm text-gray-600">Get notified when new bookings are made</div>
              </div>
              <Switch
                checked={notificationSettings.bookingAlerts}
                onCheckedChange={(checked) => handleNotificationChange("bookingAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Payment Notifications</div>
                <div className="text-sm text-gray-600">Receive updates about payments</div>
              </div>
              <Switch
                checked={notificationSettings.paymentNotifications}
                onCheckedChange={(checked) => handleNotificationChange("paymentNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Review Notifications</div>
                <div className="text-sm text-gray-600">Get notified when you receive new reviews</div>
              </div>
              <Switch
                checked={notificationSettings.reviewNotifications}
                onCheckedChange={(checked) => handleNotificationChange("reviewNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Maintenance Reminders</div>
                <div className="text-sm text-gray-600">Receive maintenance schedule reminders</div>
              </div>
              <Switch
                checked={notificationSettings.maintenanceReminders}
                onCheckedChange={(checked) => handleNotificationChange("maintenanceReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Marketing Emails</div>
                <div className="text-sm text-gray-600">Receive promotional content and tips</div>
              </div>
              <Switch
                checked={notificationSettings.marketingEmails}
                onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
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
              <Label>Venue Visibility</Label>
              <Select
                value={privacySettings.venueVisibility}
                onValueChange={(value) => handlePrivacyChange("venueVisibility", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can find your venue</SelectItem>
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
                <div className="font-medium">Allow Direct Bookings</div>
                <div className="text-sm text-gray-600">Let customers book directly without approval</div>
              </div>
              <Switch
                checked={privacySettings.allowDirectBookings}
                onCheckedChange={(checked) => handlePrivacyChange("allowDirectBookings", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Show in Directory</div>
                <div className="text-sm text-gray-600">Include your venue in public directories</div>
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

      {/* Business Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Business Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timezone
                </Label>
                <Select
                  value={businessSettings.timezone}
                  onValueChange={(value) => handleBusinessChange("timezone", value)}
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

              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Currency
                </Label>
                <Select
                  value={businessSettings.currency}
                  onValueChange={(value) => handleBusinessChange("currency", value)}
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
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <GlobeIcon className="w-4 h-4" />
                  Language
                </Label>
                <Select
                  value={businessSettings.language}
                  onValueChange={(value) => handleBusinessChange("language", value)}
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
                <Label htmlFor="date-format" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Format
                </Label>
                <Select
                  value={businessSettings.dateFormat}
                  onValueChange={(value) => handleBusinessChange("dateFormat", value)}
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

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Business Hours
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time" className="text-sm">
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={businessSettings.businessHours.start}
                  onChange={(e) => handleBusinessHoursChange("start", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time" className="text-sm">
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={businessSettings.businessHours.end}
                  onChange={(e) => handleBusinessHoursChange("end", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button onClick={() => handleSaveSettings("Business")}>Save Business Preferences</Button>
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
              <div className="font-medium text-red-600">Delete Venue Account</div>
              <div className="text-sm text-gray-600">
                Permanently delete your venue account and all associated data
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
                    This action cannot be undone. This will permanently delete your venue account, all bookings,
                    contracts, and remove all data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                    Yes, delete my venue account
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