"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  IdCard,
  Briefcase,
  Megaphone,
  Tag,
  PlusCircle,
  FileText,
  CalendarDays,
  Mic,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import EventPage from "./info"
import Attendees from "./AttendeesManagement"
import ExhibitorsManagement from "./ExhibitorsManagement"
import VisitorBadgeSettings from "./Visitor-Badge-Settings"
// import Exhibitors from "./exhibitors"
// import Analytics from "./analytics"
// ...create/import other components as needed

interface EventLayoutProps {
  children?: React.ReactNode
  eventId: string
}

interface SidebarGroup {
  id: string
  label: string
  items: SidebarItem[]
}

interface SidebarItem {
  title: string
  icon: React.ComponentType<any>
  id: string
}

export default function EventSidebar({ eventId }: EventLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["main", "lead-management"])
  const [activeSection, setActiveSection] = useState("dashboard")
  const [params, setParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    // Simulate async params resolution
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve({ id: eventId })
      setParams(resolvedParams)
    }
    resolveParams()
  }, [eventId])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  const sidebarGroups: SidebarGroup[] = [
    {
      id: "main",
      label: "Main",
      items: [
        { title: "Event Info", icon: LayoutDashboard, id: "dashboard" },
      ],
    },
    {
      id: "lead-management",
      label: "Lead Management",
      items: [
        { title: "Attendees", icon: Users, id: "attendees" },
        { title: "Visitor Badge Settings", icon: IdCard, id: "badge-settings" },
        { title: "Exhibitors", icon: Briefcase, id: "exhibitors" },
      ],
    },
    {
      id: "marketing",
      label: "Marketing Campaigns",
      items: [
        { title: "Promotions", icon: Megaphone, id: "promotions" },
        { title: "Active Promotions", icon: Tag, id: "active-promotions" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      items: [{ title: "Analytics", icon: BarChart3, id: "analytics" }],
    },
  ]

  const renderContent = () => {
    if (!params) {
      return <div>Loading...</div>
    }

    switch (activeSection) {
      case "dashboard":
        return <EventPage params={Promise.resolve(params)} />
      case "attendees":
        return <Attendees eventId={eventId} />
      case "exhibitors":
        return <ExhibitorsManagement eventId={eventId} />
      case "badge-settings":
        return <VisitorBadgeSettings />
      default:
        return <div>Select a section</div>
    }
  }

  const getCurrentSectionTitle = () => {
    for (const group of sidebarGroups) {
      const item = group.items.find((i) => i.id === activeSection)
      if (item) return item.title
    }
    return "Event Dashboard"
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative
          w-64 min-h-screen bg-card border-r border-border z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <h2 className="text-lg font-semibold">Event Menu</h2>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Groups */}
        <div className="flex-1 overflow-y-auto p-4">
          {sidebarGroups.map((group) => (
            <div key={group.id} className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer px-2 py-2 rounded hover:bg-muted"
                onClick={() => toggleGroup(group.id)}
              >
                <span>{group.label}</span>
                {expandedGroups.includes(group.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
              {expandedGroups.includes(group.id) && (
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary border-l-4 border-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4 flex-shrink-0">
          <Button onClick={() => router.push("/events")} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="md:hidden flex items-center justify-between p-4 bg-card border-b">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">{getCurrentSectionTitle()}</h1>
          <div className="w-8" />
        </div>
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}