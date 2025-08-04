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
import { Building2, Calendar, Package, Users, Clock, Megaphone, BarChart3, Bell } from "lucide-react"

// Import all section components
import CompanyInfo from "./company-info"
import EventParticipation from "./event-participation"
import ProductListing from "./product-listing"
import AppointmentScheduling from "./appointment-scheduling"
import PromotionsMarketing from "./promotions-marketing"
import LeadManagement from "./lead-management"
// import AnalyticsReports from "./analytics-reports"
import DashboardSettings from "./settings"

export default function ExhibitorDashboardPage() {
  const [activeSection, setActiveSection] = useState("company-info")

  // Mock exhibitor data
  const exhibitorData = {
    companyName: "TechCorp Solutions",
    logo: "/placeholder.svg?height=120&width=120&text=TC",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@techcorp.com",
    mobile: "+91 98765 43210",
    website: "www.techcorp.com",
    categories: ["Technology", "Software", "AI/ML"],
    description:
      "Leading technology solutions provider specializing in enterprise software and AI-powered applications.",
    totalEvents: 12,
    activeEvents: 3,
    totalLeads: 245,
    profileViews: 1850,
  }

  const sidebarItems = [
    {
      title: "Company Info",
      icon: Building2,
      id: "company-info",
    },
    {
      title: "Event Participation",
      icon: Calendar,
      id: "event-participation",
    },
    {
      title: "Product Listing",
      icon: Package,
      id: "product-listing",
    },
    {
      title: "Lead Management",
      icon: Users,
      id: "lead-management",
    },
    {
      title: "Appointments",
      icon: Clock,
      id: "appointments",
    },
    {
      title: "Promotions",
      icon: Megaphone,
      id: "promotions",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      id: "analytics",
    },
    {
      title: "Settings",
      icon: Bell,
      id: "settings",
    },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "company-info":
        return <CompanyInfo exhibitorData={exhibitorData} />
      case "event-participation":
        return <EventParticipation />
      case "product-listing":
        return <ProductListing />
      case "lead-management":
        return <LeadManagement />
      case "appointments":
        return <AppointmentScheduling />
      case "promotions":
        return <PromotionsMarketing />
    //   case "analytics":
    //     return <AnalyticsReports />
      case "settings":
        return <DashboardSettings exhibitorData={exhibitorData} />
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
                <AvatarImage src={exhibitorData.logo || "/placeholder.svg"} />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{exhibitorData.companyName}</div>
                <div className="text-sm text-gray-600">Exhibitor</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Exhibitor Dashboard</SidebarGroupLabel>
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
                <AvatarImage src={exhibitorData.logo || "/placeholder.svg"} />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
