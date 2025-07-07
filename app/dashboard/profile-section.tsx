"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, MapPin, Phone, Mail, Globe } from "lucide-react"

interface ProfileSectionProps {
  userData: any
}

export function ProfileSection({ userData }: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">RS</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
            <p className="text-gray-600 mb-4">{userData.title}</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-semibold text-lg">{userData.followers}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div>
                <div className="font-semibold text-lg">{userData.following}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
              <div>
                <div className="font-semibold text-lg">{userData.eventsAttended}</div>
                <div className="text-sm text-gray-600">Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600">{userData.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-gray-600">{userData.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-gray-600">{userData.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Website</div>
                  <div className="text-gray-600">{userData.website}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Bio</div>
              <p className="text-gray-600">{userData.bio}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
