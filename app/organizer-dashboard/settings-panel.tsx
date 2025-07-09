"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrganizerData {
  name: string
  email: string
  phone: string
  website: string
}

interface SettingsPanelProps {
  organizerData: OrganizerData
}

export default function SettingsPanel({ organizerData }: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" defaultValue={organizerData.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-email">Email</Label>
              <Input id="org-email" type="email" defaultValue={organizerData.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-phone">Phone</Label>
              <Input id="org-phone" defaultValue={organizerData.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-website">Website</Label>
              <Input id="org-website" defaultValue={organizerData.website} />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Event Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Event Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-approve Registrations</div>
                <div className="text-sm text-gray-600">Automatically approve event registrations</div>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-600">Send email updates to attendees</div>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Public Profile</div>
                <div className="text-sm text-gray-600">Make your organizer profile public</div>
              </div>
              <Button variant="outline" size="sm">
                Public
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
