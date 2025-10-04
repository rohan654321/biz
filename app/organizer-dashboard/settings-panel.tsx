"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Building, Mail, Phone, Globe, Calendar, Users, Bell } from "lucide-react"

interface OrganizerData {
  name: string
  email: string
  phone: string
  website: string
}

interface SettingsPanelProps {
  organizerData: OrganizerData
  onUpdate: (data: Partial<OrganizerData>) => void
}

export default function SettingsPanel({ organizerData, onUpdate }: SettingsPanelProps) {
  const { toast } = useToast()
  const [organizationData, setOrganizationData] = useState({
    name: organizerData.name,
    email: organizerData.email,
    phone: organizerData.phone,
    website: organizerData.website,
  })

  const [eventSettings, setEventSettings] = useState({
    autoApproveRegistrations: true,
    emailNotifications: true,
    publicProfile: true,
    registrationApproval: "auto",
    attendeeCommunication: "all",
    eventVisibility: "public",
  })

  const handleOrganizationSave = () => {
    onUpdate(organizationData)
    toast({
      title: "Success",
      description: "Organization details updated successfully!",
    })
  }

  const handleEventSettingsSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Success",
      description: "Event settings updated successfully!",
    })
  }

  const handleOrganizationChange = (field: string, value: string) => {
    setOrganizationData({
      ...organizationData,
      [field]: value,
    })
  }

  const handleEventSettingChange = (field: string, value: boolean | string) => {
    setEventSettings({
      ...eventSettings,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      {/* Organization Details */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Organization Name
            </Label>
            <Input
              id="org-name"
              value={organizationData.name}
              onChange={(e) => handleOrganizationChange("name", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="org-email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="org-email"
              type="email"
              value={organizationData.email}
              onChange={(e) => handleOrganizationChange("email", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="org-phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </Label>
            <Input
              id="org-phone"
              value={organizationData.phone}
              onChange={(e) => handleOrganizationChange("phone", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="org-website" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </Label>
            <Input
              id="org-website"
              value={organizationData.website}
              onChange={(e) => handleOrganizationChange("website", e.target.value)}
            />
          </div>
          
          <Button onClick={handleOrganizationSave}>Save Changes</Button>
        </CardContent>
      </Card> */}

      {/* Event Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-approve Registrations</div>
                <div className="text-sm text-gray-600">Automatically approve event registrations</div>
              </div>
              <Switch
                checked={eventSettings.autoApproveRegistrations}
                onCheckedChange={(checked) => handleEventSettingChange("autoApproveRegistrations", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-600">Send email updates to attendees</div>
              </div>
              <Switch
                checked={eventSettings.emailNotifications}
                onCheckedChange={(checked) => handleEventSettingChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Public Profile</div>
                <div className="text-sm text-gray-600">Make your organizer profile public</div>
              </div>
              <Switch
                checked={eventSettings.publicProfile}
                onCheckedChange={(checked) => handleEventSettingChange("publicProfile", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Registration Approval
              </Label>
              <Select
                value={eventSettings.registrationApproval}
                onValueChange={(value) => handleEventSettingChange("registrationApproval", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-approve all registrations</SelectItem>
                  <SelectItem value="manual">Manual approval required</SelectItem>
                  <SelectItem value="payment">Auto-approve after payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Attendee Communication
              </Label>
              <Select
                value={eventSettings.attendeeCommunication}
                onValueChange={(value) => handleEventSettingChange("attendeeCommunication", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All notifications</SelectItem>
                  <SelectItem value="important">Important updates only</SelectItem>
                  <SelectItem value="none">No automated messages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Event Visibility
              </Label>
              <Select
                value={eventSettings.eventVisibility}
                onValueChange={(value) => handleEventSettingChange("eventVisibility", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Listed in directories</SelectItem>
                  <SelectItem value="unlisted">Unlisted - Access via link only</SelectItem>
                  <SelectItem value="private">Private - By invitation only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleEventSettingsSave}>Save Event Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}