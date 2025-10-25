"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  User,
  Calendar,
  Clock,
  Heart,
  Network,
  MessageSquare,
  Store,
  Users,
  Plane,
  List,
  Settings,
  HelpCircle,
  SidebarIcon,
  LogOut,
  Star,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Loader2,
  Menu,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

import { ProfileSection } from "./profile-section"
import { EventsSection } from "./events-section"
import { ConnectionsSection } from "./connections-section"
import MessagesSection from "@/app/organizer-dashboard/messages-center"
import { VisitorSettings } from "./settings-section"
import type { UserData } from "@/types/user"
import TravelAccommodation from "./TravelAccommodation"
import { PastEvents } from "./PastEvents"
import { SavedEvents } from "./SavedEvents"
import { UpcomingEvents } from "./UpcomingEvents"
import { MyAppointments } from "./my-appointments"
import { ExhibitorSchedule } from "./ExhibitorSchedule"
import { Favourites } from "./Favourites"
import { Recommendations } from "./Recommendations"
import RecommendedEvents from "./recommended-events"
import Schedule from "./Schedule"
import { HelpSupport } from "@/components/HelpSupport"
import { useDashboard } from "@/contexts/dashboard-context"

interface UserDashboardProps {
  userId: string
}

// Memoized sidebar item component to prevent re-renders
const SidebarMenuItem = memo(({ 
  isActive, 
  onClick, 
  icon: Icon, 
  label, 
  isCollapsed 
}: { 
  isActive: boolean
  onClick: () => void
  icon: any
  label: string
  isCollapsed: boolean
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full py-2 px-3 rounded-md transition-colors ${
      isActive 
        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600 font-medium" 
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`}
  >
    <Icon size={16} />
    {!isCollapsed && <span className="text-sm">{label}</span>}
  </button>
))

SidebarMenuItem.displayName = 'SidebarMenuItem'

export function UserDashboard({ userId }: UserDashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { activeSection, setActiveSection } = useDashboard()

  const [openMenus, setOpenMenus] = useState<string[]>(["dashboard"])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userInterests, setUserInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [interestedEvents, setInterestedEvents] = useState<any[]>([])

  // Memoize fetch functions to prevent recreation on every render
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/users/${userId}`)
      
      if (!res.ok) {
        throw new Error(`Failed to load user: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (!data.user) {
        throw new Error("User data not found")
      }
      
      setUserData(data.user)
      setUserInterests(data.user.interests || [])
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err instanceof Error ? err.message : "Error loading user data")
      
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [userId, toast])

  const fetchInterestedEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userId}/interested-events`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch interested events: ${response.status}`)
      }
      
      const data = await response.json()
      
      const uniqueEvents = data.events ? 
        data.events.filter((event: any, index: number, self: any[]) => 
          index === self.findIndex((e: any) => e.id === event.id)
        ) : []
        
      setInterestedEvents(uniqueEvents)
    } catch (err) {
      console.error("Error fetching interested events:", err)
    }
  }, [userId])

  // Fix useEffect dependencies - only run when necessary
  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    
    if (session?.user?.id) {
      fetchUserData()
      fetchInterestedEvents()
    }
    // Remove router from dependencies as it causes re-renders
  }, [status, session?.user?.id, fetchUserData, fetchInterestedEvents])

  // Close mobile sidebar when switching sections
  useEffect(() => {
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false)
    }
  }, [activeSection, isMobileSidebarOpen])

  // Memoize the profile update handler
  const handleProfileUpdate = useCallback((updatedUser: Partial<UserData>) => {
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
  }, [toast])

  // Memoize menu toggle functions
  const toggleMenu = useCallback((menu: string) => {
    setOpenMenus((prev) => 
      prev.includes(menu) 
        ? prev.filter((m) => m !== menu) 
        : [...prev, menu]
    )
  }, [])

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(prev => !prev)
    } else {
      setIsSidebarCollapsed(prev => !prev)
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: "/login" })
    } catch (error) {
      console.error("Error during sign out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }, [toast])

  // Memoize menu items configuration
const menuConfig = useMemo(() => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { id: "profile", label: "Profile", icon: User },
    ],
  },
  {
    id: "event",
    label: "My Events",
    icon: Calendar,
    items: [
      { id: "events", label: "Interested Events", icon: Calendar },
      { id: "past-events", label: "Past Events", icon: Clock },
      { id: "wishlist", label: "Wishlist", icon: Heart },
      // { id: "upcoming-events", label: "Upcoming Events", icon: CheckSquare },
    ],
  },
  {
    id: "networking",
    label: "Networking",
    icon: Network,
    items: [
      { id: "connections", label: "My Connections", icon: Users },
      { id: "messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    id: "exhibitor",
    label: "My Exhibitors",
    icon: Store,
    items: [
      { id: "my-appointments", label: "Exhibitor Appointments", icon: Calendar },
      { id: "Suggested", label: "Suggested", icon: Star },
    ],
  },
  {
    id: "tools",
    label: "Event Planning Tools",
    icon: List,
    items: [
      { id: "travel", label: "Travel & Stay", icon: Plane },
      { id: "schedule", label: "Schedule", icon: List },
    ],
  },
], [])

  // Memoize sidebar content to prevent re-renders
  const sidebarContent = useMemo(() => (
    <div className={`${isSidebarCollapsed ? "w-16" : "w-64"} bg-white border-r flex flex-col justify-between transition-all duration-300 h-full`}>
      <div>
        <nav className="p-4 text-sm space-y-1">
          {menuConfig.map((menu) => (
            <div key={menu.id}>
              <button 
                className="flex items-center justify-between w-full py-2 px-3 font-medium hover:text-blue-600 transition-colors rounded-md" 
                onClick={() => toggleMenu(menu.id)}
              >
                <span className="flex items-center gap-2">
                  <menu.icon size={16} />
                  {!isSidebarCollapsed && menu.label}
                </span>
                {!isSidebarCollapsed && menu.items && menu.items.length > 0 &&
                  (openMenus.includes(menu.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />)
                }
              </button>
              
              {openMenus.includes(menu.id) && !isSidebarCollapsed && menu.items && (
                <ul className="ml-2 mt-1 space-y-1 border-l">
                  {menu.items.map((item) => (
                    <li key={item.id}>
                     <SidebarMenuItem
  isActive={activeSection === item.id}
  onClick={() => setActiveSection(item.id)}
  icon={item.icon || menu.icon}
  label={item.label}
  isCollapsed={isSidebarCollapsed}
/>

                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          
          {/* Single items without dropdown */}
          <SidebarMenuItem
            isActive={activeSection === "Help & Support"}
            onClick={() => setActiveSection("Help & Support")}
            icon={HelpCircle}
            label="Help & Support"
            isCollapsed={isSidebarCollapsed}
          />
          
          <SidebarMenuItem
            isActive={activeSection === "settings"} 
            onClick={() => setActiveSection("settings")}
            icon={Settings}
            label="Settings"
            isCollapsed={isSidebarCollapsed}
          />
        </nav>
      </div>

      {/* Collapse & Logout */}
      <div className="p-4 space-y-2 border-t">
        <Button 
          onClick={toggleSidebar} 
          className="w-full flex items-center gap-2 mb-2" 
          variant="outline"
          size="sm"
        >
          <SidebarIcon size={16} />
          {!isSidebarCollapsed && (isSidebarCollapsed ? "Expand" : "Collapse")}
        </Button>
        <Button 
          onClick={handleSignOut} 
          className="w-full flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          size="sm"
        >
          <LogOut size={16} />
          {!isSidebarCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  ), [isSidebarCollapsed, openMenus, activeSection, menuConfig, toggleMenu, toggleSidebar, handleSignOut, setActiveSection])

  // Memoize main content
  const mainContent = useMemo(() => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchUserData} variant="outline">
            Retry
          </Button>
        </div>
      )
    }
    
    if (!userData) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No user data found</p>
        </div>
      )
    }

    // Render content based on active section
    const contentMap = {
      "profile": <ProfileSection userData={userData} onUpdate={handleProfileUpdate} organizerId={userId} />,
      "events": <EventsSection userId={userId} />,
      "past-events": <PastEvents userId={userId} />,
      "wishlist": <SavedEvents userId={userId} />,
      "upcoming-events": <UpcomingEvents events={interestedEvents} userId={userId} />,
      "my-appointments": <MyAppointments userId={userId} />,
      "exhibitor-schedule": <ExhibitorSchedule userId={userId} />,
      "schedule": <Schedule userId={userId} />,
      "favourites": <Favourites />,
      "recommended-events": <RecommendedEvents userId={userId} interests={userInterests} />,
      "Suggested": <Recommendations />,
      "connections": <ConnectionsSection userId={userId} />,
      "messages": <MessagesSection organizerId={userId} />,
      "settings": <VisitorSettings />,
      "travel": <TravelAccommodation />,
      "Help & Support": <HelpSupport />
    }

    return contentMap[activeSection as keyof typeof contentMap] || contentMap.profile
  }, [loading, error, userData, activeSection, userId, userInterests, interestedEvents, handleProfileUpdate, fetchUserData])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {sidebarContent}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-lg font-semibold capitalize">
            {activeSection.replace('-', ' ')}
          </h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {mainContent}
        </main>
      </div>
    </div>
  )
}