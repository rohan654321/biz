// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import {
//   LayoutDashboard,
//   Calendar,
//   Plus,
//   Users,
//   BarChart3,
//   Crown,
//   MessageSquare,
//   Settings,
//   Bell,
//   DollarSign,
//   Megaphone,
//   User,
//   Loader2,
//   TrendingUp,
//   ChevronDown,
//   ChevronRight,
//   Badge,
//   Building,
//   Mic,
//   ClipboardList,
//   MessageCircle,
//   Menu,
//   X,
//   icons,
// } from "lucide-react"
// import { signOut } from "next-auth/react"
// import VisitorBadgeSettings from "./Visitor-Badge-Settings"
// // import ExhibitorsForEvent from "../ExhibitorsForEvent"
// import ExhibitorsEventWise from "./ExhibitorsEventWise"
// import ConferenceAgenda from "./ConferenceAgenda"
// import CreateConferenceAgenda from "./create-conference-agenda"
// import { ConnectionsSection } from "@/app/dashboard/connections-section"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// // Import all section components
// import DashboardOverview from "./dashboard-overview"
// import MyEvents from "./my-events"
// import CreateEvent from "./create-event"
// import AttendeesManagement from "./attendees-management"
// import AnalyticsDashboard from "./analytics-dashboard"
// import EventPromotion from "./event-promotion"
// import MessagesCenter from "./messages-center"
// import SettingsPanel from "./settings-panel"
// import MyPlan from "./my-plan"
// import OrganizerInfo from "./organizer-info"
// import RevenueManagement from "./revenue-management"
// import AddSpeaker from "./add-speaker"
// import AddExhibitor from "./add-exhibitor"
// import ExhibitorsManagement from "./exhibitors-management"
// import AddVenue from "./add-venue"
// import ActivePromotions from "./ActivePromotion"
// import { ExhibitorManualProfessional } from "./exhibitor-manual/exhibitor-manual"
// import SpeakerSessionsTable from "./SpeakerSessionsTable"
// import ExhibitorsForEvent from "./ExhibitorsForEvent"
// import FeedbackReplyManagement from "./FeedbackReplyManagement"
// import { HelpSupport } from "@/components/HelpSupport"

// interface OrganizerDashboardPageProps {
//   organizerId: string
// }

// interface OrganizerData {
//   id: string
//   name: string
//   email: string
//   phone: string
//   location: string
//   website: string
//   description: string
//   avatar: string
//   totalEvents: number
//   activeEvents: number
//   totalAttendees: number
//   totalRevenue: number
//   founded: string
//   company: string
//   teamSize: string
//   headquarters: string
//   specialties: string[]
//   achievements: string[]
//   certifications: string[]
// }

// interface Event {
//   id: number
//   title: string
//   description: string
//   date: string
//   startDate: string
//   endDate: string
//   location: string
//   status: string
//   attendees: number
//   registrations: number
//   revenue: number
//   type: string
//   maxAttendees?: number
//   isVirtual: boolean
//   bannerImage?: string
//   thumbnailImage?: string
//   isPublic: boolean
// }

// interface Attendee {
//   id: number
//   name: string
//   email: string
//   phone: string
//   company: string
//   avatar: string
//   event: string
//   eventDate: string
//   registrationDate: string
//   status: string
//   ticketType: string
//   quantity: number
//   totalAmount: number
// }

// export default function OrganizerDashboardPage({ organizerId }: OrganizerDashboardPageProps) {
//   const params = useParams()
//   const { toast } = useToast()
//   const [activeSection, setActiveSection] = useState("dashboard")
//   const [expandedGroups, setExpandedGroups] = useState<string[]>([])
//   const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null)
//   const [events, setEvents] = useState<Event[]>([])
//   const [attendees, setAttendees] = useState<Attendee[]>([])
//   const [analyticsData, setAnalyticsData] = useState<any>(null)
//   const [revenueData, setRevenueData] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   useEffect(() => {
//     const fetchOrganizerData = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(`/api/organizers/${organizerId}`)
//         if (!response.ok) throw new Error("Failed to fetch organizer data")
//         const data = await response.json()
//         setOrganizerData(data.organizer)
//       } catch (error) {
//         console.error("Error fetching organizer data:", error)
//         setError("Failed to load organizer data")
//         toast({
//           title: "Error",
//           description: "Failed to load organizer data",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (organizerId) {
//       fetchOrganizerData()
//     }
//   }, [organizerId, toast])

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch(`/api/organizers/${organizerId}/events`)
//         if (!response.ok) throw new Error("Failed to fetch events")
//         const data = await response.json()
//         setEvents(data.events)
//       } catch (error) {
//         console.error("Error fetching events:", error)
//       }
//     }

