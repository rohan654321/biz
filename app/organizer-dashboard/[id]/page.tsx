"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
import { useToast } from "@/hooks/use-toast"
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Users,
  BarChart3,
  Crown,
  MessageSquare,
  Settings,
  Bell,
  DollarSign,
  Megaphone,
  User,
  Loader2,
  TrendingUp,
} from "lucide-react"
import { signOut } from "next-auth/react"
// Import all section components
import DashboardOverview from "../dashboard-overview"
import MyEvents from "../my-events"
import CreateEvent from "../create-event"
import AttendeesManagement from "../attendees-management"
import AnalyticsDashboard from "../analytics-dashboard"
import EventPromotion from "../event-promotion"
import MessagesCenter from "../messages-center"
import SettingsPanel from "../settings-panel"
import MyPlan from "../my-plan"
import OrganizerInfo from "../organizer-info"
import RevenueManagement from "../revenue-management"
import AddSpeaker from "../add-speaker"
import AddExhibitor from "../add-exhibitor"
// import BookVenue from "../book-venue"
import AddVenue from "../add-venue"
import ActivePromotions from "../ActivePromotion"

interface OrganizerData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  website: string
  description: string
  avatar: string
  totalEvents: number
  activeEvents: number
  totalAttendees: number
  totalRevenue: number
  founded: string
  company: string
  teamSize: string
  headquarters: string
  specialties: string[]
  achievements: string[]
  certifications: string[]
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  startDate: string
  endDate: string
  location: string
  status: string
  attendees: number
  registrations: number
  revenue: number
  type: string
  maxAttendees?: number
  isVirtual: boolean
  bannerImage?: string
  thumbnailImage?: string
  isPublic: boolean
}

interface Attendee {
  id: number
  name: string
  email: string
  phone: string
  company: string
  avatar: string
  event: string
  eventDate: string
  registrationDate: string
  status: string
  ticketType: string
  quantity: number
  totalAmount: number
}

