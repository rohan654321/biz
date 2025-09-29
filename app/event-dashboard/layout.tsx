"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  ChevronDown,
  ChevronRight,
  Badge,
  Building,
  Mic,
  ClipboardList,
  MessageCircle,
  Menu,
  X,
  HelpCircle,
} from "lucide-react"
import { signOut } from "next-auth/react"
import ConferenceAgenda from "@/app/organizer-dashboard/ConferenceAgenda"
import CreateConferenceAgenda from "@/app/organizer-dashboard/create-conference-agenda"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DashboardOverview from "@/app/organizer-dashboard/dashboard-overview"
import MyEvents from "@/app/organizer-dashboard/my-events"
import AttendeesManagement from "@/app/organizer-dashboard/attendees-management"
import AnalyticsDashboard from "@/app/organizer-dashboard/analytics-dashboard"
import EventPromotion from "@/app/organizer-dashboard/event-promotion"
import MessagesCenter from "@/app/organizer-dashboard/messages-center"
import MyPlan from "@/app/organizer-dashboard/my-plan"
import OrganizerInfo from "@/app/organizer-dashboard/organizer-info"
import AddSpeaker from "@/app/organizer-dashboard/add-speaker"
import AddExhibitor from "@/app/organizer-dashboard/add-exhibitor"
import ExhibitorsManagement from "@/app/organizer-dashboard/exhibitors-management"
import AddVenue from "@/app/organizer-dashboard/add-venue"
import ActivePromotions from "@/app/organizer-dashboard/ActivePromotion"
import { ExhibitorManualProfessional } from "@/app/organizer-dashboard/exhibitor-manual/exhibitor-manual"
import FeedbackReplyManagement from "@/app/organizer-dashboard/FeedbackReplyManagement"

interface EventDashboardPageProps {
  params: Promise<{
    eventId: string
  }>
}

