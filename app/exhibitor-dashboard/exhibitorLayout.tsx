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
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

import CompanyInfo from "./company-info"
import EventParticipation from "./event-participation"
import ProductListing from "./product-listing"
import LeadManagement from "./lead-management"
import AppointmentScheduling from "./appointment-scheduling"
import AnalyticsReports from "./analytics-reports"
// import PromotionsMarketing from "./promotions-marketing"
import ExhibitorSettings from "./settings"

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
  // const { data: session } = useSession()
  const [exhibitor, setExhibitor] = useState<ExhibitorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Check if user can access this dashboard
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
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found")
        }
        if (response.status === 403) {
          throw new Error("Access denied")
        }
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setExhibitor(data.user)
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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "company", label: "Company Info", icon: Building2 },
    { id: "events", label: "Events", icon: Calendar },
    { id: "products", label: "Products", icon: Package },
    { id: "leads", label: "Leads", icon: Users },
    { id: "messages", label: "messages", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "promotions", label: "Promotions", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ]

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={exhibitor.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {exhibitor.firstName[0]}
                {exhibitor.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">
                {exhibitor.firstName} {exhibitor.lastName}
              </h2>
              <p className="text-sm text-gray-500">{exhibitor.jobTitle || "Exhibitor"}</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full bg-red-500 hover:bg-red-600 text-white my-10"
            >
              Logout
            </Button>
          </ul>
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
                    <div className="text-2xl font-bold">{exhibitor.activeEvents}</div>
                    <p className="text-xs text-muted-foreground">of {exhibitor.totalEvents} total events</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{exhibitor.totalProducts}</div>
                    <p className="text-xs text-muted-foreground">{exhibitor.profileViews} total views</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{exhibitor.totalLeads}</div>
                    <p className="text-xs text-muted-foreground">{exhibitor.pendingLeads} pending follow-up</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{exhibitor.upcomingAppointments}</div>
                    <p className="text-xs text-muted-foreground">upcoming this week</p>
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
          {activeTab === "messages" && <MessagesCenter organizerId={exhibitor.id}  />}
          {activeTab === "leads" && <LeadManagement exhibitorId={exhibitor.id} />}
          {activeTab === "appointments" && <AppointmentScheduling exhibitorId={exhibitor.id} />}
          {activeTab === "analytics" && <AnalyticsReports exhibitorId={exhibitor.id} />}
          {activeTab === "promotions" && <EventPromotion organizerId={exhibitor.id} />}
          {activeTab === "settings" && <ExhibitorSettings exhibitorId={exhibitor.id} />}
        </div>
      </div>
    </div>
  )
}