//     if (organizerId) {
//       fetchEvents()
//     }
//   }, [organizerId])

//   useEffect(() => {
//     const fetchAttendees = async () => {
//       try {
//         const response = await fetch(`/api/organizers/${organizerId}/attendees`)
//         if (!response.ok) throw new Error("Failed to fetch attendees")
//         const data = await response.json()
//         setAttendees(data.attendees)
//       } catch (error) {
//         console.error("Error fetching attendees:", error)
//       }
//     }

//     if (organizerId) {
//       fetchAttendees()
//     }
//   }, [organizerId])

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const response = await fetch(`/api/organizers/${organizerId}/analytics`)
//         if (!response.ok) throw new Error("Failed to fetch analytics")
//         const data = await response.json()
//         setAnalyticsData(data.analytics)
//       } catch (error) {
//         console.error("Error fetching analytics:", error)
//       }
//     }

//     if (organizerId) {
//       fetchAnalytics()
//     }
//   }, [organizerId])

//   useEffect(() => {
//     const fetchRevenue = async () => {
//       try {
//         const response = await fetch(`/api/organizers/${organizerId}/revenue`)
//         if (!response.ok) throw new Error("Failed to fetch revenue")
//         const data = await response.json()
//         setRevenueData(data.revenue)
//       } catch (error) {
//         console.error("Error fetching revenue:", error)
//       }
//     }

//     if (organizerId) {
//       fetchRevenue()
//     }
//   }, [organizerId])

//   const toggleGroup = (groupId: string) => {
//     setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
//   }

//   const PlaceholderPage = ({ title }: { title: string }) => (
//     <div className="flex items-center justify-center h-64">
//       <div className="text-center">
//         <h2 className="text-2xl font-semibold mb-4">{title}</h2>
//         <p className="text-gray-600">Page will update shortly</p>
//       </div>
//     </div>
//   )

//   const sidebarGroups = [
//     {
//       id: "main",
//       label: "Main",
//       items: [
//         {
//           title: "Dashboard",
//           icon: LayoutDashboard,
//           id: "dashboard",
//         },
//         {
//           title: "My Info",
//           icon: User,
//           id: "info",
//         },
//       ],
//     },
//     {
//       id: "event-management",
//       label: "Event Management",
//       items: [
//         {
//           title: "My Events",
//           icon: Calendar,
//           id: "events",
//         },
//         {
//           title: "Create Event",
//           icon: Plus,
//           id: "create-event",
//         },
//       ],
//     },
//     {
//       id: "lead-management",
//       label: "Lead Management",
//       items: [
//         {
//           title: "Attendees",
//           icon: Users,
//           id: "attendees",
//         },
//         {
//           title: "Visitor Badge Settings",
//           icon: Badge,
//           id: "visitor-badge-settings",
//         },
//         {
//           title: "Exhibitors",
//           icon: Building,
//           id: "exhibitors",
//         },
//       ],
//     },
//     {
//       id: "marketing-campaign",
//       label: "Marketing Campaign",
//       items: [
//         {
//           title: "Promotion",
//           icon: Megaphone,
//           id: "promotion",
//         },
//         {
//           title: "Active Promotion",
//           icon: TrendingUp,
//           id: "active-promotions",
//         },
//       ],
//     },
//     {
//       id: "exhibitor-management",
//       label: "Exhibitor Management",
//       items: [
//         {
//           title: "Total Exhibitors",
//           icon: Building,
//           id: "total-exhibitors",
//         },
//         {
//           title: "Exhibitors Event Wise",
//           icon: Calendar,
//           id: "exhibitors-event-wise",
//         },
//         {
//           title: "Add Exhibitor",
//           icon: Plus,
//           id: "exhibitor",
//         },
//         {
//           title: "Exhibitor Manual",
//           icon: ClipboardList,
//           id: "exhibitor-manual",
//         },
//       ],
//     },
//     {
//       id: "speaker-management",
//       label: "Speaker Management",
//       items: [
//         {
//           title: "Conference Agenda",
//           icon: ClipboardList,
//           id: "conference-agenda",
//         },
//         {
//           title: "Create Conference Agenda",
//           icon: Plus,
//           id: "create-conference-agenda",
//         },
//         {
//           title: "Speakers",
//           icon: Mic,
//           id: "speakers",
//         },
//         {
//           title: "Add Speaker",
//           icon: Plus,
//           id: "speaker",
//         },
//       ],
//     },
//     {
//       id: "feedback",
//       label: "Feedback",
//       items: [
//         {
//           title: "Feedback",
//           icon: MessageCircle,
//           id: "feedback",
//         },
//       ],
//     },
//     {
//       id: "other",
//       label: "Other",
//       items: [
//         {
//           title: "connections",
//           icon: MessageSquare,
//           id: "connections",
//         },
//         {
//           title: "Messages",
//           icon: MessageSquare,
//           id: "messages",
//         },
//         {
//           title: "Analytics",
//           icon: BarChart3,
//           id: "analytics",
//         },
//         {
//           title: "My Plan",
//           icon: Crown,
//           id: "my-plan",
//         },
 
        
//       ],
//     },
//             {
//       title: "Help & Support",
//       icon: MessageCircle, // or HelpCircle if you prefer
//       id: "help-support",  // ✅ consistent id
//     },
//         {
//           title: "Settings",
//           icon: Settings,
//           id: "settings",
//         },
//   ]

