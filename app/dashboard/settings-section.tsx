"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SettingsSectionProps {
  userData: any
}

export function SettingsSection({ userData }: SettingsSectionProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={userData.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={userData.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue={userData.phone} />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Profile Visibility</div>
                <div className="text-sm text-gray-600">Who can see your profile</div>
              </div>
              <Button variant="outline" size="sm">
                Public
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-600">Receive event updates via email</div>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Connection Requests</div>
                <div className="text-sm text-gray-600">Who can send you connection requests</div>
              </div>
              <Button variant="outline" size="sm">
                Everyone
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Password & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Event Reminders</div>
                <div className="text-sm text-gray-600">Get notified about upcoming events</div>
              </div>
              <Button variant="outline" size="sm">
                On
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">New Messages</div>
                <div className="text-sm text-gray-600">Get notified about new messages</div>
              </div>
              <Button variant="outline" size="sm">
                On
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Connection Requests</div>
                <div className="text-sm text-gray-600">Get notified about new connection requests</div>
              </div>
              <Button variant="outline" size="sm">
                On
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
