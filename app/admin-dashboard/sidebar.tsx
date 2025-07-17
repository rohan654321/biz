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
import { Bell } from "lucide-react"
import {
  Shield,
  Users,
  Calendar,
  Building2,
  BarChart3,
  DollarSign,
  FileText,
  Settings,
  Database,
  Megaphone,
} from "lucide-react"
// import { Button } from "@/components/ui/button"

// Import all dashboard components
import DashboardOverview from "./dashboard-overview"
import UserManagement from "./user-management"
import EventManagement from "./event-management"
import OrganizerManagement from "./organizer-management"
import AnalyticsDashboard from "./analytics-dashboard"
import RevenueManagement from "./revenue-management"
import ReportsManagement from "./reports-management"
import ContentManagement from "./content-management"
import AdsManagement from "./ads-management"
import SystemSettings from "./system-settings"

interface AdminDashboardProps {
  adminData?: {
    name: string
    email: string
    role: string
    avatar?: string
  }
}

export default function AdminDashboard({ adminData }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")

  const defaultAdminData = {
    name: "Admin User",
    email: "admin@bztradefairs.com",
    role: "Super Administrator",
    avatar: "/placeholder.svg?height=120&width=120&text=Admin",
  }

  const admin = adminData || defaultAdminData

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: Shield,
      id: "dashboard",
    },
    {
      title: "User Management",
      icon: Users,
      id: "users",
    },
    {
      title: "Event Management",
      icon: Calendar,
      id: "events",
    },
    {
      title: "Organizers",
      icon: Building2,
      id: "organizers",
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
      title: "Reports",
      icon: FileText,
      id: "reports",
    },
    // {
    //   title: "Content Management",
    //   icon: Database,
    //   id: "content",
    // },
    {
      title: "Ads Management",
      icon: Megaphone,
      id: "ads",
    },
    {
      title: "System Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "users":
        return <UserManagement />
      // case "events":
      //   return <EventManagement />
      // case "organizers":
      //   return <OrganizerManagement />
      // case "analytics":
      //   return <AnalyticsDashboard />
      // case "revenue":
      //   return <RevenueManagement />
      // case "reports":
      //   return <ReportsManagement />
    //   case "content":
    //     return <ContentManagement />
      // case "ads":
      //   return <AdsManagement />
      // case "settings":
      //   return <SystemSettings />
    //   default:
    //     return <DashboardOverview />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-red-600 text-white">SA</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{admin.name}</div>
                <div className="text-sm text-gray-600">{admin.role}</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Super Admin Panel</SidebarGroupLabel>
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
                    className="w-full bg-red-500 hover:bg-red-600 text-white mt-20"
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
                <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-red-600 text-white">SA</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