//   const dashboardStats = organizerData
//     ? [
//         {
//           title: "Total Events",
//           value: organizerData.totalEvents.toString(),
//           change: "+12%",
//           trend: "up" as const,
//           icon: Calendar,
//         },
//         {
//           title: "Active Events",
//           value: organizerData.activeEvents.toString(),
//           change: "+3",
//           trend: "up" as const,
//           icon: Calendar,
//         },
//         {
//           title: "Total Attendees",
//           value: `${(organizerData.totalAttendees / 1000).toFixed(1)}K`,
//           change: "+18%",
//           trend: "up" as const,
//           icon: Users,
//         },
//         {
//           title: "Revenue",
//           value: `₹${(organizerData.totalRevenue / 100000).toFixed(1)}L`,
//           change: "+25%",
//           trend: "up" as const,
//           icon: DollarSign,
//         },
//       ]
//     : []

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="w-8 h-8 animate-spin" />
//           <span className="ml-2">Loading...</span>
//         </div>
//       )
//     }

//     if (error || !organizerData) {
//       return (
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <p className="text-red-600 mb-4">{error || "Failed to load data"}</p>
//             <Button onClick={() => window.location.reload()}>Retry</Button>
//           </div>
//         </div>
//       )
//     }

//     switch (activeSection) {
//       case "dashboard":
//         return (
//           <DashboardOverview
//             organizerName={organizerData.name}
//             dashboardStats={dashboardStats}
//             recentEvents={events}
//             organizerId={organizerId}
//             onCreateEventClick={() => setActiveSection("create-event")}
//             onManageAttendeesClick={() => setActiveSection("attendees")}
//             onViewAnalyticsClick={() => setActiveSection("analytics")}
//             onSendMessageClick={() => setActiveSection("messages")}
//           />
//         )
//       case "info":
//         return <OrganizerInfo organizerData={organizerData} />
//       case "events":
//         return <MyEvents organizerId={organizerId} />
//       case "create-event":
//         return <CreateEvent organizerId={organizerId} />
//       case "active-promotions":
//         return <ActivePromotions organizerId={organizerId} />
//       case "addvenue":
//         return <AddVenue organizerId={organizerId} />
//       case "attendees":
//         return <AttendeesManagement organizerId={organizerId} />
//       case "exhibitors":
//         return <ExhibitorsManagement organizerId={organizerId} />
//       case "analytics":
//         return analyticsData ? (
//           <AnalyticsDashboard analyticsData={analyticsData} events={events} organizerId={organizerId} />
//         ) : (
//           <div className="flex items-center justify-center h-64">
//             <Loader2 className="w-8 h-8 animate-spin" />
//           </div>
//         )
//       case "revenue":
//         return revenueData ? (
//           <RevenueManagement revenueData={revenueData} />
//         ) : (
//           <div className="flex items-center justify-center h-64">
//             <Loader2 className="w-8 h-8 animate-spin" />
//           </div>
//         )
//       case "promotion":
//         return <EventPromotion organizerId={organizerId} />
//       case "speaker":
//         return <AddSpeaker organizerId={organizerId} />
//       case "exhibitor":
//         return <AddExhibitor organizerId={organizerId} />
//       case "my-plan":
//         return <MyPlan organizerId={organizerId} />
//       case "messages":
//         return <MessagesCenter organizerId={organizerId} />
//       case "settings":
//         return <SettingsPanel organizerData={organizerData} />
//       case "company-profile":
//         return <PlaceholderPage title="Company Profile" />
//       case "change-password":
//         return <PlaceholderPage title="Change Password" />
//       case "visitor-badge-settings":
//         return <VisitorBadgeSettings />
//       case "sponsors":
//         return <PlaceholderPage title="Sponsors" />
//       case "total-exhibitors":
//         return <ExhibitorsForEvent />
//       case "exhibitors-event-wise":
//         return <ExhibitorsEventWise />
//       case "exhibitor-manual":
//         return <ExhibitorManualProfessional organizerId={organizerId} />
//       case "conference-agenda":
//         return <ConferenceAgenda organizerId={organizerId} />
//       case "create-conference-agenda":
//         return (
//           <CreateConferenceAgenda
//             organizerId={organizerId}
//             onSuccess={() => setActiveSection("conference-agenda")}
//             onCancel={() => setActiveSection("conference-agenda")}
//           />
//         )
//       case "speakers":
//         return <SpeakerSessionsTable organizerId={organizerId} />
//       case "feedback":
//         return <FeedbackReplyManagement organizerId={organizerId} />
//       case "connections":
//         return <ConnectionsSection userId={organizerId} />
//         case "help-support":
//     return <HelpSupport /> 
//       default:
//         return <div>Select a section from the sidebar</div>
//     }
//   }

