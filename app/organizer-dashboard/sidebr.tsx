"use client"

import { signOut } from "next-auth/react"
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
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Users,
  BarChart3,
//   DollarSign,
  MessageSquare,
  Settings,
  Bell,
} from "lucide-react"

// Import all section components
import DashboardOverview from "./dashboard-overview"
import MyEvents from "./my-events"
import CreateEvent from "./create-event"
import Image from "next/image"
import AttendeesManagement from "./attendees-management"
// import AnalyticsDashboard from "./analytics-dashboard"
import RevenueManagement from "./revenue-management"
import MessagesCenter from "./messages-center"
import SettingsPanel from "./settings-panel"

export default function OrganizerDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Mock organizer data
  const organizerData = {
    name: "EventCorp India",
    email: "contact@eventcorp.in",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    website: "www.eventcorp.in",
    description:
      "Professional Event Management Company specializing in trade shows, conferences, and corporate events.",
    avatar: "/placeholder.svg?height=120&width=120&text=EC",
    totalEvents: 45,
    activeEvents: 8,
    totalAttendees: 12500,
    totalRevenue: 2850000,
  }

  // Mock dashboard stats
  const dashboardStats = [
    {
      title: "Total Events",
      value: "45",
      change: "+12%",
      trend: "up" as const,
      icon: Calendar,
    },
    {
      title: "Active Events",
      value: "8",
      change: "+3",
      trend: "up" as const,
      icon: Calendar,
    },
    {
      title: "Total Attendees",
      value: "12.5K",
      change: "+18%",
      trend: "up" as const,
      icon: Users,
    },
    // {
    //   title: "Revenue",
    //   value: "₹28.5L",
    //   change: "+25%",
    //   trend: "up" as const,
    //   icon: DollarSign,
    // },
  ]

  // Mock events data
  const myEvents = [
    {
      id: 1,
      title: "Global Precision Expo 2025",
      date: "June 11-13, 2025",
      location: "Chennai Trade Centre",
      status: "Active",
      attendees: 2500,
      registrations: 2800,
      type: "Exhibition",
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      date: "July 20-22, 2025",
      location: "Mumbai Convention Center",
      status: "Planning",
      attendees: 1200,
      registrations: 1500,
      type: "Conference",
    },
    {
      id: 3,
      title: "Healthcare Expo 2025",
      date: "August 15-17, 2025",
      location: "Delhi Exhibition Center",
      status: "Draft",
      attendees: 0,
      registrations: 0,
      type: "Exhibition",
    },
  ]

  // Mock attendees data
  const attendeesData = [
    {
      id: 1,
      name: "Ramesh Sharma",
      email: "ramesh@company.com",
      event: "Global Precision Expo 2025",
      registrationDate: "2024-12-15",
      status: "Confirmed",
      ticketType: "VIP",
      avatar: "/placeholder.svg?height=40&width=40&text=RS",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@techsolutions.com",
      event: "Tech Innovation Summit",
      registrationDate: "2024-12-20",
      status: "Pending",
      ticketType: "General",
      avatar: "/placeholder.svg?height=40&width=40&text=PP",
    },
    {
      id: 3,
      name: "Arjun Reddy",
      email: "arjun@healthcare.in",
      event: "Healthcare Expo 2025",
      registrationDate: "2024-12-22",
      status: "Confirmed",
      ticketType: "Student",
      avatar: "/placeholder.svg?height=40&width=40&text=AR",
    },
  ]

  // Mock analytics data
  const analyticsData = {
    registrationData: [
      { month: "Jan", registrations: 120 },
      { month: "Feb", registrations: 180 },
      { month: "Mar", registrations: 250 },
      { month: "Apr", registrations: 320 },
      { month: "May", registrations: 280 },
      { month: "Jun", registrations: 450 },
    ],
    eventTypeData: [
      { name: "Exhibitions", value: 45, color: "#3B82F6" },
      { name: "Conferences", value: 30, color: "#10B981" },
      { name: "Workshops", value: 15, color: "#F59E0B" },
      { name: "Seminars", value: 10, color: "#EF4444" },
    ],
  }

  // Mock revenue data
  const revenueData = {
    revenueData: [
      { month: "Jan", revenue: 85000 },
      { month: "Feb", revenue: 125000 },
      { month: "Mar", revenue: 180000 },
      { month: "Apr", revenue: 220000 },
      { month: "May", revenue: 195000 },
      { month: "Jun", revenue: 285000 },
    ],
    totalRevenue: "₹28.5L",
    monthlyRevenue: "₹4.2L",
    averagePerEvent: "₹6.3L",
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      id: "dashboard",
    },
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
    // {
    //   title: "Revenue",
    //   icon: DollarSign,
    //   id: "revenue",
    // },
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

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardOverview
            organizerName={organizerData.name}
            dashboardStats={dashboardStats}
            recentEvents={myEvents}
          />
        )
      case "events":
        return <MyEvents events={myEvents} />
      case "create-event":
        return <CreateEvent />
      case "attendees":
        return <AttendeesManagement attendees={attendeesData} />
      // case "analytics":
      //   return <AnalyticsDashboard analyticsData={analyticsData} />
      // case "revenue":
      //   return <RevenueManagement revenueData={revenueData} />
      case "messages":
        return <MessagesCenter />
      case "settings":
        return <SettingsPanel organizerData={organizerData} />
      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  return (
    <SidebarProvider >
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r w-64 shrink-0">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              {/* <Avatar className="w-10 h-10">
                <AvatarImage src={organizerData.avatar || "/placeholder.svg"} />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar> */}
              <div>
                {/* <div className="font-semibold">{organizerData.name}</div> */}
                {/* <div className="text-sm text-gray-600">Event Organizer</div> */}
                <Image
                  src="/logo/logo.png"
                  alt="Organizer Avatar"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
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
                </SidebarMenu>
                <Button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full bg-red-500 hover:bg-red-600 text-white mt-20 "
                >
                  Logout
                </Button>
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
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
