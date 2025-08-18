"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  BarChart3,
  DollarSign,
  FileText,
  ImageIcon,
  Settings,
  Megaphone,
  MapPin,
} from "lucide-react"

// Import dashboard components
import DashboardOverview from "./dashboard-overview"
import UserManagement from "./user-management"
import EventManagement from "./event-management"
import OrganizerManagement from "./organizer-management"
import VenueManagement from "./venue-management"
import AnalyticsDashboard from "./analytics-dashboard"
import RevenueManagement from "./revenue-management"
import ReportsManagement from "./reports-management"
import ContentManagement from "./content-management"
import AdsManagement from "./ads-management"
import SystemSettings from "./system-settings"
import PromotionsManagement from "./promotions-management"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: Users },
  { id: "events", label: "Event Management", icon: Calendar },
  { id: "organizers", label: "Organizer Management", icon: Building2 },
  { id: "venues", label: "Venue Management", icon: MapPin },
  { id: "promotions", label: "Promotions", icon: Megaphone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "content", label: "Content Management", icon: ImageIcon },
  { id: "ads", label: "Ads Management", icon: ImageIcon },
  { id: "settings", label: "System Settings", icon: Settings },
]

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "users":
        return <UserManagement />
      case "events":
        return <EventManagement />
      case "organizers":
        return <OrganizerManagement />
      case "venues":
        return <VenueManagement />
      case "promotions":
        return <PromotionsManagement />
      case "analytics":
        return <AnalyticsDashboard />
      case "revenue":
        return <RevenueManagement />
      case "reports":
        return <ReportsManagement />
      case "content":
        return <ContentManagement />
      case "ads":
        return <AdsManagement />
      case "settings":
        return <SystemSettings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-gray-600 text-sm">Event Management System</p>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <div>
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${activeSection === item.id ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700"
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {item.id === "promotions" && <Badge className="ml-auto bg-green-100 text-green-800">New</Badge>}
                  {item.id === "venues" && <Badge className="ml-auto bg-blue-100 text-blue-800">Updated</Badge>}
                </button>

              </div>
            )
          })}
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-red-500 hover:bg-red-600 text-white my-10"
          >
            Logout
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  )
}
