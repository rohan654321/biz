"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ConnectionsSection } from "@/app/dashboard/connections-section"
import {
  Building2,
  Package,
  FileText,
  UserPlus,
  MessageSquare,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  User,
  Menu,
  X
} from "lucide-react"

import MyProfile from "./my-profile"
import MySessions from "./my-sessions"
import { PresentationMaterials } from "./presentation-materials"
import MessagesCenter from "@/app/organizer-dashboard/messages-center"
import { SpeakerSettings } from "./speaker-settings"
import { HelpSupport } from "@/components/HelpSupport"
import { useDashboard } from "@/contexts/dashboard-context"

interface SpeakerData {
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
  totalSessions: number
  profileViews: number
}

interface UserDashboardProps {
  userId: string
}

export function SpeakerDashboard({ userId }: UserDashboardProps) {
  const [speaker, setSpeaker] = useState<SpeakerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { activeSection, setActiveSection } = useDashboard()
  const [openMenus, setOpenMenus] = useState<string[]>(["speaker-management", "communication"])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // ✅ Check if user has permission to access this dashboard
    if (session?.user.id !== userId && session?.user.role !== "SPEAKER") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this dashboard.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    fetchSpeakerData()
  }, [userId, status, session, router, toast])

  const fetchSpeakerData = async () => {
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
        if (response.status === 404) throw new Error("Speaker not found")
        if (response.status === 403) throw new Error("Access denied")
        throw new Error("Failed to fetch speaker data")
      }

      const data = await response.json()
      setSpeaker(data.user)
    } catch (err) {
      console.error("Error fetching speaker data:", err)
      setError(err instanceof Error ? err.message : "An error occurred")

      if (err instanceof Error && (err.message === "Access denied" || err.message === "Speaker not found")) {
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

  // Helper function for menu item styling
  const menuItemClass = (sectionId: string) => {
    return `cursor-pointer pl-3 py-2 text-sm rounded-md transition-colors w-full text-left ${
      activeSection === sectionId 
        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent"
    }`
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
            <Button onClick={fetchSpeakerData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!speaker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No speaker data found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "myprofile":
        return <MyProfile speakerId={speaker.id} />
      case "mysessions":
        return <MySessions speakerId={speaker.id} />
      case "materials":
        return <PresentationMaterials speakerId={speaker.id} />
      case "message":
        return <MessagesCenter organizerId={speaker.id} />
      case "connection":
        return <ConnectionsSection userId={speaker.id} />
      case "help":
        return <HelpSupport />
      case "settings":
        return <SpeakerSettings speakerId={speaker.id} />
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Welcome to Speaker Dashboard</h3>
              <p className="mt-2 text-gray-500">Select a section from the sidebar to get started.</p>
            </div>
          </div>
        )
    }
  }

  const getCurrentSectionTitle = () => {
    const sections = {
      "myprofile": "My Profile",
      "mysessions": "My Sessions",
      "materials": "Presentation Materials",
      "message": "Messages",
      "connection": "Connections",
      "help": "Help & Support",
      "settings": "Settings"
    }
    return sections[activeSection as keyof typeof sections] || "Speaker Dashboard"
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative
        w-64 min-h-screen bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        flex flex-col shadow-sm
      `}>
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Speaker Menu</h2>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Speaker Info Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={speaker.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {speaker.firstName?.[0]}{speaker.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">
                {speaker.firstName} {speaker.lastName}
              </h3>
              <p className="text-xs text-gray-600">{speaker.jobTitle || "Speaker"}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {/* Speaker Management Dropdown */}
          <div className="mb-4">
            <button
              className="flex items-center justify-between w-full py-2 font-medium text-sm text-gray-700 hover:text-gray-900"
              onClick={() => toggleMenu("speaker-management")}
            >
              <span className="flex items-center gap-2">
                <User size={16} />
                Speaker Management
              </span>
              {openMenus.includes("speaker-management") ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {openMenus.includes("speaker-management") && (
              <div className="ml-2 mt-2 space-y-1">
                <button
                  onClick={() => setActiveSection("myprofile")}
                  className={menuItemClass("myprofile")}
                >
                  My Profile
                </button>
                <button
                  onClick={() => setActiveSection("mysessions")}
                  className={menuItemClass("mysessions")}
                >
                  My Sessions
                </button>
                <button
                  onClick={() => setActiveSection("materials")}
                  className={menuItemClass("materials")}
                >
                  Presentation Materials
                </button>
              </div>
            )}
          </div>

          {/* Communication Dropdown */}
          <div className="mb-4">
            <button
              className="flex items-center justify-between w-full py-2 font-medium text-sm text-gray-700 hover:text-gray-900"
              onClick={() => toggleMenu("communication")}
            >
              <span className="flex items-center gap-2">
                <MessageSquare size={16} />
                Communication
              </span>
              {openMenus.includes("communication") ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {openMenus.includes("communication") && (
              <div className="ml-2 mt-2 space-y-1">
                <button
                  onClick={() => setActiveSection("message")}
                  className={menuItemClass("message")}
                >
                  Messages
                </button>
                <button
                  onClick={() => setActiveSection("connection")}
                  className={menuItemClass("connection")}
                >
                  Connections
                </button>
              </div>
            )}
          </div>

          {/* Help & Support */}
          <button
            onClick={() => setActiveSection("help")}
            className={`flex items-center w-full py-2 gap-2 font-medium text-sm rounded-md transition-colors ${
              activeSection === "help" 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <HelpCircle size={16} />
            Help & Support
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center w-full py-2 gap-2 font-medium text-sm rounded-md transition-colors mt-1 ${
              activeSection === "settings" 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Settings size={16} />
            Settings
          </button>

          {/* Logout */}
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-red-500 hover:bg-red-600 text-white mt-8"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 truncate flex-1 text-center px-4">
            {getCurrentSectionTitle()}
          </h1>
          <div className="w-9" />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Content Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {getCurrentSectionTitle()}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your speaker profile and sessions
              </p>
            </div>

            {/* Dynamic Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}