interface EventData {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  status: string
  maxAttendees?: number
  isVirtual: boolean
  bannerImage?: string
  thumbnailImage?: string
  isPublic: boolean
  organizer: {
    id: string
    name: string
    email: string
    phone: string
    location: string
    website: string
    description: string
    avatar: string
    company: string
    teamSize: string
    headquarters: string
    specialties: string[]
    achievements: string[]
    certifications: string[]
  }
  totalAttendees: number
  totalRevenue: number
  activePromotions: number
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

interface SidebarGroup {
  id: string
  label: string
  items: SidebarItem[]
}

interface SidebarItem {
  title: string
  icon: React.ComponentType<any>
  id: string
}

export default function EventDashboardPage({ params }: EventDashboardPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ eventId: string } | null>(null)
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Resolve the params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    
    resolveParams()
  }, [params])

  const eventId = resolvedParams?.eventId

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/events/${eventId}`)
        if (!response.ok) throw new Error("Failed to fetch event data")
        const data = await response.json()
        setEventData(data.event)
      } catch (error) {
        console.error("Error fetching event data:", error)
        setError("Failed to load event data")
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [eventId, toast])

  useEffect(() => {
    const fetchEventAttendees = async () => {
      if (!eventId) return

      try {
        const response = await fetch(`/api/events/${eventId}/attendees`)
        if (!response.ok) throw new Error("Failed to fetch attendees")
        const data = await response.json()
        setAttendees(data.attendees)
      } catch (error) {
        console.error("Error fetching attendees:", error)
      }
    }

    fetchEventAttendees()
  }, [eventId])

  useEffect(() => {
    const fetchEventAnalytics = async () => {
      if (!eventId) return

      try {
        const response = await fetch(`/api/events/${eventId}/analytics`)
        if (!response.ok) throw new Error("Failed to fetch analytics")
        const data = await response.json()
        setAnalyticsData(data.analytics)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      }
    }

    fetchEventAnalytics()
  }, [eventId])

  useEffect(() => {
    const fetchEventRevenue = async () => {
      if (!eventId) return

      try {
        const response = await fetch(`/api/events/${eventId}/revenue`)
        if (!response.ok) throw new Error("Failed to fetch revenue")
        const data = await response.json()
        setRevenueData(data.revenue)
      } catch (error) {
        console.error("Error fetching revenue:", error)
      }
    }

    fetchEventRevenue()
  }, [eventId])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600">Page will update shortly</p>
      </div>
    </div>
  )

  const sidebarGroups: SidebarGroup[] = [
    {
      id: "main",
      label: "Main",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          id: "dashboard",
        },
        {
          title: "Event Info",
          icon: Calendar,
          id: "info",
        },
      ],
    },
    {
      id: "event-management",
      label: "Event Management",
      items: [
        {
          title: "Event Settings",
          icon: Settings,
          id: "event-settings",
        },
        {
          title: "Edit Event",
          icon: Plus,
          id: "edit-event",
        },
      ],
    },
    {
      id: "lead-management",
      label: "Attendee Management",
      items: [
        {
          title: "Attendees",
          icon: Users,
          id: "attendees",
        },
        {
          title: "Visitor Badge Settings",
          icon: Badge,
          id: "visitor-badge-settings",
        },
        {
          title: "Exhibitors",
          icon: Building,
          id: "exhibitors",
        },
      ],
    },
    {
      id: "marketing-campaign",
      label: "Marketing Campaign",
      items: [
        {
          title: "Promotion",
          icon: Megaphone,
          id: "promotion",
        },
        {
          title: "Active Promotion",
          icon: TrendingUp,
          id: "active-promotions",
        },
      ],
    },
    {
      id: "exhibitor-management",
      label: "Exhibitor Management",
      items: [
        {
          title: "Total Exhibitors",
          icon: Building,
          id: "total-exhibitors",
        },
        {
          title: "Exhibitors Event Wise",
          icon: Calendar,
          id: "exhibitors-event-wise",
        },
        {
          title: "Add Exhibitor",
          icon: Plus,
          id: "exhibitor",
        },
        {
          title: "Exhibitor Manual",
          icon: ClipboardList,
          id: "exhibitor-manual",
        },
      ],
    },
    {
      id: "speaker-management",
      label: "Speaker Management",
      items: [
        {
          title: "Conference Agenda",
          icon: ClipboardList,
          id: "conference-agenda",
        },
        {
          title: "Create Conference Agenda",
          icon: Plus,
          id: "create-conference-agenda",
        },
        {
          title: "Speakers",
          icon: Mic,
          id: "speakers",
        },
        {
          title: "Add Speaker",
          icon: Plus,
          id: "speaker",
        },
      ],
    },
    {
      id: "feedback",
      label: "Feedback",
      items: [
        {
          title: "Feedback",
          icon: MessageCircle,
          id: "feedback",
        },
      ],
    },
    {
      id: "other",
      label: "Other",
      items: [
        {
          title: "Connections",
          icon: MessageSquare,
          id: "connections",
        },
        {
          title: "Messages",
          icon: MessageSquare,
          id: "messages",
        },
        {
          title: "Analytics",
          icon: BarChart3,
          id: "analytics",
        },
        {
          title: "Event Plan",
          icon: Crown,
          id: "event-plan",
        },
      ],
    },
  ]

  // Separate sidebar items that should be outside of groups
  const individualSidebarItems: SidebarItem[] = [
    {
      title: "Help & Support",
      icon: HelpCircle,
      id: "help-support",
    },
    {
      title: "Organizer Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  const dashboardStats = eventData
    ? [
        {
          title: "Total Attendees",
          value: `${eventData.totalAttendees}`,
          change: "+18%",
          trend: "up" as const,
          icon: Users,
        },
        {
          title: "Active Promotions",
          value: eventData.activePromotions.toString(),
          change: "+3",
          trend: "up" as const,
          icon: Megaphone,
        },
        {
          title: "Revenue",
          value: `₹${eventData.totalRevenue}`,
          change: "+25%",
          trend: "up" as const,
          icon: DollarSign,
        },
        {
          title: "Days Remaining",
          value: `${Math.ceil((new Date(eventData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}`,
          change: "",
          trend: "up" as const,
          icon: Calendar,
        },
      ]
    : []

  const renderContent = () => {
    if (!eventId) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading event...</span>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      )
    }

    if (error || !eventData) {
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
        // return (
        //   <DashboardOverview
        //     eventName={eventData.title}
        //     dashboardStats={dashboardStats}
        //     eventData={eventData}
        //     eventId={eventId}
        //     onEditEventClick={() => setActiveSection("edit-event")}
        //     onManageAttendeesClick={() => setActiveSection("attendees")}
        //     onViewAnalyticsClick={() => setActiveSection("analytics")}
        //     onSendMessageClick={() => setActiveSection("messages")}
        //   />
        // )
      case "info":
        return <div>Event Info: {eventData.title}</div>
      case "event-settings":
        return <div>Event Settings for {eventData.title}</div>
      case "edit-event":
        return <div>Edit Event: {eventData.title}</div>
      case "active-promotions":
        // return <ActivePromotions eventId={eventId} />
      case "addvenue":
        // return <AddVenue eventId={eventId} />
      case "attendees":
        // return <AttendeesManagement eventId={eventId} />
      case "exhibitors":
        // return <ExhibitorsManagement eventId={eventId} />
      case "analytics":
        // return analyticsData ? (
        //   <AnalyticsDashboard analyticsData={analyticsData} eventId={eventId} />
        // ) : (
        //   <div className="flex items-center justify-center h-64">
        //     <Loader2 className="w-8 h-8 animate-spin" />
        //   </div>
        // )
      case "revenue":
        return revenueData ? (
          <div>Revenue Management Component</div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )
      case "promotion":
        // return <EventPromotion eventId={eventId} />
      case "speaker":
        // return <AddSpeaker eventId={eventId} />
      case "exhibitor":
        // return <AddExhibitor eventId={eventId} />
      case "event-plan":
        // return <MyPlan eventId={eventId} />
      case "messages":
        // return <MessagesCenter eventId={eventId} />
      case "settings":
        return eventData.organizer ? <div>Settings Panel</div> : <div>Organizer data not available</div>
      case "visitor-badge-settings":
        return <div>Visitor Badge Settings</div>
      case "total-exhibitors":
        return <div>Total Exhibitors</div>
      case "exhibitors-event-wise":
        return <div>Exhibitors Event Wise</div>
      case "exhibitor-manual":
        // return <ExhibitorManualProfessional eventId={eventId} />
      case "speakers":
        return <div>Speaker Sessions Table</div>
      case "feedback":
        // return <FeedbackReplyManagement eventId={eventId} />
      case "connections":
        return <div>Connections Section</div>
      case "help-support":
        return <div>Help & Support</div>
      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  // Find the current section title for the header
  const getCurrentSectionTitle = () => {
    // Check in grouped items first
    for (const group of sidebarGroups) {
      const item = group.items.find(item => item.id === activeSection)
      if (item) return item.title
    }
    // Check in individual items
    const individualItem = individualSidebarItems.find(item => item.id === activeSection)
    if (individualItem) return individualItem.title
    
    return "Dashboard"
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative
        w-64 min-h-screen bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        flex flex-col
      `}
      >
        {/* Sidebar Header */}
        <div className="border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={eventData?.thumbnailImage || "/placeholder.svg"} />
                <AvatarFallback>
                  {eventData?.title
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "E"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm truncate max-w-[120px]">{eventData?.title || "Loading..."}</div>
                <div className="text-xs text-gray-600">Event Dashboard</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Grouped Items */}
          {sidebarGroups.map((group) => (
            <div key={group.id} className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-100 px-2 py-2 rounded text-sm font-medium text-gray-700"
                onClick={() => toggleGroup(group.id)}
              >
                <span>{group.label}</span>
                {expandedGroups.includes(group.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
              {expandedGroups.includes(group.id) && (
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
                        ${
                          activeSection === item.id
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Individual Items (outside of groups) */}
          <div className="mt-8 space-y-1">
            {individualSidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
                  ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}