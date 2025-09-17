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
  Network,
  MessageSquare,
  Settings,
  LogOut,
  List,
  SidebarIcon,
  User,
  Bell,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

import { ProfileSection } from "./profile-section"
import { EventsSection } from "./events-section"
import { ConnectionsSection } from "./connections-section"
import MessagesSection from "@/app/organizer-dashboard/messages-center"
import { SettingsSection } from "./settings-section"
import type { UserData } from "@/types/user"
import TravelAccommodation from "./TravelAccommodation"
import { PastEvents } from "./PastEvents"
import { SavedEvents } from "./SavedEvents"
import { UpcomingEvents } from "./UpcomingEvents"
import { MyAppointments } from "./my-appointments"
// import { SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserDashboardProps {
  userId: string
}

interface OrganizerData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  website: string
  description: string
  avatar: string
  totalEvents: number
  activeEvents: number
  totalAttendees: number
  totalRevenue: number
  founded: string
  company: string
  teamSize: string
  headquarters: string
  specialties: string[]
  achievements: string[]
  certifications: string[]
}

export function UserDashboard({ userId }: UserDashboardProps) {
  const sidebarGroups = [
    {
      id: "main",
      label: "Main",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          id: "dashboard",
        },
        {
          title: "My Info",
          icon: User,
          id: "info",
        },
      ],
    },
  ]
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [activeSection, setActiveSection] = useState("profile")
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null)
  const [openMenus, setOpenMenus] = useState<string[]>(["dashboard"])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
    setOpenMenus((prev) => (prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]))
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
      case "past-events":
        return <PastEvents userId={userId} />
      case "wishlist":
        return <SavedEvents userId={userId} />
      case "passes":
        return <UpcomingEvents userId={userId} events={[]} />
      case "connections":
        return <ConnectionsSection userId={userId} />
      case "appointments":
        // return <MyAppointments userId={userId} />
      case "messages":
        return <MessagesSection organizerId={userId} />
      case "settings":
        return <SettingsSection userData={userData!} onUpdate={() => {}} />
      case "travel":
        return <TravelAccommodation />
      default:
        return <p>Select a section</p>
    }
  }

  // const toggleGroup = (groupId: string) => {
  //   setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  // }

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
      <aside
        className={`${isSidebarCollapsed ? "w-16" : "w-64"} bg-white border-r flex flex-col justify-between transition-all duration-300`}
      >
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
            {!isSidebarCollapsed && (
              <div>
                <p className="font-semibold">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-xs text-gray-500">{userData?.jobTitle || userData?.role || "User"}</p>
              </div>
            )}
          </div>

          {/* Menu */}
          <nav className="p-4 text-sm space-y-2">
            {/* Dashboard */}
            <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("dashboard")}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  {!isSidebarCollapsed && "Dashboard"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("dashboard") ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>

              {openMenus.includes("dashboard") && !isSidebarCollapsed && (
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
                  <Calendar size={16} />
                  {!isSidebarCollapsed && "Event"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("event") ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {openMenus.includes("event") && !isSidebarCollapsed && (
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

                  <li
                    onClick={() => setActiveSection("past-events")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "past-events"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    Past Events Attended
                  </li>

                  <li
                    onClick={() => setActiveSection("wishlist")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "wishlist"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    Wishlist
                  </li>

                  <li
                    onClick={() => setActiveSection("passes")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "passes"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    Passes
                  </li>

                  <li
                    onClick={() => setActiveSection("qr")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "qr"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    Badge / QR Code
                  </li>
                </ul>
              )}
            </div>

            {/* Networking */}
            <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("networking")}
              >
                <span className="flex items-center gap-2">
                  <Network size={16} />
                  {!isSidebarCollapsed && "Networking"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("networking") ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {openMenus.includes("networking") && !isSidebarCollapsed && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
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
                  <li
                    onClick={() => setActiveSection("appointments")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "appointments"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    My Appointments
                  </li>
                </ul>
              )}
            </div>

            {/* Messages */}
            <div>
              <button
                onClick={() => setActiveSection("messages")}
                className={`flex items-center gap-2 w-full py-2 font-medium ${
                  activeSection === "messages"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                <MessageSquare size={16} />
                {!isSidebarCollapsed && "Messages"}
              </button>
            </div>

            {/* Event Planning Tools */}
            <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("tools")}
              >
                <span className="flex items-center gap-2">
                  <List size={16} />
                  {!isSidebarCollapsed && "Event Planning Tools"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("tools") ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {openMenus.includes("tools") && !isSidebarCollapsed && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li
                    onClick={() => setActiveSection("travel")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "travel"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    Travel & Accommodation
                  </li>
                </ul>
              )}
            </div>

            {/* Settings */}
            <div>
              <button
                onClick={() => setActiveSection("settings")}
                className={`flex items-center gap-2 w-full py-2 font-medium ${
                  activeSection === "settings"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                <Settings size={16} />
                {!isSidebarCollapsed && "Settings"}
              </button>
            </div>
          </nav>
        </div>

        {/* Collapse Toggle and Logout */}
        <div className="p-4 space-y-2">
          <Button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center gap-2 mb-2"
            variant="outline"
          >
            <SidebarIcon size={16} />
            {!isSidebarCollapsed && "Collapse"}
          </Button>
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut size={16} />
            {!isSidebarCollapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main content with top navigation */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="flex h-16 items-center gap-2 border-b px-4 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="md:hidden"
          >
            <SidebarIcon className="w-4 h-4" />
          </Button>

          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {activeSection === "profile" && "My Profile"}
              {activeSection === "events" && "Registered Events"}
              {activeSection === "past-events" && "Past Events Attended"}
              {activeSection === "wishlist" && "Wishlist"}
              {activeSection === "passes" && "My Passes"}
              {activeSection === "connections" && "My Connections"}
              {activeSection === "appointments" && "My Appointments"}
              {activeSection === "messages" && "Messages"}
              {activeSection === "settings" && "Settings"}
              {activeSection === "travel" && "Travel & Accommodation"}
              {activeSection === "qr" && "Badge / QR Code"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userData?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {userData?.firstName?.[0] || "U"}
                      {userData?.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => setActiveSection("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
