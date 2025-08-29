"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { User, Calendar, Users, MessageSquare, Settings, Bell, Loader2 } from "lucide-react"
import { ProfileSection } from "./profile-section"
import { EventsSection } from "./events-section"
import { ConnectionsSection } from "./connections-section"
import { MessagesSection } from "./messages-section"
import { SettingsSection } from "./settings-section"
import { useToast } from "@/hooks/use-toast"

interface UserDashboardProps {
  userId: string
}

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: string
  bio?: string
  website?: string
  linkedin?: string
  twitter?: string
  company?: string
  jobTitle?: string
  location?: {
    address: string
    city: string
    state: string
    country: string
  }
  isVerified: boolean
  createdAt: string
  lastLogin?: string
  _count?: {
    eventsAttended: number
    eventsOrganized: number
    connections: number
  }
}

export function UserDashboard({ userId }: UserDashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [activeSection, setActiveSection] = useState("profile")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    fetchUserData()
  }, [userId, status, session, router, toast])

  const fetchUserData = async () => {
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
      setUserData(data.user)
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

  const updateUserData = async (updatedData: Partial<UserData>) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update user data")
      }

      const data = await response.json()
      setUserData((prev) => (prev ? { ...prev, ...data.user } : data.user))

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (err) {
      console.error("Error updating user data:", err)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sidebarItems = [
    {
      title: "Profile",
      icon: User,
      id: "profile",
    },
    {
      title: "Events",
      icon: Calendar,
      id: "events",
    },
    {
      title: "Connections",
      icon: Users,
      id: "connections",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      id: "messages",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <div className="lg:col-span-2">
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUserData}>Try Again</Button>
          </div>
        </div>
      )
    }

    if (!userData) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">User not found</p>
        </div>
      )
    }

    switch (activeSection) {
      case "profile":
        return <ProfileSection userData={userData} onUpdate={updateUserData} />
      case "events":
        return <EventsSection userId={userId} />
      case "connections":
        return <ConnectionsSection userId={userId} />
      case "messages":
        return <MessagesSection userId={userId} />
      case "settings":
        return <SettingsSection userData={userData} onUpdate={updateUserData} />
      default:
        return <div>Select a section from the sidebar</div>
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={userData?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {userData?.firstName?.[0] || "U"}
                  {userData?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {/* {userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : "User"} */}
                  {userData?.firstName}
                </div>
                <div className="text-sm text-gray-600">{userData?.jobTitle || userData?.role || "User"}</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={userData?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {userData?.firstName?.[0] || "U"}
                  {userData?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
