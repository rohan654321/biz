"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import MessagesCenter from "@/app/organizer-dashboard/messages-center"
import EventPromotion from "@/app/organizer-dashboard/event-promotion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Calendar,
  Users,
  TrendingUp,
  Package,
  Settings,
  BarChart3,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Twitter,
  Briefcase,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

import CompanyInfo from "./company-info"
import EventParticipation from "./event-participation"
import ProductListing from "./product-listing"
import LeadManagement from "./lead-management"
import AppointmentScheduling from "./appointment-scheduling"
import AnalyticsReports from "./analytics-reports"
import PromotionsMarketing from "./promotions-marketing"
import ExhibitorSettings from "./settings"
import { ConnectionsSection } from "@/app/dashboard/connections-section"
import { HelpSupport } from "@/components/HelpSupport"
import { FollowManagement } from "./follow-management"
import { ActiveEventsCard } from "./TotalExhibitorEvent"
import { FollowersCountCard } from "./FollowersCountCard"
import { AppointmentsCountCard } from "./AppointmentsCountCard"
import ActivePromotions from "./active-promotion"

interface ExhibitorData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  website?: string
  twitter?: string
  location?: string
  jobTitle?: string
  totalEvents: number
  activeEvents: number
  totalProducts: number
  totalLeads: number
  pendingLeads: number
  profileViews: number
  upcomingAppointments: number
}

interface UserDashboardProps {
  userId: string
}

