"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SuperAdminManagement from "./superadminmanagement"

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
  ChevronDown,
} from "lucide-react"

// Import all section components
import DashboardOverview from "./dashboard-overview"
import EventManagement from "./event-management"
import OrganizerManagement from "./organizer-management"
import ExhibitorManagement from "./exhibitor-management"
import SpeakerManagement from "./speaker-management"
import VenueManagement from "./venue-management"
import ContentManagement from "./content-management"
import SystemSettings from "./system-settings"
import SubAdminManagement from "./subadmin-management"
import { title } from "process"
import { CreateEventForm } from "./eventManagement/createEvent/create-event"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [activeSubSection, setActiveSubSection] = useState("")
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set(["dashboard"]))

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("superAdminToken")
    localStorage.removeItem("superAdmin")
    
    // Redirect to signin page
    router.push("/sign-in")
  }

  const toggleMenu = (menuId: string) => {
    const newOpenMenus = new Set(openMenus)
    if (newOpenMenus.has(menuId)) {
      newOpenMenus.delete(menuId)
    } else {
      newOpenMenus.add(menuId)
    }
    setOpenMenus(newOpenMenus)
  }

  const sidebarItems = [
    {
      title: "Dashboard Overview",
      icon: LayoutDashboard,
      id: "dashboard",
    },
    {
      title: "Events",
      icon: Calendar,
      id: "events",
      subItems: [
        { title: "All Events", id: "events-all" },
        { title: "Create New Event", id: "events-create" },
        { title: "Event Categories", id: "events-categories" },
        { title: "Bluk Data", id: "bulk-data" },
      ],
    },
    {
      title: "Organizer",
      icon: Users,
      id: "organizers",
      subItems: [
        { title: "All Organizers", id: "organizers-all" },
        { title: "Add Organizer", id: "organizers-add" },
        { title: "Followers", id: "organizers-connections" },
        {title: "Promotions", id: "promotions"},
        // { title: "Messages", id: "organizers-messages" },
        { title: "Venue Bookings", id: "organizers-bookings" },
        { title: "Event Feedback", id: "organizers-feedback" },
      ],
    },
    {
      title: "Exhibitor",
      icon: Building2,
      id: "exhibitors",
      subItems: [
        { title: "All Exhibitors", id: "exhibitors-all" },
        { title: "Add Exhibitor", id: "exhibitors-add" },
        // { title: "Events Participating", id: "exhibitors-events" },
        { title: "Promotions", id: "exhibitors-promotions" },
        { title: "Followers", id: "exhibitors-followers" },
        // { title: "Messages", id: "exhibitors-messages" },
        // { title: "Connections", id: "exhibitors-connections" },
        { title: "Appointments", id: "exhibitors-appointments" },
        { title: "Feedback", id: "exhibitors-feedback" },
      ],
    },
    {
      title: "Speaker",
      icon: Mic,
      id: "speakers",
      subItems: [
        { title: "All Speakers", id: "speakers-all" },
        { title: "Add Speaker", id: "speakers-add" },
        { title: "Followers", id: "speakers-followers" },
        // { title: "Messages", id: "speakers-messages" },
        // { title: "Connections", id: "speakers-connections" },
        { title: "Appointments", id: "speakers-appointments" },
        { title: "Feedback", id: "speakers-feedback" },
      ],
    },
    {
      title: "Venue",
      icon: MapPin,
      id: "venues",
      subItems: [
        { title: "All Venues", id: "venues-all" },
        { title: "Add Venue", id: "venues-add" },
        { title: "Events by Venue", id: "venues-events" },
        { title: "Booking Enquiries", id: "venues-bookings" },
        // { title: "Followers", id: "venues-followers" },
        { title: "Feedback", id: "venues-feedback" },
      ],
    },
    {
      title: "Visitor",
      icon: UserCircle,
      id: "visitors",
      subItems: [
        // { title: "All Visitors", id: "visitors-all" },
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
      title: "Content",
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
        // { title: "Traffic Sources", id: "reports-traffic" },
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
        // { title: "Access Control", id: "roles-access" },
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
      // Roles
      case "roles-superadmin":
        return <SuperAdminManagement />
      case "roles-subadmins":
        return <SubAdminManagement />

      // Events
      case "events-create":
        return <CreateEventForm />
      case "events-all":
        return <EventManagement />
      case "events-categories":
        return <div>Event Categories - Coming Soon</div>
      case "events-approvals":
        return <div>Event Approvals - Coming Soon</div>

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
      return <div>Visitor Management - Coming Soon</div>
    case "financial":
      return <div>Financial Management - Coming Soon</div>
    case "content":
      return <ContentManagement />
    case "marketing":
      return <div>Marketing Management - Coming Soon</div>
    case "reports":
      return <div>Reports & Analytics - Coming Soon</div>
    case "integrations":
      return <div>Integrations Management - Coming Soon</div>
    case "roles":
      return <SuperAdminManagement />
    case "settings":
      return <SystemSettings />
    case "support":
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

  const isMenuOpen = (menuId: string) => openMenus.has(menuId)
  const isActive = (id: string) => activeSection === id
  const isSubActive = (id: string) => activeSubSection === id

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 text-sm flex flex-col">
        {/* Sidebar Header */}
        {/* <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40&text=SA" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">Super Admin</div>
              <div className="text-sm text-gray-600">System Administrator</div>
            </div>
          </div>
        </div> */}

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.id} className="mb-1">
                  {item.subItems ? (
                    <div className="rounded-lg">
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isActive(item.id) 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isMenuOpen(item.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {isMenuOpen(item.id) && (
                        <div className="mt-1 ml-4 space-y-1 border-l border-gray-200 pl-2">
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => handleSubSectionClick(item.id, subItem.id)}
                              className={`w-full text-left p-2 rounded-lg transition-colors ${
                                isSubActive(subItem.id)
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <span className="text-sm">{subItem.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSectionClick(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive(item.id)
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  )}
                </div>
              ))}
              
              {/* Logout Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        {/* <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === activeSection)?.title || "Dashboard"}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeSubSection 
                  ? sidebarItems
                      .find(item => item.id === activeSection)
                      ?.subItems?.find(sub => sub.id === activeSubSection)?.title
                  : "System Overview"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header> */}

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}