"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
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
import { Building2, Calendar, MapPin, MessageSquare, Star, FileText, Bell, Settings, HelpCircle, ChevronDown, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Import all section components
import VenueProfile from "./venue-profile"
import EventManagement from "./event-management"
import BookingSystem from "./booking-system"
import CommunicationCenter from "./communication-center"
import RatingsReviews from "./ratings-reviews"
import LegalDocumentation from "./legal-documentation"
import VenueSettings from "./venue-settings"
import { promise } from "zod"
import { MeetingSpace } from "@prisma/client"
import { ConnectionsSection } from "../dashboard/connections-section"
import { HelpSupport } from "@/components/HelpSupport"
import FeedbackReplyManagement from "./feedback"

type VenueData = {
  id: string
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
  amenities: string[]
  meetingSpaces: MeetingSpace[]
}

interface UserDashboardProps {
  userId: string
}

export default function VenueDashboardPage({ userId }: UserDashboardProps) {
  const [activeSection, setActiveSection] = useState("venue-profile")
  const [venueData, setVenueData] = useState<VenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openMenus, setOpenMenus] = useState<string[]>(["venue-management"])
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Check if user can access this dashboard
    if (session?.user.id !== userId && session?.user.role !== "VENUE_MANAGER") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this dashboard.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    fetchVenueData()
  }, [userId, status, session, router, toast])

  const fetchVenueData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/venue-manager/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found")
        }
        if (response.status === 403) {
          throw new Error("Access denied")
        }
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
// Handle all possible backend response shapes
if (data.data) {
  setVenueData(data.data)
} else if (data.user?.venue) {
  setVenueData(data.user.venue)
} else if (data.venue) {
  setVenueData(data.venue)
} else if (data.user) {
  setVenueData(data.user)
} else {
  throw new Error("Invalid data structure in response")
}

    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err instanceof Error ? err.message : "An error occurred")

      if (err instanceof Error && (err.message === "Access denied" || err.message === "User not found")) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => (prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]))
  }

  // Helper function for menu item styling
  const menuItemClass = (sectionId: string) => {
    return `cursor-pointer pl-3 py-1 border-l-4 ${
      activeSection === sectionId 
        ? "border-blue-500 text-blue-600 font-medium" 
        : "border-transparent hover:text-blue-600"
    }`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchVenueData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!venueData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No venue data found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "venue-profile":
        return <VenueProfile venueData={venueData} />
      case "event-management":
        return <EventManagement />
      case "booking-system":
        return <BookingSystem />
      case "communication":
        return <CommunicationCenter params={{ id: userId }} />
      case "connection":
        return <ConnectionsSection userId={venueData.id} />
      case "ratings-reviews":
        return <FeedbackReplyManagement organizerId={venueData.id} />
      case "legal-documentation":
        return <LegalDocumentation venueId={venueData.id} />
      case "help-support":
        return <HelpSupport /> 
      case "settings":
        return <VenueSettings venueData={venueData} onUpdate={function (data: Partial<VenueData>): void {
          throw new Error("Function not implemented.")
        } } />
      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          {/* <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={venueData?.logo || "/placeholder.svg"} />
                <AvatarFallback>GCC</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{venueData?.venueName}</div>
                <div className="text-sm text-gray-600">Venue Manager</div>
              </div>
            </div>
          </SidebarHeader> */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Venue Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Venue Management Dropdown */}
                  <SidebarMenuItem>
                    <div className="w-full">
                      <button 
                        className="flex items-center justify-between w-full py-2 font-medium text-sm" 
                        onClick={() => toggleMenu("venue-management")}
                      >
                        <span className="flex items-center gap-2">
                          <Building2 size={16} />
                          Venue Management
                        </span>
                        {openMenus.includes("venue-management") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {openMenus.includes("venue-management") && (
                        <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
                          <li
                            onClick={() => setActiveSection("venue-profile")}
                            className={menuItemClass("venue-profile")}
                          >
                            Venue Profile
                          </li>
                          <li
                            onClick={() => setActiveSection("event-management")}
                            className={menuItemClass("event-management")}
                          >
                            Event Management
                          </li>
                          <li
                            onClick={() => setActiveSection("booking-system")}
                            className={menuItemClass("booking-system")}
                          >
                            Booking System
                          </li>
                        </ul>
                      )}
                    </div>
                  </SidebarMenuItem>

                  {/* Communication Dropdown */}
                  <SidebarMenuItem>
                    <div className="w-full">
                      <button 
                        className="flex items-center justify-between w-full py-2 font-medium text-sm" 
                        onClick={() => toggleMenu("communication")}
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare size={16} />
                          Communication
                        </span>
                        {openMenus.includes("communication") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {openMenus.includes("communication") && (
                        <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
                          <li
                            onClick={() => setActiveSection("communication")}
                            className={menuItemClass("communication")}
                          >
                            Messages
                          </li>
                          <li
                            onClick={() => setActiveSection("connection")}
                            className={menuItemClass("connection")}
                          >
                            Connections
                          </li>
                        </ul>
                      )}
                    </div>
                  </SidebarMenuItem>

                  {/* Reviews & Legal Dropdown */}
                  <SidebarMenuItem>
                    <div className="w-full">
                      <button 
                        className="flex items-center justify-between w-full py-2 font-medium text-sm" 
                        onClick={() => toggleMenu("reviews-legal")}
                      >
                        <span className="flex items-center gap-2">
                          <Star size={16} />
                          Reviews & Legal
                        </span>
                        {openMenus.includes("reviews-legal") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {openMenus.includes("reviews-legal") && (
                        <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
                          <li
                            onClick={() => setActiveSection("ratings-reviews")}
                            className={menuItemClass("ratings-reviews")}
                          >
                            Ratings & Reviews
                          </li>
                          <li
                            onClick={() => setActiveSection("legal-documentation")}
                            className={menuItemClass("legal-documentation")}
                          >
                            Legal & Documentation
                          </li>
                        </ul>
                      )}
                    </div>
                  </SidebarMenuItem>

                  {/* Help & Support (No Dropdown) */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("help-support")}
                      isActive={activeSection === "help-support"}
                      className="w-full justify-start"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help & Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Settings (No Dropdown) */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("settings")}
                      isActive={activeSection === "settings"}
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Logout Button */}
                  <SidebarMenuItem>
                    <Button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full bg-red-500 hover:bg-red-600 text-white mt-10"
                    >
                      Logout
                    </Button>
                  </SidebarMenuItem>
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
                <AvatarImage src={venueData?.logo || "/placeholder.svg"} />
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