//   return (
//     <div className="flex min-h-screen w-full bg-gray-50">
//       {/* Mobile Sidebar Overlay */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//         fixed md:relative
//         w-64 min-h-screen bg-white border-r border-gray-200 z-50
//         transform transition-transform duration-300 ease-in-out
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         md:translate-x-0
//         flex flex-col
//       `}
//       >
//         {/* Sidebar Header */}
//         {/* <div className="border-b border-gray-200 p-4 flex-shrink-0">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src={organizerData?.avatar || "/placeholder.svg"} />
//                 <AvatarFallback>
//                   {organizerData?.name
//                     ?.split(" ")
//                     .map((n) => n[0])
//                     .join("") || "?"}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <div className="font-semibold text-sm">{organizerData?.company || "Loading..."}</div>
//                 <div className="text-xs text-gray-600">Event Organizer</div>
//               </div>
//             </div>
//             <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(false)}>
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </div> */}

//         {/* Sidebar Content */}
//         <div className="flex-1 overflow-y-auto p-4">
//           {sidebarGroups.map((group) => (
//             <div key={group.id} className="mb-4">
//               <div
//                 className="flex items-center justify-between cursor-pointer hover:bg-gray-100 px-2 py-2 rounded text-sm font-medium text-gray-700"
//                 onClick={() => toggleGroup(group.id)}
//               >
//                 <span>{group.label}</span>
//                 {expandedGroups.includes(group.id) ? (
//                   <ChevronDown className="w-4 h-4" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4" />
//                 )}
//               </div>
//               {expandedGroups.includes(group.id) && (
//                 <div className="mt-2 space-y-1">
//                   {group.items.map((item) => (
//                     <button
//                       key={item.id}
//                       onClick={() => {
//                         setActiveSection(item.id)
//                         setSidebarOpen(false)
//                       }}
//                       className={`
//                         w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
//                         ${
//                           activeSection === item.id
//                             ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
//                             : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                         }
//                       `}
//                     >
//                       <item.icon className="w-4 h-4 flex-shrink-0" />
//                       <span className="truncate">{item.title}</span>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Sidebar Footer */}
//         <div className="border-t border-gray-200 p-4 flex-shrink-0">
//           <Button
//             onClick={() => signOut({ callbackUrl: "/login" })}
//             className="w-full bg-red-600 hover:bg-red-700 text-white"
//           >
//             <User className="mr-2 h-4 w-4" />
//             <span>Logout</span>
//           </Button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-h-screen">
//         {/* Header */}
//         {/* <header className="bg-white border-b border-gray-200 px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
//                 <Menu className="w-5 h-5" />
//               </Button>
//               <h1 className="text-xl font-semibold text-gray-900">
//                 {sidebarGroups.flatMap((g) => g.items).find((item) => item.id === activeSection)?.title || "Dashboard"}
//               </h1>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="sm">
//                 <Bell className="w-4 h-4" />
//               </Button>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                     <Avatar className="w-8 h-8">
//                       <AvatarImage src={organizerData?.avatar || "/placeholder.svg"} />
//                       <AvatarFallback>
//                         {organizerData?.name
//                           ?.split(" ")
//                           .map((n) => n[0])
//                           .join("") || "?"}
//                       </AvatarFallback>
//                     </Avatar>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-56" align="end" forceMount>
//                   <DropdownMenuItem onClick={() => setActiveSection("info")}>
//                     <User className="mr-2 h-4 w-4" />
//                     <span>Company Profile</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setActiveSection("settings")}>
//                     <Settings className="mr-2 h-4 w-4" />
//                     <span>Change Password</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
//                     <User className="mr-2 h-4 w-4" />
//                     <span>Logout</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </header> */}

