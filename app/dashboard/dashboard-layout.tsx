"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { ProfileSection } from "./profile-section"
import { EventsSection } from "./events-section"
import { ConnectionsSection } from "./connections-section"
import { MessagesSection } from "./messages-section"
import { SettingsSection } from "./settings-section"
import { userData } from "@/lib/mock-data"

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState("profile")

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection userData={userData} />
      case "events":
        return <EventsSection />
      case "connections":
        return <ConnectionsSection />
      case "messages":
        return <MessagesSection />
      case "settings":
        return <SettingsSection userData={userData} />
      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} userData={userData} />
        <SidebarInset className="flex-1">
          <DashboardHeader userData={userData} />
          <div className="flex-1 p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
