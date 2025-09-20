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
  Store,
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
import { ExhibitorSchedule } from "./ExhibitorSchedule" // ADD THIS IMPORT
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Favourites } from "./Favourites"
import { Recommendations } from "./Recommendations"
import RecommendedEvents from "./recommended-events"
import Schedule from "./Schedule"
import { HelpCircle, Phone, MessageCircle } from "lucide-react"
import { FAQs } from "../../components/help/FAQs"
import { ContactSupport } from "../../components/help/ContactSupport"
import { ChatSupport } from "../../components/help/ChatSupport"

interface UserDashboardProps {
  userId: string
}

export function UserDashboard({ userId }: UserDashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [activeSection, setActiveSection] = useState("profile")
  const [openMenus, setOpenMenus] = useState<string[]>(["dashboard"])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userInterests, setUserInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [interestedEvents, setInterestedEvents] = useState<any[]>([])

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    fetchUserData()
    fetchInterestedEvents()
  }, [status])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/users/${userId}`)
      if (!res.ok) throw new Error("Failed to load user")
      const data = await res.json()
      setUserData(data.user)
      setUserInterests(data.user.interests || [])
    } catch (err) {
      setError("Error loading user data")
    } finally {
      setLoading(false)
    }
  }

  const fetchInterestedEvents = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/interested-events`)
      if (!response.ok) throw new Error("Failed to fetch interested events")
      const data = await response.json()
      setInterestedEvents(data.events || [])
    } catch (err) {
      console.error("Error fetching interested events:", err)
    }
  }

  const handleProfileUpdate = (updatedUser: Partial<UserData>) => {
    setUserData((prev) => {
      if (!prev) return updatedUser as UserData
      return { ...prev, ...updatedUser }
    })

    if (updatedUser.interests) {
      setUserInterests(updatedUser.interests)
    }

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
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
        return <ProfileSection userData={userData!} onUpdate={handleProfileUpdate} organizerId={""} />
      case "events":
        return <EventsSection userId={userId} />
      case "past-events":
        return <PastEvents userId={userId} />
      case "wishlist":
        return <SavedEvents userId={userId} />
      case "upcoming-events":
        return <UpcomingEvents events={interestedEvents} userId={userId} />
      case "my-appointments":
        return <MyAppointments userId={userId} />
      case "exhibitor-schedule": // ADD THIS CASE
        return <ExhibitorSchedule userId={userId} />
      case "schedule":
        return <Schedule userId={userId} />
      case "favourites":
        return <Favourites />
      case "recommended-events":
        return <RecommendedEvents userId={userId} interests={userInterests} />
      case "recommendations":
        return <Recommendations />
      case "connections":
        return <ConnectionsSection userId={userId} />
      case "messages":
        return <MessagesSection organizerId={userId} />
      case "settings":
        return <SettingsSection userData={userData!} onUpdate={handleProfileUpdate} />
      case "travel":
        return <TravelAccommodation />
      case "faqs":
        return <FAQs />
      case "contact-support":
        return <ContactSupport />
      case "chat-support":
        return <ChatSupport />  
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
      <aside className={`${isSidebarCollapsed ? "w-16" : "w-64"} bg-white border-r flex flex-col justify-between transition-all duration-300`}>
        <div>
          {/* Profile Header */}
          <div className="flex items-center gap-3 p-3 border-b">
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
                <p className="text-xs text-gray-500">{userData?.jobTitle || (userData?.role == "ATTENDEE" ? "VISITOR" : userData?.role)}</p>
              </div>
            )}
          </div>

          {/* Menu */}
          <nav className="p-4 text-sm space-y-2">
            {/* Dashboard */}
            <div>
              <button className="flex items-center justify-between w-full py-2 font-medium" onClick={() => toggleMenu("dashboard")}>
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
              <button className="flex items-center justify-between w-full py-2 font-medium" onClick={() => toggleMenu("event")}>
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {!isSidebarCollapsed && "My-Events"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("event") ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {openMenus.includes("event") && !isSidebarCollapsed && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li onClick={() => setActiveSection("events")} className={menuItemClass(activeSection, "events")}>Interested Events</li>
                  <li onClick={() => setActiveSection("past-events")} className={menuItemClass(activeSection, "past-events")}>Past Events</li>
                  <li onClick={() => setActiveSection("wishlist")} className={menuItemClass(activeSection, "wishlist")}>Wishlist</li>
                </ul>
              )}
            </div>

            {/* Networking */}
            <div>
              <button className="flex items-center justify-between w-full py-2 font-medium" onClick={() => toggleMenu("networking")}>
                <span className="flex items-center gap-2">
                  <Network size={16} />
                  {!isSidebarCollapsed && "Networking"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("networking") ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {openMenus.includes("networking") && !isSidebarCollapsed && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li onClick={() => setActiveSection("connections")} className={menuItemClass(activeSection, "connections")}>My Connections</li>
                  <li onClick={() => setActiveSection("messages")} className={menuItemClass(activeSection, "messages")}>Messages</li>
                </ul>
              )}
            </div>

            {/* Exhibitor */}
            <div>
              <button className="flex items-center justify-between w-full py-2 font-medium" onClick={() => toggleMenu("exhibitor")}>
                <span className="flex items-center gap-2">
                  <Store size={16} />
                  {!isSidebarCollapsed && "My-Exhibitors"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("exhibitor") ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {openMenus.includes("exhibitor") && !isSidebarCollapsed && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  {/* <li onClick={() => setActiveSection("exhibitor-schedule")} className={menuItemClass(activeSection, "exhibitor-schedule")}>Exhibitor Schedule</li> */}
                  <li onClick={() => setActiveSection("my-appointments")} className={menuItemClass(activeSection, "my-appointments")}>Exhibitor Appointments</li>
                  <li onClick={() => setActiveSection("recommendations")} className={menuItemClass(activeSection, "recommendations")}>Recommendations</li>
                </ul>
              )}
            </div>

            {/* Event Planning Tools */}
            {/* <div>
              <button className="flex items-center justify-between w-full py-2 font-medium" onClick={() => toggleMenu("tools")}>
                <span className="flex items-center gap-2">
                  <List size={16} />
                  {!isSidebarCollapsed && "Event Planning Tools"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("tools") ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {openMenus.includes("tools") && !isSidebarCollapsed && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li onClick={() => setActiveSection("travel")} className={menuItemClass(activeSection, "travel")}>Travel & Stay</li>
                  <li onClick={() => setActiveSection("schedule")} className={menuItemClass(activeSection, "schedule")}>Schedule</li>
                </ul>
              )}
            </div> */}

            {/* Help & Support */}
            <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("help-support")}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={16} />
                  {!isSidebarCollapsed && "Help & Support"}
                </span>
                {!isSidebarCollapsed &&
                  (openMenus.includes("help-support") ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  ))}
              </button>
              {openMenus.includes("help-support") && !isSidebarCollapsed && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li
                    onClick={() => setActiveSection("faqs")}
                    className={menuItemClass(activeSection, "faqs")}
                  >
                    FAQs
                  </li>
                  <li
                    onClick={() => setActiveSection("contact-support")}
                    className={menuItemClass(activeSection, "contact-support")}
                  >
                    Contact
                  </li>
                  <li
                    onClick={() => setActiveSection("chat-support")}
                    className={menuItemClass(activeSection, "chat-support")}
                  >
                    Chat Support
                  </li>
                </ul>
              )}
            </div>

            {/* Settings */}
            <div>
              <button
                onClick={() => setActiveSection("settings")}
                className={`flex items-center gap-2 w-full py-2 font-medium ${
                  activeSection === "settings" ? "text-blue-600 font-medium" : "hover:text-blue-600"
                }`}
              >
                <Settings size={16} />
                {!isSidebarCollapsed && "Settings"}
              </button>
            </div>
          </nav>
        </div>

        {/* Collapse & Logout */}
        <div className="p-4 space-y-2">
          <Button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="w-full flex items-center gap-2 mb-2" variant="outline">
            <SidebarIcon size={16} />
            {!isSidebarCollapsed && "Collapse"}
          </Button>
          <Button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white">
            <LogOut size={16} />
            {!isSidebarCollapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main content with top bar */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex h-16 items-center gap-2 border-b px-4 bg-white">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="md:hidden">
            <SidebarIcon className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold capitalize">{activeSection.replace("-", " ")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 " />
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}

// helper for menu items
function menuItemClass(activeSection: string, id: string) {
  return `cursor-pointer pl-3 py-1 border-l-4 ${
    activeSection === id ? "border-blue-500 text-blue-600 font-medium" : "border-transparent hover:text-blue-600"
  }`
}