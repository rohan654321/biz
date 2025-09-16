"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Users,
  Store,
  Network,
  MessageSquare,
  Settings,
  LogOut,
  Star,
  Map,
  Heart,
  List
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

import { ProfileSection } from "./profile-section"
import { EventsSection } from "./events-section"
import { ConnectionsSection } from "./connections-section"
import MessagesSection from "@/app/organizer-dashboard/messages-center"
import { SettingsSection } from "./settings-section"
import { UserData } from "@/types/user"


interface UserDashboardProps {
  userId: string
}

// interface UserData {
//   id: string
//   email: string
//   firstName: string
//   lastName: string
//   phone?: string
//   avatar?: string
//   role: string
//   bio?: string
//   website?: string
//   linkedin?: string
//   twitter?: string
//   company?: string
//   jobTitle?: string
//   location?: string   // <-- FIXED (was object)
//   isVerified: boolean
//   createdAt: string
//   lastLogin?: string
//   _count?: {
//     eventsAttended: number
//     eventsOrganized: number
//     connections: number
//   }
// }



export function UserDashboard({ userId }: UserDashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  

  const [activeSection, setActiveSection] = useState("profile")
  const [openMenus, setOpenMenus] = useState<string[]>(["dashboard"])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    fetchUserData()
  }, [status])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/users/${userId}`)
      if (!res.ok) throw new Error("Failed to load user")
      const data = await res.json()
      setUserData(data.user)
    } catch (err) {
      setError("Error loading user data")
    } finally {
      setLoading(false)
    }
  }

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    )
  }

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="h-64 w-full" />
    }
    if (error) {
      return <p className="text-red-600">{error}</p>
    }
    switch (activeSection) {
      case "profile":
        return <ProfileSection userData={userData!} onUpdate={() => {}} />
      case "events":
        return <EventsSection userId={userId} />
      case "connections":
        return <ConnectionsSection userId={userId} />
      case "messages":
        return <MessagesSection organizerId={userId} />
      case "settings":
        return <SettingsSection userData={userData!} onUpdate={() => {}} />
      default:
        return <p>Select a section</p>
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        <div>
          {/* Profile Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userData?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {userData?.firstName?.[0] || "U"}
                {userData?.lastName?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {userData?.firstName} {userData?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {userData?.jobTitle || userData?.role || "User"}
              </p>
            </div>
          </div>

          {/* Menu */}
          <nav className="p-4 text-sm space-y-2">
            {/* Dashboard */}
{/* Dashboard */}
<div>
  <button
    className="flex items-center justify-between w-full py-2 font-medium"
    onClick={() => toggleMenu("dashboard")}
  >
    <span className="flex items-center gap-2">
      <LayoutDashboard size={16} /> Dashboard
    </span>
    {openMenus.includes("dashboard") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
  </button>

  {openMenus.includes("dashboard") && (
    <ul className="ml-2 mt-2 space-y-2 border-l border-transparent">
      <li
        onClick={() => setActiveSection("profile")}
        className={`cursor-pointer pl-3 py-1 border-l-4 ${
          activeSection === "profile"
            ? "border-blue-500 text-blue-600 font-medium"
            : "border-transparent hover:text-blue-600"
        }`}
      >
        Profile
      </li>
    </ul>
  )}
</div>


            {/* Event */}
            <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("event")}
              >
                <span className="flex items-center gap-2">
                  <Calendar size={16} /> Event
                </span>
                {openMenus.includes("event") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {openMenus.includes("event") && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li
                    onClick={() => setActiveSection("events")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "events"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    Registered Events
                  </li>
                  {/* <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Past Events Attended
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Wishlist
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Passes
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Badge / QR Code
                  </li> */}
                </ul>
              )}
            </div>

            {/* Exhibitors */}
            {/* <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("exhibitors")}
              >
                <span className="flex items-center gap-2">
                  <Store size={16} /> Exhibitors
                </span>
                {openMenus.includes("exhibitors") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {openMenus.includes("exhibitors") && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    All Exhibitors
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    <Heart size={14} className="inline mr-1" /> Favourites
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    <Star size={14} className="inline mr-1" /> Recommendation
                  </li>
                </ul>
              )}
            </div> */}

            {/* Networking */}
            <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("networking")}
              >
                <span className="flex items-center gap-2">
                  <Network size={16} /> Networking
                </span>
                {openMenus.includes("networking") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {openMenus.includes("networking") && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  {/* <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Exhibitor Connect
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Suggested Exhibitor
                  </li> */}
                  <li
                    onClick={() => setActiveSection("connections")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "connections"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    My Connections
                  </li>
                </ul>
              )}
            </div>

            {/* Messages */}
            <div>
              <button
                onClick={() => setActiveSection("messages")}
                className={`flex items-center gap-2 w-full py-2 font-medium border-l-4 ${
                  activeSection === "messages"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                <MessageSquare size={16} /> Messages
              </button>
            </div>

            {/* Event Planning Tools */}
            {/* <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("tools")}
              >
                <span className="flex items-center gap-2">
                  <List size={16} /> Event Planning Tools
                </span>
                {openMenus.includes("tools") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {openMenus.includes("tools") && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    My Schedule
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    <Map size={14} className="inline mr-1" /> Venue Map / Floor Plan
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Travel & Accommodation
                  </li>
                </ul>
              )}
            </div> */}

            {/* Settings */}
            <div>
              <button
                onClick={() => setActiveSection("settings")}
                className={`flex items-center gap-2 w-full py-2 font-medium border-l-4 ${
                  activeSection === "settings"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                <Settings size={16} /> Settings
              </button>
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  )
}
