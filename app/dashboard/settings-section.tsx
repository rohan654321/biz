"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { UserData } from "@/types/user"

// interface UserData {
//   id: string
//   email: string
//   firstName: string
//   lastName: string
//   phone?: string
//   avatar?: string
//   role: string
//   bio?: string
//   website?: string
//   linkedin?: string
//   twitter?: string
//   company?: string
//   jobTitle?: string
//   location?: {
//     address: string
//     city: string
//     state: string
//     country: string
//   }
//   isVerified: boolean
//   createdAt: string
//   lastLogin?: string
//   _count?: {
//     eventsAttended: number
//     eventsOrganized: number
//     connections: number
//   }
// }

interface SettingsSectionProps {
  userData: UserData
  onUpdate: (data: Partial<UserData>) => void
}

export function SettingsSection({ userData, onUpdate }: SettingsSectionProps) {
  const { toast } = useToast()
  const [accountData, setAccountData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone || "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    profileVisibility: "public",
    connectionRequests: "everyone",
  })

  const handleAccountSave = () => {
    onUpdate(accountData)
    toast({
      title: "Success",
      description: "Account settings updated successfully!",
    })
  }

  const handlePreferencesSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Success",
      description: "Preferences updated successfully!",
    })
  }

  return (
    <div className="space-y-6">
      {/* <h1 className="text-3xl font-bold text-gray-900">Settings</h1> */}

      
        {/* Account Settings */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={accountData.firstName}
                onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={accountData.lastName}
                onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={accountData.email}
                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={accountData.phone}
                onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
              />
            </div>
            <Button onClick={handleAccountSave}>Save Changes</Button>
          </CardContent>
        </Card> */}

        {/* Privacy & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Notifications</CardTitle>
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
            </div>

            <Button onClick={handlePreferencesSave}>Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Button variant="outline">Enable 2FA</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Active Sessions</div>
                <div className="text-sm text-gray-600">Manage your active login sessions</div>
              </div>
              <Button variant="outline">View Sessions</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
              <div>
                <div className="font-medium text-red-600">Delete Account</div>
                <div className="text-sm text-gray-600">Permanently delete your account and data</div>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
     
    </div>
  )
}
