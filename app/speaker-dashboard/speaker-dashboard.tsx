"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
// import { Building2, Calendar, MapPin, MessageSquare, Star, FileText, Bell, Settings } from "lucide-react"
import { User, Calendar, Upload, Share2, Users, Network, MessageSquare, Star, Bell, Settings, LogOut, Menu, X } from 'lucide-react'

// Import all section components
import { MyProfile } from "./my-profile"
import { MySessions } from "./my-sessions"
import { PresentationMaterials } from "./presentation-materials"
import { SessionPromotion } from "./session-promotion"
// import AudienceInteraction
import { OrganizerCommunication } from "./organizer-communication"
import { FeedbackRatings } from "./feedback-ratings"
import { SpeakerSettings } from "./speaker-settings"

export default function SpeakerDashboard() {
  const [activeSection, setActiveSection] = useState("venue-profile")

  // Mock venue data
  const venueData = {
    venueName: "Grand Convention Center",
    logo: "/placeholder.svg?height=120&width=120&text=GCC",
    contactPerson: "Priya Sharma",
    email: "priya@grandconvention.com",
    mobile: "+91 98765 43210",
    address: "123 Business District, Mumbai, Maharashtra 400001",
    website: "www.grandconvention.com",
    description: "Premier convention center in the heart of Mumbai with state-of-the-art facilities",
    maxCapacity: 5000,
    totalHalls: 8,
    totalEvents: 156,
    activeBookings: 12,
    averageRating: 4.7,
    totalReviews: 89,
  }

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "sessions", label: "My Sessions", icon: Calendar, badge: "3" },
    { id: "materials", label: "Presentation Materials", icon: Upload },
    // { id: "promotion", label: "Session Promotion", icon: Share2 },
    // { id: "interaction", label: "Audience Interaction", icon: Users },
    // { id: "networking", label: "Networking & Leads", icon: Network, badge: "89" },
    { id: "communication", label: "Messages", icon: MessageSquare, badge: "5" },
    { id: "feedback", label: "Feedback & Ratings", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ]


   const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <MyProfile />
      case "sessions":
        return <MySessions />
      case "materials":
        return <PresentationMaterials />
    //   case "promotion":
    //     return <SessionPromotion />
    //   case "interaction":
    //     return <AudienceInteraction />
    //   case "networking":
    //     return <NetworkingLeads />
      case "communication":
        return <OrganizerCommunication />
      case "feedback":
        return <FeedbackRatings />
      case "settings":
        return <SpeakerSettings />
      default:
        return <MyProfile />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={venueData.logo || "/placeholder.svg"} />
                <AvatarFallback>GCC</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{venueData.venueName}</div>
                <div className="text-sm text-gray-600">Speaker Manager</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Venue Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <Button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full bg-red-500 hover:bg-red-600 text-white my-10"
                  >
                    Logout
                  </Button>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={venueData.logo || "/placeholder.svg"} />
                <AvatarFallback>GCC</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
