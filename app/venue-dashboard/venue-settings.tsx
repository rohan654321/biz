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
}

export default function VenueSettings({ venueData }: VenueSettingsProps) {
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
      alert("New passwords don't match!")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!")
      return
    }
    // Handle password update
    console.log("Password update submitted")
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    alert("Password updated successfully!")
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

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Account deletion requested")
    alert("Account deletion request submitted. You will receive a confirmation email.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Venue Settings</h1>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Venue Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={venueData.logo || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">
                  {venueData.venueName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{venueData.venueName}</h3>
              <p className="text-gray-600">{venueData.contactPerson}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{venueData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{venueData.mobile}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{venueData.website}</span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-600">{venueData.maxCapacity}</div>
                <div className="text-sm text-gray-600">Max Capacity</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-600">{venueData.totalHalls}</div>
                <div className="text-sm text-gray-600">Total Halls</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Password Settings */}
          <Card>
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
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Communication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch
                        id="email-notifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <Switch
                        id="push-notifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <Switch
                        id="sms-notifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Business Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="booking-alerts">New Booking Alerts</Label>
                      <Switch
                        id="booking-alerts"
                        checked={notificationSettings.bookingAlerts}
                        onCheckedChange={(checked) => handleNotificationChange("bookingAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payment-notifications">Payment Notifications</Label>
                      <Switch
                        id="payment-notifications"
                        checked={notificationSettings.paymentNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("paymentNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="review-notifications">Review Notifications</Label>
                      <Switch
                        id="review-notifications"
                        checked={notificationSettings.reviewNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("reviewNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance-reminders">Maintenance Reminders</Label>
                      <Switch
                        id="maintenance-reminders"
                        checked={notificationSettings.maintenanceReminders}
                        onCheckedChange={(checked) => handleNotificationChange("maintenanceReminders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <Switch
                        id="marketing-emails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue-visibility">Venue Visibility</Label>
                    <Select
                      value={privacySettings.venueVisibility}
                      onValueChange={(value) => handlePrivacyChange("venueVisibility", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="registered">Registered Users Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-contact">Show Contact Information</Label>
                      <Switch
                        id="show-contact"
                        checked={privacySettings.showContactInfo}
                        onCheckedChange={(checked) => handlePrivacyChange("showContactInfo", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="direct-bookings">Allow Direct Bookings</Label>
                      <Switch
                        id="direct-bookings"
                        checked={privacySettings.allowDirectBookings}
                        onCheckedChange={(checked) => handlePrivacyChange("allowDirectBookings", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-directory">Show in Directory</Label>
                      <Switch
                        id="show-directory"
                        checked={privacySettings.showInDirectory}
                        onCheckedChange={(checked) => handlePrivacyChange("showInDirectory", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-sharing">Allow Data Sharing</Label>
                      <Switch
                        id="data-sharing"
                        checked={privacySettings.dataSharing}
                        onCheckedChange={(checked) => handlePrivacyChange("dataSharing", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Business Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
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
                    <Label htmlFor="currency">Currency</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
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
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
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

                  <div className="space-y-2">
                    <Label>Business Hours</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
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
                      <div>
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
                </div>
              </div>
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Delete Venue Account</h4>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your venue account, there is no going back. This will permanently delete all your
                  data, bookings, and contracts.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Venue Account
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
      </div>
    </div>
  )
}
