"use client"

import type React from "react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Info, Edit, Settings, ArrowLeft, Menu, X } from "lucide-react"

interface EventLayoutProps {
  children: React.ReactNode
  eventId: string // Changed from async params to direct eventId prop
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

  const sidebarItems: SidebarItem[] = [
    {
      title: "Event Info",
      icon: Info,
      id: "info",
      href: `/events/${eventId}`,
    },
    {
      title: "Edit Event",
      icon: Edit,
      id: "edit",
      href: `/events/${eventId}/edit`,
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
      href: `/events/${eventId}/settings`,
    },
  ]

  const getCurrentSectionTitle = () => {
    const currentItem = sidebarItems.find((item) => item.href === pathname)
    return currentItem?.title || "Event Info"
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    setSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

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
          <h2 className="text-lg font-semibold text-foreground">Event Menu</h2>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
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

        <div className="border-t border-border p-4 flex-shrink-0">
          <Button onClick={() => router.push("/events")} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Events</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{getCurrentSectionTitle()}</h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
