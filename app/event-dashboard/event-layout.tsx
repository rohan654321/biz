"use client"

import type React from "react"
import { useState } from "react"
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
  Settings,
  HelpCircle,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface EventLayoutProps {
  children: React.ReactNode
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
  href: string
}

export default function EventLayout({ children, eventId }: EventLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["main", "event-management"])

  const sidebarGroups: SidebarGroup[] = [
    {
      id: "main",
      label: "Main",
      items: [
        {
          title: "Event Info",
          icon: LayoutDashboard,
          id: "dashboard",
          href: `/events/${eventId}/dashboard`,
        },
      ],
    },
    {
      id: "lead-management",
      label: "Lead Management",
      items: [
        {
          title: "Attendees",
          icon: Users,
          id: "attendees",
          href: `/events/${eventId}/attendees`,
        },
        {
          title: "Visitor Badge Settings",
          icon: IdCard,
          id: "badge-settings",
          href: `/events/${eventId}/badge-settings`,
        },
        {
          title: "Exhibitors",
          icon: Briefcase,
          id: "exhibitors",
          href: `/events/${eventId}/exhibitors`,
        },
      ],
    },
    {
      id: "marketing",
      label: "Marketing Campaigns",
      items: [
        {
          title: "Promotions",
          icon: Megaphone,
          id: "promotions",
          href: `/events/${eventId}/promotions`,
        },
        {
          title: "Active Promotions",
          icon: Tag,
          id: "active-promotions",
          href: `/events/${eventId}/active-promotions`,
        },
      ],
    },
    {
      id: "exhibitor-management",
      label: "Exhibitor Management",
      items: [
        {
          title: "Total Exhibitors",
          icon: Briefcase,
          id: "total-exhibitors",
          href: `/events/${eventId}/total-exhibitors`,
        },
        {
          title: "Exhibitors Eventwise",
          icon: FileText,
          id: "exhibitors-eventwise",
          href: `/events/${eventId}/eventwise-exhibitors`,
        },
        {
          title: "Add Exhibitors",
          icon: PlusCircle,
          id: "add-exhibitors",
          href: `/events/${eventId}/add-exhibitors`,
        },
        {
          title: "Exhibitors Manual",
          icon: FileText,
          id: "exhibitors-manual",
          href: `/events/${eventId}/exhibitors-manual`,
        },
      ],
    },
    {
      id: "speaker-management",
      label: "Speaker Management",
      items: [
        {
          title: "Conference Agenda",
          icon: CalendarDays,
          id: "conference-agenda",
          href: `/events/${eventId}/agenda`,
        },
        {
          title: "Create Conference Agenda",
          icon: PlusCircle,
          id: "create-agenda",
          href: `/events/${eventId}/create-agenda`,
        },
        {
          title: "Speakers",
          icon: Mic,
          id: "speakers",
          href: `/events/${eventId}/speakers`,
        },
        {
          title: "Add Speakers",
          icon: PlusCircle,
          id: "add-speakers",
          href: `/events/${eventId}/add-speakers`,
        },
      ],
    },
    {
      id: "feedback",
      label: "Feedback",
      items: [
        {
          title: "Feedback",
          icon: MessageSquare,
          id: "feedback",
          href: `/events/${eventId}/feedback`,
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      items: [
        {
          title: "Analytics",
          icon: BarChart3,
          id: "analytics",
          href: `/events/${eventId}/analytics`,
        },
      ],
    },
  ]

  const individualSidebarItems: SidebarItem[] = [
    { title: "Help & Support", icon: HelpCircle, id: "help-support", href: `/events/${eventId}/help` },
    { title: "Settings", icon: Settings, id: "settings", href: `/events/${eventId}/settings` },
  ]

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  const getCurrentSectionTitle = () => {
    for (const group of sidebarGroups) {
      const item = group.items.find((item) => item.href === pathname)
      if (item) return item.title
    }
    const individualItem = individualSidebarItems.find((item) => item.href === pathname)
    if (individualItem) return individualItem.title

    return "Event Info"
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    setSidebarOpen(false)
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
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <h2 className="text-lg font-semibold text-foreground">Event Menu</h2>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Groups */}
        <div className="flex-1 overflow-y-auto p-4">
          {sidebarGroups.map((group) => (
            <div key={group.id} className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-accent px-2 py-2 rounded text-sm font-medium text-foreground"
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
                      onClick={() => handleNavigation(item.href)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
                        ${
                          pathname === item.href
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Individual Items */}
          <div className="mt-8 space-y-1">
            {individualSidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
                  ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }
                `}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 flex-shrink-0">
          <Button onClick={() => router.push("/events")} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Events</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{getCurrentSectionTitle()}</h1>
          <div className="w-8" /> {/* Spacer */}
        </div>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
