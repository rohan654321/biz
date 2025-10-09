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
} from "lucide-react"

import MyProfile from "./my-profile"
import MySessions from "./my-sessions"
import { PresentationMaterials } from "./presentation-materials"
import MessagesCenter from "@/app/organizer-dashboard/messages-center"
import { SpeakerSettings } from "./speaker-settings"
import { HelpSupport } from "@/components/HelpSupport"

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
  const [activeTab, setActiveTab] = useState("myprofile")
  const [openMenus, setOpenMenus] = useState<string[]>(["speaker-management"])

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
    return `cursor-pointer pl-3 py-2 border-l-4 text-sm ${
      activeTab === sectionId 
        ? "border-blue-500 text-blue-600 font-medium bg-blue-50" 
        : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        {/* Profile Header */}
        {/* <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={speaker.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {speaker.firstName[0]}
                {speaker.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">
                {speaker.firstName} {speaker.lastName}
              </h2>
              <p className="text-sm text-gray-500">{speaker.jobTitle || "Speaker"}</p>
            </div>
          </div>
        </div> */}

        <nav className="p-4">
          <ul className="space-y-1">
            {/* Speaker Management Dropdown */}
            <li>
              <div className="w-full">
                <button 
                  className="flex items-center justify-between w-full py-3 px-3 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors" 
                  onClick={() => toggleMenu("speaker-management")}
                >
                  <span className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    Speaker Management
                  </span>
                  {openMenus.includes("speaker-management") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {openMenus.includes("speaker-management") && (
                  <ul className="ml-2 mt-1 space-y-1 border-l border-gray-100">
                    <li
                      onClick={() => setActiveTab("myprofile")}
                      className={menuItemClass("myprofile")}
                    >
                      My Profile
                    </li>
                    <li
                      onClick={() => setActiveTab("mysessions")}
                      className={menuItemClass("mysessions")}
                    >
                      My Sessions
                    </li>
                    <li
                      onClick={() => setActiveTab("materials")}
                      className={menuItemClass("materials")}
                    >
                      Presentation Materials
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* Communication Dropdown */}
            <li>
              <div className="w-full">
                <button 
                  className="flex items-center justify-between w-full py-3 px-3 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors" 
                  onClick={() => toggleMenu("communication")}
                >
                  <span className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5" />
                    Communication
                  </span>
                  {openMenus.includes("communication") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {openMenus.includes("communication") && (
                  <ul className="ml-2 mt-1 space-y-1 border-l border-gray-100">
                    <li
                      onClick={() => setActiveTab("message")}
                      className={menuItemClass("message")}
                    >
                      Messages
                    </li>
                    <li
                      onClick={() => setActiveTab("connection")}
                      className={menuItemClass("connection")}
                    >
                      Connections
                    </li>
                  </ul>
                )}
              </div>
            </li>

            {/* Help & Support (No Dropdown) */}
            <li>
              <button
                onClick={() => setActiveTab("help")}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "help"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </button>
            </li>

            {/* Settings (No Dropdown) */}
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "settings"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </li>

            {/* Logout Button */}
            <li className="mt-10">
              <Button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "myprofile" && <MyProfile speakerId={speaker.id} />}
          {activeTab === "mysessions" && <MySessions speakerId={speaker.id} />}
          {activeTab === "materials" && <PresentationMaterials speakerId={speaker.id} />}
          {activeTab === "message" && <MessagesCenter organizerId={speaker.id} />}
          {activeTab === "connection" && <ConnectionsSection userId={speaker.id} />}
          {activeTab === "help" && <HelpSupport />}
          {activeTab === "settings" && <SpeakerSettings speakerId={speaker.id} />}
        </div>
      </div>
    </div>
  )
}