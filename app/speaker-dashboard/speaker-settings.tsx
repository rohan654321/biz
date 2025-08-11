"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, User, Bell, Shield, Eye, Globe, Smartphone, Mail, Lock, Trash2, Save, AlertTriangle, Key, Camera } from 'lucide-react'

export function SpeakerSettings() {
  const [activeTab, setActiveTab] = useState("account")
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    eventReminders: true,
    messageAlerts: true,
    promotionalEmails: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    contactInfoVisible: true,
    sessionHistoryVisible: true,
    ratingsVisible: true,
  })

  const [preferences, setPreferences] = useState({
    language: "English",
    timezone: "UTC+05:30 (India Standard Time)",
    currency: "USD",
    dateFormat: "DD/MM/YYYY",
  })

  const tabs = [
    { id: "account", label: "Account Settings", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Settings },
  ]

  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="text-xl">JS</AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Button variant="outline">Upload New Photo</Button>
              <Button variant="ghost" className="text-red-600 hover:text-red-700">
                Remove Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.smith@techcorp.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              defaultValue="Experienced technology leader with 15+ years in enterprise software development. Passionate about cloud architecture, AI/ML, and digital transformation."
            />
          </div>
        </CardContent>
      </Card>

      {/* Password & Security */}
      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline">
                <Key className="h-4 w-4 mr-2" />
                Enable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Event Reminders</h4>
              <p className="text-sm text-gray-600">Get reminded about upcoming sessions</p>
            </div>
            <Switch
              checked={notifications.eventReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, eventReminders: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Message Alerts</h4>
              <p className="text-sm text-gray-600">Notifications for new messages from organizers</p>
            </div>
            <Switch
              checked={notifications.messageAlerts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, messageAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Promotional Emails</h4>
              <p className="text-sm text-gray-600">Receive updates about new features and events</p>
            </div>
            <Switch
              checked={notifications.promotionalEmails}
              onCheckedChange={(checked) => setNotifications({ ...notifications, promotionalEmails: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mobile Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive important updates via SMS</p>
            </div>
            <Switch
              checked={notifications.smsNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-gray-600">Get push notifications on your mobile device</p>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="public"
                name="visibility"
                checked={privacy.profileVisibility === "public"}
                onChange={() => setPrivacy({ ...privacy, profileVisibility: "public" })}
              />
              <Label htmlFor="public" className="flex-1">
                <div>
                  <h4 className="font-medium">Public</h4>
                  <p className="text-sm text-gray-600">Anyone can view your speaker profile</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="organizers"
                name="visibility"
                checked={privacy.profileVisibility === "organizers"}
                onChange={() => setPrivacy({ ...privacy, profileVisibility: "organizers" })}
              />
              <Label htmlFor="organizers" className="flex-1">
                <div>
                  <h4 className="font-medium">Event Organizers Only</h4>
                  <p className="text-sm text-gray-600">Only event organizers can view your profile</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="private"
                name="visibility"
                checked={privacy.profileVisibility === "private"}
                onChange={() => setPrivacy({ ...privacy, profileVisibility: "private" })}
              />
              <Label htmlFor="private" className="flex-1">
                <div>
                  <h4 className="font-medium">Private</h4>
                  <p className="text-sm text-gray-600">Your profile is hidden from public view</p>
                </div>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Information Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Contact Information</h4>
              <p className="text-sm text-gray-600">Show email and phone number on profile</p>
            </div>
            <Switch
              checked={privacy.contactInfoVisible}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, contactInfoVisible: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Session History</h4>
              <p className="text-sm text-gray-600">Display past speaking engagements</p>
            </div>
            <Switch
              checked={privacy.sessionHistoryVisible}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, sessionHistoryVisible: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Ratings & Reviews</h4>
              <p className="text-sm text-gray-600">Show ratings and feedback from events</p>
            </div>
            <Switch
              checked={privacy.ratingsVisible}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, ratingsVisible: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPreferences = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              >
                <option value="UTC+05:30 (India Standard Time)">UTC+05:30 (India Standard Time)</option>
                <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time)</option>
                <option value="UTC+00:00 (GMT)">UTC+00:00 (GMT)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={preferences.currency}
                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <select
                id="dateFormat"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={preferences.dateFormat}
                onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">Li</span>
              </div>
              <div>
                <h4 className="font-medium">LinkedIn</h4>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Disconnect
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">Tw</span>
              </div>
              <div>
                <h4 className="font-medium">Twitter</h4>
                <p className="text-sm text-gray-600">Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-700">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return renderAccountSettings()
      case "notifications":
        return renderNotificationSettings()
      case "privacy":
        return renderPrivacySettings()
      case "preferences":
        return renderPreferences()
      default:
        return renderAccountSettings()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <Button className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  )
}
