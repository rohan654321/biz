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
import { Building2, Calendar, MapPin, MessageSquare, Star, FileText, Bell, Settings } from "lucide-react"
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
type MeetingSpace = {
  id: string
  name: string
  capacity: number
  amenities: string[]
}

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
    
    // Handle both possible response structures
    if (data.user && data.user.venue) {
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
      // venue-layout.tsx
return <CommunicationCenter params={{ id: userId }} />

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
                <AvatarImage src={venueData?.logo || "/placeholder.svg"} />
                <AvatarFallback>GCC</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{venueData?.venueName}</div>
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