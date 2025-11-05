"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SuperAdminManagement from "./superadminmanagement"

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  Mic,
  MapPin,
  UserCircle,
  DollarSign,
  FileText,
  Megaphone,
  BarChart3,
  Plug,
  Shield,
  Settings,
  HelpCircle,
  Bell,
  ChevronRight,
  LogOut,
} from "lucide-react"

// Import all section components
import DashboardOverview from "./dashboard-overview"
import EventManagement from "./event-management"
import OrganizerManagement from "./organizer-management"
import ExhibitorManagement from "./exhibitor-management"
import SpeakerManagement from "./speaker-management"
import VenueManagement from "./venue-management"
// import VisitorManagement from "./visitor-management"
// import FinancialManagement from "./financial-management"
import ContentManagement from "./content-management"
// import MarketingManagement from "./marketing-management"
// import ReportsAnalytics from "./reports-analytics"
// import IntegrationsManagement from "./integrations-management"
// import RolesPermissions from "./roles-permissions"
import SystemSettings from "./system-settings"
import SubAdminManagement from "./subadmin-management"
// import HelpSupport from "./help-support"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [activeSubSection, setActiveSubSection] = useState("")

  const sidebarItems = [
    {
      title: "Dashboard Overview",
      icon: LayoutDashboard,
      id: "dashboard",
    },
    {
      title: "Events Management",
      icon: Calendar,
      id: "events",
      subItems: [
        { title: "All Events", id: "events-all" },
        { title: "Create New Event", id: "events-create" },
        { title: "Event Categories", id: "events-categories" },
        { title: "Event Approvals", id: "events-approvals" },
      ],
    },
    {
      title: "Organizer Management",
      icon: Users,
      id: "organizers",
      subItems: [
        { title: "All Organizers", id: "organizers-all" },
        { title: "Add Organizer", id: "organizers-add" },
        { title: "Connections", id: "organizers-connections" },
        { title: "Messages", id: "organizers-messages" },
        { title: "Venue Bookings", id: "organizers-bookings" },
        { title: "Event Feedback", id: "organizers-feedback" },
      ],
    },
    {
      title: "Exhibitor Management",
      icon: Building2,
      id: "exhibitors",
      subItems: [
        { title: "All Exhibitors", id: "exhibitors-all" },
        { title: "Add Exhibitor", id: "exhibitors-add" },
        { title: "Events Participating", id: "exhibitors-events" },
        { title: "Promotions", id: "exhibitors-promotions" },
        { title: "Followers", id: "exhibitors-followers" },
        { title: "Messages", id: "exhibitors-messages" },
        { title: "Connections", id: "exhibitors-connections" },
        { title: "Appointments", id: "exhibitors-appointments" },
        { title: "Feedback", id: "exhibitors-feedback" },
      ],
    },
    {
      title: "Speaker Management",
      icon: Mic,
      id: "speakers",
      subItems: [
        { title: "All Speakers", id: "speakers-all" },
        { title: "Add Speaker", id: "speakers-add" },
        { title: "Followers", id: "speakers-followers" },
        { title: "Messages", id: "speakers-messages" },
        { title: "Connections", id: "speakers-connections" },
        { title: "Appointments", id: "speakers-appointments" },
        { title: "Feedback", id: "speakers-feedback" },
      ],
    },
    {
      title: "Venue Management",
      icon: MapPin,
      id: "venues",
      subItems: [
        { title: "All Venues", id: "venues-all" },
        { title: "Add Venue", id: "venues-add" },
        { title: "Events by Venue", id: "venues-events" },
        { title: "Booking Enquiries", id: "venues-bookings" },
        { title: "Followers", id: "venues-followers" },
        { title: "Feedback", id: "venues-feedback" },
      ],
    },
    {
      title: "Visitor Management",
      icon: UserCircle,
      id: "visitors",
      subItems: [
        { title: "All Visitors", id: "visitors-all" },
        { title: "Events by Visitor", id: "visitors-events" },
        { title: "Connections", id: "visitors-connections" },
        { title: "Appointments", id: "visitors-appointments" },
      ],
    },
    {
      title: "Financial & Transactions",
      icon: DollarSign,
      id: "financial",
      subItems: [
        { title: "Payments Dashboard", id: "financial-payments" },
        { title: "Subscriptions & Plans", id: "financial-subscriptions" },
        { title: "Invoices & Receipts", id: "financial-invoices" },
        { title: "Transaction History", id: "financial-transactions" },
      ],
    },
    {
      title: "Content Management",
      icon: FileText,
      id: "content",
      subItems: [
        { title: "News & Announcements", id: "content-news" },
        { title: "Blog & Articles", id: "content-blog" },
        { title: "Banner & Ads Manager", id: "content-banners" },
        { title: "Featured Events", id: "content-featured" },
        { title: "Media Library", id: "content-media" },
      ],
    },
    {
      title: "Marketing & Communication",
      icon: Megaphone,
      id: "marketing",
      subItems: [
        { title: "Email Campaigns", id: "marketing-email" },
        { title: "Push Notifications", id: "marketing-notifications" },
        { title: "Traffic Analytics", id: "marketing-traffic" },
        { title: "SEO & Keywords", id: "marketing-seo" },
      ],
    },
    {
      title: "Reports & Analytics",
      icon: BarChart3,
      id: "reports",
      subItems: [
        { title: "Event Performance", id: "reports-events" },
        { title: "User Engagement", id: "reports-engagement" },
        { title: "Revenue Reports", id: "reports-revenue" },
        { title: "Traffic Sources", id: "reports-traffic" },
        { title: "System Health", id: "reports-system" },
      ],
    },
    {
      title: "Integrations",
      icon: Plug,
      id: "integrations",
      subItems: [
        { title: "Payment Gateways", id: "integrations-payment" },
        { title: "Email/SMS Providers", id: "integrations-communication" },
        { title: "Calendar & API", id: "integrations-calendar" },
        { title: "Hotel & Travel Partners", id: "integrations-travel" },
      ],
    },
    {
      title: "User Roles & Permissions",
      icon: Shield,
      id: "roles",
      subItems: [
        { title: "Super Admin", id: "roles-superadmin" },
        { title: "Sub Admins", id: "roles-subadmins" },
        { title: "Access Control", id: "roles-access" },
      ],
    },
    {
      title: "Settings & Configuration",
      icon: Settings,
      id: "settings",
      subItems: [
        { title: "Module Management", id: "settings-modules" },
        { title: "Notifications", id: "settings-notifications" },
        { title: "Security", id: "settings-security" },
        { title: "Language & Localization", id: "settings-language" },
        { title: "Backup & Restore", id: "settings-backup" },
      ],
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      id: "support",
      subItems: [
        { title: "Support Tickets", id: "support-tickets" },
        { title: "Contact Logs", id: "support-contacts" },
        { title: "Admin Notes", id: "support-notes" },
      ],
    },
  ]

  const renderContent = () => {
    const section = activeSection
    const subSection = activeSubSection

    // Handle sub-sections first
if (subSection) {
  switch (subSection) {
    case "roles-superadmin":
      return <SuperAdminManagement />
    case "roles-subadmins":
      return <SubAdminManagement />
    default:
      break
  }
}


    // Handle main sections
    switch (section) {
      case "dashboard":
        return <DashboardOverview />
      case "events":
        return <EventManagement />
      case "organizers":
        return <OrganizerManagement />
      case "exhibitors":
        return <ExhibitorManagement />
      case "speakers":
        return <SpeakerManagement />
      case "venues":
        return <VenueManagement />
      case "visitors":
        // return <VisitorManagement />
        return <div>Visitor Management - Coming Soon</div>
      case "financial":
        // return <FinancialManagement />
        return <div>Financial Management - Coming Soon</div>
      case "content":
        return <ContentManagement />
      case "marketing":
        // return <MarketingManagement />
        return <div>Marketing Management - Coming Soon</div>
      case "reports":
        // return <ReportsAnalytics />
        return <div>Reports & Analytics - Coming Soon</div>
      case "integrations":
        // return <IntegrationsManagement />
        return <div>Integrations Management - Coming Soon</div>
     case "roles":
  return <SuperAdminManagement />

      case "settings":
        return <SystemSettings />
      case "support":
        // return <HelpSupport />
        return <div>Help & Support - Coming Soon</div>
      default:
        return <DashboardOverview />
    }
  }

  const handleSectionClick = (id: string) => {
    setActiveSection(id)
    setActiveSubSection("")
  }

  const handleSubSectionClick = (parentId: string, subId: string) => {
    setActiveSection(parentId)
    setActiveSubSection(subId)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40&text=SA" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Super Admin</div>
                <div className="text-sm text-gray-600">System Administrator</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <Collapsible key={item.id} asChild defaultOpen={activeSection.startsWith(item.id)}>
                      <SidebarMenuItem>
                        {item.subItems ? (
                          <>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                onClick={() => handleSectionClick(item.id)}
                                isActive={activeSection.startsWith(item.id)}
                                className="w-full justify-start"
                              >
                                <item.icon className="w-4 h-4" />
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.subItems.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.id}>
                                    <SidebarMenuSubButton
                                      onClick={() => handleSubSectionClick(item.id, subItem.id)}
                                      isActive={activeSubSection === subItem.id}
                                    >
                                      <span>{subItem.title}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </>
                        ) : (
                          <SidebarMenuButton
                            onClick={() => handleSectionClick(item.id)}
                            isActive={activeSection === item.id}
                            className="w-full justify-start"
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    </Collapsible>
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
                <AvatarImage src="/placeholder.svg?height=32&width=32&text=SA" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}