export function ExhibitorLayout({ userId }: UserDashboardProps) {
  const [exhibitor, setExhibitor] = useState<ExhibitorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [appointmentCount, setAppointmentCount] = useState<number>(0)
  const [openMenus, setOpenMenus] = useState<string[]>(["main"])

  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (session?.user.id !== userId && session?.user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this dashboard.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    fetchExhibitorData()
  }, [userId, status, session, router, toast])

  const fetchExhibitorData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        if (response.status === 404) throw new Error("User not found")
        if (response.status === 403) throw new Error("Access denied")
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setExhibitor(data.user)
      setAppointmentCount(Number(data.user.upcomingAppointments) || 0)
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

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => (prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]))
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
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
            <Button onClick={fetchExhibitorData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!exhibitor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No exhibitor data found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleUpdate = async (updates: Partial<any>) => {
    try {
      const res = await fetch(`/api/exhibitors/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      const data = await res.json()

      if (data.success) {
        setExhibitor((prev: any) => ({ ...prev, ...updates }))
      }
    } catch (error) {
      console.error("Error updating exhibitor:", error)
    }
  }

  // Helper function for menu item styling
  const menuItemClass = (tabId: string) => {
    return `cursor-pointer pl-3 py-1 border-l-4 ${
      activeTab === tabId 
        ? "border-blue-500 text-blue-600 font-medium" 
        : "border-transparent hover:text-blue-600"
    }`
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <nav className="p-4 text-sm space-y-2">
          {/* Main Dropdown */}
          <div>
            <button 
              className="flex items-center justify-between w-full py-2 font-medium" 
              onClick={() => toggleMenu("main")}
            >
              <span className="flex items-center gap-2">
                <BarChart3 size={16} />
                Main
              </span>
              {openMenus.includes("main") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {openMenus.includes("main") && (
              <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
                <li
                  onClick={() => handleTabClick("overview")}
                  className={menuItemClass("overview")}
                >
                  Overview
                </li>
                <li
                  onClick={() => handleTabClick("company")}
                  className={menuItemClass("company")}
                >
                  Company
                </li>
              </ul>
            )}
          </div>

          {/* Lead Management Dropdown */}
          <div>
            <button 
              className="flex items-center justify-between w-full py-2 font-medium" 
              onClick={() => toggleMenu("leadManagement")}
            >
              <span className="flex items-center gap-2">
                <Users size={16} />
                Lead Management
              </span>
              {openMenus.includes("leadManagement") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {openMenus.includes("leadManagement") && (
              <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
                <li
                  onClick={() => handleTabClick("events")}
                  className={menuItemClass("events")}
                >
                  Events
                </li>
                <li
                  onClick={() => handleTabClick("products")}
                  className={menuItemClass("products")}
                >
                  Products
                </li>
              </ul>
            )}
          </div>

          {/* Marketing Campaigns Dropdown */}
          <div>
            <button 
              className="flex items-center justify-between w-full py-2 font-medium" 
              onClick={() => toggleMenu("marketingCampaigns")}
            >
              <span className="flex items-center gap-2">
                <Star size={16} />
                Marketing Campaigns
              </span>
              {openMenus.includes("marketingCampaigns") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {openMenus.includes("marketingCampaigns") && (
              <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
                <li
                  onClick={() => handleTabClick("promotions")}
                  className={menuItemClass("promotions")}
                >
                  Promotion
                </li>
                <li
                  onClick={() => handleTabClick("active-promotions")}
                  className={menuItemClass("active-promotions")}
                >
                  Active Promotion
                </li>
              </ul>
            )}
          </div>

          {/* Analytics Dropdown */}
          <div>
            <button 
              className="flex items-center justify-between w-full py-2 font-medium" 
              onClick={() => toggleMenu("analytics")}
            >
              <span className="flex items-center gap-2">
                <TrendingUp size={16} />
                Analytics
              </span>
              {openMenus.includes("analytics") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {openMenus.includes("analytics") && (
              <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
                <li
                  onClick={() => handleTabClick("analytics")}
                  className={menuItemClass("analytics")}
                >
                  Analytics
                </li>
              </ul>
            )}
          </div>

          {/* Network Dropdown */}
          <div>
            <button 
              className="flex items-center justify-between w-full py-2 font-medium" 
              onClick={() => toggleMenu("network")}
            >
              <span className="flex items-center gap-2">
                <Users size={16} />
                Network
              </span>
              {openMenus.includes("network") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {openMenus.includes("network") && (
              <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
                <li
                  onClick={() => handleTabClick("follow")}
                  className={menuItemClass("follow")}
                >
                  Follow
                </li>
                <li
                  onClick={() => handleTabClick("messages")}
                  className={menuItemClass("messages")}
                >
                  Messages
                </li>
                <li
                  onClick={() => handleTabClick("connection")}
                  className={menuItemClass("connection")}
                >
                  Connection
                </li>
                <li
                  onClick={() => handleTabClick("appointments")}
                  className={menuItemClass("appointments")}
                >
                  Appointments
                </li>
              </ul>
            )}
          </div>

          {/* Help & Support (No Dropdown) */}
          <div>
            <button
              onClick={() => handleTabClick("help")}
              className={`flex items-center gap-2 w-full py-2 font-medium ${
                activeTab === "help" ? "text-blue-600 font-medium" : "hover:text-blue-600"
              }`}
            >
              <HelpCircle size={16} />
              Help & Support
            </button>
          </div>

          {/* Settings (No Dropdown) */}
          <div>
            <button
              onClick={() => handleTabClick("settings")}
              className={`flex items-center gap-2 w-full py-2 font-medium ${
                activeTab === "settings" ? "text-blue-600 font-medium" : "hover:text-blue-600"
              }`}
            >
              <Settings size={16} />
              Settings
            </button>
          </div>

          {/* Logout Button */}
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-red-500 hover:bg-red-600 text-white mt-10"
          >
            Logout
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Exhibitor Dashboard</h1>
                <p className="text-gray-600">Welcome back, {exhibitor.firstName}!</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <ActiveEventsCard exhibitorId={exhibitor.id} />
                    <p className="text-xs text-muted-foreground">Active Events</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{exhibitor.totalProducts || 25}</div>
                    <p className="text-xs text-muted-foreground">{exhibitor.profileViews || 30} total views</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <FollowersCountCard exhibitorId={exhibitor.id} />
                    <p className="text-xs text-muted-foreground">Total Leads</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <AppointmentsCountCard exhibitorId={exhibitor.id} />
                    <p className="text-xs text-muted-foreground">Total Appointments</p>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={exhibitor.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {exhibitor.firstName[0]}
                        {exhibitor.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {exhibitor.firstName} {exhibitor.lastName}
                      </h3>
                      {exhibitor.jobTitle && (
                        <p className="text-gray-600 flex items-center mt-1">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {exhibitor.jobTitle}
                        </p>
                      )}
                      {exhibitor.location && (
                        <p className="text-gray-600 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          {exhibitor.location}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        {exhibitor.email && (
                          <a
                            href={`mailto:${exhibitor.email}`}
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </a>
                        )}
                        {exhibitor.phone && (
                          <a
                            href={`tel:${exhibitor.phone}`}
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </a>
                        )}
                        {exhibitor.website && (
                          <a
                            href={exhibitor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Globe className="h-4 w-4 mr-1" />
                            Website
                          </a>
                        )}
                        {exhibitor.twitter && (
                          <a
                            href={`https://twitter.com/${exhibitor.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Twitter className="h-4 w-4 mr-1" />
                            Twitter
                          </a>
                        )}
                      </div>
                      {exhibitor.bio && <p className="text-gray-700 mt-3">{exhibitor.bio}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "company" && <CompanyInfo exhibitorId={exhibitor.id} onUpdate={handleUpdate} exhibitorData={exhibitor} />}
          {activeTab === "events" && <EventParticipation exhibitorId={exhibitor.id} />}
          {activeTab === "products" && <ProductListing exhibitorId={exhibitor.id} />}
          {activeTab === "messages" && <MessagesCenter organizerId={exhibitor.id} />}
          {activeTab === "connection" && <ConnectionsSection userId={exhibitor.id} />}
          {activeTab === "follow" && <FollowManagement userId={exhibitor.id} />}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Add any appointment stats cards here if needed */}
              </div>
              <AppointmentScheduling
                exhibitorId={exhibitor.id}
                onCountChange={setAppointmentCount}
              />
            </div>
          )}
          {activeTab === "analytics" && <AnalyticsReports exhibitorId={exhibitor.id} />}
          {activeTab === "promotions" && <PromotionsMarketing exhibitorId={exhibitor.id} />}
          {activeTab === "active-promotions" && <ActivePromotions exhibitorId={exhibitor.id} />}
          {activeTab === "help" && <HelpSupport />}
          {activeTab === "settings" && <ExhibitorSettings exhibitorId={exhibitor.id} />}
        </div>
      </div>
    </div>
  )
}