//         {/* Content */}
//         <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
//       </div>
//     </div>
//   )
// }
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
import VisitorBadgeSettings from "./Visitor-Badge-Settings"
import ExhibitorsEventWise from "./ExhibitorsEventWise"
import ConferenceAgenda from "./ConferenceAgenda"
import CreateConferenceAgenda from "./create-conference-agenda"
import { ConnectionsSection } from "@/app/dashboard/connections-section"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Import all section components
import DashboardOverview from "./dashboard-overview"
import MyEvents from "./my-events"
import CreateEvent from "./create-event"
import AttendeesManagement from "./attendees-management"
import AnalyticsDashboard from "./analytics-dashboard"
import EventPromotion from "./event-promotion"
import MessagesCenter from "./messages-center"
import SettingsPanel from "./settings-panel"
import MyPlan from "./my-plan"
import OrganizerInfo from "./organizer-info"
import RevenueManagement from "./revenue-management"
import AddSpeaker from "./add-speaker"
import AddExhibitor from "./add-exhibitor"
import ExhibitorsManagement from "./exhibitors-management"
import AddVenue from "./add-venue"
import ActivePromotions from "./ActivePromotion"
import { ExhibitorManualProfessional } from "./exhibitor-manual/exhibitor-manual"
import SpeakerSessionsTable from "./SpeakerSessionsTable"
import ExhibitorsForEvent from "./ExhibitorsForEvent"
import FeedbackReplyManagement from "./FeedbackReplyManagement"
import { HelpSupport } from "@/components/HelpSupport"

interface OrganizerDashboardPageProps {
  organizerId: string
}

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

export default function OrganizerDashboardPage({ organizerId }: OrganizerDashboardPageProps) {
  const params = useParams()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
          title: "My Info",
          icon: User,
          id: "info",
        },
      ],
    },
    {
      id: "event-management",
      label: "Event Management",
      items: [
        {
          title: "My Events",
          icon: Calendar,
          id: "events",
        },
        {
          title: "Create Event",
          icon: Plus,
          id: "create-event",
        },
      ],
    },
    {
      id: "lead-management",
      label: "Lead Management",
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
          title: "My Plan",
          icon: Crown,
          id: "my-plan",
        },
        {
          title: "Help & Support",
          icon: HelpCircle,
          id: "help-support",
        },
        {
          title: "Settings",
          icon: Settings,
          id: "settings",
        },
      ],
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
        return <AttendeesManagement organizerId={organizerId} />
      case "exhibitors":
        return <ExhibitorsManagement organizerId={organizerId} />
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
      case "my-plan":
        return <MyPlan organizerId={organizerId} />
      case "messages":
        return <MessagesCenter organizerId={organizerId} />
      case "settings":
        return <SettingsPanel organizerData={organizerData} />
      case "company-profile":
        return <PlaceholderPage title="Company Profile" />
      case "change-password":
        return <PlaceholderPage title="Change Password" />
      case "visitor-badge-settings":
        return <VisitorBadgeSettings />
      case "sponsors":
        return <PlaceholderPage title="Sponsors" />
      case "total-exhibitors":
        return <ExhibitorsForEvent />
      case "exhibitors-event-wise":
        return <ExhibitorsEventWise />
      case "exhibitor-manual":
        return <ExhibitorManualProfessional organizerId={organizerId} />
      case "conference-agenda":
        return <ConferenceAgenda organizerId={organizerId} />
      case "create-conference-agenda":
        return (
          <CreateConferenceAgenda
            organizerId={organizerId}
            onSuccess={() => setActiveSection("conference-agenda")}
            onCancel={() => setActiveSection("conference-agenda")}
          />
        )
      case "speakers":
        return <SpeakerSessionsTable organizerId={organizerId} />
      case "feedback":
        return <FeedbackReplyManagement organizerId={organizerId} />
      case "connections":
        return <ConnectionsSection userId={organizerId} />
      case "help-support":
        return <HelpSupport /> 
      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  // Find the current section title for the header
  const getCurrentSectionTitle = () => {
    for (const group of sidebarGroups) {
      const item = group.items.find(item => item.id === activeSection)
      if (item) return item.title
    }
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
        {/* <div className="border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={organizerData?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {organizerData?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">{organizerData?.company || "Loading..."}</div>
                <div className="text-xs text-gray-600">Event Organizer</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div> */}

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
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
        {/* Header */}
        {/* <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {getCurrentSectionTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={organizerData?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {organizerData?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => setActiveSection("info")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Company Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveSection("settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header> */}

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}