export default function OrganizerDashboardPage() {
  const params = useParams()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const organizerId = params.id as string

  // Fetch organizer data
  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/organizers/${organizerId}`)
        if (!response.ok) throw new Error("Failed to fetch organizer data")
        const data = await response.json()
        setOrganizerData(data.organizer)
      } catch (error) {
        console.error("Error fetching organizer data:", error)
        setError("Failed to load organizer data")
        toast({
          title: "Error",
          description: "Failed to load organizer data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (organizerId) {
      fetchOrganizerData()
    }
  }, [organizerId, toast])

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/organizers/${organizerId}/events`)
        if (!response.ok) throw new Error("Failed to fetch events")
        const data = await response.json()
        setEvents(data.events)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    if (organizerId) {
      fetchEvents()
    }
  }, [organizerId])

  // Fetch attendees data
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch(`/api/organizers/${organizerId}/attendees`)
        if (!response.ok) throw new Error("Failed to fetch attendees")
        const data = await response.json()
        setAttendees(data.attendees)
      } catch (error) {
        console.error("Error fetching attendees:", error)
      }
    }

    if (organizerId) {
      fetchAttendees()
    }
  }, [organizerId])

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/organizers/${organizerId}/analytics`)
        if (!response.ok) throw new Error("Failed to fetch analytics")
        const data = await response.json()
        setAnalyticsData(data.analytics)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      }
    }

    if (organizerId) {
      fetchAnalytics()
    }
  }, [organizerId])

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch(`/api/organizers/${organizerId}/revenue`)
        if (!response.ok) throw new Error("Failed to fetch revenue")
        const data = await response.json()
        setRevenueData(data.revenue)
      } catch (error) {
        console.error("Error fetching revenue:", error)
      }
    }

    if (organizerId) {
      fetchRevenue()
    }
  }, [organizerId])

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      id: "dashboard",
    },
    {
      title: "My Info",
      icon: User,
      id: "info",
    },
    {
      title: "My Events",
      icon: Calendar,
      id: "events",
    },
    {
      title: "Active Promotions",
      icon: TrendingUp, // or Megaphone if you prefer
      id: "active-promotions",
    },
    {
      title: "Create Event",
      icon: Plus,
      id: "create-event",
    },
    {
      title: "Attendees",
      icon: Users,
      id: "attendees",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      id: "analytics",
    },
    {
      title: "Revenue",
      icon: DollarSign,
      id: "revenue",
    },
    {
      title: "Promotion",
      icon: Megaphone,
      id: "promotion",
    },
    {
      title: "My Plan",
      icon: Crown,
      id: "my-plan",
    },
    {
      title: "Add speaker",
      icon: Users,
      id: "speaker",
    },
    {
      title: "Add exhibitor",
      icon: Users,
      id: "exhibitor",
    },
    // {
    //   title:"book venue",
    //   icon: Users,
    //   id: "venue",
    // },
    {
      title: "add venue",
      icon: Users,
      id: "addvenue",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      id: "messages",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  const dashboardStats = organizerData
    ? [
        {
          title: "Total Events",
          value: organizerData.totalEvents.toString(),
          change: "+12%",
          trend: "up" as const,
          icon: Calendar,
        },
        {
          title: "Active Events",
          value: organizerData.activeEvents.toString(),
          change: "+3",
          trend: "up" as const,
          icon: Calendar,
        },
        {
          title: "Total Attendees",
          value: `${(organizerData.totalAttendees / 1000).toFixed(1)}K`,
          change: "+18%",
          trend: "up" as const,
          icon: Users,
        },
        {
          title: "Revenue",
          value: `₹${(organizerData.totalRevenue / 100000).toFixed(1)}L`,
          change: "+25%",
          trend: "up" as const,
          icon: DollarSign,
        },
      ]
    : []

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      )
    }

    if (error || !organizerData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Failed to load data"}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      )
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardOverview
            organizerName={organizerData.name}
            dashboardStats={dashboardStats}
            recentEvents={events}
            organizerId={organizerId}
            onCreateEventClick={() => setActiveSection("create-event")}
            onManageAttendeesClick={() => setActiveSection("attendees")}
            onViewAnalyticsClick={() => setActiveSection("analytics")}
            onSendMessageClick={() => setActiveSection("messages")}
          />
        )
      case "info":
        return <OrganizerInfo organizerData={organizerData} />
      case "events":
        return <MyEvents organizerId={organizerId} />
      case "create-event":
        return <CreateEvent organizerId={organizerId} />
      case "active-promotions":
        return <ActivePromotions organizerId={organizerId} />
      case "addvenue":
        return <AddVenue organizerId={organizerId} />
      case "attendees":
        return (
          <AttendeesManagement
            attendees={attendees}
            onSendMessageClick={(): void => {
              throw new Error("Function not implemented.")
            }}
          />
        )
      case "analytics":
        return analyticsData ? (
          <AnalyticsDashboard analyticsData={analyticsData} events={events} organizerId={organizerId} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )
      case "revenue":
        return revenueData ? (
          <RevenueManagement revenueData={revenueData} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )
      case "promotion":
        return <EventPromotion organizerId={organizerId} />
      case "speaker":
        return <AddSpeaker organizerId={organizerId} />
      case "exhibitor":
        return <AddExhibitor organizerId={organizerId} />
      // case "venue":
      //   return <BookVenue organizerId={organizerId} />
      case "my-plan":
        return <MyPlan organizerId={organizerId} />
      case "messages":
        return <MessagesCenter organizerId={organizerId} />
      case "settings":
        return <SettingsPanel organizerData={organizerData} />

      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  if (error || !organizerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Failed to load organizer data"}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={organizerData.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {organizerData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{organizerData.company}</div>
                <div className="text-sm text-gray-600">Event Organizer</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Organizer Dashboard</SidebarGroupLabel>
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
                <AvatarImage src={organizerData.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {organizerData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
