"use client"

import { useState } from "react"
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
import { Building2, Calendar, MapPin, MessageSquare, Star, FileText, Bell, Settings } from "lucide-react"

// Import all section components
import VenueProfile from "./venue-profile"
import EventManagement from "./event-management"
import BookingSystem from "./booking-system"
import CommunicationCenter from "./communication-center"
import RatingsReviews from "./ratings-reviews"
import LegalDocumentation from "./legal-documentation"
import VenueSettings from "./venue-settings"

export default function VenueDashboardPage() {
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

  const sidebarItems = [
    {
      title: "Venue Profile",
      icon: Building2,
      id: "venue-profile",
    },
    {
      title: "Event Management",
      icon: Calendar,
      id: "event-management",
    },
    {
      title: "Booking System",
      icon: MapPin,
      id: "booking-system",
    },
    {
      title: "Communication",
      icon: MessageSquare,
      id: "communication",
    },
    {
      title: "Ratings & Reviews",
      icon: Star,
      id: "ratings-reviews",
    },
    {
      title: "Legal & Docs",
      icon: FileText,
      id: "legal-documentation",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "venue-profile":
        return <VenueProfile venueData={venueData} />
      case "event-management":
        return <EventManagement />
      case "booking-system":
        return <BookingSystem />
      case "communication":
        return <CommunicationCenter />
      case "ratings-reviews":
        return <RatingsReviews />
      case "legal-documentation":
        return <LegalDocumentation />
      case "settings":
        return <VenueSettings venueData={venueData} />
      default:
        return <div>Select a section from the sidebar</div>
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
                <div className="text-sm text-gray-600">Venue Manager</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Venue Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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
